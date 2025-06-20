"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = __importDefault(require("./types"));
const RepositoryInversify_1 = __importDefault(require("./repositories/RepositoryInversify"));
const ServiceInversify_1 = __importDefault(require("./services/ServiceInversify"));
const MapperInversify_1 = __importDefault(require("./mappers/MapperInversify"));
const container = new inversify_1.Container();
exports.container = container;
RepositoryInversify_1.default.register(container);
ServiceInversify_1.default.register(container);
MapperInversify_1.default.register(container);
container.bind(types_1.default.PrismaClient).toConstantValue(new client_1.PrismaClient());
