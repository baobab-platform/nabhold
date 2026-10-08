import { z } from "zod";

import { capabilityKeySchema } from "@/lib/control-plane/resolution";

/**
 * Canonical business-capability keys in the Shared catalogue at the
 * masterplan baseline (shared@70f92ee, contracts/capability/v1/catalogue.yaml).
 * Proposed `P:` keys from NAB-GOLIVE-MP-001 §4 are deliberately absent: they
 * must not be requested from the Control Plane until Shared registers them
 * (G03). Refresh this list from Shared at each gate.
 */
export const CANONICAL_CAPABILITY_KEYS: ReadonlySet<string> = new Set([
  "billing.subscription.manage",
  "billing.usage.record",
  "commerce.cart.manage",
  "commercial.quotation.manage",
  "commercial.rfq.manage",
  "content.entry.resolve",
  "customer.buyer-application.manage",
  "customer.buyer-membership.manage",
  "finance.order-consequence.process",
  "identity.authentication.perform",
  "identity.workload-token.issue",
  "intelligence.evidence.search",
  "intelligence.research-mission.manage",
  "inventory.availability.query",
  "payment.intent.cancel",
  "payment.intent.create",
  "payment.payment.authorize",
  "payment.payment.capture",
  "payment.refund.create",
  "regulations.decision.evaluate",
  "regulations.evidence.assess",
  "regulations.requirement.resolve",
]);

const nullableText = z.string().trim().min(1).nullable();

export const onboardingProfileSchema = z
  .object({
    profile_version: z.string().min(1),
    masterplan: z.literal("NAB-GOLIVE-MP-001"),
    gate: z.literal("G02"),
    status: z.literal("DRAFT"),
    notes: z.array(z.string()).optional(),
    organisation: z
      .object({
        first_party_id: z.literal("NABHOLD"),
        legal_name: z.string().min(1),
        role: z.literal("holding_company"),
        jurisdiction: nullableText,
        registration_identifier: nullableText,
        legal_evidence_ref: nullableText,
      })
      .strict(),
    classification: z
      .object({
        subscription_type: z.literal("INTERNAL"),
        monetary_charge: z.literal(0),
        billing_required: z.literal(false),
        usage_metering: z.literal(true),
        entitlement_control: z.literal(true),
        audit: z.literal(true),
        readiness_control: z.literal(true),
        isolation_control: z.literal(true),
      })
      .strict(),
    market: z
      .object({
        operating_markets: z.tuple([z.literal("ZA")]),
        participation_activities: z.array(z.string()),
      })
      .strict()
      .refine(
        (market) => !market.participation_activities.includes("SELLING_GOODS"),
        {
          path: ["participation_activities"],
          message: "Nabhold does not trade goods (masterplan G01 task 4)",
        },
      ),
    digital_estate: z
      .object({
        repository: z.literal("baobab-platform/nabhold"),
        surfaces: z.array(z.enum(["public", "protected"])).min(1),
        market: z.literal("ZA"),
        domains: z.array(z.string().trim().min(1)).min(1),
      })
      .strict(),
    requested_capabilities: z
      .object({
        R0: z.array(capabilityKeySchema),
        R1: z.array(capabilityKeySchema),
      })
      .strict(),
    approvals: z
      .object({
        requester: nullableText,
        independent_authoriser: nullableText,
      })
      .strict(),
  })
  .strict()
  .superRefine((profile, ctx) => {
    for (const [releaseClass, keys] of Object.entries(
      profile.requested_capabilities,
    )) {
      for (const key of keys) {
        if (!CANONICAL_CAPABILITY_KEYS.has(key)) {
          ctx.addIssue({
            code: "custom",
            path: ["requested_capabilities", releaseClass],
            message: `${key} is not a canonical Shared capability key`,
          });
        }
      }
    }
  });

export type OnboardingProfile = z.infer<typeof onboardingProfileSchema>;

export interface OnboardingAssessment {
  /** True only when no blocker remains. Says nothing about CP runtime state. */
  readyToSubmit: boolean;
  blockers: string[];
}

/**
 * Lists what stops this profile being submitted to Control Plane admission.
 * Unverified legal facts and missing approvals are blockers, never defaults.
 */
export function assessOnboardingReadiness(
  profile: OnboardingProfile,
): OnboardingAssessment {
  const blockers: string[] = [];
  const { organisation, digital_estate, approvals } = profile;

  if (!organisation.jurisdiction) {
    blockers.push("G01: organisation.jurisdiction is unverified");
  }
  if (!organisation.registration_identifier) {
    blockers.push("G01: organisation.registration_identifier is unverified");
  }
  if (!organisation.legal_evidence_ref) {
    blockers.push("G01: organisation.legal_evidence_ref is missing");
  }
  if (digital_estate.domains.length === 0) {
    blockers.push("G02: digital_estate.domains is not decided");
  }
  if (!approvals.requester) {
    blockers.push("G02: approvals.requester is not named");
  }
  if (!approvals.independent_authoriser) {
    blockers.push("G02: approvals.independent_authoriser is not named");
  } else if (approvals.independent_authoriser === approvals.requester) {
    blockers.push("G02: authoriser must be a different principal from requester");
  }

  return { readyToSubmit: blockers.length === 0, blockers };
}
