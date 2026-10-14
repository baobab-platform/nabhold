import { z } from "zod";

import { capabilityKeySchema } from "@/lib/control-plane/resolution";

/**
 * Canonical Shared capability keys consumed by the accepted v2.0 Nabhold plan.
 * This is a reviewed estate-side safety ceiling, not a replacement catalogue.
 * Refresh from Shared when canonical contracts change.
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

const principalId = z.string().trim().min(1).nullable();

export const onboardingProfileSchema = z
  .object({
    profile_version: z.literal("2.0.0"),
    masterplan: z.literal("NAB-GOLIVE-MP-001"),
    masterplan_version: z.literal("2.0"),
    gate: z.literal("G02"),
    status: z.literal("DRAFT_CONTROLLED_STAGING_INPUT"),
    business_identity: z
      .object({
        first_party_id: z.literal("NABHOLD"),
        display_name: z.string().min(1),
        legal_name_claim: z.string().min(1),
        jurisdiction_claim: z.literal("ZA"),
        registration_identifier_claim: z.string().min(1),
        legal_evidence_ref: z.string().min(1),
        evidence_posture: z.literal("DOCUMENTED_NOT_INDEPENDENTLY_VERIFIED"),
      })
      .strict(),
    application: z
      .object({
        application_channel: z.literal("INTERNAL_GROUP"),
        requested_markets: z.tuple([z.literal("ZA")]),
        business_needs: z.array(z.string().min(1)).min(1),
      })
      .strict(),
    principals: z
      .object({
        applicant_or_sponsor_principal_id: principalId,
        reviewer_principal_id: principalId,
        decision_maker_principal_id: principalId,
        onboarding_requester_principal_id: principalId,
        onboarding_authoriser_principal_id: principalId,
        registrar_principal_id: principalId,
      })
      .strict(),
    organisation: z
      .object({
        organisation_id: principalId,
        primary_organisation_required: z.literal(true),
      })
      .strict(),
    tenant: z
      .object({
        tenant_id: principalId,
        identity_state_target: z.literal(
          "IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION",
        ),
        isolation_strategy: z.enum(["schema_per_tenant", "row_level_security"]),
        residency_region: z.literal("af-south-1"),
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
          message: "Nabhold is a non-trading holding company",
        },
      ),
    digital_estate: z
      .object({
        repository: z.literal("baobab-platform/nabhold"),
        surfaces: z.array(z.enum(["public", "protected"])).min(1),
        domains: z.array(z.string().trim().min(1)).min(1),
        canonical_domain: z.string().trim().min(1),
      })
      .strict(),
    requested_capabilities: z
      .object({
        R0: z.array(capabilityKeySchema),
        R1_foundation: z.array(capabilityKeySchema),
        R2_existing_canonical: z.array(capabilityKeySchema),
        R3_existing_canonical: z.array(capabilityKeySchema),
        conditional_regulations: z.array(capabilityKeySchema),
      })
      .strict(),
    legal_actor: z
      .object({
        default_legal_entity_mapping: z.literal("PENDING_ACCEPTED_AUTHORITY"),
        cross_business_mandates_requested: z.literal(false),
      })
      .strict(),
    notes: z.array(z.string()).optional(),
  })
  .strict()
  .superRefine((profile, ctx) => {
    if (
      !profile.digital_estate.domains.includes(
        profile.digital_estate.canonical_domain,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["digital_estate", "canonical_domain"],
        message: "canonical_domain must be one of digital_estate.domains",
      });
    }

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
  /** Ready to begin the real controlled staging workflow, never production GO. */
  readyForControlledSubmission: boolean;
  blockers: string[];
}

/**
 * v2.0 deliberately refuses the old "documented company + two names = ready"
 * interpretation. Real CP Principals and independent verification are required.
 */
export function assessOnboardingReadiness(
  profile: OnboardingProfile,
): OnboardingAssessment {
  const blockers: string[] = [];

  if (
    profile.business_identity.evidence_posture !==
    "DOCUMENTED_NOT_INDEPENDENTLY_VERIFIED"
  ) {
    blockers.push("G01B: unsupported evidence posture");
  } else {
    blockers.push("G01B: independent Nabhold verification is not accepted");
  }

  for (const [role, value] of Object.entries(profile.principals)) {
    if (!value) blockers.push(`G04A: ${role} is not a Control Plane Principal`);
  }

  const assignedPrincipals = Object.entries(profile.principals).filter(
    (entry): entry is [string, string] => entry[1] !== null,
  );
  const rolesByPrincipal = new Map<string, string[]>();
  for (const [role, principal] of assignedPrincipals) {
    const roles = rolesByPrincipal.get(principal) ?? [];
    roles.push(role);
    rolesByPrincipal.set(principal, roles);
  }
  for (const [principal, roles] of rolesByPrincipal) {
    if (roles.length > 1) {
      blockers.push(
        `G04A: separation of duties requires distinct Principals; ${principal} is assigned to ${roles.join(", ")}`,
      );
    }
  }

  if (profile.organisation.organisation_id) {
    blockers.push(
      "G02B: this repository must not pre-mint organisation_id; use CP state",
    );
  }
  if (profile.tenant.tenant_id) {
    blockers.push("G02D: this repository must not pre-mint tenant_id; use CP state");
  }

  return {
    readyForControlledSubmission: blockers.length === 0,
    blockers,
  };
}
