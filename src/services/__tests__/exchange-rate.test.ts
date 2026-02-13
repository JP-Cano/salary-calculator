import { test, expect, describe } from "bun:test";
import { getUsdToCopRate } from "../exchange-rate.ts";

describe("Exchange Rate Service", () => {
    test("returns a rate object with expected shape", async () => {
        const result = await getUsdToCopRate();

        expect(result).toHaveProperty("rate");
        expect(result).toHaveProperty("lastUpdated");
        expect(result).toHaveProperty("source");
        expect(typeof result.rate).toBe("number");
        expect(result.rate).toBeGreaterThan(0);
        expect(["api", "cache", "fallback"]).toContain(result.source);
    });

    test("rate is a reasonable COP value (between 1000 and 10000)", async () => {
        const result = await getUsdToCopRate();

        // COP/USD is typically between 3000-5000 but we use a wide range for safety
        expect(result.rate).toBeGreaterThan(1000);
        expect(result.rate).toBeLessThan(10_000);
    });

    test("second call returns cached result", async () => {
        const first = await getUsdToCopRate();
        const second = await getUsdToCopRate();

        // Second call should return from cache (same rate, cache source)
        expect(second.rate).toBe(first.rate);
        expect(second.source).toBe("cache");
    });
});
