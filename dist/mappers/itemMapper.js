"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemMapper = void 0;
const ItemMapper = (items) => {
    const itemResponses = [];
    for (const item of items) {
        const itemResponse = {
            name: item.name,
            id: item._id
        };
        itemResponses.push(itemResponse);
    }
    return itemResponses;
};
exports.ItemMapper = ItemMapper;
