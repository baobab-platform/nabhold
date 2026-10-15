import "server-only";
import { z } from "zod";
import type { ConfidentialSession } from "../store/confidential-store";
import { AuthenticationDenied, type AuthSettings } from "./settings";
import { fetchJson } from "./transport";

/** Every protected session read rechecks IAM revocation then CP identity. No
 * JWT claim, email, cached grant or provider administrator role grants access.
 * authority:self is CP's read-only self endpoint, not executive authorisation.
 */
export async function requireCurrentIdentity(session: ConfidentialSession, settings: AuthSettings, fetcher: typeof fetch = fetch) {
  try {
    if (session.issuer !== settings.issuer || session.expiresAt <= Date.now() || session.createdAt > Date.now()) throw new Error();
    const basic = Buffer.from(`${encodeURIComponent(settings.clientId)}:${encodeURIComponent(settings.clientSecret)}`).toString("base64");
    const token = z.object({ active: z.literal(true), iss: z.literal(settings.issuer), sub: z.literal(session.subject),
      aud: z.union([z.string(), z.array(z.string())]).refine(v => (Array.isArray(v) ? v : [v]).includes("baobab-control-plane")),
      exp: z.number().int().positive().safe(), client_id: z.literal(settings.clientId),
      scope: z.string().refine(v => v.split(" ").includes("authority:self")),
    }).parse(await fetchJson(settings.introspectionEndpoint, { method: "POST", headers: { Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: session.accessToken }).toString() }, fetcher));
    if (token.exp * 1000 <= Date.now()) throw new Error();
    const cp = z.object({ principal_id: z.uuid(), evaluated_at: z.iso.datetime({ offset: true }),
      grants: z.array(z.unknown()).max(500) }).parse(await fetchJson(new URL("/v1/admin/effective-authority", settings.cpOrigin).href,
      { headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" } }, fetcher));
    const evaluated = Date.parse(cp.evaluated_at);
    if (evaluated > Date.now() + 30000 || evaluated < Date.now() - 30000) throw new Error();
    // CP resolves verified (iss,sub), refuses unknown/inactive principals, and
    // never provisions on this route. Its canonical UUID need not equal sub.
    // Return no grants: this diagnostic boundary authorises no business action.
    const expiresAt = Math.min(session.expiresAt, token.exp * 1000);
    if (expiresAt <= Date.now()) throw new Error();
    return { principalId: cp.principal_id, expiresAt };
  } catch { throw new AuthenticationDenied(); }
}
