export default interface ExpenseDto {
    id: number;
    amount: number
    tags: string[]
    description?: string | null;
}