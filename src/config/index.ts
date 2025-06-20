import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export default {
    port: +(process.env.PORT || 3000),
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY
    },
}