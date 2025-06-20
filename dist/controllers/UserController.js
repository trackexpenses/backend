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
exports.UserController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../container/types"));
const client_1 = require("@prisma/client");
let UserController = class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    readCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.create({
                    name: "YOUSSR",
                    email: 'youssrbarakat22@gmail.com',
                    password: "ashdhh"
                });
                res.status(200).send(users);
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    // Known error (e.g., unique constraint failed)
                    console.error("Prisma error code:", error.code);
                    console.error("Details:", error.meta);
                }
                else {
                    // Unknown error
                    console.error("Unexpected error:", error);
                }
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, inversify_express_utils_1.httpGet)("/")
], UserController.prototype, "readCategories", null);
exports.UserController = UserController = __decorate([
    (0, inversify_express_utils_1.controller)("/users"),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository))
], UserController);
