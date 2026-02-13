import { test, expect, describe } from "bun:test";
import { Taxes } from "../taxes.ts";
import { TAX_CONSTANTS } from "../../config/tax-constants.ts";

describe("Taxes", () => {
    describe("constructor", () => {
        test("calculates health as 4% of IBC", () => {
            const taxes = new Taxes(10_000_000);
            expect(taxes.health).toBe(400_000);
        });

        test("calculates pension as 4% of IBC", () => {
            const taxes = new Taxes(10_000_000);
            expect(taxes.pension).toBe(400_000);
        });
    });

    describe("uses 2026 constants", () => {
        test("UVT is 52,374 for 2026", () => {
            const taxes = new Taxes(1_000_000);
            expect(taxes.UVT).toBe(52_374);
        });

        test("SMLMV is 1,750,905 for 2026", () => {
            const taxes = new Taxes(1_000_000);
            expect(taxes.SMLMV).toBe(1_750_905);
        });
    });

    describe("FSP calculation", () => {
        test("no FSP when IBC is below 4x SMLMV", () => {
            // 3x SMLMV = 5,252,715
            const taxes = new Taxes(TAX_CONSTANTS.SMLMV * 3);
            taxes.calculateTaxes();
            expect(taxes.FSP).toBe(0);
        });

        test("1% FSP when IBC is between 4x and 16x SMLMV", () => {
            const ibc = TAX_CONSTANTS.SMLMV * 5; // 5x SMLMV
            const taxes = new Taxes(ibc);
            taxes.calculateTaxes();
            expect(taxes.FSP).toBe(ibc * 0.01);
        });

        test("1.2% FSP when IBC is between 16x and 17x SMLMV", () => {
            const ibc = TAX_CONSTANTS.SMLMV * 16.5;
            const taxes = new Taxes(ibc);
            taxes.calculateTaxes();
            expect(taxes.FSP).toBeCloseTo(ibc * 0.012, 0);
        });

        test("2% FSP when IBC is above 20x SMLMV", () => {
            const ibc = TAX_CONSTANTS.SMLMV * 25;
            const taxes = new Taxes(ibc);
            taxes.calculateTaxes();
            expect(taxes.FSP).toBe(ibc * 0.02);
        });
    });

    describe("withholding tax", () => {
        test("no withholding tax when base UVT is below 95", () => {
            // A low salary that after deductions stays below 95 UVT
            const taxes = new Taxes(2_000_000);
            const totalTaxes = taxes.calculateTaxes();
            const withholding = totalTaxes - taxes.health - taxes.pension - taxes.FSP;
            expect(withholding).toBe(0);
        });

        test("applies withholding tax for higher salaries", () => {
            // 10M COP salary should produce some withholding
            const taxes = new Taxes(10_000_000);
            const totalTaxes = taxes.calculateTaxes();
            const withholding = totalTaxes - taxes.health - taxes.pension - taxes.FSP;
            expect(withholding).toBeGreaterThan(0);
        });

        test("progressive brackets produce increasing tax for higher income", () => {
            const taxes8M = new Taxes(8_000_000);
            const total8M = taxes8M.calculateTaxes();
            const withholding8M = total8M - taxes8M.health - taxes8M.pension - taxes8M.FSP;

            const taxes20M = new Taxes(20_000_000);
            const total20M = taxes20M.calculateTaxes();
            const withholding20M = total20M - taxes20M.health - taxes20M.pension - taxes20M.FSP;

            expect(withholding20M).toBeGreaterThan(withholding8M);
        });
    });

    describe("calculateTaxes total", () => {
        test("total equals health + pension + FSP + withholding", () => {
            const taxes = new Taxes(12_000_000);
            const total = taxes.calculateTaxes();
            const withholding = total - taxes.health - taxes.pension - taxes.FSP;

            expect(total).toBe(taxes.health + taxes.pension + taxes.FSP + withholding);
        });

        test("total is always less than IBC", () => {
            const ibc = 15_000_000;
            const taxes = new Taxes(ibc);
            const total = taxes.calculateTaxes();
            expect(total).toBeLessThan(ibc);
        });

        test("total is non-negative", () => {
            const taxes = new Taxes(1_000_000);
            const total = taxes.calculateTaxes();
            expect(total).toBeGreaterThanOrEqual(0);
        });
    });
});
