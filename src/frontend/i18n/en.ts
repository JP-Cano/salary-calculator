export const en = {
    // App
    "app.title": "Salary Calculator",
    "app.subtitle": "Calculate your net salary in Colombia after taxes and expenses",
    "app.disclaimer": "Calculations are approximate. Consult a tax professional for precise figures.",

    // Salary input
    "salary.title": "Salary Information",
    "salary.currency_label": "Currency selection",
    "salary.monthly_cop": "Monthly Salary (COP)",
    "salary.monthly_usd": "Monthly Salary (USD)",
    "salary.placeholder_cop": "e.g. 8,000,000",
    "salary.placeholder_usd": "e.g. 2,000",
    "salary.help_cop": "Your gross monthly salary in Colombian pesos",
    "salary.help_usd": "Your gross monthly salary in US dollars",
    "salary.exchange_rate": "Exchange Rate (COP per USD)",
    "salary.exchange_placeholder": "e.g. 4,200",
    "salary.exchange_help": "Current USD to COP exchange rate",
    "salary.rate_live": "Live",
    "salary.rate_cached": "Cached",
    "salary.rate_default": "Default",

    // Non-salary income
    "income.title": "Non-Salary Income",
    "income.empty": "No non-salary income added. Add bonuses or other non-taxable income below.",
    "income.name_placeholder": "Income name",
    "income.value_placeholder_cop": "Value in COP",
    "income.value_placeholder_usd": "Value in USD",
    "income.currency_label": "Income currency",
    "income.add": "+ Add",
    "income.remove": "Remove",

    // Expenses
    "expenses.title": "Monthly Expenses",
    "expenses.empty": "No expenses added yet. Add your monthly expenses below.",
    "expenses.name_placeholder": "Expense name",
    "expenses.value_placeholder": "Value in COP",
    "expenses.add": "+ Add",
    "expenses.remove": "Remove",

    // Results
    "results.title": "Results",
    "results.total_income": "Total Income",
    "results.gross": "Gross Salary (Taxable)",
    "results.non_salary_income": "Non-Salary Income",
    "results.taxes": "Taxes & Deductions",
    "results.expenses": "Total Expenses",
    "results.net": "Net Salary",
    "results.show_details": "Show details",
    "results.hide_details": "Hide details",
    "results.of_total": "of total income",
    "results.health": "Health (4%)",
    "results.pension": "Pension (4%)",
    "results.fsp": "FSP",
    "results.withholding": "Withholding Tax",

    // Pay periods
    "period.monthly": "Monthly",
    "period.biweekly": "Biweekly",
    "period.weekly": "Weekly",
    "period.hourly": "Hourly",
    "period.label": "Pay period",

    // Chart
    "chart.title": "Salary Distribution",
    "chart.gross": "Gross",
    "chart.taxes": "Taxes",
    "chart.expenses": "Expenses",
    "chart.non_salary": "Non-Salary",
    "chart.net": "Net",

    // Status
    "loading": "Calculating...",
    "loading.rate": "Loading...",
    "error.exchange_rate": "Failed to fetch exchange rate",
    "error.calculation": "Calculation failed",
} as const;
