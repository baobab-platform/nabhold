/**
 * Release classes from NAB-GOLIVE-MP-001 §1.3. Each class is independently
 * releasable and is never inferred from another:
 *
 *   R0 Institutional      public corporate website
 *   R1 Corporate          protected workplace (identity, finance, HR, ...)
 *   R2 Platform commercial subscriptions, collections, revenue
 *   R3 Group oversight    portfolio, consolidation, intelligence
 *
 * R0 is on by default. R1-R3 are off unless a server-side flag is set to
 * exactly "true". Enabling a flag never substitutes for the acceptance
 * evidence in docs/go-live/register.md; it only lets a signed GO be
 * technically enforced and rolled back (masterplan §7.3, last item).
 */
export const RELEASE_CLASSES = ["R0", "R1", "R2", "R3"] as const;

export type ReleaseClass = (typeof RELEASE_CLASSES)[number];

const FLAG_NAMES: Record<ReleaseClass, string> = {
  R0: "NABHOLD_RELEASE_R0",
  R1: "NABHOLD_RELEASE_R1",
  R2: "NABHOLD_RELEASE_R2",
  R3: "NABHOLD_RELEASE_R3",
};

export function releaseFlagName(releaseClass: ReleaseClass): string {
  return FLAG_NAMES[releaseClass];
}

export function isReleaseEnabled(releaseClass: ReleaseClass): boolean {
  const value = process.env[FLAG_NAMES[releaseClass]];

  if (releaseClass === "R0") {
    return value !== "false";
  }

  return value === "true";
}

export class ReleaseNotEnabledError extends Error {
  readonly releaseClass: ReleaseClass;

  constructor(releaseClass: ReleaseClass) {
    super(`Release class ${releaseClass} is not enabled.`);
    this.name = "ReleaseNotEnabledError";
    this.releaseClass = releaseClass;
  }
}

/** Throws unless the release class is enabled. Use in server code paths. */
export function assertReleaseEnabled(releaseClass: ReleaseClass): void {
  if (!isReleaseEnabled(releaseClass)) {
    throw new ReleaseNotEnabledError(releaseClass);
  }
}
