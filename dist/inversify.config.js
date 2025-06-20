"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const UserRepository_1 = require("./repositories/UserRepository");
const client_1 = require("@prisma/client");
const types_1 = __importDefault(require("./container/types"));
const container = new inversify_1.Container();
exports.container = container;
container.bind('UserRepository').to(UserRepository_1.UserRepository);
container.bind(types_1.default.PrismaClient).toConstantValue(new client_1.PrismaClient());
