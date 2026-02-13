import React, { useState } from "react";
import type { Expense } from "../../types/index.ts";
import { formatCOP, formatNumericInput, parseFormattedNumber } from "../utils/formatters.ts";
import { useTranslation } from "../i18n/index.ts";

type ExpenseManagerProps = {
    expenses: Expense[];
    onExpensesChange: (expenses: Expense[]) => void;
};

export function ExpenseManager({ expenses, onExpensesChange }: ExpenseManagerProps) {
    const { t } = useTranslation();
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState("");

    function addExpense() {
        const name = newName.trim();
        const value = parseFormattedNumber(newValue);

        if (!name || !value || value <= 0) return;

        onExpensesChange([...expenses, { name, value }]);
        setNewName("");
        setNewValue("");
    }

    function removeExpense(index: number) {
        onExpensesChange(expenses.filter((_, i) => i !== index));
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            addExpense();
        }
    }

    function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = (e.currentTarget as any).value as string;
        const formatted = formatNumericInput(raw);
        setNewValue(formatted);
    }

    return (
        <section className="card" aria-labelledby="expenses-section">
            <h2 id="expenses-section">{t("expenses.title")}</h2>

            <div className="expenses-list">
                {expenses.length === 0 ? (
                    <p className="help-text">
                        {t("expenses.empty")}
                    </p>
                ) : (
                    expenses.map((expense, index) => (
                        <div key={`${expense.name}-${index}`} className="expense-item">
                            <div className="expense-info">
                                <div className="expense-name">{expense.name}</div>
                                <div className="expense-value">{formatCOP(expense.value)}</div>
                            </div>
                            <button
                                type="button"
                                className="remove-expense"
                                onClick={() => removeExpense(index)}
                                aria-label={`${t("expenses.remove")} ${expense.name}`}
                            >
                                {t("expenses.remove")}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="add-expense-form">
                <input
                    type="text"
                    placeholder={t("expenses.name_placeholder")}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label={t("expenses.name_placeholder")}
                />
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t("expenses.value_placeholder")}
                    value={newValue}
                    onChange={handleValueChange}
                    onKeyDown={handleKeyDown}
                    aria-label={t("expenses.value_placeholder")}
                />
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addExpense}
                    aria-label={t("expenses.add")}
                >
                    {t("expenses.add")}
                </button>
            </div>
        </section>
    );
}
