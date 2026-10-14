import { createHash } from "node:crypto";
import { z } from "zod";

/**
 * P0-03 preparation boundary (ADR-NAB-0014; ADR-BCP-023/026/027).
 *
 * This server/operator-only module compiles documentary facts into existing
 * Shared requests. It has no network client, token source or decision writer.
 * A legally registered business can prepare its case before IAM/staging setup;
 * preparation never means CP has accepted a verification result. Shared remains
 * the contract authority and CP remains the evidence/case/Organisation owner.
 */
const registrations = {
  NABHOLD: {
    legal_name: "NABHOLD GROUP AFRICA (Pty) Ltd",
    registration_identifier: "2026/029839/07",
    registration_effective_date: "2026-01-16",
    certificate_issued_date: "2026-01-16",
    certificate_enterprise_name: "NABHOLD GROUP AFRICA (Pty) Ltd",
    documentary_reference:
      "baobab-platform/nabhold:docs/go-live/evidence/G01/production/2026-01-16-cipc-registration.md",
  },
  "THAMANI-GLOBAL": {
    legal_name: "THAMANI GLOBAL (Pty) Ltd",
    registration_identifier: "2026/291672/07",
    registration_effective_date: "2026-04-09",
    certificate_issued_date: "2026-04-13",
    certificate_enterprise_name: "THAMANI GLOBAL",
    documentary_reference:
      "baobab-platform/thamani:docs/legal/evidence/2026-04-09-cipc-registration.md",
  },
} as const;

const businessIdSchema = z.enum(["NABHOLD", "THAMANI-GLOBAL"]);
export type VerificationBusiness = z.infer<typeof businessIdSchema>;

const businessSchema = z.object({
  business_id: businessIdSchema,
  legal_name: z.string().min(1),
  registration_identifier: z.string().regex(/^\d{4}\/\d{6}\/\d{2}$/),
  jurisdiction: z.literal("ZA"),
  registration_effective_date: z.iso.date(),
  certificate_issued_date: z.iso.date(),
  certificate_enterprise_name: z.string().min(1),
  documentary_reference: z.string().min(1),
  documentary_posture: z.literal("REGISTERED_EVIDENCED"),
}).strict().superRefine((business, ctx) => {
  // Pair the name, number and evidence to the same real business. A name-only
  // join could put Thamani's claim into Nabhold's case (or silently swap them).
  // These non-sensitive facts are pinned to Shared's first-party registry and
  // the cited certificate notes; changes require a fresh documentary review.
  for (const [field, expected] of Object.entries(registrations[business.business_id])) {
    if (business[field as keyof typeof business] !== expected) {
      ctx.addIssue({ code: "custom", path: [field], message: "Does not match the reviewed registration baseline" });
    }
  }
});

export const legalVerificationPacketSchema = z.object({
  packet_version: z.literal("1.0.0"),
  masterplan: z.literal("NAB-GOLIVE-MP-001"),
  masterplan_version: z.literal("2.0"),
  task: z.literal("P0-03"),
  status: z.literal("PREPARED_NOT_SUBMITTED"),
  businesses: z.array(businessSchema).length(2),
}).strict().superRefine((packet, ctx) => {
  if (new Set(packet.businesses.map((business) => business.business_id)).size !== 2) {
    ctx.addIssue({ code: "custom", path: ["businesses"], message: "Each registered business must occur exactly once" });
  }
});
export type LegalVerificationPacket = z.infer<typeof legalVerificationPacketSchema>;

/** Mirrors the bounded Shared evidence/v1 requests used by this increment only. */
const subjectSchema = z.object({
  subject_type: z.literal("ORGANISATION"),
  subject_id: z.string().uuid(),
}).strict();
export const verificationCaseRequestSchema = z.object({
  subject: subjectSchema,
  purpose: z.literal("ORGANISATION_ADMISSION"),
  organisation_id: z.string().uuid(),
}).strict().refine((request) => request.subject.subject_id === request.organisation_id, {
  message: "Case subject and Organisation must be identical",
});
export const verificationClaimRequestSchema = z.object({
  subject: subjectSchema,
  claim_type: z.enum(["REGISTRATION_IDENTIFIER", "LEGAL_NAME"]),
  jurisdiction: z.literal("ZA"),
  claimed_value: z.object({ value: z.string().min(1).max(1000) }).strict(),
  purpose: z.literal("ORGANISATION_ADMISSION"),
}).strict();

