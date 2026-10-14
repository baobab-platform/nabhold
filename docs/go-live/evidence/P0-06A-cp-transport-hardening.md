# P0-06A — credentialed CP resolution transport

This source increment prepares G05/G15 for R0 capability qualification. It does
not activate `nabhold-backend`, create credentials, accept a binding or complete
P0-06. P0-03/P0-04/P0-05 protected prerequisites remain outstanding.

## Problem and resulting behaviour

The estate's CP capability client previously followed Fetch redirects and used
an unbounded `response.json()`. A same-origin redirect could move its bearer
credential and resolution body to another route; a large or stalled response
could consume server resources before contract validation.

The client now validates deployment configuration before acquiring a token:
HTTPS origin only, without URL credentials, path, query or fragment. Explicit
`allowLocalHttp: true` is available to local harnesses for loopback only and is
refused under `NODE_ENV=production`. Environment construction retains the HTTPS
default; it does not infer a local exception from the hostname. TLS verification
bypass is refused before each credential acquisition.

The fixed canonical POST requests JSON with `redirect: error` and `cache:
no-store`. Only an unredirected HTTP 200 JSON response proceeds to the existing
closed Shared contract validator. Actual decoded stream bytes are limited to
256 KiB, independent of Content-Length/compression. The same 1–60000 ms deadline
(default 5000 ms) covers headers and body; stalled/oversized streams are
cancelled. Malformed UTF-8, JSON, media type or contract responses fail closed.
Transport and validation errors retain generic diagnostics without raw upstream
bodies, URL/token details or error causes. No retries or cached fallback were
added. Correlation, capability, context, expiry and version checks remain.

This is a conservative consumer transport ceiling, not a new Shared contract
limit or an authorisation decision. Operators must supply a reviewed HTTPS CP
origin; CP endpoint migration requires configuration review rather than a
redirect. Oversized legitimate single-resolution responses require a reviewed
consumer ceiling change; they cannot silently bypass this protection.

## Consulted authority before implementation

- Accepted Nabhold ADR-NAB-0004 (IAM-owned credentials and layered authority),
  ADR-NAB-0006 §§57/60/63 (contract validation, bounded calls and cancellation),
  ADR-NAB-0014 and accepted masterplan v2.0.
- CP `c42624c03464155334cc0eb7811d6ea2222a8ff1`: Accepted ADR-BCP-007
  §§25/91 and ADR-BCP-009 §39; workload-authorised capability route;
  `api/capability_resolve_handler.go` and `api/router.go#writeJSON` return HTTP
  200 with application/json for canonical decisions.
- CP's vendored Shared capability/v1 resolution schema, pinned to
  `92541c92321abde72dea7deb7d42e70d0b6acafb`. No schema/pin changes here.
- Installed Next 16.4 fetch documentation: native Fetch options are supported;
  `cache: no-store` prevents framework persistence of authority responses.
- [Fetch Standard](https://fetch.spec.whatwg.org/#http-redirect-fetch) redirect
  error semantics and [Node 22 AbortSignal documentation](https://nodejs.org/download/release/v22.18.0/docs/api/globals.html#static-method-abortsignaltimeoutdelay).

## Verification and acceptance boundaries

Regression coverage includes a real loopback HTTP redirect that must receive
only the initial request; unsafe origins and TLS bypass before token acquisition;
malformed bearer values including a final newline; invalid deadlines; streamed
oversize despite a false Content-Length; stalled-body cancellation; media,
UTF-8, JSON and status refusals; secret-free error causes; and existing CP
contract/matching/expiry/version decisions and content adapter behaviour.

Lint, typecheck, unit/integration tests and production build are required locally;
GitHub CI includes browser E2E, security and foundation checks before merge.
Protected staging and real IAM/CP/CMS acceptance were not executed. G05 remains
PARTIAL and R0/R1/R2/R3 remain NOT RELEASED. Rollback is a source revert; there
is no migration or external mutation.
