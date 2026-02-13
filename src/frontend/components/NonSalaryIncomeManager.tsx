import React, { useState } from "react";
import type { NonSalaryIncome } from "../../types/index.ts";
import { formatCOP, formatNumericInput, parseFormattedNumber } from "../utils/formatters.ts";
import { useTranslation } from "../i18n/index.ts";

type NonSalaryIncomeManagerProps = {
    items: NonSalaryIncome[];
    onItemsChange: (items: NonSalaryIncome[]) => void;
};

export function NonSalaryIncomeManager({ items, onItemsChange }: NonSalaryIncomeManagerProps) {
    const { t } = useTranslation();
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState("");

    function addItem() {
        const name = newName.trim();
        const value = parseFormattedNumber(newValue);

        if (!name || !value || value <= 0) return;

        onItemsChange([...items, { name, value }]);
        setNewName("");
        setNewValue("");
    }

    function removeItem(index: number) {
        onItemsChange(items.filter((_, i) => i !== index));
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            addItem();
        }
    }

    function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = (e.currentTarget as any).value as string;
        const formatted = formatNumericInput(raw);
        setNewValue(formatted);
    }

    return (
        <section className="card" aria-labelledby="income-section">
            <h2 id="income-section">{t("income.title")}</h2>

            <div className="expenses-list">
                {items.length === 0 ? (
                    <p className="help-text">
                        {t("income.empty")}
                    </p>
                ) : (
                    items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="expense-item income-item">
                            <div className="expense-info">
                                <div className="expense-name">{item.name}</div>
                                <div className="expense-value income-value">{formatCOP(item.value)}</div>
                            </div>
                            <button
                                type="button"
                                className="remove-expense"
                                onClick={() => removeItem(index)}
                                aria-label={`${t("income.remove")} ${item.name}`}
                            >
                                {t("income.remove")}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="add-expense-form">
                <input
                    type="text"
                    placeholder={t("income.name_placeholder")}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label={t("income.name_placeholder")}
                />
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder={t("income.value_placeholder")}
                    value={newValue}
                    onChange={handleValueChange}
                    onKeyDown={handleKeyDown}
                    aria-label={t("income.value_placeholder")}
                />
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addItem}
                    aria-label={t("income.add")}
                >
                    {t("income.add")}
                </button>
            </div>
        </section>
    );
}
