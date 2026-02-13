import type { TranslationDictionary } from "./index.ts";

export const es: TranslationDictionary = {
    // App
    "app.title": "Calculadora de Salario",
    "app.subtitle": "Calcula tu salario neto en Colombia despues de impuestos y gastos",
    "app.disclaimer": "Los calculos son aproximados. Consulta con un contador para cifras precisas.",

    // Salary input
    "salary.title": "Informacion Salarial",
    "salary.currency_label": "Seleccion de moneda",
    "salary.monthly_cop": "Salario Mensual (COP)",
    "salary.monthly_usd": "Salario Mensual (USD)",
    "salary.placeholder_cop": "ej. 8.000.000",
    "salary.placeholder_usd": "ej. 2.000",
    "salary.help_cop": "Tu salario bruto mensual en pesos colombianos",
    "salary.help_usd": "Tu salario bruto mensual en dolares americanos",
    "salary.exchange_rate": "Tasa de Cambio (COP por USD)",
    "salary.exchange_placeholder": "ej. 4.200",
    "salary.exchange_help": "Tasa de cambio actual de USD a COP",
    "salary.rate_live": "En vivo",
    "salary.rate_cached": "Cache",
    "salary.rate_default": "Por defecto",

    // Non-salary income
    "income.title": "Ingresos No Salariales",
    "income.empty": "No hay ingresos no salariales. Agrega bonificaciones u otros ingresos no gravables abajo.",
    "income.name_placeholder": "Nombre del ingreso",
    "income.value_placeholder": "Valor en COP",
    "income.add": "+ Agregar",
    "income.remove": "Eliminar",

    // Expenses
    "expenses.title": "Gastos Mensuales",
    "expenses.empty": "No hay gastos agregados. Agrega tus gastos mensuales abajo.",
    "expenses.name_placeholder": "Nombre del gasto",
    "expenses.value_placeholder": "Valor en COP",
    "expenses.add": "+ Agregar",
    "expenses.remove": "Eliminar",

    // Results
    "results.title": "Resultados",
    "results.total_income": "Ingreso Total",
    "results.gross": "Salario Bruto (Gravable)",
    "results.non_salary_income": "Ingresos No Salariales",
    "results.taxes": "Impuestos y Deducciones",
    "results.expenses": "Gastos Totales",
    "results.net": "Salario Neto",
    "results.show_details": "Ver detalles",
    "results.hide_details": "Ocultar detalles",
    "results.of_total": "del ingreso total",
    "results.health": "Salud (4%)",
    "results.pension": "Pension (4%)",
    "results.fsp": "FSP",
    "results.withholding": "Retencion en la Fuente",

    // Pay periods
    "period.monthly": "Mensual",
    "period.biweekly": "Quincenal",
    "period.weekly": "Semanal",
    "period.hourly": "Por hora",
    "period.label": "Periodo de pago",

    // Chart
    "chart.title": "Distribucion del Salario",
    "chart.gross": "Bruto",
    "chart.taxes": "Impuestos",
    "chart.expenses": "Gastos",
    "chart.non_salary": "No Salarial",
    "chart.net": "Neto",

    // Status
    "loading": "Calculando...",
    "loading.rate": "Cargando...",
    "error.exchange_rate": "Error al obtener la tasa de cambio",
    "error.calculation": "Error en el calculo",
} as const;
