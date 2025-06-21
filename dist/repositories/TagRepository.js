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
exports.TagRepository = void 0;
const Repository_1 = require("./Repository");
const types_1 = __importDefault(require("../container/types"));
const inversify_1 = require("inversify");
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
let TagRepository = class TagRepository extends Repository_1.Repository {
    constructor(prisma) {
        super(prisma.tag);
    }
    createOrUpsertTags(tx, tagNames, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(tagNames.map(tagName => tx.tag.upsert({
                where: { name_userId: { name: tagName, userId } },
                update: {},
                create: { name: tagName, userId },
            })));
        });
    }
    getUserTagsFrequency(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.default.$queryRaw `
        SELECT t.id AS id, t.name AS name, COUNT(*) AS count
        FROM Tag t
        JOIN ExpenseTag et ON et.tagId = t.id
        WHERE t.userId = ${userId}
        GROUP BY t.id, t.name
        ORDER BY count DESC;
    `;
        });
    }
};
exports.TagRepository = TagRepository;
exports.TagRepository = TagRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.PrismaClient))
], TagRepository);
