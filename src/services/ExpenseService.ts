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


@injectable()
export default class ExpenseService {

    constructor(
        @inject(TYPES.ExpenseRepository) private expenseRepository: ExpenseRepository,
        @inject(TYPES.TagRepository) private tagRepository: TagRepository,
        @inject(TYPES.ExpenseTagRepository) private expenseTagRepository: ExpenseTagRepository,
        @inject(TYPES.ExpenseMapper) private expenseMapper: ExpenseMapper,

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

        const mappedExpenses = await Promise.all(
            expenses.map(expense => this.expenseMapper.toDto(expense))
        );

        return mappedExpenses;
    }
}