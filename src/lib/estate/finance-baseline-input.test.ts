/** @vitest-environment node */
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assessFinanceBaselineReadiness,
  financeBaselineInputSchema,
} from "./finance-baseline-input";

const file = path.join(
  process.cwd(),
  "docs/go-live/onboarding/nabhold-finance-baseline-input.json",
);

type Raw = Record<string, unknown> & {
  tax: Record<string, unknown>;
  approval: Record<string, unknown>;
};

const load = (): Raw => JSON.parse(readFileSync(file, "utf8")) as Raw;

describe("Nabhold finance baseline input", () => {
  it("conforms to the schema", () => {
    expect(financeBaselineInputSchema.safeParse(load()).success).toBe(true);
  });

  it("records the sponsor-stated facts", () => {
    const input = financeBaselineInputSchema.parse(load());

    expect(input.fiscal_year_start_month).toBe(3);
    expect(input.tax.vat_registered).toBe(false);
    expect(input.tax.vat_registration_number).toBeNull();
    expect(input.approval.approved_by).toBe("Brian Nabusiu");
  });

  it("is not ready for intake while accounting decisions are open", () => {
    const result = assessFinanceBaselineReadiness(
      financeBaselineInputSchema.parse(load()),
    );

    expect(result.readyForIntake).toBe(false);
    expect(result.missing).toEqual(
      expect.arrayContaining([
        "chart_of_accounts_template",
        "accounting_schema",
        "costing_method",
        "effective_from",
        "approval.approved_at",
        "approval.evidence_reference",
      ]),
    );
  });

  it("does not invent a VAT number for an unregistered entity", () => {
    const raw = load();
    raw.tax.vat_registration_number = "4123456789";

    expect(financeBaselineInputSchema.safeParse(raw).success).toBe(false);
  });

  it("requires a VAT number once registered", () => {
    const raw = load();
    raw.tax.vat_registered = true;

    expect(financeBaselineInputSchema.safeParse(raw).success).toBe(false);
  });

  it("rejects a malformed tax reference or fiscal month", () => {
    const badTax = load();
    badTax.tax.tax_reference_number = "12345";
    expect(financeBaselineInputSchema.safeParse(badTax).success).toBe(false);

    const badMonth = load();
    badMonth.fiscal_year_start_month = 13;
    expect(financeBaselineInputSchema.safeParse(badMonth).success).toBe(false);
  });

  it("refuses a synthetic approver", () => {
    const raw = load();
    raw.approval.approved_by = "System";
    raw.chart_of_accounts_template = "x";
    raw.accounting_schema = "x";
    raw.costing_method = "x";
    raw.effective_from = "2027-03-01";
    raw.tax.erp_tax_profile = "x";
    raw.approval.approved_at = "2026-12-01T09:00:00Z";
    raw.approval.evidence_reference = "x";

    const result = assessFinanceBaselineReadiness(
      financeBaselineInputSchema.parse(raw),
    );

    expect(result.readyForIntake).toBe(false);
    expect(result.missing).toEqual([
      "approval.approved_by (a named, accountable person)",
    ]);
  });

  it("is ready only when every open item is resolved by a named person", () => {
    const raw = load();
    raw.chart_of_accounts_template = "x";
    raw.accounting_schema = "x";
    raw.costing_method = "x";
    raw.effective_from = "2027-03-01";
    raw.tax.erp_tax_profile = "x";
    raw.approval.approved_at = "2026-12-01T09:00:00Z";
    raw.approval.evidence_reference = "x";

    expect(
      assessFinanceBaselineReadiness(financeBaselineInputSchema.parse(raw)),
    ).toEqual({ readyForIntake: true, missing: [] });
  });
});
