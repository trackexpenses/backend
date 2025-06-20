import express = require("express");
import { } from "@decorators/express";
import {
    controller,
    httpGet,
} from "inversify-express-utils";
import { inject } from "inversify";
import prisma from "../database/prismaClient";
import { UserRepository } from "../repositories/UserRepository";
import TYPES from "../container/types";
import { Prisma } from "@prisma/client";

@controller("/users")
class UserController {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
    ) { }

    @httpGet("/")
    public async readCategories(req: express.Request, res: express.Response) {
        try {
            const users = await this.userRepository.create({
                name: "YOUSSR",
                email: 'youssrbarakat22@gmail.com',
                password: "ashdhh"
            })

            res.status(200).send(users);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Known error (e.g., unique constraint failed)
                console.error("Prisma error code:", error.code);
                console.error("Details:", error.meta);
            } else {
                // Unknown error
                console.error("Unexpected error:", error);
            }
            res.status(500).send({ message: "Server Error" });
        }
    }

}
export { UserController };
