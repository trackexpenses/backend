import express = require("express");
import { } from "@decorators/express";
import {
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import prisma from "../database/prismaClient";
import { UserRepository } from "../repositories/UserRepository";
import TYPES from "../container/types";
import { Prisma, User } from "@prisma/client";
import { ApiStatus } from "../models/IUser";
import ExpenseService from "../services/ExpenseService";
import { isAuth } from "../middleware/isAuth";

@controller("/expenses", isAuth)
class ExpenseController {
    constructor(
        @inject(TYPES.ExpenseService) private expenseService: ExpenseService,
    ) { }

    @httpPost("/")
    public async addExpense(req: express.Request, res: express.Response) {
        const user = (req as any).user as User
        const expenseParams = req.body;

        const { status, errorMessage, expense } = await this.expenseService.create(user.id, expenseParams)
        if (status === ApiStatus.FAILURE) {
            return res.status(422).send({ message: errorMessage });

        }
        res.status(201).send({ expense });
    }
}

export { ExpenseController };