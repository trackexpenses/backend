import { NextFunction } from "express";
import { container } from "../container";
import TYPES from "../container/types";
import JwtHelper from "../utils/JwtHelper";
import { UserRepository } from "../repositories/UserRepository";
import { Response } from 'express';

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = container.get<UserRepository>(TYPES.UserRepository);

    const token = (req.headers as any).authorization;

    if (!token) {
        return res.status(401).send({ message: "Unauthenticated" });
    }

    const verifyResult = await JwtHelper.verify(token);

    if (!verifyResult.valid || verifyResult.expired) {
        return res.status(401).send({ message: "Unauthenticated" });
    }

    const decodedToken: any = verifyResult.decodedToken;

    const user = await userRepository.findById(decodedToken?.userId);

    if (!user) {
        return res.status(401).send({ message: "Unauthenticated" });
    }

    (req as any).user = user;
    next();
};