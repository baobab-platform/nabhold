import type { CorporateContentGateway } from "@/lib/content/gateway";
import {
  createCapabilityClientFromEnv,
  unavailableTokenProvider,
  type WorkloadTokenProvider,
} from "@/lib/control-plane/capability-client";

import { getBaobabContentConfig } from "./config";
import { ContentEntryResolver } from "./entry-resolver";
import { CapabilityContentGateway } from "./gateway";

export { getBaobabContentConfig } from "./config";
export { ContentEntryResolver } from "./entry-resolver";
export { CapabilityContentGateway } from "./gateway";

/**
 * Returns the capability-backed gateway only when it is requested and fully
 * configured (flag, tenant, context, scope ids, service origin map and a
 * Control Plane URL). Otherwise `null`, and the caller keeps the Payload
 * gateway. Token providers default to "unavailable": until IAM issues the
 * estate's workload tokens, the capability path fails closed to estate
 * defaults instead of calling anything anonymously.
 */
export function createCapabilityContentGatewayFromEnv(
  transitional: CorporateContentGateway,
  providers: { resolve?: WorkloadTokenProvider; content?: WorkloadTokenProvider } = {},
): CorporateContentGateway | null {
  const config = getBaobabContentConfig();
  if (!config) return null;

  const capabilities = createCapabilityClientFromEnv(
    providers.resolve ?? unavailableTokenProvider,
  );
  if (!capabilities) return null;

  const resolver = new ContentEntryResolver({
    config,
    capabilities,
    contentTokens: providers.content ?? unavailableTokenProvider,
  });

  return new CapabilityContentGateway(resolver, transitional, (key, outcome) => {
    if (outcome !== "ok") {
      console.warn(JSON.stringify({ event: "content.capability", key, outcome }));
    }
  });
}
