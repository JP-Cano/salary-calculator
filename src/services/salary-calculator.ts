import { Salary } from "../calculations/salary.ts";
import { Expenses } from "../calculations/expenses.ts";
import { Taxes } from "../calculations/taxes.ts";
import type { CalculationRequest, CalculationResponse } from "../types/index.ts";

/** Orchestrates salary, tax, and expense calculations. */
export function calculateSalary(request: CalculationRequest): CalculationResponse {
    const { salary: inputSalary, currency, dollarRate, expenses: userExpenses } = request;

    const salary = new Salary(inputSalary, currency, dollarRate);
    const copSalary = salary.copSalary;

    const taxes = new Taxes(copSalary);
    const totalTaxes = taxes.calculateTaxes();

    const expenses = new Expenses();
    expenses.addExpenses(userExpenses);
    const totalExpenses = expenses.total;

    const netSalary = salary.calculateNetSalary(totalExpenses, totalTaxes);

    return {
        grossSalary: {
            cop: copSalary,
            usd: salary.toUsd(copSalary),
        },
        taxes: {
            health: taxes.health,
            pension: taxes.pension,
            fsp: taxes.FSP,
            withholding: totalTaxes - taxes.health - taxes.pension - taxes.FSP,
            total: totalTaxes,
        },
        expenses: {
            items: userExpenses,
            total: totalExpenses,
        },
        netSalary: {
            cop: netSalary,
            usd: salary.toUsd(netSalary),
        },
        periodBreakdown: salary.computePeriodBreakdown(netSalary),
        percentages: {
            taxes: (totalTaxes / copSalary) * 100,
            expenses: (totalExpenses / copSalary) * 100,
            remaining: (netSalary / copSalary) * 100,
        },
    };
}
