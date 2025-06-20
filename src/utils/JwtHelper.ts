import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken';
import config from '../config';

export interface ITokenVerifyResult {
    decodedToken?: object;
    valid: boolean;
    expired: boolean;
}

export default class JwtHelper {

    public static sign(payload: object, expiresIn?: number): string {

        const signOptions: any = {}
        if (expiresIn) {
            signOptions.expiresIn = expiresIn;
        }

        return jwt.sign(
            payload,
            config.jwt.secretKey as Secret,
            signOptions
        )
    }

    public static async verify(token: string): Promise<ITokenVerifyResult> {

        var valid = true;
        var expired = false;
        var decodedToken;

        try {
            decodedToken = jwt.verify(token, config.jwt.secretKey as Secret) as object;
        } catch (e) {

            if (e instanceof TokenExpiredError) {
                expired = true;
            } else {
                valid = false;
            }
        }

        return {
            decodedToken: decodedToken,
            expired: expired,
            valid: valid
        };
    }

    public static decode(token: string): any {
        return jwt.decode(token);
    }
}