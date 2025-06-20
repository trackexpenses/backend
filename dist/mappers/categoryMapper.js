"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMapper = void 0;
const CategoryMapper = (categories) => {
    const categoryResponses = [];
    for (const category of categories) {
        const categoryResponse = {
            name: category.name,
            id: category._id
        };
        categoryResponses.push(categoryResponse);
    }
    return categoryResponses;
};
exports.CategoryMapper = CategoryMapper;
