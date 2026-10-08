import { z } from "zod";

/**
 * Types for the Control Plane capability-resolution contract, mirrored from
 * baobab-platform/shared contracts/capability/v1/resolution.schema.json.
 * Shared is the contract authority; update this file only after a Shared
 * contract change, never to work around one (masterplan §4, master rule).
 */
export const CAPABILITY_KEY_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export const capabilityKeySchema = z
  .string()
  .min(5)
  .max(128)
  .regex(CAPABILITY_KEY_PATTERN);

const uuidSchema = z.string().uuid();

export const resolutionDecisionSchema = z.enum([
  "RESOLVED",
  "DENIED",
  "UNAVAILABLE",
  "AMBIGUOUS",
  "INCOMPATIBLE",
]);

export type ResolutionDecision = z.infer<typeof resolutionDecisionSchema>;

/**
 * Deliberately has no tenant, legal-entity or principal field: callers never
 * supply raw identity to capability resolution. Context is resolved first and
 * referenced by `context_id`.
 */
export const resolutionRequestSchema = z
  .object({
    capability_key: capabilityKeySchema,
    required_contract_version: z.number().int().min(1).optional(),
    context_id: z.string().min(1),
    operation_scope: z
      .object({
        origin_country: z.string().regex(/^[A-Z]{2}$/).optional(),
        destination_country: z.string().regex(/^[A-Z]{2}$/).optional(),
        transit_countries: z.array(z.string().regex(/^[A-Z]{2}$/)).optional(),
        currency: z.string().regex(/^[A-Z]{3}$/).optional(),
        jurisdiction: z.string().max(63).optional(),
        transaction_type: z
          .enum([
            "GOODS",
            "SERVICE",
            "LOGISTICS",
            "COMMODITY_TRADE",
            "DIGITAL_SERVICE",
          ])
          .optional(),
      })
      .strict()
      .optional(),
    correlation_id: uuidSchema,
  })
  .strict();

export type ResolutionRequest = z.infer<typeof resolutionRequestSchema>;

export const invocationDescriptorSchema = z
  .object({
    service_reference: z.string().url(),
    route_reference: z.string().max(255).optional(),
    protocol: z.enum(["http", "grpc"]),
    contract_version: z.number().int().min(1),
    provider_id: z.string().min(1),
    engine_instance_id: z.string().min(1),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type InvocationDescriptor = z.infer<typeof invocationDescriptorSchema>;

export const resolutionSchema = z
  .object({
    resolution_id: z.string().min(1),
    context_id: z.string().min(1),
    capability_key: capabilityKeySchema,
    contract_version: z.number().int().min(1).optional(),
    decision: resolutionDecisionSchema,
    reason_code: z.string().optional(),
    grant_id: z.string().optional(),
    binding_id: z.string().optional(),
    invocation: invocationDescriptorSchema.optional(),
    resolved_at: z.string().datetime(),
    expires_at: z.string().datetime().optional(),
    correlation_id: uuidSchema,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.decision === "RESOLVED") {
      for (const field of ["grant_id", "binding_id", "invocation"] as const) {
        if (!value[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `${field} is required when decision is RESOLVED`,
          });
        }
      }
    } else if (!value.reason_code) {
      ctx.addIssue({
        code: "custom",
        path: ["reason_code"],
        message: "reason_code is required when decision is not RESOLVED",
      });
    }
  });

export type Resolution = z.infer<typeof resolutionSchema>;

/** A RESOLVED resolution, narrowed so callers cannot skip the decision check. */
export type ResolvedCapability = Resolution & {
  decision: "RESOLVED";
  invocation: InvocationDescriptor;
};
