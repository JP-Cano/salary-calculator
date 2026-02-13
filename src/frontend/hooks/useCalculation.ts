import { useState, useCallback, useRef } from "react";
import type {
    CalculationRequest,
    CalculationResponse,
} from "../../types/index.ts";

type UseCalculationResult = {
    result: CalculationResponse | null;
    loading: boolean;
    error: string | null;
    calculate: (request: CalculationRequest) => void;
};

const DEBOUNCE_MS = 400;

/** Calls POST /api/calculate with debouncing. */
export function useCalculation(): UseCalculationResult {
    const [result, setResult] = useState<CalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const calculate = useCallback((request: CalculationRequest) => {
        // Clear previous debounce timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request),
                });

                if (!response.ok) {
                    throw new Error(`Calculation failed (HTTP ${response.status})`);
                }

                const data: CalculationResponse = await response.json();
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Calculation failed");
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_MS);
    }, []);

    return { result, loading, error, calculate };
}
