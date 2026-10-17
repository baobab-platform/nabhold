# Evidence index

[NAB-GOLIVE-MP-001 v2.0](../NAB-GOLIVE-MP-001.md) §31: evidence classes are not interchangeable. An ADR is not an implementation, a green CI run is not an active binding, and a simulated provider proves nothing about production.

Store pointers to immutable artefacts, not the artefacts themselves:

```text
docs/go-live/evidence/<gate>/<environment>/<yyyy-mm-dd>-<subject>.md
```

Each record states:

- the claim (`IMPLEMENTED`, `CERTIFIED`, `ACTIVE`, `PASS`, ...) and the exact scope
- the immutable reference: commit SHA, CI run ID, image digest, EngineRelease or signed review ID
- the evidence class from the table below
- the reviewer role and date
- whether any part used a simulated or sandbox provider

Redact PII, tokens and payroll data. Do not copy confidential records into GitHub.

| Class | Sufficient for |
|---|---|
| ADR only | Design authority |
| Shared contract | Canonical semantics |
| Source and unit tests | Implementation confidence |
| Live dependency integration | Provider interoperability |
| Independent certification (EA-09) | Eligibility, not Nabhold entitlement |
| CP activation record | Runtime availability in a context |
| Nabhold end-to-end test | Feature readiness in an approved environment |
| Domain acceptance | Business acceptance |
| Production observation | Production launch acceptance |

## Records

None accepted yet. No gate has accepted evidence.

Recorded and awaiting reviewer sign-off (not accepted):

| Gate | Record | Status |
|---|---|---|
| G01 | [`G01/production/2026-01-16-cipc-registration.md`](G01/production/2026-01-16-cipc-registration.md): CIPC registration certificate facts for Nabhold Group Africa | Sign-off PENDING |
| G03/G06 | [`finance-f1-source-2026-10-16.md`](finance-f1-source-2026-10-16.md): merged DRAFT Finance source and unit tests | Source only; steward/gate sign-off PENDING |
| G04 | [`int02-prerequisite-source-2026-10-16.md`](int02-prerequisite-source-2026-10-16.md): merged CP/IAM/Shared source repairs | Source only; full INT-02 and gate sign-off PENDING |
| EA-R03 / Trade-A (source) | [`trade-a-ta05-source-2026-10-17.md`](trade-a-ta05-source-2026-10-17.md): merged central order-authority kernel and receipt hardening | Source/engine-local only; independent programme/gate sign-off PENDING; Nabhold P0-04/P0-04B unchanged |
| INT-03 preparation (source) | [`../../testing/codespaces-integration.md`](../../testing/codespaces-integration.md): consumer harness, private configuration and handoff requirements | Source only; real integrated execution BLOCKED; gate sign-off PENDING |
