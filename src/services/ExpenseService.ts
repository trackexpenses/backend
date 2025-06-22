import { injectable, inject } from "inversify"
import TYPES from "../container/types"
import { UserRepository } from "../repositories/UserRepository"
import { ApiStatus, IDevice, IUserAuthResult, IUserLoginParams, IUserSignupParams } from "../models/IUser"
import bcrypt from 'bcrypt';
import { PrismaErrorCodes } from "../constants";
import UserMapper from "../mappers/UserMapper";
import config from "../config";
import JwtHelper from "../utils/JwtHelper";
import { uid } from 'rand-token';
import { ExpenseRepository } from "../repositories/ExpenseRepository";
import { IExpenseCreationParams, IExpenseResult } from "../models/IExpense";
import prisma from "../database/prismaClient";
import { Prisma } from "@prisma/client";
import { TagRepository } from "../repositories/TagRepository";
import { ExpenseTagRepository } from "../repositories/ExpenseTagRepository";
import ExpenseMapper from "../mappers/ExpenseMapper";
import TagService from "./TagService";
import ExpenseDto from "../dto/ExpenseDto";
export const OTHER_TAG = 'other'

@injectable()
export default class ExpenseService {

    constructor(
        @inject(TYPES.ExpenseRepository) private expenseRepository: ExpenseRepository,
        @inject(TYPES.TagRepository) private tagRepository: TagRepository,
        @inject(TYPES.ExpenseTagRepository) private expenseTagRepository: ExpenseTagRepository,
        @inject(TYPES.ExpenseMapper) private expenseMapper: ExpenseMapper,
        @inject(TYPES.TagService) private tagService: TagService,
    ) { }

    public async create(userId: number, expenseParams: IExpenseCreationParams): Promise<IExpenseResult> {
        const { amount, description, tags: expenseTags } = expenseParams;

        if (!this.isValidExpenseAmount(amount)) {
            return { errorMessage: 'Invalid Amount', status: ApiStatus.FAILURE };
        }

        try {
            const expense = await prisma.$transaction(async (tx) => {
                const expense = await this.expenseRepository.addExpense(tx, { amount, description, userId });

                const tags = await this.tagRepository.createOrUpsertTags(tx, expenseTags, userId);

                await this.expenseTagRepository.createExpenseTags(tx, expense.id, tags);

                return expense;
            });
            return { status: ApiStatus.SUCCESS, expense: expenseParams }

        } catch (error) {
            console.error('Failed to create expense transactionally:', error);
            return { errorMessage: 'Could not create expense', status: ApiStatus.FAILURE };
        }
    }

    private isValidExpenseAmount(amount: number) {
        if (isNaN(amount) || amount <= 0) {
            return false
        }
        return true
    }

    public async getUserExpenses(userId: number, filter?: any) {
        const expenses = await this.expenseRepository.getUserExpenses(userId, filter);

        const mappedExpenses = expenses.map(expense => this.expenseMapper.toDto(expense))
        return mappedExpenses;
    }

    public async getUserExpensesAnalytics(userId: number, startDate?: string, endDate?: string) {
        const tagsFrequencyMap = await this.tagService.getTagFrequencyMap(userId)
        const analytics = await this.getParentExpensesTagsDetails(userId, tagsFrequencyMap, startDate, endDate)

        for (const [tagName, data] of Object.entries(analytics)) {
            if (tagName === OTHER_TAG) {
                analytics[tagName] = data;
            } else {
                const childTags = await this.getTagBreakDown(data.children, tagsFrequencyMap);
                analytics[tagName] = {
                    ...data,
                    children: childTags,
                };
            }
        }

        const formattedAnalytics = this.expenseMapper.toAnalyticsDto(analytics)
        return formattedAnalytics;
    }


    private async getParentExpensesTagsDetails(userId: number, tagsFrequencyMap: Map<string, number>, startDate?: string, endDate?: string) {
        const dateFilter = this.getDateFilter(startDate, endDate)

        const userExpenses = await this.getUserExpenses(userId, dateFilter);
        const tagSummary = await this.getTagBreakDown(userExpenses, tagsFrequencyMap)
        return tagSummary
    }

    private getDateFilter(startDate?: string, endDate?: string) {
        if (!startDate || !endDate) {
            return {}
        }
        const startDateObject = new Date(startDate);
        startDateObject.setHours(0, 0, 0, 0);

        const endDateObjet = new Date(endDate);

        return {
            createdAt: {
                gte: startDateObject,
                lte: endDateObjet,
            },
        }

    }

    private async getTagBreakDown(userExpenses: any, tagsFrequencyMap: Map<string, number>) {
        const tagSummary: Record<string, { total: number; children: typeof userExpenses, description?: string }> = {};

        for (const expense of userExpenses) {
            const expenseTags = expense.tags;
            if (expenseTags.length === 0) {
                this.addToOther(tagSummary, expense)
                continue;
            }

            const parentTag = await this.getExpenseParentTag(expenseTags, tagsFrequencyMap)
            if (!parentTag) {
                this.addToOther(tagSummary, expense)
                continue;
            }

            if (!tagSummary[parentTag]) {
                tagSummary[parentTag] = {
                    total: 0,
                    children: []
                };
            }

            tagSummary[parentTag].total += expense.amount;
            tagSummary[parentTag].children.push({ ...expense, tags: expense.tags.filter((tag: string) => tag !== parentTag) });
        }

        return this.groupLowPercentageTags(tagSummary)
    }

    private async getExpenseParentTag(expenseTags: string[], tagsFrequencyMap: Map<string, number>): Promise<string | null> {
        let parentTag: string | null = null;
        let maxFrequency = -1;


        for (const tag of expenseTags) {
            const frequency = tagsFrequencyMap.get(tag) ?? 0;
            if (frequency > maxFrequency) {
                parentTag = tag;
                maxFrequency = frequency;
            }
        }
        return parentTag
    }

    private addToOther(tagSummary: Record<string, any>, expense: any) {
        if (!tagSummary[OTHER_TAG]) {
            tagSummary[OTHER_TAG] = { total: 0, children: [] };
        }
        tagSummary[OTHER_TAG].total += expense.amount;
        tagSummary[OTHER_TAG].children.push(expense);
    }

    private groupLowPercentageTags(tagSummary: Record<string, any>) {
        const totalAmount = Object.values(tagSummary).reduce((sum, tag) => sum + tag.total, 0);
        const result: typeof tagSummary = {};
        const MIN_STAND_ALONE_PERCENTAGE = 5

        for (const [tag, data] of Object.entries(tagSummary)) {
            const percentage = (data.total / totalAmount) * 100;

            if (tag !== OTHER_TAG && percentage >= MIN_STAND_ALONE_PERCENTAGE) {
                result[tag] = data;
            } else {
                if (!result[OTHER_TAG]) {
                    result[OTHER_TAG] = { total: 0, children: [] };
                }
                result[OTHER_TAG].total += data.total;
                const children = tag === OTHER_TAG
                    ? data.children || []
                    : (data.children || []).map((child: any) => ({
                        ...child,
                        tags: [...(child.tags || []), tag],
                    }));

                result[OTHER_TAG].children.push(...children)
            }
        }
        return result;
    }

}


