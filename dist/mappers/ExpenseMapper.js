"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const ExpenseService_1 = require("../services/ExpenseService");
let ExpenseMapper = class ExpenseMapper {
    constructor() { }
    toDto(document) {
        return {
            id: document.id,
            amount: document.amount,
            description: document.description,
            tags: document.tags.map((tag) => tag.tag.name)
        };
    }
    toAnalyticsDto(analytics) {
        const sortByTotalDesc = ([, aRaw], [, bRaw]) => bRaw.total - aRaw.total;
        const formattedAnalytics = Object.entries(analytics)
            .sort(sortByTotalDesc)
            .map(([tagName, dataRaw], index) => {
            const data = dataRaw;
            const children = tagName === ExpenseService_1.OTHER_TAG
                ? this.formatOtherChildren(data.children)
                : this.toChildExpenseDto(data.children);
            return {
                label: tagName,
                total: data.total,
                children,
                color: colorPalette[index % colorPalette.length],
            };
        });
        return formattedAnalytics;
    }
    toChildExpenseDto(childTags) {
        const sortByAmountDesc = (a, b) => b.amount - a.amount;
        return Object.entries(childTags)
            .map(([childTag, childData]) => ({
            tags: [childTag],
            amount: childData.total,
            description: childData.description,
        }))
            .sort(sortByAmountDesc);
    }
    formatOtherChildren(children) {
        const sortByAmountDesc = (a, b) => b.amount - a.amount;
        return children
            .map((expense) => ({
            tags: expense.tags,
            amount: expense.amount,
            description: expense.description,
        }))
            .sort(sortByAmountDesc);
    }
};
ExpenseMapper = __decorate([
    (0, inversify_1.injectable)()
], ExpenseMapper);
exports.default = ExpenseMapper;
const colorPalette = [
    '#FBAF17', // yellow
    '#9A88F2', // purple
    '#A4D97A', // light green
    '#73C9F4', // blue
    '#84D08B', // medium green
    '#B55AE0', // violet
    '#E6C662', // gold
    '#9AE3EB', // light blue
    '#76DE9F', // mint green
];
