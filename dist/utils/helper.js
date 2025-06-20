"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCategory = formatCategory;
exports.formatItem = formatItem;
const categoryMapper_1 = require("../mappers/categoryMapper");
const itemMapper_1 = require("../mappers/itemMapper");
function formatCategory(res, rawCategoryData, isCreate) {
    if (!rawCategoryData) {
        return res.status(404).send({ message: "Category not found" });
    }
    const category = [];
    category.push(rawCategoryData);
    const categoryResponse = (0, categoryMapper_1.CategoryMapper)(category);
    if (isCreate) {
        return res.status(201).send(categoryResponse);
    }
    return res.status(200).send(categoryResponse);
}
function formatItem(res, rawItemData, isCreate) {
    if (!rawItemData) {
        return res.status(404).send({ message: "Item not found" });
    }
    const item = [];
    item.push(rawItemData);
    const itemResponse = (0, itemMapper_1.ItemMapper)(item);
    if (isCreate) {
        return res.status(201).send(itemResponse);
    }
    return res.status(200).send(itemResponse);
}
