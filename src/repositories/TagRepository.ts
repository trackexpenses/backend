import { Prisma, PrismaClient } from '@prisma/client';
import { Repository } from './Repository';
import TYPES from '../container/types';
import { inject, injectable } from 'inversify';
import prisma from '../database/prismaClient';

@injectable()
export class TagRepository extends Repository<any> {
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        super(prisma.tag);
    }

    async createOrUpsertTags(tx: Prisma.TransactionClient, tagNames: string[], userId: number) {
        return Promise.all(
            tagNames.map(tagName =>
                tx.tag.upsert({
                    where: { name_userId: { name: tagName.toLowerCase(), userId } },
                    update: {},
                    create: { name: tagName, userId },
                })
            )
        );
    }

    async getUserTagsFrequency(userId: number) {
        return await prisma.$queryRaw<
            Array<{ id: number; name: string; count: number }>
        >`
        SELECT t.id AS id, t.name AS name, COUNT(*) AS count
        FROM Tag t
        JOIN ExpenseTag et ON et.tagId = t.id
        WHERE t.userId = ${userId}
        GROUP BY t.id, t.name
        ORDER BY count DESC;
    `;

    }
    async getUserTagsWithTotalExpenses(userId: number) {
        return await prisma.$queryRaw<
            Array<{ id: number; name: string; total: number }>
        >`
    SELECT 
        t.id AS id, 
        t.name AS name, 
        SUM(e.amount) AS total
    FROM Tag t
    JOIN ExpenseTag et ON et.tagId = t.id
    JOIN Expense e ON e.id = et.expenseId
    WHERE t.userId = ${userId}
    GROUP BY t.id, t.name
    ORDER BY total DESC;
    `;
    }

}
