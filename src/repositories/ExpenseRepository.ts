import { injectable, inject } from 'inversify';
import { Prisma, PrismaClient } from '@prisma/client';
import { Repository } from './Repository';
import TYPES from '../container/types';

@injectable()
export class ExpenseRepository extends Repository<any> {
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        super(prisma.expense);
    }
    async addExpense(tx: Prisma.TransactionClient, data: { amount: number; description: string; userId: number }) {
        return tx.expense.create({ data });
    }

    async getUserExpenses(userId: number) {
        const expenses = await this.findMany({
            where: { userId },
            include: {
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        return expenses
    }

}
