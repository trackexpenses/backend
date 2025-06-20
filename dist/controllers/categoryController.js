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
exports.CategoryController = void 0;
const helper_1 = require("../utils/helper");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
let CategoryController = class CategoryController {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const rawCategoryData = yield this.categoryRepository.create({ name });
                (0, helper_1.formatCategory)(res, rawCategoryData, true);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    readCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prismaClient_1.default.user.findMany({});
                res.status(200).send(users);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const rawCategoryData = yield this.categoryRepository.delete(categoryId);
                (0, helper_1.formatCategory)(res, rawCategoryData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    readCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const rawCategoryData = yield this.categoryRepository.show(categoryId);
                (0, helper_1.formatCategory)(res, rawCategoryData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const rawCategoryData = yield this.categoryRepository.update(categoryId, req.body.name);
                (0, helper_1.formatCategory)(res, rawCategoryData, false);
            }
            catch (error) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/", validationMiddleware_1.ValidationMiddleware.validateInput)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/")
], CategoryController.prototype, "readCategories", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/:id", validationMiddleware_1.ValidationMiddleware.validateId)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id", validationMiddleware_1.ValidationMiddleware.validateId)
], CategoryController.prototype, "readCategory", null);
__decorate([
    (0, inversify_express_utils_1.httpPatch)("/:id", validationMiddleware_1.ValidationMiddleware.validateId, validationMiddleware_1.ValidationMiddleware.validateInput)
], CategoryController.prototype, "updateCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, inversify_express_utils_1.controller)("/categories"),
    __param(0, (0, inversify_1.inject)("CategoryRepository"))
], CategoryController);
