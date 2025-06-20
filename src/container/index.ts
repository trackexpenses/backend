import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/UserRepository';
import TYPES from './types';
import RepositoryInversify from './repositories/RepositoryInversify';
import ServiceInversify from './services/ServiceInversify';
import MapperInversify from './mappers/MapperInversify';



const container = new Container();
RepositoryInversify.register(container);
ServiceInversify.register(container)
MapperInversify.register(container)

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

export { container };