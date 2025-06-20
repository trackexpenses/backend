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
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../container/types"));
const IUser_1 = require("../models/IUser");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const JwtHelper_1 = __importDefault(require("../utils/JwtHelper"));
const rand_token_1 = require("rand-token");
let UserAuthService = class UserAuthService {
    constructor(userRepository, userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }
    registerByEmail(userParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.create({
                    name: userParams.name,
                    email: userParams.email,
                    password: yield this.hashPassword(userParams.password)
                });
                const mappedUser = yield this.userMapper.toDto(user);
                const device = this.getDeviceTokens(user.id);
                return { user: mappedUser, status: IUser_1.ApiStatus.SUCCESS, device };
            }
            catch (error) {
                if (error.code === constants_1.PrismaErrorCodes.UniqueConstraintViolation) {
                    return { status: IUser_1.ApiStatus.FAILURE, errorMessage: 'User already exists with that email.' };
                }
                else {
                    return { status: IUser_1.ApiStatus.FAILURE, errorMessage: 'Error creating user' };
                }
            }
        });
    }
    login(userParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userParams;
            const user = yield this.userRepository.findFirst({ email });
            if (!user) {
                return { status: IUser_1.ApiStatus.FAILURE, errorMessage: 'Invalid email or password' };
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return { status: IUser_1.ApiStatus.FAILURE, errorMessage: 'Invalid email or password' };
            }
            const device = this.getDeviceTokens(user.id);
            return { user: yield this.userMapper.toDto(user), status: IUser_1.ApiStatus.SUCCESS, device };
        });
    }
    hashPassword(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const hashed = yield bcrypt_1.default.hash(plainPassword, saltRounds);
            return hashed;
        });
    }
    getDeviceTokens(userId) {
        const device = {
            refreshToken: this.generateRefreshToken(),
            accessToken: this.generateAccessToken(userId),
        };
        return device;
    }
    generateRefreshToken() {
        const payload = { refreshToken: (0, rand_token_1.uid)(256) };
        return JwtHelper_1.default.sign(payload);
    }
    generateAccessToken(userId) {
        const payload = {
            userId: userId.toString(),
        };
        return JwtHelper_1.default.sign(payload);
    }
};
UserAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.default.UserMapper))
], UserAuthService);
exports.default = UserAuthService;
