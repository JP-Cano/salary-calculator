import { useState, useEffect } from "react";
import type { ExchangeRateResponse } from "../../types/index.ts";

type UseExchangeRateResult = {
    rate: number | null;
    loading: boolean;
    error: string | null;
    source: ExchangeRateResponse["source"] | null;
};

/** Fetches the current USD/COP rate from the backend on mount. */
export function useExchangeRate(): UseExchangeRateResult {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<ExchangeRateResponse["source"] | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchRate() {
            try {
                const response = await fetch("/api/exchange-rate");

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: ExchangeRateResponse = await response.json();

                if (!cancelled) {
                    setRate(Math.round(data.rate));
                    setSource(data.source);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to fetch rate");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchRate();
        return () => { cancelled = true; };
    }, []);

    return { rate, loading, error, source };
}
