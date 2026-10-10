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

  it("carries the verified CIPC facts and no longer has G01 blockers", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());

    expect(profile.organisation).toMatchObject({
      legal_name: "NABHOLD GROUP AFRICA (Pty) Ltd",
      jurisdiction: "ZA",
      registration_identifier: "2026/029839/07",
    });
    expect(
      assessOnboardingReadiness(profile).blockers.filter((b) =>
        b.startsWith("G01"),
      ),
    ).toEqual([]);
  });

  it("names a requester and a distinct independent authoriser", () => {
    const profile = onboardingProfileSchema.parse(loadProfile());

    expect(profile.approvals).toEqual({
      requester: "Brenda Adams",
      independent_authoriser: "Brian Nabusiu",
    });
    expect(profile.digital_estate.domains).toEqual([
      "nabhold.com",
      "www.nabhold.com",
    ]);
    expect(profile.digital_estate.canonical_domain).toBe("nabhold.com");
    expect(assessOnboardingReadiness(profile)).toEqual({
      readyToSubmit: true,
      blockers: [],
    });
  });

  it("is blocked when approvals are removed", () => {
    const raw = loadProfile();
    raw.approvals.requester = null;
    raw.approvals.independent_authoriser = null;

    expect(
      assessOnboardingReadiness(onboardingProfileSchema.parse(raw)).blockers,
    ).toEqual([
      "G02: approvals.requester is not named",
      "G02: approvals.independent_authoriser is not named",
    ]);
  });

  it("reports G01 blockers when legal facts are removed", () => {
    const raw = loadProfile();
    raw.organisation.jurisdiction = null;
    raw.organisation.registration_identifier = null;
    raw.organisation.legal_evidence_ref = null;

    expect(
      assessOnboardingReadiness(onboardingProfileSchema.parse(raw)).blockers,
    ).toEqual(
      expect.arrayContaining([
        "G01: organisation.jurisdiction is unverified",
        "G01: organisation.registration_identifier is unverified",
        "G01: organisation.legal_evidence_ref is missing",
      ]),
    );
  });

  it("rejects an authoriser who is the requester", () => {
    const raw = loadProfile();
    raw.approvals.independent_authoriser = raw.approvals.requester;
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

  it("requires the canonical domain to be one of the estate domains", () => {
    const raw = loadProfile();
    raw.digital_estate.canonical_domain = "other.example";

    expect(onboardingProfileSchema.safeParse(raw).success).toBe(false);
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
