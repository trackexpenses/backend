export default interface ExpenseDto {
    id: number;
    amount: number
    tags: string[]
    description?: string | null;
}

interface IChildExpense {
    amount: number
    tags: string[]
    description?: string
}

export interface ExpenseAnalyticsDto {
    label: string
    color: string
    total: number
    children?: IChildExpense[]
}