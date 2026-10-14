import { z } from "zod";

/**
 * A workflow's `environment: staging` label alone creates no reviewer policy.
 * Inspect the current GitHub-owned environment response before injecting any
 * service credential into an execution step. Requiring independent review and
 * refusing admin bypass protects the acceptance evidence ceremony; it still
 * grants no IAM, CP, domain or production authority.
 */
export function assertProtectedStagingEnvironment(input: unknown): void {
  const schema = z.object({ name: z.literal("staging"), can_admins_bypass: z.literal(false),
    protection_rules: z.array(z.object({ type: z.string(), prevent_self_review: z.boolean().optional(),
      reviewers: z.array(z.unknown()).optional() })),
    deployment_branch_policy: z.object({ protected_branches: z.boolean(), custom_branch_policies: z.boolean() }),
  });
  const environment = schema.parse(input);
  const reviewers = environment.protection_rules.find((p) => p.type === "required_reviewers");
  if (!reviewers?.prevent_self_review || !reviewers.reviewers?.length ||
      (!environment.deployment_branch_policy.protected_branches && !environment.deployment_branch_policy.custom_branch_policies)) {
    throw new Error("Protected staging policy required");
  }
}