/**
 * Assessment separates work that can be done now from execution prerequisites.
 * In particular, an old certificate establishes documentary registration facts,
 * not current entity/director/tax/ownership standing. No expiry is invented here:
 * the reviewer records freshness under the governing CP policy at observation.
 */
export function assessLegalVerificationPreparation(input: unknown) {
  const packet = legalVerificationPacketSchema.parse(input);
  return {
    task: packet.task,
    preparation_ready: true,
    submitted: false,
    independently_verified: false,
    production_authorised: false,
    businesses: packet.businesses.map((business) => ({
      business_id: business.business_id,
      jurisdiction: business.jurisdiction,
      registration_identifier: business.registration_identifier,
      documentary_posture: business.documentary_posture,
      claim_order: ["REGISTRATION_IDENTIFIER", "LEGAL_NAME"],
      legal_name_requires_source_review:
        business.legal_name !== business.certificate_enterprise_name,
    })),
    deferred_execution: [
      "CP-issued Organisation identity for each business",
      "Authorised verification:write, verification:read and independent verification:decide Principals",
      "Approved official-source access or governed official-document review and evidence custody",
      "Protected non-production CP/IAM runtime credentials and source certification",
      "Current independent checks, results and accepted real case conclusion",
    ],
  } as const;
}

/**
 * Build reviewer's draft requests only after a genuine CP Organisation UUID is
 * supplied by the operator. UUID syntax is NOT proof of issuance or authority;
 * execution must independently resolve the correct business/UUID association
 * from CP and authenticate the operator. This function never mints an identity.
 *
 * CP's CIPC adapter requires a current VERIFIED registration-identifier result
 * in the same case before checking LEGAL_NAME. Claims can be added together,
 * but checks/decisions must respect that dependency. We deliberately omit
 * ENTITY_STATUS/LEGAL_EXISTENCE: historic certificate labels and registration
 * alone must not fabricate current status or unsupported adapter semantics.
 */
export function buildLegalVerificationRequests(
  input: unknown,
  businessId: VerificationBusiness,
  organisationId: string,
) {
  const packet = legalVerificationPacketSchema.parse(input);
  const business = packet.businesses.find((entry) => entry.business_id === businessIdSchema.parse(businessId));
  if (!business) throw new Error("Business is absent from the reviewed packet");
  const id = z.string().uuid().parse(organisationId).toLowerCase();
  const subject = { subject_type: "ORGANISATION" as const, subject_id: id };
  const purpose = "ORGANISATION_ADMISSION" as const;
  const caseRequest = verificationCaseRequestSchema.parse({ subject, purpose, organisation_id: id });
  const claimRequests = ([
    ["REGISTRATION_IDENTIFIER", business.registration_identifier],
    ["LEGAL_NAME", business.legal_name],
  ] as const).map(([claim_type, value]) => verificationClaimRequestSchema.parse({
    subject, purpose, claim_type, jurisdiction: "ZA", claimed_value: { value },
  }));
  // Stable, non-secret case idempotency key includes exact identity and facts.
  // A changed business/Organisation/packet yields a new key. It is NOT a case ID,
  // evidence digest, source observation or proof of legal-person standing.
  const idempotencyKey = "p0-03-" + createHash("sha256")
    .update(JSON.stringify({ packet_version: packet.packet_version, business, caseRequest, claimRequests }))
    .digest("hex");
  return { business_id: businessId, submitted: false, idempotency_key: idempotencyKey, case_request: caseRequest, claim_requests: claimRequests };
}
