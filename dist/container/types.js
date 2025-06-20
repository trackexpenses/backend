"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MapperTypes_1 = require("./mappers/MapperTypes");
const RepositoryTypes_1 = require("./repositories/RepositoryTypes");
const ServiceTypes_1 = require("./services/ServiceTypes");
const TYPES = Object.assign(Object.assign(Object.assign({ PrismaClient: Symbol.for('PrismaClient') }, RepositoryTypes_1.RepositoryTypes), ServiceTypes_1.ServiceTypes), MapperTypes_1.MapperTypes);
exports.default = TYPES;
