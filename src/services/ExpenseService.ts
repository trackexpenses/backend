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

    public async getUserExpenses(userId: number) {
        const expenses = await this.expenseRepository.getUserExpenses(userId);

        const mappedExpenses = expenses.map(expense => this.expenseMapper.toDto(expense))
        return mappedExpenses;
    }

    public async getUserExpensesAnalytics(userId: number) {
        const analytics = await this.getParentExpensesTagsDetails(userId)

        for (const [tagName, data] of Object.entries(analytics)) {
            if (tagName === OTHER_TAG) {
                analytics[tagName] = data;
            } else {
                const childTags = await this.getTagBreakDown(data.children, userId);
                analytics[tagName] = {
                    ...data,
                    children: childTags,
                };
            }
        }

        const formattedAnalytics = this.expenseMapper.toAnalyticsDto(analytics)
        return formattedAnalytics;
    }


    private async getParentExpensesTagsDetails(userId: number) {
        const userExpenses = await this.getUserExpenses(userId);
        const tagSummary = await this.getTagBreakDown(userExpenses, userId)
        return tagSummary
    }

    private async getTagBreakDown(userExpenses: any, userId: number) {
        const tagSummary: Record<string, { total: number; children: typeof userExpenses, description?: string }> = {
            other: {
                total: 0,
                children: [],
            }
        };

        for (const expense of userExpenses) {
            const expenseTags = expense.tags;
            if (expenseTags.length === 0) {
                tagSummary[OTHER_TAG].total += expense.amount;
                tagSummary[OTHER_TAG].children.push(expense);
                continue;
            }

            const parentTag = await this.getExpenseParentTag(expenseTags, userId)
            if (!parentTag) {
                tagSummary[OTHER_TAG].total += expense.amount;
                tagSummary[OTHER_TAG].children.push(expense);
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

        const filteredTagSummary = Object.entries(tagSummary).reduce((acc, [key, value]) => {
            if (value.total > 0) {
                acc[key] = value;
            }
            return acc;
        }, {} as typeof tagSummary);

        return filteredTagSummary;
    }

    private async getExpenseParentTag(expenseTags: string[], userId: number): Promise<string | null> {
        let parentTag: string | null = null;
        let maxFrequency = -1;

        const tagsFrequencyMap = await this.tagService.getTagFrequencyMap(userId)

        for (const tag of expenseTags) {
            const frequency = tagsFrequencyMap.get(tag) ?? 0;
            if (frequency > maxFrequency) {
                parentTag = tag;
                maxFrequency = frequency;
            }
        }
        return parentTag
    }
}


