/** A rate bracket used for FSP and withholding tax calculations. */
export type TaxBracket = {
    readonly min: number;
    readonly max: number;
    readonly rate: number;
};

/** Supported input currencies. */
export type Currency = "COP" | "USD";

/** Pay period options for salary breakdown. */
export type PayPeriod = "monthly" | "biweekly" | "weekly" | "hourly";

/** A user-defined monthly expense. */
export type Expense = {
    name: string;
    value: number;
};

/** Request body for POST /api/calculate. */
export type CalculationRequest = {
    salary: number;
    currency: Currency;
    dollarRate: number;
    expenses: Expense[];
};

/** Breakdown of taxes returned by the calculation. */
export type TaxBreakdown = {
    health: number;
    pension: number;
    fsp: number;
    withholding: number;
    total: number;
};

/** Dual-currency monetary amount. */
export type DualCurrency = {
    cop: number;
    usd: number;
};

/** Percentage breakdown of salary distribution. */
export type SalaryPercentages = {
    taxes: number;
    expenses: number;
    remaining: number;
};

/** Net salary broken down by pay period. */
export type PeriodBreakdown = {
    monthly: DualCurrency;
    biweekly: DualCurrency;
    weekly: DualCurrency;
    hourly: DualCurrency;
};

/** Response body for POST /api/calculate. */
export type CalculationResponse = {
    grossSalary: DualCurrency;
    taxes: TaxBreakdown;
    expenses: {
        items: Expense[];
        total: number;
    };
    netSalary: DualCurrency;
    periodBreakdown: PeriodBreakdown;
    percentages: SalaryPercentages;
};

/** Response body for GET /api/exchange-rate. */
export type ExchangeRateResponse = {
    rate: number;
    lastUpdated: string;
    source: "api" | "cache" | "fallback";
};
