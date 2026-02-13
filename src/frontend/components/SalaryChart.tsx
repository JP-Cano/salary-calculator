import React from "react";
import type { SalaryPercentages } from "../../types/index.ts";
import { formatCOP } from "../utils/formatters.ts";
import { useTranslation } from "../i18n/index.ts";

type SalaryChartProps = {
    percentages: SalaryPercentages;
    totalIncomeCop: number;
    taxesCop: number;
    expensesCop: number;
    nonSalaryIncomeCop: number;
    netCop: number;
};

export function SalaryChart({ percentages, totalIncomeCop, taxesCop, expensesCop, nonSalaryIncomeCop, netCop }: SalaryChartProps) {
    const { t } = useTranslation();

    type BarData = {
        labelKey: "chart.taxes" | "chart.expenses" | "chart.non_salary" | "chart.net";
        percent: number;
        copValue: number;
        className: string;
    };

    const bars: BarData[] = [
        { labelKey: "chart.taxes", percent: percentages.taxes, copValue: taxesCop, className: "taxes-bar" },
        { labelKey: "chart.expenses", percent: percentages.expenses, copValue: expensesCop, className: "expenses-bar" },
    ];

    // Only show non-salary income bar when there is non-salary income
    if (nonSalaryIncomeCop > 0) {
        bars.push({
            labelKey: "chart.non_salary",
            percent: percentages.nonSalaryIncome,
            copValue: nonSalaryIncomeCop,
            className: "non-salary-bar",
        });
    }

    bars.push({ labelKey: "chart.net", percent: percentages.remaining, copValue: netCop, className: "net-bar" });

    // Normalize so the tallest bar fills 100% of the chart height
    const maxPercent = Math.max(...bars.map((b) => b.percent));
    const scale = (value: number) => maxPercent > 0 ? (value / maxPercent) * 100 : 0;

    return (
        <div className="chart-container">
            <h3>{t("chart.title")}</h3>
            <div className="chart-gross-label">
                {t("chart.gross")}: {formatCOP(totalIncomeCop)}
            </div>
            <div className="chart-bars">
                {bars.map((bar) => {
                    const height = scale(bar.percent);
                    const isSmall = height < 15;

                    return (
                        <div key={bar.labelKey} className="chart-bar">
                            {/* Value label above bar when bar is too small */}
                            {isSmall && bar.percent > 0 && (
                                <div className="bar-top-label">
                                    <div className="bar-top-value">{formatCOP(bar.copValue)}</div>
                                    <div className="bar-top-percent">{bar.percent.toFixed(1)}%</div>
                                </div>
                            )}
                            <div
                                className={`bar-fill ${bar.className}`}
                                style={{ height: `${Math.max(height, bar.percent > 0 ? 3 : 0)}%` }}
                            >
                                {/* Value label inside bar when bar is large enough */}
                                {!isSmall && (
                                    <div className="bar-inner-label">
                                        <div className="bar-inner-value">{formatCOP(bar.copValue)}</div>
                                        <div className="bar-inner-percent">{bar.percent.toFixed(1)}%</div>
                                    </div>
                                )}
                            </div>
                            <span className="bar-label">{t(bar.labelKey)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
