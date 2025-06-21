import { injectable, inject } from "inversify"
import TYPES from "../container/types"
import { UserRepository } from "../repositories/UserRepository"
import { ApiStatus, IDevice, IUserAuthResult, IUserLoginParams, IUserSignupParams } from "../models/IUser"
import bcrypt from 'bcrypt';
import { PrismaErrorCodes } from "../constants";
import UserMapper from "../mappers/UserMapper";
import config from "../config";
import JwtHelper from "../utils/JwtHelper";
import { uid } from 'rand-token';


@injectable()
export default class UserAuthService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.UserMapper) private userMapper: UserMapper,

    ) { }

    public async registerByEmail(userParams: IUserSignupParams): Promise<IUserAuthResult> {

        try {
            const user = await this.userRepository.create({
                name: userParams.name,
                email: userParams.email,
                password: await this.hashPassword(userParams.password)
            });
            const mappedUser = this.userMapper.toDto(user)
            const device = this.getDeviceTokens(user.id)

            return { user: mappedUser, status: ApiStatus.SUCCESS, device };

        } catch (error: any) {

            if (error.code === PrismaErrorCodes.UniqueConstraintViolation) {
                return { status: ApiStatus.FAILURE, errorMessage: 'User already exists with that email.' };
            } else {
                return { status: ApiStatus.FAILURE, errorMessage: 'Error creating user' };
            }
        }
    }

    public async login(userParams: IUserLoginParams): Promise<IUserAuthResult> {

        const { email, password } = userParams
        const user = await this.userRepository.findFirst({ email });

        if (!user) {
            return { status: ApiStatus.FAILURE, errorMessage: 'Invalid email or password' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { status: ApiStatus.FAILURE, errorMessage: 'Invalid email or password' };
        }

        const device = this.getDeviceTokens(user.id)
        return { user: this.userMapper.toDto(user), status: ApiStatus.SUCCESS, device }
    }

    private async hashPassword(plainPassword: string): Promise<string> {
        const saltRounds = 10;

        const hashed = await bcrypt.hash(plainPassword, saltRounds);
        return hashed;
    }

    private getDeviceTokens(userId: number): IDevice {
        const device = {
            refreshToken: this.generateRefreshToken(),
            accessToken: this.generateAccessToken(userId),
        }
        return device
    }

    private generateRefreshToken(): string {
        const payload = { refreshToken: uid(256) };
        return JwtHelper.sign(payload);
    }

    private generateAccessToken(userId: number): string {
        const payload = {
            userId: userId.toString(),
        }
        return JwtHelper.sign(payload);
    }

}