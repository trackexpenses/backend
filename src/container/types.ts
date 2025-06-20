import { MapperTypes } from "./mappers/MapperTypes";
import { RepositoryTypes } from "./repositories/RepositoryTypes";
import { ServiceTypes } from "./services/ServiceTypes";

const TYPES = {
  PrismaClient: Symbol.for('PrismaClient'),
  ...RepositoryTypes,
  ...ServiceTypes,
  ...MapperTypes
};

export default TYPES;