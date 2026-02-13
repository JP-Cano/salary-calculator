import { TAX_CONSTANTS } from "../config/tax-constants.ts";
import type { TaxBracket } from "../types/index.ts";

/**
 * Calculates all Colombian tax components for a given IBC
 * (Ingreso Base de Cotizacion).
 */
export class Taxes {
    private readonly _health: number;
    private readonly _pension: number;
    private readonly IBC: number;
    private _FSP: number = 0;

    constructor(IBC: number) {
        this.IBC = IBC;
        this._health = IBC * TAX_CONSTANTS.HEALTH_RATE;
        this._pension = IBC * TAX_CONSTANTS.PENSION_RATE;
    }

    /** Calculate total taxes (health + pension + FSP + withholding). */
    public calculateTaxes(): number {
        this._FSP = this.calculateFsp();

        const baseIncome = this.IBC - this._health - this._pension - this._FSP;
        const exemptIncome = baseIncome * TAX_CONSTANTS.EXEMPT_INCOME_PERCENTAGE;
        const taxBase = baseIncome - exemptIncome;
        const baseUVT = taxBase / TAX_CONSTANTS.UVT;
        const withholdingTax = this.calculateWithholdingTax(baseUVT);

        return this._health + this._pension + this._FSP + withholdingTax;
    }

    /** Calculate FSP based on how many times IBC exceeds the SMLMV. */
    private calculateFsp(): number {
        const smlmvFactor = this.IBC / TAX_CONSTANTS.SMLMV;

        const bracket = TAX_CONSTANTS.FSP_RATES.find(
            (rate: TaxBracket) => smlmvFactor >= rate.min && smlmvFactor < rate.max,
        );

        return bracket ? this.IBC * bracket.rate : 0;
    }

    /** Calculate withholding tax using progressive UVT brackets. */
    private calculateWithholdingTax(baseUVT: number): number {
        let totalTax = 0;

        for (const bracket of TAX_CONSTANTS.WITHHOLDING_BRACKETS) {
            if (baseUVT <= bracket.min) {
                break;
            }

            const taxableAmount = Math.min(baseUVT, bracket.max) - bracket.min;
            totalTax += taxableAmount * bracket.rate;
        }

        return Math.trunc(totalTax * TAX_CONSTANTS.UVT);
    }

    get health(): number {
        return this._health;
    }

    get pension(): number {
        return this._pension;
    }

    get FSP(): number {
        return this._FSP;
    }

    get UVT(): number {
        return TAX_CONSTANTS.UVT;
    }

    get SMLMV(): number {
        return TAX_CONSTANTS.SMLMV;
    }
}
