import { Prisma, PrismaClient } from '@prisma/client';
import { Repository } from './Repository';
import TYPES from '../container/types';
import { inject, injectable } from 'inversify';

@injectable()
export class TagRepository extends Repository<any> {
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        super(prisma.tag);
    }
    
    async createOrUpsertTags(tx: Prisma.TransactionClient, tagNames: string[], userId: number) {
        return Promise.all(
            tagNames.map(tagName =>
                tx.tag.upsert({
                    where: { name_userId: { name: tagName, userId } },
                    update: {},
                    create: { name: tagName, userId },
                })
            )
        );
    }
}
