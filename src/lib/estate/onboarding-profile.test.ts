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

type Profile = Record<string, Record<string, unknown>>;

function loadProfile(): Profile {
  return JSON.parse(readFileSync(profilePath, "utf8")) as Profile;
}

describe("Nabhold INTERNAL onboarding profile", () => {
  it("conforms to the profile schema", () => {
    expect(onboardingProfileSchema.safeParse(loadProfile()).success).toBe(true);
  });

  it("is blocked while legal facts and approvals are unverified", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());
    const assessment = assessOnboardingReadiness(profile);

    expect(assessment.readyToSubmit).toBe(false);
    expect(assessment.blockers).toEqual(
      expect.arrayContaining([
        "G01: organisation.jurisdiction is unverified",
        "G01: organisation.registration_identifier is unverified",
        "G01: organisation.legal_evidence_ref is missing",
      ]),
    );
  });

  it("is ready only when every blocker is resolved by a distinct authoriser", () => {
    const raw = loadProfile();
    raw.organisation.jurisdiction = "ZA";
    raw.organisation.registration_identifier = "TEST-ONLY-ID";
    raw.organisation.legal_evidence_ref = "evidence/G01/test";
    raw.digital_estate.domain = "example.test";
    raw.approvals.requester = "principal-a";
    raw.approvals.independent_authoriser = "principal-b";

    expect(
      assessOnboardingReadiness(onboardingProfileSchema.parse(raw)),
    ).toEqual({ readyToSubmit: true, blockers: [] });

    raw.approvals.independent_authoriser = "principal-a";
    expect(
      assessOnboardingReadiness(onboardingProfileSchema.parse(raw)).blockers,
    ).toEqual([
      "G02: authoriser must be a different principal from requester",
    ]);
  });

  it("rejects a billable, wildcard or non-ZA classification", () => {
    for (const mutate of [
      (p: Profile) => (p.classification.monetary_charge = 10),
      (p: Profile) => (p.classification.billing_required = true),
      (p: Profile) => (p.classification.usage_metering = false),
      (p: Profile) => (p.market.operating_markets = ["KE"]),
      (p: Profile) => (p.market.operating_markets = ["*"]),
      (p: Profile) => (p.tenant_id = "*" as unknown as Record<string, unknown>),
    ]) {
      const raw = loadProfile();
      mutate(raw);

      expect(onboardingProfileSchema.safeParse(raw).success).toBe(false);
    }
  });

  it("refuses trading activity for the holding company", () => {
    const raw = loadProfile();
    raw.market.participation_activities = ["SELLING_GOODS"];

    expect(onboardingProfileSchema.safeParse(raw).success).toBe(false);
  });

  it("refuses non-canonical or proposed capability keys", () => {
    const raw = loadProfile();
    (raw.requested_capabilities.R1 as string[]).push("finance.ledger.balance.read");

    expect(onboardingProfileSchema.safeParse(raw).success).toBe(false);
  });
});
