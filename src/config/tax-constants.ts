import type { TaxBracket } from "../types/index.ts";

/**
 * Colombian tax constants for the current fiscal year.
 *
 * Updated annually — all yearly-changing values live here so they
 * can be modified in a single place.
 */
export const TAX_CONSTANTS = {
    /** Fiscal year these constants apply to. */
    YEAR: 2026,

    /** Unidad de Valor Tributario (DIAN Resolucion 000238, Dec 2025). */
    UVT: 52_374,

    /** Salario Minimo Legal Mensual Vigente. */
    SMLMV: 1_750_905,

    /** Employee health contribution rate. */
    HEALTH_RATE: 0.04,

    /** Employee pension contribution rate. */
    PENSION_RATE: 0.04,

    /** Percentage of base income exempt from withholding tax. */
    EXEMPT_INCOME_PERCENTAGE: 0.25,

    /**
     * Fondo de Solidaridad Pensional tiers.
     * min/max are expressed as multiples of SMLMV.
     * Ley 100 de 1993 rates (reform Ley 2381 suspended by Constitutional Court).
     */
    FSP_RATES: [
        { min: 4, max: 16, rate: 0.01 },
        { min: 16, max: 17, rate: 0.012 },
        { min: 17, max: 18, rate: 0.014 },
        { min: 18, max: 19, rate: 0.016 },
        { min: 19, max: 20, rate: 0.018 },
        { min: 20, max: Infinity, rate: 0.02 },
    ] as readonly TaxBracket[],

    /**
     * Withholding tax (Retencion en la Fuente) progressive brackets.
     * min/max are expressed in UVTs.
     */
    WITHHOLDING_BRACKETS: [
        { min: 0, max: 95, rate: 0 },
        { min: 95, max: 150, rate: 0.19 },
        { min: 150, max: 360, rate: 0.28 },
        { min: 360, max: 640, rate: 0.33 },
        { min: 640, max: 945, rate: 0.35 },
        { min: 945, max: 2300, rate: 0.37 },
        { min: 2300, max: Infinity, rate: 0.39 },
    ] as readonly TaxBracket[],
} as const;
