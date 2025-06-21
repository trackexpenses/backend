"use strict";
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
exports.isAuth = void 0;
const container_1 = require("../container");
const types_1 = __importDefault(require("../container/types"));
const JwtHelper_1 = __importDefault(require("../utils/JwtHelper"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = container_1.container.get(types_1.default.UserRepository);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const verifyResult = yield JwtHelper_1.default.verify(token);
    if (!verifyResult.valid || verifyResult.expired) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const decodedToken = verifyResult.decodedToken;
    const user = yield userRepository.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId);
    if (!user) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    req.user = user;
    next();
});
exports.isAuth = isAuth;
