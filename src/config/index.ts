import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret';

export default {
    port: +(process.env.PORT || 3000),
    jwt: {
        publicKey: ACCESS_TOKEN_SECRET,
        privateKey: REFRESH_TOKEN_SECRET,
        accessTokenValidPeriod: 60 * 60,
        refreshTokenValidPeriod: 7 * 24 * 60 * 60,
        forgotPasswordTokenValidPeriod: 60 * 60,
        verifyTokenValidPeriod: 60 * 60,
    },
}