import React from "react";
import type { Currency } from "../../types/index.ts";
import { useTranslation } from "../i18n/index.ts";
import { formatNumericInput, parseFormattedNumber } from "../utils/formatters.ts";

type SalaryInputProps = {
    salary: number;
    currency: Currency;
    dollarRate: number;
    rateLoading: boolean;
    rateSource: string | null;
    onSalaryChange: (value: number) => void;
    onCurrencyChange: (currency: Currency) => void;
    onRateChange: (value: number) => void;
};

export function SalaryInput({
    salary,
    currency,
    dollarRate,
    rateLoading,
    rateSource,
    onSalaryChange,
    onCurrencyChange,
    onRateChange,
}: SalaryInputProps) {
    const { t } = useTranslation();

    function handleSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = (e.currentTarget as any).value as string;
        onSalaryChange(parseFormattedNumber(raw));
    }

    function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = (e.currentTarget as any).value as string;
        onRateChange(parseFormattedNumber(raw));
    }

    return (
        <section className="card" aria-labelledby="salary-section">
            <h2 id="salary-section">{t("salary.title")}</h2>

            {/* Currency toggle */}
            <div className="currency-toggle" role="radiogroup" aria-label={t("salary.currency_label")}>
                <button
                    type="button"
                    role="radio"
                    aria-checked={currency === "COP"}
                    className={`currency-option ${currency === "COP" ? "active" : ""}`}
                    onClick={() => onCurrencyChange("COP")}
                >
                    COP
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={currency === "USD"}
                    className={`currency-option ${currency === "USD" ? "active" : ""}`}
                    onClick={() => onCurrencyChange("USD")}
                >
                    USD
                </button>
            </div>

            <div className="input-group">
                <label htmlFor="salary-input">
                    {currency === "COP" ? t("salary.monthly_cop") : t("salary.monthly_usd")}
                    <input
                        type="text"
                        inputMode="numeric"
                        id="salary-input"
                        placeholder={currency === "COP" ? t("salary.placeholder_cop") : t("salary.placeholder_usd")}
                        value={salary ? formatNumericInput(String(salary)) : ""}
                        onChange={handleSalaryChange}
                        aria-describedby="salary-help"
                    />
                    <span id="salary-help" className="help-text">
                        {currency === "COP" ? t("salary.help_cop") : t("salary.help_usd")}
                    </span>
                </label>

                {currency === "USD" && (
                    <label htmlFor="dollar-rate">
                        {t("salary.exchange_rate")}
                        <div className="input-with-badge">
                            <input
                                type="text"
                                inputMode="numeric"
                                id="dollar-rate"
                                placeholder={rateLoading ? t("loading.rate") : t("salary.exchange_placeholder")}
                                value={dollarRate ? formatNumericInput(String(dollarRate)) : ""}
                                onChange={handleRateChange}
                                aria-describedby="dollar-rate-help"
                            />
                        </div>
                        <span id="dollar-rate-help" className="help-text">
                            {t("salary.exchange_help")}
                        </span>
                    </label>
                )}
            </div>
        </section>
    );
}
