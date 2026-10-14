/** @vitest-environment node */
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assessOnboardingReadiness,
  onboardingProfileSchema,
} from "./onboarding-profile";

const profilePath = path.join(
  process.cwd(),
  "docs/go-live/onboarding/nabhold-internal-onboarding-profile.json",
);

function loadProfile(): unknown {
  return JSON.parse(readFileSync(profilePath, "utf8"));
}

describe("Nabhold Organisation-first onboarding profile v2", () => {
  it("conforms to the accepted v2.0 planning schema", () => {
    const parsed = onboardingProfileSchema.parse(loadProfile());
    expect(parsed.masterplan_version).toBe("2.0");
    expect(parsed.status).toBe("DRAFT_CONTROLLED_STAGING_INPUT");
  });

  it("keeps documentary CIPC facts explicitly unverified", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());

    expect(profile.business_identity).toMatchObject({
      legal_name_claim: "NABHOLD GROUP AFRICA (Pty) Ltd",
      jurisdiction_claim: "ZA",
      registration_identifier_claim: "2026/029839/07",
      evidence_posture: "DOCUMENTED_NOT_INDEPENDENTLY_VERIFIED",
    });
    expect(assessOnboardingReadiness(profile).blockers).toContain(
      "G01B: independent Nabhold verification is not accepted",
    );
  });

  it("does not pretend named humans are Control Plane Principals", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());
    const assessment = assessOnboardingReadiness(profile);

    expect(Object.values(profile.principals).every((value) => value === null)).toBe(
      true,
    );
    expect(assessment.readyForControlledSubmission).toBe(false);
    expect(
      assessment.blockers.filter((blocker) => blocker.startsWith("G04A:")),
    ).toHaveLength(6);
  });

  it("does not pre-mint Organisation or Tenant identity", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());

    expect(profile.organisation.organisation_id).toBeNull();
    expect(profile.tenant.tenant_id).toBeNull();
    expect(profile.tenant.identity_state_target).toBe(
      "IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION",
    );
  });

  it("rejects invented Organisation and Tenant ids as readiness", () => {
    const raw = onboardingProfileSchema.parse(loadProfile());
    const withIds = {
      ...raw,
      organisation: { ...raw.organisation, organisation_id: "org_fake" },
      tenant: { ...raw.tenant, tenant_id: "tn_fake" },
    };
    const assessment = assessOnboardingReadiness(
      onboardingProfileSchema.parse(withIds),
    );

    expect(assessment.blockers).toEqual(
      expect.arrayContaining([
        "G02B: this repository must not pre-mint organisation_id; use CP state",
        "G02D: this repository must not pre-mint tenant_id; use CP state",
      ]),
    );
  });

  it("keeps Nabhold non-trading and ZA scoped", () => {
    const raw = onboardingProfileSchema.parse(loadProfile());

    expect(raw.market.operating_markets).toEqual(["ZA"]);
    const invalid = {
      ...raw,
      market: {
        ...raw.market,
        participation_activities: ["SELLING_GOODS"],
      },
    };
    expect(onboardingProfileSchema.safeParse(invalid).success).toBe(false);
  });

  it("requires canonical domains to match the estate declaration", () => {
    const raw = onboardingProfileSchema.parse(loadProfile());
    const invalid = {
      ...raw,
      digital_estate: {
        ...raw.digital_estate,
        canonical_domain: "other.example",
      },
    };

    expect(onboardingProfileSchema.safeParse(invalid).success).toBe(false);
  });

  it("refuses proposed noncanonical capability keys", () => {
    const raw = onboardingProfileSchema.parse(loadProfile());
    const invalid = {
      ...raw,
      requested_capabilities: {
        ...raw.requested_capabilities,
        R1_foundation: [
          ...raw.requested_capabilities.R1_foundation,
          "finance.ledger.read",
        ],
      },
    };

    expect(onboardingProfileSchema.safeParse(invalid).success).toBe(false);
  });
});
