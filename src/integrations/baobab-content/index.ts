import type { CorporateContentGateway } from "@/lib/content/gateway";
import {
  createCapabilityClientFromEnv,
  unavailableTokenProvider,
  type WorkloadTokenProvider,
} from "@/lib/control-plane/capability-client";

import { getBaobabContentConfig } from "./config";
import { ContentEntryResolver } from "./entry-resolver";
import { CapabilityContentGateway } from "./gateway";
import { DevelopmentContentWorkload, readDevelopmentWorkloadSettings } from "@/lib/auth/workload";

export { getBaobabContentConfig } from "./config";
export { ContentEntryResolver } from "./entry-resolver";
export { CapabilityContentGateway } from "./gateway";

/**
 * Returns the capability-backed gateway only when it is requested and fully
 * configured (flag, tenant, context, scope ids, service origin map and a
 * Control Plane URL). Otherwise `null`, and the caller keeps the Payload
 * gateway. Token providers default to "unavailable": until IAM issues the
 * estate's workload tokens, the capability path fails closed to estate
 * defaults instead of calling anything anonymously. The explicit development
 * proof uses IAM-issued workload tokens and fresh same-owner CP contexts,
 * requires published content, and never activates the product client.
 */
export function createCapabilityContentGatewayFromEnv(
  transitional: CorporateContentGateway,
  providers: { resolve?: WorkloadTokenProvider; content?: WorkloadTokenProvider } = {},
): CorporateContentGateway | null {
  const required = process.env.NABHOLD_CONTENT_FALLBACK === "disabled" || process.env.NABHOLD_CMS_PROOF_ENABLED === "true";
  const config = getBaobabContentConfig();
  if (!config) {
    if (required) throw new Error("Required capability content is not configured");
    return null;
  }
  const settings = readDevelopmentWorkloadSettings();
  if (settings && Object.values(config.serviceOrigins).some(origin => new URL(origin).protocol !== "https:")) {
    throw new Error("Proof requires verified HTTPS provider origins");
  }
  const workload = settings ? new DevelopmentContentWorkload(settings) : null;
  if (workload && (providers.resolve || providers.content)) throw new Error("Proof uses only the named workload");

  const capabilities = createCapabilityClientFromEnv(
    workload?.tokens("baobab-control-plane") ?? providers.resolve ?? unavailableTokenProvider,
  );
  if (!capabilities) {
    if (required) throw new Error("Required capability resolver is not configured");
    return null;
  }

  const resolver = new ContentEntryResolver({
    config,
    capabilities,
    contentTokens: workload?.tokens("baobab-cms") ?? providers.content ?? unavailableTokenProvider,
    currentContextId: workload ? () => workload.currentContextId() : undefined,
    requireExactScope: required,
    proofDeadline: settings?.deadline,
  });

  return new CapabilityContentGateway(resolver, transitional, (key, outcome) => {
    if (outcome !== "ok") {
      console.warn(JSON.stringify({ event: "content.capability", key, outcome }));
    }
  }, required);
}
