import { Expense, User } from "@prisma/client";
import { injectable } from "inversify";
import ExpenseDto, { ExpenseAnalyticsDto } from "../dto/ExpenseDto";
import { OTHER_TAG } from "../services/ExpenseService";

@injectable()
export default class ExpenseMapper {
    constructor() { }

    public toDto(document: Expense): ExpenseDto {

        return {
            id: document.id,
            amount: document.amount,
            description: document.description,
            tags: (document as any).tags.map((tag: any) => tag.tag.name)
        };
    }

    public toAnalyticsDto(analytics: any): ExpenseAnalyticsDto[] {
        const formattedAnalytics =
            Object.entries(analytics).map(([tagName, dataRaw], index) => {
                const data = dataRaw as { total: number; children: any };

                const children = tagName === OTHER_TAG
                    ? this.formatOtherChildren(data.children)
                    : this.toChildExpenseDto(data.children);

                return {
                    label: tagName,
                    total: data.total,
                    children,
                    color: colorPalette[index % colorPalette.length],
                };
            })

        return formattedAnalytics
    }

    private toChildExpenseDto(childTags: Record<string, any>) {
        return Object.entries(childTags).map(([childTag, childData]) => ({
            tags: [childTag],
            amount: childData.total,
            description: childData.description,
        }));
    }

    private formatOtherChildren(children: any[]) {
        return children.map((expense: any) => ({
            tags: expense.tags,
            amount: expense.amount,
            description: expense.description,
        }));
    }

}
const colorPalette = [
    '#FBAF17', // yellow
    '#9A88F2', // purple
    '#A4D97A', // light green
    '#73C9F4', // blue
    '#84D08B', // medium green
    '#B55AE0', // violet
    '#E6C662', // gold
    '#9AE3EB', // light blue
    '#76DE9F', // mint green
];

