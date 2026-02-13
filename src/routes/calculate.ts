import { calculateSalary } from "../services/salary-calculator.ts";
import type { CalculationRequest } from "../types/index.ts";

/** POST /api/calculate — compute net salary from inputs. */
export async function calculateHandler(req: Request): Promise<Response> {
    const body = (await req.json()) as CalculationRequest;
    const result = calculateSalary(body);
    return Response.json(result);
}
