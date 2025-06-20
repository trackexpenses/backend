"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../types"));
const UserRepository_1 = require("../../repositories/UserRepository");
class RepositoryInversify {
    static register(container) {
        container.bind(types_1.default.UserRepository).to(UserRepository_1.UserRepository);
    }
}
exports.default = RepositoryInversify;
