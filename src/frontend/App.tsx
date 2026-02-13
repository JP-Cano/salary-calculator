import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import type { Expense, NonSalaryIncome, Currency } from "../types/index.ts";
import { SalaryInput } from "./components/SalaryInput.tsx";
import { NonSalaryIncomeManager } from "./components/NonSalaryIncomeManager.tsx";
import { ExpenseManager } from "./components/ExpenseManager.tsx";
import { ResultsPanel } from "./components/ResultsPanel.tsx";
import { Notification, type NotificationType } from "./components/Notification.tsx";
import { useExchangeRate } from "./hooks/useExchangeRate.ts";
import { useCalculation } from "./hooks/useCalculation.ts";
import { LanguageProvider, useTranslation, type Language } from "./i18n/index.ts";
import "./index.css";

type Toast = {
    id: number;
    message: string;
    type: NotificationType;
};

let toastId = 0;

function LanguageToggle() {
    const { language, setLanguage } = useTranslation();

    return (
        <div className="language-toggle" role="radiogroup" aria-label="Language">
            <button
                type="button"
                role="radio"
                aria-checked={language === "es"}
                className={`lang-option ${language === "es" ? "active" : ""}`}
                onClick={() => setLanguage("es")}
            >
                ES
            </button>
            <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                className={`lang-option ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
            >
                EN
            </button>
        </div>
    );
}

function App() {
    const { t } = useTranslation();
    const [salary, setSalary] = useState(0);
    const [currency, setCurrency] = useState<Currency>("COP");
    const [dollarRate, setDollarRate] = useState(0);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [nonSalaryIncome, setNonSalaryIncome] = useState<NonSalaryIncome[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const { rate, loading: rateLoading, error: rateError, source: rateSource } = useExchangeRate();
    const { result, loading: calcLoading, error: calcError, calculate } = useCalculation();

    // Set the exchange rate once fetched (only relevant when USD is selected)
    useEffect(() => {
        if (rate && dollarRate === 0 && currency === "USD") {
            setDollarRate(rate);
        }
    }, [rate, dollarRate, currency]);

    // When switching to USD, auto-fill the rate if available
    useEffect(() => {
        if (currency === "USD" && rate && dollarRate === 0) {
            setDollarRate(rate);
        }
    }, [currency, rate, dollarRate]);

    // Show errors as toasts
    useEffect(() => {
        if (rateError && currency === "USD") {
            addToast(t("error.exchange_rate"), "error");
        }
    }, [rateError, currency]);

    useEffect(() => {
        if (calcError) {
            addToast(calcError, "error");
        }
    }, [calcError]);

    // Auto-calculate when inputs change
    useEffect(() => {
        if (salary <= 0) return;

        // Always pass the best available dollar rate so USD non-salary income
        // items can be converted even when the main salary is in COP
        const effectiveRate = currency === "USD" ? dollarRate : (rate ?? 0);

        if (currency === "COP") {
            calculate({ salary, currency, dollarRate: effectiveRate, expenses, nonSalaryIncome });
        } else if (dollarRate > 0) {
            calculate({ salary, currency, dollarRate, expenses, nonSalaryIncome });
        }
    }, [salary, currency, dollarRate, rate, expenses, nonSalaryIncome, calculate]);

    function handleCurrencyChange(newCurrency: Currency) {
        setCurrency(newCurrency);
        // Reset salary when switching currency to avoid confusion
        setSalary(0);
        if (newCurrency === "USD" && rate) {
            setDollarRate(rate);
        }
    }

    const addToast = useCallback((message: string, type: NotificationType) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <div className="container">
            <header>
                <div className="header-row">
                    <h1>{t("app.title")}</h1>
                    <LanguageToggle />
                </div>
                <p className="subtitle">
                    {t("app.subtitle")}
                </p>
            </header>

            <main>
                <SalaryInput
                    salary={salary}
                    currency={currency}
                    dollarRate={dollarRate}
                    rateLoading={rateLoading}
                    rateSource={currency === "USD" ? rateSource : null}
                    onSalaryChange={setSalary}
                    onCurrencyChange={handleCurrencyChange}
                    onRateChange={setDollarRate}
                />

                <NonSalaryIncomeManager
                    items={nonSalaryIncome}
                    onItemsChange={setNonSalaryIncome}
                />

                <ExpenseManager
                    expenses={expenses}
                    onExpensesChange={setExpenses}
                />

                {calcLoading && (
                    <div className="loading-indicator" aria-live="polite">
                        {t("loading")}
                    </div>
                )}

                {result && <ResultsPanel result={result} currency={currency} />}
            </main>

            <footer>
                <p className="disclaimer">
                    {t("app.disclaimer")}
                </p>
            </footer>

            {/* Toast notifications */}
            <div className="toast-container" aria-live="polite">
                {toasts.map((toast) => (
                    <Notification
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onDismiss={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById("root")!);
root.render(
    <LanguageProvider>
        <App />
    </LanguageProvider>
);
