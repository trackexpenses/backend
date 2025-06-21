"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../types"));
const UserAuthService_1 = __importDefault(require("../../services/UserAuthService"));
const ExpenseService_1 = __importDefault(require("../../services/ExpenseService"));
const TagService_1 = __importDefault(require("../../services/TagService"));
class ServiceInversify {
    static register(container) {
        container.bind(types_1.default.UserAuthService).to(UserAuthService_1.default);
        container.bind(types_1.default.ExpenseService).to(ExpenseService_1.default);
        container.bind(types_1.default.TagService).to(TagService_1.default);
    }
}
exports.default = ServiceInversify;
