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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const itemMapper_1 = require("../mappers/itemMapper");
const helper_1 = require("../utils/helper");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
let ItemController = class ItemController {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, categoryId } = req.body;
                const rawItemData = yield this.itemRepository.create({ name, categoryId });
                (0, helper_1.formatItem)(res, rawItemData, true);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    readItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.itemRepository.read();
                const itemResponses = (0, itemMapper_1.ItemMapper)(items);
                res.status(200).send(itemResponses);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const rawItemData = yield this.itemRepository.delete(categoryId);
                (0, helper_1.formatItem)(res, rawItemData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    readItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const rawItemData = yield this.itemRepository.show(itemId);
                (0, helper_1.formatItem)(res, rawItemData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const rawItemData = yield this.itemRepository.update(itemId, req.body.name);
                (0, helper_1.formatItem)(res, rawItemData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
};
exports.ItemController = ItemController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', validationMiddleware_1.ValidationMiddleware.validateInput, validationMiddleware_1.ValidationMiddleware.validateReferenceId, validationMiddleware_1.ValidationMiddleware.validateCategoryReference)
], ItemController.prototype, "createItem", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/')
], ItemController.prototype, "readItems", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id', validationMiddleware_1.ValidationMiddleware.validateId)
], ItemController.prototype, "deleteItem", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', validationMiddleware_1.ValidationMiddleware.validateId)
], ItemController.prototype, "readItem", null);
__decorate([
    (0, inversify_express_utils_1.httpPatch)('/:id', validationMiddleware_1.ValidationMiddleware.validateId, validationMiddleware_1.ValidationMiddleware.validateInput)
], ItemController.prototype, "updateItem", null);
exports.ItemController = ItemController = __decorate([
    (0, inversify_express_utils_1.controller)('/items'),
    __param(0, (0, inversify_1.inject)('ItemRepository'))
], ItemController);
;
