import type { Currency } from "../types/index.ts";

const DEFAULT_DOLLAR_RATE = 4_200;

/** Standard Colombian work month: 48 hours/week * 4 weeks. */
const MONTHLY_WORK_HOURS = 192;

/** Handles salary conversion and net salary computation. */
export class Salary {
    private readonly _copSalary: number;
    private readonly _dollarRate: number;

    constructor(salary: number, currency: Currency, dollarRate?: number) {
        if (currency === "COP") {
            this._copSalary = salary;
            // Rate is not meaningful for COP input, but store it for potential USD display
            this._dollarRate = dollarRate || DEFAULT_DOLLAR_RATE;
        } else {
            this._dollarRate = dollarRate || DEFAULT_DOLLAR_RATE;
            this._copSalary = salary * this._dollarRate;
        }
    }

    /** Net salary = gross COP salary minus taxes and expenses. */
    public calculateNetSalary(expenses: number, taxes: number): number {
        return this._copSalary - taxes - expenses;
    }

    /** Convert a COP amount to USD using the current rate. */
    public toUsd(copAmount: number): number {
        return copAmount / this._dollarRate;
    }

    /** Compute net salary for each pay period (monthly, biweekly, weekly, hourly). */
    public computePeriodBreakdown(netSalaryCop: number) {
        const biweekly = netSalaryCop / 2;
        const weekly = netSalaryCop / 4;
        const hourly = netSalaryCop / MONTHLY_WORK_HOURS;

        return {
            monthly: { cop: netSalaryCop, usd: this.toUsd(netSalaryCop) },
            biweekly: { cop: biweekly, usd: this.toUsd(biweekly) },
            weekly: { cop: weekly, usd: this.toUsd(weekly) },
            hourly: { cop: hourly, usd: this.toUsd(hourly) },
        };
    }

    get copSalary(): number {
        return this._copSalary;
    }

    get dollarRate(): number {
        return this._dollarRate;
    }
}
