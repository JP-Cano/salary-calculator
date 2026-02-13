import type { Expense } from "../types/index.ts";

export type { Expense };

/** Manages a list of user-defined monthly expenses. */
export class Expenses {
    private _expenses: Expense[] = [];

    public addExpense(expense: Expense): void {
        this._expenses.push(expense);
    }

    public addExpenses(expenses: Expense[]): void {
        this._expenses.push(...expenses);
    }

    public removeExpense(expense: Expense): void {
        this._expenses = this._expenses.filter((e) => e !== expense);
    }

    public removeExpenses(expenses: Expense[]): void {
        this._expenses = this._expenses.filter((e) => !expenses.includes(e));
    }

    public get expenses(): Expense[] {
        return this._expenses;
    }

    public get total(): number {
        return this._expenses.reduce((acc, curr) => acc + curr.value, 0);
    }
}
