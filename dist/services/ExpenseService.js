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
    getUserExpenses(userId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenses = yield this.expenseRepository.getUserExpenses(userId, filter);
            const mappedExpenses = expenses.map(expense => this.expenseMapper.toDto(expense));
            return mappedExpenses;
        });
    }
    getUserExpensesAnalytics(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagsFrequencyMap = yield this.tagService.getTagFrequencyMap(userId);
            const analytics = yield this.getParentExpensesTagsDetails(userId, tagsFrequencyMap, startDate, endDate);
            for (const [tagName, data] of Object.entries(analytics)) {
                if (tagName === exports.OTHER_TAG) {
                    analytics[tagName] = data;
                }
                else {
                    const childTags = yield this.getTagBreakDown(data.children, tagsFrequencyMap);
                    analytics[tagName] = Object.assign(Object.assign({}, data), { children: childTags });
                }
            }
            const formattedAnalytics = this.expenseMapper.toAnalyticsDto(analytics);
            return formattedAnalytics;
        });
    }
    getParentExpensesTagsDetails(userId, tagsFrequencyMap, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFilter = this.getDateFilter(startDate, endDate);
            const userExpenses = yield this.getUserExpenses(userId, dateFilter);
            const tagSummary = yield this.getTagBreakDown(userExpenses, tagsFrequencyMap);
            return tagSummary;
        });
    }
    getDateFilter(startDate, endDate) {
        if (!startDate || !endDate) {
            return {};
        }
        const startDateObject = new Date(startDate);
        startDateObject.setHours(0, 0, 0, 0);
        const endDateObjet = new Date(endDate);
        return {
            createdAt: {
                gte: startDateObject,
                lte: endDateObjet,
            },
        };
    }
    getTagBreakDown(userExpenses, tagsFrequencyMap) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagSummary = {};
            for (const expense of userExpenses) {
                const expenseTags = expense.tags;
                if (expenseTags.length === 0) {
                    this.addToOther(tagSummary, expense);
                    continue;
                }
                const parentTag = yield this.getExpenseParentTag(expenseTags, tagsFrequencyMap);
                if (!parentTag) {
                    this.addToOther(tagSummary, expense);
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
            return this.groupLowPercentageTags(tagSummary);
        });
    }
    getExpenseParentTag(expenseTags, tagsFrequencyMap) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let parentTag = null;
            let maxFrequency = -1;
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
    addToOther(tagSummary, expense) {
        if (!tagSummary[exports.OTHER_TAG]) {
            tagSummary[exports.OTHER_TAG] = { total: 0, children: [] };
        }
        tagSummary[exports.OTHER_TAG].total += expense.amount;
        tagSummary[exports.OTHER_TAG].children.push(expense);
    }
    groupLowPercentageTags(tagSummary) {
        const totalAmount = Object.values(tagSummary).reduce((sum, tag) => sum + tag.total, 0);
        const result = {};
        const MIN_STAND_ALONE_PERCENTAGE = 5;
        for (const [tag, data] of Object.entries(tagSummary)) {
            const percentage = (data.total / totalAmount) * 100;
            if (percentage >= MIN_STAND_ALONE_PERCENTAGE) {
                result[tag] = data;
            }
            else {
                if (!result[exports.OTHER_TAG]) {
                    result[exports.OTHER_TAG] = { total: 0, children: [] };
                }
                result[exports.OTHER_TAG].total += data.total;
                const children = tag === exports.OTHER_TAG
                    ? data.children || []
                    : (data.children || []).map((child) => (Object.assign(Object.assign({}, child), { tags: [...(child.tags || []), tag] })));
                result[exports.OTHER_TAG].children.push(...children);
            }
        }
        return result;
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
