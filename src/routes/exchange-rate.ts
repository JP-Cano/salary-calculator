import { getUsdToCopRate } from "../services/exchange-rate.ts";

/** GET /api/exchange-rate — return current USD/COP rate. */
export async function exchangeRateHandler(): Promise<Response> {
    const data = await getUsdToCopRate();
    return Response.json(data);
}
