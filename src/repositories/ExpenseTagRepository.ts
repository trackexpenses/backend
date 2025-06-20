import { Prisma, PrismaClient, Tag } from '@prisma/client';
import { Repository } from './Repository';
import TYPES from '../container/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ExpenseTagRepository extends Repository<any> {
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        super(prisma.expenseTag);
    }
    async createExpenseTags(tx: Prisma.TransactionClient, expenseId: number, tags: Tag[]) {
        return tx.expenseTag.createMany({
            data: tags.map(tag => ({
                expenseId,
                tagId: tag.id,
            })),
        });
    }
}
