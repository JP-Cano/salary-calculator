# Salary Calculator - AI Guidelines

## 1. Project Overview

### Purpose

Colombian salary calculator that computes **net salary after taxes and deductions** for workers paid in USD. The calculator converts USD income to COP, applies the full Colombian tax model (health, pension, FSP, withholding), subtracts user-defined expenses, and displays the final take-home pay in both currencies.

### Target Audience

Colombian workers and freelancers who receive their salary in US dollars and need to understand their net income after Colombian taxes and personal expenses.

### Language

All code, comments, variable names, commit messages, UI text, and documentation **must be written in English**. The only exceptions are well-known Colombian tax acronyms (IBC, UVT, SMLMV, FSP) which should be kept as-is since they are official terms.

---

## 2. Tech Stack

| Layer      | Technology                  | Notes                                                    |
| ---------- | --------------------------- | -------------------------------------------------------- |
| Runtime    | **Bun**                     | Not Node.js, npm, pnpm, or vite                         |
| Backend    | **Bun.serve()**             | Native Bun HTTP server; serves API routes + frontend      |
| Frontend   | **React**                   | To be migrated from current vanilla JS; served by Bun    |
| Testing    | **bun test**                | Not jest, vitest, or mocha                               |
| Language   | **TypeScript** (strict)     | All source files must be `.ts` or `.tsx`                 |
| Styling    | **CSS**                     | CSS variables, dark mode support via `prefers-color-scheme` |

