"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../types"));
const UserRepository_1 = require("../../repositories/UserRepository");
const TagRepository_1 = require("../../repositories/TagRepository");
const ExpenseRepository_1 = require("../../repositories/ExpenseRepository");
const ExpenseTagRepository_1 = require("../../repositories/ExpenseTagRepository");
class RepositoryInversify {
    static register(container) {
        container.bind(types_1.default.UserRepository).to(UserRepository_1.UserRepository);
        container.bind(types_1.default.TagRepository).to(TagRepository_1.TagRepository);
        container.bind(types_1.default.ExpenseRepository).to(ExpenseRepository_1.ExpenseRepository);
        container.bind(types_1.default.ExpenseTagRepository).to(ExpenseTagRepository_1.ExpenseTagRepository);
    }
}
exports.default = RepositoryInversify;
