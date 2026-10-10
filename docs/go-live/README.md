# Nabhold go-live programme

Programme control for [NAB-GOLIVE-MP-001](NAB-GOLIVE-MP-001-masterplan-v1.0.md) (v1.0, *Draft for ratification*, baseline 8 October 2026).

The masterplan is the programme reference. It does not replace Shared, Control Plane or engine ADRs, and it does not authorise merges or production changes.

| Document | Purpose |
|---|---|
| [register.md](register.md) | Gate status, blockers B-01 to B-18, decisions D-01 to D-18. Update with every PR that moves a gate. |
| [evidence/README.md](evidence/README.md) | Evidence index rules. Nothing is `IMPLEMENTED`, `CERTIFIED`, `ACTIVE` or `PASS` without a pointer here. |
| [capability-demand-census.md](capability-demand-census.md) | Per-journey capability demand with canonical / proposed / active status. |
| [erp-scope.md](erp-scope.md) | What `baobab-erp` must gain for finance, accounts, HR and payroll, in Nabhold's order, with phases and decisions. |
| [onboarding/](onboarding/nabhold-internal-onboarding-profile.json) | Machine-checkable G02 input profile for INTERNAL admission (`src/lib/estate/onboarding-profile.test.ts`), and the G06 finance-baseline input for ERP intake (`finance-baseline-input.test.ts`). |

The masterplan G00 names the canonical path `docs/go-live/NAB-GOLIVE-MP-001.md`. The merged file keeps its versioned name `NAB-GOLIVE-MP-001-masterplan-v1.0.md`; renaming it is a separate, reviewed change.

## What the code enforces today

| Control | Where | Behaviour |
|---|---|---|
| Release classes | `src/lib/release/release-class.ts` | R0 on by default; R1 to R3 off unless the flag is exactly `"true"`. `/dashboard` needs R1; the Pulse overview needs R3. Disabled routes return 404. |
| Capability resolution | `src/lib/control-plane/` | Typed client for the Shared `resolutionRequest`/`resolution` contract. Sends no tenant or legal-entity identity. Fails closed with no workload token provider (blocked on G04), on mismatched or expired resolutions, and on any non-`RESOLVED` decision. |
| Security headers | `src/lib/security/headers.ts` | Frame, sniffing, referrer, transport and cross-origin baseline everywhere; `/dashboard` is `noindex` and `no-store`. |
| Content-Security-Policy | `src/lib/security/csp.ts`, `src/proxy.ts` | Workspace: per-request nonce plus `strict-dynamic`, no inline scripts. Public pages: scripts allow `'unsafe-inline'` (prerendered, cached), everything else locked down; browser may connect only to this origin. `NABHOLD_CSP_MODE=report-only` for rollout. |
| Canonical host | `src/lib/security/canonical-host.ts`, `src/proxy.ts`, `src/app/layout.tsx` | With `NABHOLD_CANONICAL_HOST=nabhold.com`, `www.nabhold.com` gets a 308 to the apex. Redirect target comes from configuration, not the Host header. Pages carry canonical links; the Docker build defaults `NEXT_PUBLIC_SITE_URL` to `https://nabhold.com`. |
| Onboarding profile | `src/lib/estate/onboarding-profile.ts` | INTERNAL, zero charge, metering on, ZA only, canonical keys only. Reports G01/G02 blockers instead of defaulting. |

None of this establishes a production-active CapabilityBinding. Enabling a flag is not acceptance.

## Release status

| Release | Status |
|---|---|
| R0 Institutional | NOT RELEASED. Waiting on G01 legal content approval, G05 and G16. |
| R1 Corporate | NOT RELEASED. Disabled by default. |
| R2 Platform commercial | NOT RELEASED. Disabled by default. |
| R3 Group oversight | NOT RELEASED. Disabled by default. |