### Bun-Specific Rules

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` / `yarn install` / `pnpm install`
- Use `bun run <script>` instead of `npm run <script>`
- Bun automatically loads `.env` files — do **not** use `dotenv`
- Prefer `Bun.file` over `node:fs` for file operations
- Use `Bun.serve()` with HTML imports for frontend serving — do **not** use vite or webpack

---

## 3. Business Rules - Colombian Tax Model

### Core Concept

The Colombian tax model calculates mandatory deductions based on the **IBC (Ingreso Base de Cotizacion)**, which equals the gross salary in COP.

### Tax Components

#### Health Contribution
- **Rate**: 4% of IBC
- Mandatory for all employees

#### Pension Contribution
- **Rate**: 4% of IBC
- Mandatory for all employees

#### FSP (Fondo de Solidaridad Pensional)
Tiered rates based on how many times the IBC exceeds the SMLMV:

| IBC / SMLMV Range | Rate  |
| ------------------ | ----- |
| 4 - 16             | 1.0%  |
| 16 - 17            | 1.2%  |
| 17 - 18            | 1.4%  |
| 18 - 19            | 1.6%  |
| 19 - 20            | 1.8%  |
| 20+                | 2.0%  |

Only applies when IBC >= 4x SMLMV.

#### Withholding Tax (Retencion en la Fuente)
Progressive brackets applied to the tax base expressed in UVTs:

1. **Base income** = IBC - health - pension - FSP
2. **Exempt income** = 25% of base income
3. **Tax base** = base income - exempt income
4. **Tax base in UVTs** = tax base / UVT value

| UVT Range   | Marginal Rate |
| ----------- | ------------- |
| 0 - 95      | 0%            |
| 95 - 150    | 19%           |
| 150 - 360   | 28%           |
| 360 - 640   | 33%           |
| 640 - 945   | 35%           |
| 945 - 2,300 | 37%           |
| 2,300+      | 39%           |

### Key Constants (2026 values)

| Constant | Value           | Description                          | Source                                    |
| -------- | --------------- | ------------------------------------ | ----------------------------------------- |
| UVT      | $52,374 COP     | Unidad de Valor Tributario           | DIAN Resolucion 000238, Dec 2025          |
| SMLMV    | $1,750,905 COP  | Salario Minimo Legal Mensual Vigente | Decreto 2025                              |

> **Important**: These values change annually. They are defined in `src/config/tax-constants.ts` as a single source of truth.

### Net Salary Formula

```
Net Salary = Gross Salary (COP) - Total Taxes - Total Expenses
```

Where:
- **Gross Salary (COP)** = USD salary * exchange rate
- **Total Taxes** = health + pension + FSP + withholding tax
- **Total Expenses** = sum of all user-defined expenses

---

## 4. Core Features

### USD to COP Conversion
- User inputs salary in USD
- Exchange rate is fetched from a **free external API** (real-time USD/COP rate)
- User can also manually override the exchange rate
- All monetary results are displayed in **both COP and USD**

### Tax Calculation
- Full Colombian tax breakdown: health, pension, FSP, withholding
- Expandable detail view showing each tax component
- Percentage of gross salary shown for total taxes

### Expense Management
- Users can add and remove custom expenses (name + value in COP)
- Preset "favorite" expenses for quick toggling
- Expenses are subtracted from net salary after taxes
- Total expenses shown with percentage of gross

### Results Display
- Gross salary (COP + USD)
- Tax breakdown (total + individual components)
- Total expenses
- **Net salary** (COP + USD) with percentage of gross
- Visual bar chart showing distribution: taxes vs expenses vs net

---

## 5. Architecture

### Directory Structure

```
salary-calculator/
├── src/
│   ├── server.ts                    # Bun.serve() entry point, imports routes
│   ├── routes/
│   │   ├── index.ts                 # Barrel: exports apiRoutes object
│   │   ├── calculate.ts             # POST /api/calculate handler
│   │   ├── exchange-rate.ts         # GET /api/exchange-rate handler
│   │   └── health.ts               # GET /api/health handler
│   ├── calculations/
│   │   ├── salary.ts                # USD-COP conversion, net salary computation
│   │   ├── taxes.ts                 # Colombian tax model (health, pension, FSP, withholding)
│   │   ├── expenses.ts              # Expense aggregation
│   │   └── __tests__/               # Unit tests for all calculations
│   ├── config/
│   │   ├── tax-constants.ts         # Annually-updated tax constants (UVT, SMLMV, rates)
│   │   └── favorite-expenses.ts     # Preset favorite expenses
│   ├── services/
│   │   ├── exchange-rate.ts         # USD/COP rate fetcher with caching
│   │   ├── salary-calculator.ts     # Orchestrates salary, tax, and expense calculations
│   │   └── __tests__/               # Service tests
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript types and interfaces
│   └── frontend/
│       ├── index.html               # Entry HTML (Bun HTML import)
│       ├── App.tsx                   # Root React component
│       ├── index.css                # Global styles with dark mode
│       ├── components/              # React UI components
│       ├── hooks/                   # Custom React hooks
│       └── utils/                   # Formatters and helpers
├── package.json
├── tsconfig.json
├── CLAUDE.md                        # Bun-specific workspace rules
└── GUIDELINES.md                    # This file
```

### Design Principles

- **Separation of concerns**: Business logic in `src/calculations/`, config in `src/config/`, services in `src/services/`, UI in `src/frontend/`
- **Single Responsibility**: Each class handles one domain concept (Salary, Taxes, Expenses)
- **Easy annual updates**: Tax constants live in `src/config/tax-constants.ts` — a single file to update each year
- **Configurable presets**: Favorite expenses are in `src/config/favorite-expenses.ts`
- **Stateless calculations**: The backend compute endpoint is stateless — all inputs come from the request body
- **Shared types**: All interfaces shared between frontend and backend are defined in `src/types/index.ts`

---

## 6. Coding Standards

### TypeScript
- **Strict mode** enabled (`"strict": true` in tsconfig)
- All source files must be `.ts` or `.tsx`
- Use explicit types for function parameters and return values
- Prefer `readonly` for properties that should not change after construction
- Use `type` for simple type aliases, `interface` for object shapes that may be extended

### Naming Conventions
- **Classes**: PascalCase (`Salary`, `Taxes`, `Expenses`)
- **Functions/methods**: camelCase (`calculateNetSalary`, `calculateFsp`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`EXEMPT_INCOME_PERCENTAGE`), camelCase for config objects
- **Types/Interfaces**: PascalCase (`Expense`, `FSPRate`, `WithholdingTaxRate`)
- **Files**: kebab-case for multi-word files, lowercase for single-word files (`salary.ts`, `taxes.ts`)
- **Well-known abbreviations** allowed: IBC, UVT, SMLMV, FSP, COP, USD

### Code Quality
- Follow **SOLID principles**
- Prefer **immutability** — use `readonly`, `const`, and avoid mutation where practical
- Keep functions small and focused
- Use **pure functions** for calculations when possible
- No magic numbers — all numeric constants must be named
- Format currency values using `Intl.NumberFormat`

### Error Handling
- Validate all API inputs on the backend
- Return meaningful error messages
- Use try/catch for async operations
- Show user-friendly notifications for errors in the UI

### Comments
- Write comments in **English**
- Comment the "why", not the "what"
- Use JSDoc for public API methods
- Avoid obvious comments

---

## 7. Changelog / Completed

The following changes have been implemented in V2:

1. **Updated tax constants to 2026 values** — UVT=$52,374, SMLMV=$1,750,905. FSP tiers and withholding brackets confirmed unchanged.
2. **Integrated real-time exchange rate API** — Uses ExchangeRate-API (open.er-api.com), with 1-hour cache and fallback.
3. **Migrated frontend to React** — Full component-based architecture served via Bun HTML imports.
4. **Translated UI to English** — All labels, headings, and notifications in English.
5. **Modern, intuitive UI** — Card-based layout, dark mode, responsive, auto-calculate on input change.
6. **Added unit tests** — 30 tests covering taxes, salary, expenses, and exchange rate service.
7. **Extracted config** — Tax constants and favorite expenses moved to `src/config/`.
8. **Shared types** — All interfaces in `src/types/index.ts`.

### Future Improvements

- Add i18n support (English/Spanish toggle)
- Persist user expenses in localStorage
- Add export to PDF/CSV
- Add historical tax year comparison
- Add more detailed withholding tax breakdown by bracket

---

## 8. API Reference

### `POST /api/calculate`

Calculates net salary given inputs.

**Request body:**
```json
{
  "dollarSalary": 2000,
  "dollarRate": 4000,
  "expenses": [
    { "name": "Home", "value": 1500000 },
    { "name": "Gym", "value": 100000 }
  ]
}
```

**Response:**
```json
{
  "grossSalary": { "cop": 8000000, "usd": 2000 },
  "taxes": {
    "health": 320000,
    "pension": 320000,
    "fsp": 80000,
    "withholding": 253800,
    "total": 973800
  },
  "expenses": {
    "items": [...],
    "total": 1600000
  },
  "netSalary": { "cop": 5426200, "usd": 1356.55 },
  "percentages": {
    "taxes": 12.17,
    "expenses": 20.0,
    "remaining": 67.83
  }
}
```

### `GET /api/exchange-rate`

Returns the current USD/COP exchange rate.

**Response:**
```json
{
  "rate": 4200,
  "lastUpdated": "2026-02-13T12:00:00.000Z",
  "source": "api"
}
```

`source` is one of `"api"`, `"cache"`, or `"fallback"`.

### `GET /api/favorites`

Returns the list of preset favorite expenses.

### `GET /api/health`

Health check endpoint. Returns `{ "status": "ok" }`.
