import { Expense, User } from "@prisma/client";
import { injectable } from "inversify";
import ExpenseDto from "../dto/ExpenseDto";

@injectable()
export default class ExpenseMapper {
    constructor() { }

    public async toDto(document: Expense): Promise<ExpenseDto> {

        return {
            id: document.id,
            amount: document.amount,
            description: document.description,
            tags: (document as any).tags.map((tag: any) => tag.tag.name)
        };
    }
}