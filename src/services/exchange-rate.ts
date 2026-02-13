import type { ExchangeRateResponse } from "../types/index.ts";

const API_URL = "https://open.er-api.com/v6/latest/USD";
const FALLBACK_RATE = 4_000;
const CACHE_TTL_MS = 60 * 60 * 1_000; // 1 hour

type CachedRate = {
    rate: number;
    fetchedAt: number;
};

let cache: CachedRate | null = null;

/** Fetch the raw USD/COP rate from the external API. */
async function fetchFromApi(): Promise<number> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = (await response.json()) as {
        result: string;
        rates: Record<string, number>;
    };

    if (data.result !== "success" || !data.rates.COP) {
        throw new Error("Unexpected exchange rate API response format");
    }

    return data.rates.COP;
}

/** Returns true if the cached value is still fresh. */
function isCacheValid(): boolean {
    return cache !== null && Date.now() - cache.fetchedAt < CACHE_TTL_MS;
}

/**
 * Get the current USD to COP exchange rate.
 *
 * Uses an in-memory cache (1-hour TTL) to avoid excessive API calls.
 * Falls back to a hardcoded default if the API is unreachable.
 */
export async function getUsdToCopRate(): Promise<ExchangeRateResponse> {
    // Return cached value if still valid
    if (isCacheValid() && cache) {
        return {
            rate: cache.rate,
            lastUpdated: new Date(cache.fetchedAt).toISOString(),
            source: "cache",
        };
    }

    try {
        const rate = await fetchFromApi();
        cache = { rate, fetchedAt: Date.now() };

        return {
            rate,
            lastUpdated: new Date().toISOString(),
            source: "api",
        };
    } catch (error) {
        console.error("Failed to fetch exchange rate, using fallback:", error);

        // If we have a stale cache, prefer it over the hardcoded fallback
        if (cache) {
            return {
                rate: cache.rate,
                lastUpdated: new Date(cache.fetchedAt).toISOString(),
                source: "cache",
            };
        }

        return {
            rate: FALLBACK_RATE,
            lastUpdated: new Date().toISOString(),
            source: "fallback",
        };
    }
}
