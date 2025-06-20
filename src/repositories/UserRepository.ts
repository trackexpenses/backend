// src/repositories/UserRepository.ts
import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { Repository } from './Repository';
import TYPES from '../container/types';

@injectable()
export class UserRepository extends Repository<any> {
    constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
        super(prisma.user);
    }
}
