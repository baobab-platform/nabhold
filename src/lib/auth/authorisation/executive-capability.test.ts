// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { requireExecutiveCapability } from "./executive-capability";
import { AuthenticationDenied, type AuthSettings } from "../oidc/settings";
import type { ConfidentialSession } from "../store/confidential-store";
import type { CapabilityClient } from "../../control-plane/capability-client";

const principal = "019a0915-a8c0-7000-8000-000000000001";
const org = "019a0915-a8c0-7000-8000-000000000002";
const tenant = "019a0915-a8c0-7000-8000-000000000003";
const settings: AuthSettings = { origin: "https://estate.example.test", issuer: "https://iam.example.test/",
 cpOrigin: "https://cp.example.test", introspectionEndpoint: "https://iam.example.test/introspect",
 clientId: "synthetic-client", clientSecret: "synthetic-only-long-secret", algorithm: "RS256",
 redirectUri: "https://estate.example.test/api/auth/callback" };
const session = { issuer: settings.issuer, subject: "human-subject", accessToken: "token",
 createdAt: Date.now()-1000, expiresAt: Date.now()+300000 } as ConfidentialSession;
const request = { expectedOrganisationId: org, expectedTenantId: tenant,
 capabilityKey: "content.entry.resolve", contractVersion: 1 };
function setup() {
 const expires = new Date(Date.now()+60000).toISOString();
 const context = vi.fn(async () => ({ principal_id: principal, organisation_id: org, tenant_id: tenant,
   context_id: "current-context", evaluated_at: new Date().toISOString(), expires_at: expires, authorised: true }));
 const resolve = vi.fn(async () => ({
   context_id: "current-context", capability_key: request.capabilityKey, decision: "RESOLVED" as const,
   grant_id: "grant", binding_id: "binding", invocation: { contract_version: 1, service_reference: "https://cms.example.test",
    protocol: "http" as const, provider_id: "cms", engine_instance_id: "instance" },
   expires_at: expires }));
 let inactive = false;
 const fetcher = vi.fn<typeof fetch>(async (input) => {
   if (String(input) === settings.introspectionEndpoint) return Response.json({
     active: !inactive, iss: settings.issuer, sub: session.subject, aud: "baobab-control-plane",
     exp: Math.floor(Date.now()/1000)+120, client_id: settings.clientId, scope: "openid authority:self" });
   if (String(input) === settings.cpOrigin + "/v1/admin/effective-authority") return Response.json({
     principal_id: principal, evaluated_at: new Date().toISOString(), grants: [] });
   throw new Error("Unexpected network request");
 });
 const deps = { settings, context: { resolveCurrent: context },
   capabilities: { resolve } as unknown as Pick<CapabilityClient,"resolve">, fetcher };
 return { deps, context, resolve, revoke: () => { inactive=true; } };
}
describe("G04B-04 current executive capability boundary", () => {
 it("requires current identity, matching context and resolved capability", async () => {
   const f=setup();
   const result=await requireExecutiveCapability(session,request,f.deps);
   expect(result.principalId).toBe(principal);
   expect(result.contextId).toBe("current-context");
   expect(f.context).toHaveBeenCalledWith({ principalId: principal, expectedOrganisationId: org, expectedTenantId: tenant });
   expect(f.resolve).toHaveBeenCalledWith(expect.objectContaining({
     context_id:"current-context", capability_key:request.capabilityKey, required_contract_version:1 }));
 });
 it("denies revocation before consulting context", async () => {
   const f=setup(); f.revoke();
   await expect(requireExecutiveCapability(session,request,f.deps)).rejects.toBeInstanceOf(AuthenticationDenied);
   expect(f.context).not.toHaveBeenCalled();
 });
 it("denies wrong tenant and never resolves capability", async () => {
   const f=setup(); f.context.mockImplementationOnce(async () => ({ principal_id:principal, organisation_id:org,
     tenant_id:"019a0915-a8c0-7000-8000-000000000004", context_id:"current-context",
     evaluated_at:new Date().toISOString(), expires_at:new Date(Date.now()+60000).toISOString(), authorised:true }));
   await expect(requireExecutiveCapability(session,request,f.deps)).rejects.toBeInstanceOf(AuthenticationDenied);
   expect(f.resolve).not.toHaveBeenCalled();
 });
 it("denies missing binding even when response says RESOLVED", async () => {
   const f=setup(); f.resolve.mockImplementationOnce(async () => ({
     context_id:"current-context", capability_key:request.capabilityKey, decision:"RESOLVED" as const,
     grant_id:"grant", binding_id:"", invocation:{ contract_version:1, service_reference:"https://cms.example.test",
       protocol:"http" as const, provider_id:"cms", engine_instance_id:"instance" }, expires_at:new Date(Date.now()+60000).toISOString() }));
   await expect(requireExecutiveCapability(session,request,f.deps)).rejects.toBeInstanceOf(AuthenticationDenied);
 });
 it("denies wrong Organisation, expired context and missing authority", async () => {
   const f=setup();
   await expect(requireExecutiveCapability(session,{...request,expectedOrganisationId:"bad"},f.deps)).rejects.toBeInstanceOf(AuthenticationDenied);
   f.context.mockImplementationOnce(async () => ({ principal_id:principal, organisation_id:org, tenant_id:tenant,
      context_id:"current-context", evaluated_at:new Date().toISOString(), expires_at:new Date(Date.now()-1000).toISOString(),authorised:true }));
   await expect(requireExecutiveCapability(session,request,f.deps)).rejects.toBeInstanceOf(AuthenticationDenied);
   const noContext={...f.deps,context:{resolveCurrent:async()=>null}};
   await expect(requireExecutiveCapability(session,request,noContext)).rejects.toBeInstanceOf(AuthenticationDenied);
 });
 it("denies when capability resolution outlives its context lease", async () => {
   const f=setup();
   let clock = Date.now();
   const first = clock;
   f.context.mockImplementationOnce(async () => ({ principal_id: principal, organisation_id: org,
     tenant_id: tenant, context_id: "current-context",
     evaluated_at: new Date(first).toISOString(), expires_at: new Date(first+60000).toISOString(), authorised: true }));
   f.resolve.mockImplementationOnce(async () => {
     clock = first + 61000;
     return { context_id:"current-context", capability_key:request.capabilityKey, decision:"RESOLVED" as const,
       grant_id:"grant",binding_id:"binding",invocation:{contract_version:1,service_reference:"https://cms.example.test",
       protocol:"http" as const,provider_id:"cms",engine_instance_id:"instance"},expires_at:new Date(first+120000).toISOString() };
   });
   await expect(requireExecutiveCapability(session,request,{...f.deps, now:()=>clock})).rejects.toBeInstanceOf(AuthenticationDenied);
 });
});
