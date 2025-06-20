import express = require("express");
import { } from "@decorators/express";
import {
    controller,
    httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "../container/types";
import UserAuthService from "../services/UserAuthService";
import { ApiStatus } from "../models/IUser";

@controller("/auth")
class AuthController {
    constructor(
        @inject(TYPES.UserAuthService) private userAuthService: UserAuthService,
    ) { }

    @httpPost("/signup")
    public async signup(req: express.Request, res: express.Response) {
        const userParams = req.body;
        const { status, errorMessage, user, device } = await this.userAuthService.registerByEmail(userParams)
        if (status === ApiStatus.FAILURE) {
            return res.status(422).send({ message: errorMessage });

        }
        res.status(201).send({ user, device });
    }

    @httpPost("/login")
    public async login(req: express.Request, res: express.Response) {
        const userParams = req.body;
        const { status, errorMessage, user, device } = await this.userAuthService.login(userParams)
        if (status === ApiStatus.FAILURE) {
            return res.status(422).send({ message: errorMessage });

        }
        res.status(200).send({ user, device });
    }

}
export { AuthController };
