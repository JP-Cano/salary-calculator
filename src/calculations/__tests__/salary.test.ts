import { test, expect, describe } from "bun:test";
import { Salary } from "../salary.ts";

describe("Salary", () => {
    describe("USD to COP conversion", () => {
        test("converts using provided exchange rate", () => {
            const salary = new Salary(2000, "USD", 4000);
            expect(salary.copSalary).toBe(8_000_000);
        });

        test("converts using a different rate", () => {
            const salary = new Salary(3000, "USD", 4200);
            expect(salary.copSalary).toBe(12_600_000);
        });

        test("uses default rate when none provided for USD", () => {
            const salary = new Salary(2000, "USD");
            // Default is 4200
            expect(salary.copSalary).toBe(8_400_000);
        });

        test("handles zero salary", () => {
            const salary = new Salary(0, "USD", 4000);
            expect(salary.copSalary).toBe(0);
        });
    });

    describe("COP currency", () => {
        test("uses salary directly as COP when currency is COP", () => {
            const salary = new Salary(8_000_000, "COP");
            expect(salary.copSalary).toBe(8_000_000);
        });

        test("ignores dollarRate when currency is COP", () => {
            const salary = new Salary(8_000_000, "COP", 4000);
            expect(salary.copSalary).toBe(8_000_000);
        });
    });

    describe("calculateNetSalary", () => {
        test("subtracts taxes and expenses from gross", () => {
            const salary = new Salary(2000, "USD", 4000);
            const net = salary.calculateNetSalary(1_000_000, 500_000);
            expect(net).toBe(8_000_000 - 1_000_000 - 500_000);
        });

        test("returns gross when no deductions", () => {
            const salary = new Salary(2000, "USD", 4000);
            const net = salary.calculateNetSalary(0, 0);
            expect(net).toBe(8_000_000);
        });

        test("can return negative when deductions exceed gross", () => {
            const salary = new Salary(500, "USD", 4000);
            const net = salary.calculateNetSalary(2_000_000, 1_000_000);
            expect(net).toBeLessThan(0);
        });
    });

    describe("toUsd", () => {
        test("converts COP to USD using the rate", () => {
            const salary = new Salary(2000, "USD", 4000);
            expect(salary.toUsd(8_000_000)).toBe(2000);
        });

        test("converts COP to USD for COP-based salary using default rate", () => {
            const salary = new Salary(8_000_000, "COP");
            // Default rate is 4200
            expect(salary.toUsd(8_400_000)).toBe(2000);
        });
    });

    describe("computePeriodBreakdown", () => {
        test("computes correct period amounts", () => {
            const salary = new Salary(2000, "USD", 4000);
            const netCop = 6_000_000;
            const breakdown = salary.computePeriodBreakdown(netCop);

            expect(breakdown.monthly.cop).toBe(6_000_000);
            expect(breakdown.biweekly.cop).toBe(3_000_000);
            expect(breakdown.weekly.cop).toBe(1_500_000);
            expect(breakdown.hourly.cop).toBeCloseTo(31_250, 0);
        });

        test("computes USD equivalents for each period", () => {
            const salary = new Salary(2000, "USD", 4000);
            const netCop = 6_000_000;
            const breakdown = salary.computePeriodBreakdown(netCop);

            expect(breakdown.monthly.usd).toBe(1500);
            expect(breakdown.biweekly.usd).toBe(750);
            expect(breakdown.weekly.usd).toBe(375);
            expect(breakdown.hourly.usd).toBeCloseTo(7.8125, 4);
        });
    });
});
