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
exports.OTHER_TAG = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../container/types"));
const IUser_1 = require("../models/IUser");
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
exports.OTHER_TAG = 'other';
let ExpenseService = class ExpenseService {
    constructor(expenseRepository, tagRepository, expenseTagRepository, expenseMapper, tagService) {
        this.expenseRepository = expenseRepository;
        this.tagRepository = tagRepository;
        this.expenseTagRepository = expenseTagRepository;
        this.expenseMapper = expenseMapper;
        this.tagService = tagService;
    }
    create(userId, expenseParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, description, tags: expenseTags } = expenseParams;
            if (!this.isValidExpenseAmount(amount)) {
                return { errorMessage: 'Invalid Amount', status: IUser_1.ApiStatus.FAILURE };
            }
            try {
                const expense = yield prismaClient_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const expense = yield this.expenseRepository.addExpense(tx, { amount, description, userId });
                    const tags = yield this.tagRepository.createOrUpsertTags(tx, expenseTags, userId);
                    yield this.expenseTagRepository.createExpenseTags(tx, expense.id, tags);
                    return expense;
                }));
                return { status: IUser_1.ApiStatus.SUCCESS, expense: expenseParams };
            }
            catch (error) {
                console.error('Failed to create expense transactionally:', error);
                return { errorMessage: 'Could not create expense', status: IUser_1.ApiStatus.FAILURE };
            }
        });
    }
    isValidExpenseAmount(amount) {
        if (isNaN(amount) || amount <= 0) {
            return false;
        }
        return true;
    }
    getUserExpenses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenses = yield this.expenseRepository.getUserExpenses(userId);
            const mappedExpenses = expenses.map(expense => this.expenseMapper.toDto(expense));
            return mappedExpenses;
        });
    }
    getUserExpensesAnalytics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const analytics = yield this.getParentExpensesTagsDetails(userId);
            for (const [tagName, data] of Object.entries(analytics)) {
                if (tagName === exports.OTHER_TAG) {
                    analytics[tagName] = data;
                }
                else {
                    const childTags = yield this.getTagBreakDown(data.children, userId);
                    analytics[tagName] = Object.assign(Object.assign({}, data), { children: childTags });
                }
            }
            const formattedAnalytics = this.expenseMapper.toAnalyticsDto(analytics);
            return formattedAnalytics;
        });
    }
    getParentExpensesTagsDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExpenses = yield this.getUserExpenses(userId);
            const tagSummary = yield this.getTagBreakDown(userExpenses, userId);
            return tagSummary;
        });
    }
    getTagBreakDown(userExpenses, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagSummary = {
                other: {
                    total: 0,
                    children: [],
                }
            };
            for (const expense of userExpenses) {
                const expenseTags = expense.tags;
                if (expenseTags.length === 0) {
                    tagSummary[exports.OTHER_TAG].total += expense.amount;
                    tagSummary[exports.OTHER_TAG].children.push(expense);
                    continue;
                }
                const parentTag = yield this.getExpenseParentTag(expenseTags, userId);
                if (!parentTag) {
                    tagSummary[exports.OTHER_TAG].total += expense.amount;
                    tagSummary[exports.OTHER_TAG].children.push(expense);
                    continue;
                }
                if (!tagSummary[parentTag]) {
                    tagSummary[parentTag] = {
                        total: 0,
                        children: []
                    };
                }
                tagSummary[parentTag].total += expense.amount;
                tagSummary[parentTag].children.push(Object.assign(Object.assign({}, expense), { tags: expense.tags.filter((tag) => tag !== parentTag) }));
            }
            const filteredTagSummary = Object.entries(tagSummary).reduce((acc, [key, value]) => {
                if (value.total > 0) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            return filteredTagSummary;
        });
    }
    getExpenseParentTag(expenseTags, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let parentTag = null;
            let maxFrequency = -1;
            const tagsFrequencyMap = yield this.tagService.getTagFrequencyMap(userId);
            for (const tag of expenseTags) {
                const frequency = (_a = tagsFrequencyMap.get(tag)) !== null && _a !== void 0 ? _a : 0;
                if (frequency > maxFrequency) {
                    parentTag = tag;
                    maxFrequency = frequency;
                }
            }
            return parentTag;
        });
    }
};
ExpenseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.ExpenseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.TagRepository)),
    __param(2, (0, inversify_1.inject)(types_1.default.ExpenseTagRepository)),
    __param(3, (0, inversify_1.inject)(types_1.default.ExpenseMapper)),
    __param(4, (0, inversify_1.inject)(types_1.default.TagService))
], ExpenseService);
exports.default = ExpenseService;
