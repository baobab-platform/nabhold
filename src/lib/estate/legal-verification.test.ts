/** @vitest-environment node */
import { readFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  assessLegalVerificationPreparation,
  buildLegalVerificationRequests,
  legalVerificationPacketSchema,
  verificationCaseRequestSchema,
  verificationClaimRequestSchema,
} from "./legal-verification";

const packetPath = "docs/go-live/onboarding/za-legal-verification-packet.json";
const packet = () => JSON.parse(readFileSync(packetPath, "utf8"));
// Isolated test identity, never stored in the real registration packet or emitted
// as an accepted CP issuance. Production IDs must come from the CP ledger.
const ORG = "0199a1b2-c3d4-7e8f-9a0b-0000000000a1";

describe("P0-03 registered-business verification preparation", () => {
  it("prepares both real documentary registrations without IAM or a Tenant", () => {
    const report = assessLegalVerificationPreparation(packet());
    expect(report.preparation_ready).toBe(true);
    expect(report.businesses.map((b) => b.registration_identifier)).toEqual(["2026/029839/07", "2026/291672/07"]);
    expect(report.submitted).toBe(false);
    expect(report.independently_verified).toBe(false);
    expect(report.production_authorised).toBe(false);
    expect(report.businesses[1].legal_name_requires_source_review).toBe(true);
  });

  it("does not let one business borrow the other's registration or documentary source", () => {
    for (const field of ["legal_name", "registration_identifier", "documentary_reference"]) {
      const input = packet();
      input.businesses[0][field] = input.businesses[1][field];
      expect(legalVerificationPacketSchema.safeParse(input).success).toBe(false);
    }
    const duplicate = packet();
    duplicate.businesses[1] = duplicate.businesses[0];
    expect(legalVerificationPacketSchema.safeParse(duplicate).success).toBe(false);
  });

  it("rejects authority/credential fields and invented status rather than silently dropping them", () => {
    for (const extra of [{ verified: true }, { principal_id: "Brian" }, { token: "secret" }, { status: "VERIFIED" }]) {
      expect(legalVerificationPacketSchema.safeParse({ ...packet(), ...extra }).success).toBe(false);
    }
    const input = packet();
    input.businesses[0].entity_status = "ACTIVE";
    expect(legalVerificationPacketSchema.safeParse(input).success).toBe(false);
  });

  it("compiles canonical reviewer requests with registration checked before legal name", () => {
    const draft = buildLegalVerificationRequests(packet(), "NABHOLD", ORG.toUpperCase());
    expect(draft.case_request).toEqual({
      subject: { subject_type: "ORGANISATION", subject_id: ORG },
      purpose: "ORGANISATION_ADMISSION", organisation_id: ORG,
    });
    expect(draft.claim_requests.map((c) => c.claim_type)).toEqual(["REGISTRATION_IDENTIFIER", "LEGAL_NAME"]);
    expect(draft.claim_requests[0].claimed_value.value).toBe("2026/029839/07");
    expect(draft.claim_requests[1].claimed_value.value).toBe("NABHOLD GROUP AFRICA (Pty) Ltd");
    for (const claim of draft.claim_requests) {
      expect(claim.subject).toEqual(draft.case_request.subject);
      expect(claim).not.toHaveProperty("source_id");
      expect(claim).not.toHaveProperty("evidence_ids");
      expect(claim).not.toHaveProperty("status");
    }
    expect(draft.submitted).toBe(false);
  });

  it("preserves the full Thamani legal-name claim without rewriting the certificate label", () => {
    const draft = buildLegalVerificationRequests(packet(), "THAMANI-GLOBAL", ORG);
    expect(draft.claim_requests[0].claimed_value.value).toBe("2026/291672/07");
    expect(draft.claim_requests[1].claimed_value.value).toBe("THAMANI GLOBAL (Pty) Ltd");
    expect(packet().businesses[1].certificate_enterprise_name).toBe("THAMANI GLOBAL");
  });

  it("requires a UUID and gives each business/Organisation its own replay key", () => {
    for (const id of ["NABHOLD", "tn_fake", "", ORG + "/claims"]) {
      expect(() => buildLegalVerificationRequests(packet(), "NABHOLD", id)).toThrow();
    }
    const draft = buildLegalVerificationRequests(packet(), "NABHOLD", ORG);
    expect(draft.idempotency_key).toBe(buildLegalVerificationRequests(packet(), "NABHOLD", ORG.toUpperCase()).idempotency_key);
    expect(draft.idempotency_key).not.toBe(buildLegalVerificationRequests(packet(), "THAMANI-GLOBAL", ORG).idempotency_key);
    expect(draft.idempotency_key).not.toBe(buildLegalVerificationRequests(packet(), "NABHOLD", ORG.replace(/1$/, "2")).idempotency_key);
  });

  it("keeps case and claim requests closed against forged outcomes", () => {
    const draft = buildLegalVerificationRequests(packet(), "NABHOLD", ORG);
    expect(verificationCaseRequestSchema.safeParse({ ...draft.case_request, status: "VERIFIED" }).success).toBe(false);
    expect(verificationCaseRequestSchema.safeParse({ ...draft.case_request, organisation_id: ORG.replace(/1$/, "2") }).success).toBe(false);
    expect(verificationClaimRequestSchema.safeParse({ ...draft.claim_requests[0], verified: true }).success).toBe(false);
  });

  it("runs the offline CLI and refuses execution/credential flags", () => {
    const output = execFileSync(process.execPath, ["--experimental-strip-types", "scripts/prepare-legal-verification.mjs"], { encoding: "utf8" });
    expect(JSON.parse(output).preparation_ready).toBe(true);
    const rejected = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/prepare-legal-verification.mjs", "--token", "private-value"], { encoding: "utf8" });
    expect(rejected.status).toBe(2);
    expect(rejected.stderr).not.toContain("private-value");
  });
});
