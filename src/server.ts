import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Salary } from "./calculations/salary.ts";
import { Expenses } from "./calculations/expenses.ts";
import { Taxes } from "./calculations/taxes.ts";
import { getUsdToCopRate } from "./services/exchange-rate.ts";
import type { CalculationRequest, CalculationResponse } from "./types/index.ts";
import index from "./frontend/index.html";

// Elysia handles all /api/* routes
const api = new Elysia({ prefix: "/api" })
    .use(cors())

    // Calculate net salary from inputs
    .post("/calculate", ({ body }): CalculationResponse => {
        const { salary: inputSalary, currency, dollarRate, expenses: userExpenses } =
            body as CalculationRequest;

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
    })

    // Return the current USD/COP exchange rate
    .get("/exchange-rate", async () => {
        return await getUsdToCopRate();
    })

    // Health check
    .get("/health", () => ({ status: "ok" }));

// Bun.serve() handles HTML imports (bundling React/TSX) + delegates API to Elysia
const server = Bun.serve({
    port: Bun.env.PORT || 3005,
    routes: {
        "/": index,
    },
    fetch(req) {
        return api.handle(req);
    },
    development: {
        hmr: true,
        console: true,
    },
});

console.log(
    `Salary Calculator is running at ${server.hostname}:${server.port}`,
);
