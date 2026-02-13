import { test, expect, describe } from "bun:test";
import { Expenses } from "../expenses.ts";

describe("Expenses", () => {
    describe("addExpense", () => {
        test("adds a single expense", () => {
            const expenses = new Expenses();
            expenses.addExpense({ name: "Rent", value: 1_500_000 });
            expect(expenses.expenses).toHaveLength(1);
            expect(expenses.expenses[0]).toEqual({ name: "Rent", value: 1_500_000 });
        });
    });

    describe("addExpenses", () => {
        test("adds multiple expenses at once", () => {
            const expenses = new Expenses();
            expenses.addExpenses([
                { name: "Rent", value: 1_500_000 },
                { name: "Gym", value: 100_000 },
            ]);
            expect(expenses.expenses).toHaveLength(2);
        });
    });

    describe("removeExpense", () => {
        test("removes a specific expense by reference", () => {
            const expenses = new Expenses();
            const rent = { name: "Rent", value: 1_500_000 };
            const gym = { name: "Gym", value: 100_000 };
            expenses.addExpenses([rent, gym]);

            expenses.removeExpense(rent);
            expect(expenses.expenses).toHaveLength(1);
            expect(expenses.expenses[0]).toBe(gym);
        });
    });

    describe("removeExpenses", () => {
        test("removes multiple expenses", () => {
            const expenses = new Expenses();
            const rent = { name: "Rent", value: 1_500_000 };
            const gym = { name: "Gym", value: 100_000 };
            const food = { name: "Food", value: 500_000 };
            expenses.addExpenses([rent, gym, food]);

            expenses.removeExpenses([rent, food]);
            expect(expenses.expenses).toHaveLength(1);
            expect(expenses.expenses[0]).toBe(gym);
        });
    });

    describe("total", () => {
        test("returns 0 when no expenses", () => {
            const expenses = new Expenses();
            expect(expenses.total).toBe(0);
        });

        test("sums all expense values", () => {
            const expenses = new Expenses();
            expenses.addExpenses([
                { name: "Rent", value: 1_500_000 },
                { name: "Gym", value: 100_000 },
                { name: "Food", value: 500_000 },
            ]);
            expect(expenses.total).toBe(2_100_000);
        });
    });
});
