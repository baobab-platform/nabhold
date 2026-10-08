import { z } from "zod";

const nullableText = z.string().trim().min(1).nullable();

/**
 * The facts ERP's controlled finance-baseline intake will need for Nabhold
 * (masterplan G06). The baseline is authored, approved and stored by ERP; this
 * schema only checks that the collected input is well formed and reports what
 * is still undecided. Nothing here defaults a value.
 */
export const financeBaselineInputSchema = z
  .object({
    input_version: z.string().min(1),
    masterplan: z.literal("NAB-GOLIVE-MP-001"),
    gate: z.literal("G06"),
    status: z.literal("DRAFT"),
    notes: z.array(z.string()).optional(),
    legal_entity: z.literal("NABHOLD"),
    functional_currency: z.string().regex(/^[A-Z]{3}$/),
    functional_currency_basis: z.string().min(1),
    fiscal_year_start_month: z.number().int().min(1).max(12),
    fiscal_year_basis: z.string().min(1),
    chart_of_accounts_template: nullableText,
    accounting_schema: nullableText,
    costing_method: nullableText,
    effective_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    tax: z
      .object({
        vat_registered: z.boolean(),
        vat_basis: z.string().min(1),
        vat_registration_number: nullableText,
        tax_reference_number: z
          .string()
          .regex(/^\d{10}$/)
          .nullable(),
        tax_reference_basis: z.string().min(1),
        erp_tax_profile: nullableText,
      })
      .strict(),
    approval: z
      .object({
        approved_by: nullableText,
        approver_basis: z.string().min(1),
        approved_at: z.string().datetime().nullable(),
        evidence_reference: nullableText,
      })
      .strict(),
  })
  .strict()
  .superRefine((input, ctx) => {
    if (input.tax.vat_registered && !input.tax.vat_registration_number) {
      ctx.addIssue({
        code: "custom",
        path: ["tax", "vat_registration_number"],
        message: "A VAT-registered entity must carry its VAT number",
      });
    }
    if (!input.tax.vat_registered && input.tax.vat_registration_number) {
      ctx.addIssue({
        code: "custom",
        path: ["tax", "vat_registration_number"],
        message: "A VAT number cannot be recorded while vat_registered is false",
      });
    }
  });

export type FinanceBaselineInput = z.infer<typeof financeBaselineInputSchema>;

/** ERP refuses these as approvers because they are not accountable people. */
const SYNTHETIC_APPROVERS = new Set([
  "system",
  "service",
  "bootstrap",
  "automation",
  "auto",
  "unknown",
  "n/a",
  "none",
]);

export function assessFinanceBaselineReadiness(input: FinanceBaselineInput): {
  readyForIntake: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!input.chart_of_accounts_template) missing.push("chart_of_accounts_template");
  if (!input.accounting_schema) missing.push("accounting_schema");
  if (!input.costing_method) missing.push("costing_method");
  if (!input.effective_from) missing.push("effective_from");
  if (!input.tax.erp_tax_profile) missing.push("tax.erp_tax_profile");

  const approver = input.approval.approved_by;
  if (!approver || SYNTHETIC_APPROVERS.has(approver.trim().toLowerCase())) {
    missing.push("approval.approved_by (a named, accountable person)");
  }
  if (!input.approval.approved_at) missing.push("approval.approved_at");
  if (!input.approval.evidence_reference) missing.push("approval.evidence_reference");

  return { readyForIntake: missing.length === 0, missing };
}
