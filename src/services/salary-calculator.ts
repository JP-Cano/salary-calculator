import { Salary } from "../calculations/salary.ts";
import { Expenses } from "../calculations/expenses.ts";
import { Taxes } from "../calculations/taxes.ts";
import type { CalculationRequest, CalculationResponse } from "../types/index.ts";

/** Orchestrates salary, tax, and expense calculations. */
export function calculateSalary(request: CalculationRequest): CalculationResponse {
    const {
        salary: inputSalary,
        currency,
        dollarRate,
        expenses: userExpenses,
        nonSalaryIncome: nonSalaryItems,
    } = request;

    const salary = new Salary(inputSalary, currency, dollarRate);
    const copSalary = salary.copSalary;

    // Taxes are calculated ONLY on the base salary (IBC), not on non-salary income
    const taxes = new Taxes(copSalary);
    const totalTaxes = taxes.calculateTaxes();

    const expenses = new Expenses();
    expenses.addExpenses(userExpenses);
    const totalExpenses = expenses.total;

    // Non-salary income is added to net (not subject to taxes)
    // Items in USD are converted to COP using the same dollar rate
    const totalNonSalaryIncome = nonSalaryItems.reduce((sum, item) => {
        const copValue = item.currency === "USD" ? item.value * salary.dollarRate : item.value;
        return sum + copValue;
    }, 0);

    const netSalary = salary.calculateNetSalary(totalExpenses, totalTaxes) + totalNonSalaryIncome;
    const totalIncomeCop = copSalary + totalNonSalaryIncome;

    return {
        totalIncome: {
            cop: totalIncomeCop,
            usd: salary.toUsd(totalIncomeCop),
        },
        grossSalary: {
            cop: copSalary,
            usd: salary.toUsd(copSalary),
        },
        nonSalaryIncome: {
            items: nonSalaryItems,
            total: totalNonSalaryIncome,
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
            taxes: totalIncomeCop > 0 ? (totalTaxes / totalIncomeCop) * 100 : 0,
            expenses: totalIncomeCop > 0 ? (totalExpenses / totalIncomeCop) * 100 : 0,
            nonSalaryIncome: totalIncomeCop > 0 ? (totalNonSalaryIncome / totalIncomeCop) * 100 : 0,
            remaining: totalIncomeCop > 0 ? (netSalary / totalIncomeCop) * 100 : 0,
        },
    };
}
