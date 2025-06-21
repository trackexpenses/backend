"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../container/types"));
const IUser_1 = require("../models/IUser");
const isAuth_1 = require("../middleware/isAuth");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    addExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const expenseParams = req.body;
            const { status, errorMessage, expense } = yield this.expenseService.create(user.id, expenseParams);
            if (status === IUser_1.ApiStatus.FAILURE) {
                return res.status(422).send({ message: errorMessage });
            }
            res.status(201).send({ expense });
        });
    }
    getExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const expenses = yield this.expenseService.getUserExpenses(user.id);
            res.status(200).send({ expenses });
        });
    }
    getExpensesSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const analytics = yield this.expenseService.getUserExpensesAnalytics(user.id);
            res.status(200).send({ analytics });
        });
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/")
], ExpenseController.prototype, "addExpense", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/")
], ExpenseController.prototype, "getExpenses", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/analytics")
], ExpenseController.prototype, "getExpensesSummary", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, inversify_express_utils_1.controller)("/expenses", isAuth_1.isAuth),
    __param(0, (0, inversify_1.inject)(types_1.default.ExpenseService))
], ExpenseController);
