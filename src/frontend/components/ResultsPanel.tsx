import React, { useState } from "react";
import type { CalculationResponse, Currency, PayPeriod } from "../../types/index.ts";
import { formatCOP, formatUSD, formatPercent } from "../utils/formatters.ts";
import { SalaryChart } from "./SalaryChart.tsx";
import { useTranslation } from "../i18n/index.ts";

type ResultsPanelProps = {
    result: CalculationResponse;
    currency: Currency;
};

const PERIOD_KEYS: Record<PayPeriod, "period.monthly" | "period.biweekly" | "period.weekly" | "period.hourly"> = {
    monthly: "period.monthly",
    biweekly: "period.biweekly",
    weekly: "period.weekly",
    hourly: "period.hourly",
};

const PERIODS: PayPeriod[] = ["monthly", "biweekly", "weekly", "hourly"];

export function ResultsPanel({ result, currency }: ResultsPanelProps) {
    const { t } = useTranslation();
    const [showTaxDetails, setShowTaxDetails] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<PayPeriod>("monthly");

    const periodData = result.periodBreakdown[selectedPeriod];
    const showUsd = currency === "USD";

    return (
        <section className="card results-card" aria-labelledby="results-section">
            <h2 id="results-section">{t("results.title")}</h2>

            <div className="results-grid">
                {/* Gross Salary */}
                <div className="result-item">
                    <span className="result-label">{t("results.gross")}</span>
                    <div className="result-value">
                        <span className="primary-value">
                            {formatCOP(result.grossSalary.cop)}
                        </span>
                        {showUsd && (
                            <span className="secondary-value">
                                {formatUSD(result.grossSalary.usd)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Taxes */}
                <div className="result-item negative">
                    <span className="result-label">{t("results.taxes")}</span>
                    <div className="result-value">
                        <span className="primary-value">
                            {formatCOP(result.taxes.total)}
                        </span>
                        <span className="secondary-value">
                            {formatPercent(result.percentages.taxes)}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="detail-btn"
                        onClick={() => setShowTaxDetails(!showTaxDetails)}
                        aria-expanded={showTaxDetails}
                        aria-label="Toggle tax details"
                    >
                        {showTaxDetails ? t("results.hide_details") : t("results.show_details")}
                        {showTaxDetails ? " \u25B2" : " \u25BC"}
                    </button>
                    {showTaxDetails && (
                        <div className="details">
                            <div className="detail-item">
                                <span>{t("results.health")}</span>
                                <span>{formatCOP(result.taxes.health)}</span>
                            </div>
                            <div className="detail-item">
                                <span>{t("results.pension")}</span>
                                <span>{formatCOP(result.taxes.pension)}</span>
                            </div>
                            <div className="detail-item">
                                <span>{t("results.fsp")}</span>
                                <span>{formatCOP(result.taxes.fsp)}</span>
                            </div>
                            <div className="detail-item">
                                <span>{t("results.withholding")}</span>
                                <span>{formatCOP(result.taxes.withholding)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expenses */}
                <div className="result-item negative">
                    <span className="result-label">{t("results.expenses")}</span>
                    <div className="result-value">
                        <span className="primary-value">
                            {formatCOP(result.expenses.total)}
                        </span>
                        <span className="secondary-value">
                            {formatPercent(result.percentages.expenses)}
                        </span>
                    </div>
                </div>

                {/* Net Salary with period breakdown */}
                <div className="result-item highlight">
                    <span className="result-label">{t("results.net")}</span>

                    {/* Period tabs */}
                    <div className="period-tabs" role="tablist" aria-label={t("period.label")}>
                        {PERIODS.map((period) => (
                            <button
                                key={period}
                                type="button"
                                role="tab"
                                aria-selected={selectedPeriod === period}
                                className={`period-tab ${selectedPeriod === period ? "active" : ""}`}
                                onClick={() => setSelectedPeriod(period)}
                            >
                                {t(PERIOD_KEYS[period])}
                            </button>
                        ))}
                    </div>

                    <div className="result-value">
                        {periodData.cop < 0 ? (
                            <span className="primary-value negative">
                                {formatCOP(periodData.cop)} COP
                            </span>
                        ) : (
                            <span className="primary-value success">
                                {formatCOP(periodData.cop)} COP
                            </span>
                        )}
                        {showUsd && (
                            <span className="secondary-value">
                                {formatUSD(periodData.usd)} USD
                            </span>
                        )}
                    </div>
                    <span className="percentage-badge">
                        {formatPercent(result.percentages.remaining)} {t("results.of_gross")}
                    </span>
                </div>
            </div>

            <SalaryChart
                percentages={result.percentages}
                grossCop={result.grossSalary.cop}
                taxesCop={result.taxes.total}
                expensesCop={result.expenses.total}
                netCop={result.netSalary.cop}
            />
        </section>
    );
}
