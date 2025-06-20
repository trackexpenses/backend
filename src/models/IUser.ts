import UserDto from "../dto/UserDto"

export enum ApiStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}
export interface IUserLoginParams {
    email: string
    password: string
}

export interface IUserSignupParams extends IUserLoginParams {
    name?: string
}

export interface IDevice {
    accessToken: string
    refreshToken: string
}

export interface IUserAuthResult {
    user?: UserDto
    device?: IDevice
    errorMessage?: string
    status: ApiStatus
}