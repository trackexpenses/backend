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

}
export { UserController };
