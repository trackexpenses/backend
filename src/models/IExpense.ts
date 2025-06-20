import { ApiStatus } from "./IUser"

export interface IExpenseCreationParams {
    amount: number
    tags: string[]
    description?: string
}

export interface IExpenseResult {
    expense?: IExpenseCreationParams
    errorMessage?: string
    status: ApiStatus
}