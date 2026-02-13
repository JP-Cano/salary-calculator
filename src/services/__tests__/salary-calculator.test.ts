import { test, expect, describe } from "bun:test";
import { calculateSalary } from "../salary-calculator.ts";
import type { CalculationRequest } from "../../types/index.ts";

describe("Salary Calculator Service", () => {
    const baseRequest: CalculationRequest = {
        salary: 5_000_000,
        currency: "COP",
        dollarRate: 0,
        expenses: [],
        nonSalaryIncome: [],
    };

    describe("without non-salary income", () => {
        test("calculates correctly with no non-salary income", () => {
            const result = calculateSalary(baseRequest);

            expect(result.nonSalaryIncome.total).toBe(0);
            expect(result.nonSalaryIncome.items).toEqual([]);
            expect(result.totalIncome.cop).toBe(result.grossSalary.cop);
        });

        test("percentages are relative to total income", () => {
            const result = calculateSalary(baseRequest);

            const totalPercent =
                result.percentages.taxes +
                result.percentages.expenses +
                result.percentages.nonSalaryIncome +
                result.percentages.remaining;

            expect(Math.round(totalPercent)).toBe(100);
        });
    });

    describe("with non-salary income", () => {
        const requestWithBonus: CalculationRequest = {
            ...baseRequest,
            nonSalaryIncome: [
                { name: "Bonus", value: 1_000_000 },
                { name: "Transport allowance", value: 500_000 },
            ],
        };

        test("non-salary income does NOT affect tax calculation", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withBonus = calculateSalary(requestWithBonus);

            // Taxes must be identical — non-salary income is not taxable
            expect(withBonus.taxes.health).toBe(withoutBonus.taxes.health);
            expect(withBonus.taxes.pension).toBe(withoutBonus.taxes.pension);
            expect(withBonus.taxes.fsp).toBe(withoutBonus.taxes.fsp);
            expect(withBonus.taxes.withholding).toBe(withoutBonus.taxes.withholding);
            expect(withBonus.taxes.total).toBe(withoutBonus.taxes.total);
        });

        test("non-salary income is added to net salary", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withBonus = calculateSalary(requestWithBonus);

            const totalNonSalary = 1_000_000 + 500_000;
            expect(withBonus.netSalary.cop).toBe(withoutBonus.netSalary.cop + totalNonSalary);
        });

        test("total income includes gross salary + non-salary income", () => {
            const result = calculateSalary(requestWithBonus);

            const totalNonSalary = 1_000_000 + 500_000;
            expect(result.totalIncome.cop).toBe(result.grossSalary.cop + totalNonSalary);
        });

        test("non-salary income items are returned in the response", () => {
            const result = calculateSalary(requestWithBonus);

            expect(result.nonSalaryIncome.items).toHaveLength(2);
            expect(result.nonSalaryIncome.items[0].name).toBe("Bonus");
            expect(result.nonSalaryIncome.items[1].value).toBe(500_000);
            expect(result.nonSalaryIncome.total).toBe(1_500_000);
        });

        test("taxes + expenses + remaining sum to 100%", () => {
            const result = calculateSalary(requestWithBonus);

            // nonSalaryIncome % is informational (portion of total that is non-taxable)
            // It's already included in `remaining`, so only taxes + expenses + remaining = 100%
            const totalPercent =
                result.percentages.taxes +
                result.percentages.expenses +
                result.percentages.remaining;

            expect(Math.round(totalPercent)).toBe(100);
        });

        test("percentages are relative to total income, not gross salary", () => {
            const result = calculateSalary(requestWithBonus);

            // Total income is 5M + 1.5M = 6.5M
            // Non-salary percentage should be ~23.08% (1.5M / 6.5M)
            expect(result.percentages.nonSalaryIncome).toBeCloseTo(
                (1_500_000 / 6_500_000) * 100,
                1,
            );
        });
    });

    describe("with expenses and non-salary income", () => {
        test("expenses are subtracted and non-salary income is added", () => {
            const request: CalculationRequest = {
                ...baseRequest,
                expenses: [{ name: "Rent", value: 1_000_000 }],
                nonSalaryIncome: [{ name: "Bonus", value: 2_000_000 }],
            };

            const noExtras = calculateSalary(baseRequest);
            const withExtras = calculateSalary(request);

            // Net = base net - expenses + non-salary income
            expect(withExtras.netSalary.cop).toBe(
                noExtras.netSalary.cop - 1_000_000 + 2_000_000,
            );
        });
    });
});
