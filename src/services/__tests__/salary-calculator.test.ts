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

    describe("with COP non-salary income", () => {
        const requestWithBonus: CalculationRequest = {
            ...baseRequest,
            nonSalaryIncome: [
                { name: "Bonus", value: 1_000_000, currency: "COP" },
                { name: "Transport allowance", value: 500_000, currency: "COP" },
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

            const totalPercent =
                result.percentages.taxes +
                result.percentages.expenses +
                result.percentages.remaining;

            expect(Math.round(totalPercent)).toBe(100);
        });

        test("percentages are relative to total income, not gross salary", () => {
            const result = calculateSalary(requestWithBonus);

            expect(result.percentages.nonSalaryIncome).toBeCloseTo(
                (1_500_000 / 6_500_000) * 100,
                1,
            );
        });
    });

    describe("with USD non-salary income", () => {
        const dollarRate = 4_000;
        const requestWithUsdBonus: CalculationRequest = {
            ...baseRequest,
            dollarRate,
            nonSalaryIncome: [
                { name: "USD Bonus", value: 500, currency: "USD" },
            ],
        };

        test("USD items are converted to COP using the dollar rate", () => {
            const result = calculateSalary(requestWithUsdBonus);

            // 500 USD * 4000 = 2,000,000 COP
            expect(result.nonSalaryIncome.total).toBe(2_000_000);
        });

        test("USD non-salary income does NOT affect taxes", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withBonus = calculateSalary(requestWithUsdBonus);

            expect(withBonus.taxes.total).toBe(withoutBonus.taxes.total);
        });

        test("USD non-salary income is added to net salary in COP", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withBonus = calculateSalary(requestWithUsdBonus);

            expect(withBonus.netSalary.cop).toBe(withoutBonus.netSalary.cop + 2_000_000);
        });
    });

    describe("with mixed currency non-salary income", () => {
        const dollarRate = 4_000;
        const requestMixed: CalculationRequest = {
            ...baseRequest,
            dollarRate,
            nonSalaryIncome: [
                { name: "COP Bonus", value: 1_000_000, currency: "COP" },
                { name: "USD Bonus", value: 250, currency: "USD" },
            ],
        };

        test("mixed COP and USD items are correctly summed in COP", () => {
            const result = calculateSalary(requestMixed);

            // 1,000,000 COP + (250 USD * 4000) = 1,000,000 + 1,000,000 = 2,000,000
            expect(result.nonSalaryIncome.total).toBe(2_000_000);
        });

        test("total income reflects both COP and converted USD items", () => {
            const result = calculateSalary(requestMixed);

            expect(result.totalIncome.cop).toBe(5_000_000 + 2_000_000);
        });

        test("taxes remain unchanged with mixed currency income", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withMixed = calculateSalary(requestMixed);

            expect(withMixed.taxes.total).toBe(withoutBonus.taxes.total);
        });

        test("net salary includes all non-salary income converted to COP", () => {
            const withoutBonus = calculateSalary(baseRequest);
            const withMixed = calculateSalary(requestMixed);

            expect(withMixed.netSalary.cop).toBe(withoutBonus.netSalary.cop + 2_000_000);
        });
    });

    describe("with expenses and non-salary income", () => {
        test("expenses are subtracted and non-salary income is added", () => {
            const request: CalculationRequest = {
                ...baseRequest,
                expenses: [{ name: "Rent", value: 1_000_000 }],
                nonSalaryIncome: [{ name: "Bonus", value: 2_000_000, currency: "COP" }],
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
