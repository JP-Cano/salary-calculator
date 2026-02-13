import { calculateHandler } from "./calculate.ts";
import { exchangeRateHandler } from "./exchange-rate.ts";
import { healthHandler } from "./health.ts";

export const apiRoutes = {
    "/api/calculate": {
        POST: calculateHandler,
    },
    "/api/exchange-rate": {
        GET: exchangeRateHandler,
    },
    "/api/health": {
        GET: healthHandler,
    },
};
