"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../types"));
const UserMapper_1 = __importDefault(require("../../mappers/UserMapper"));
const ExpenseMapper_1 = __importDefault(require("../../mappers/ExpenseMapper"));
class MapperInversify {
    static register(container) {
        container.bind(types_1.default.UserMapper).to(UserMapper_1.default);
        container.bind(types_1.default.ExpenseMapper).to(ExpenseMapper_1.default);
    }
}
exports.default = MapperInversify;
