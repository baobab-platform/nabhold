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

Frozen INT-02 real-component/synthetic Actions **source qualification is accepted**
for the exact pins and evidence in Shared’s
[immutable qualification record](https://github.com/baobab-platform/shared/blob/bd21d229f54521da30ad7c79f8967797ad4fb401/docs/architecture/int02-pulse-qualification-register.md).
Infrastructure #35 merged; run `39108198886` completed successfully with
mandatory assertions and teardown. The [19 October reconciliation](progress-audit-2026-10-19.md)
records its scope and the later source/PR deltas. That acceptance does not
promote later IAM/CP pins, protected native C4-03/C4-04B/C, full Nabhold
INT-03, a Nabhold provider binding, real legal verification, staging, G17 or
production. No Nabhold release gate has accepted protected release evidence.

Recorded and awaiting reviewer sign-off (not accepted):

| Gate | Record | Status |
|---|---|---|
| G01 | [`G01/production/2026-01-16-cipc-registration.md`](G01/production/2026-01-16-cipc-registration.md): CIPC registration certificate facts for Nabhold Group Africa | Sign-off PENDING |
| G03/G06 | [`finance-f1-source-2026-10-16.md`](finance-f1-source-2026-10-16.md): merged DRAFT Finance source and unit tests | Source only; steward/gate sign-off PENDING |
| G04 | [`int02-prerequisite-source-2026-10-16.md`](int02-prerequisite-source-2026-10-16.md): merged CP/IAM/Shared source repairs | Historical source checkpoint; frozen INT-02 synthetic Actions qualification subsequently accepted as above; protected G04 sign-off PENDING |
| EA-R03 / Trade-A (source) | [`trade-a-ta05-source-2026-10-17.md`](trade-a-ta05-source-2026-10-17.md): merged central order-authority kernel and receipt hardening | Source/engine-local only; independent programme/gate sign-off PENDING; Nabhold P0-04/P0-04B unchanged |
| INT-03 preparation (source) | [`../../testing/codespaces-integration.md`](../../testing/codespaces-integration.md): consumer harness, private configuration and handoff requirements | Source only; real integrated execution BLOCKED; gate sign-off PENDING |
| G17 identity smoke (source) | [Register §22](../register.md#22-g17--int-03-identity-smoke-evidence-preparation--18-october-2026): fixed scenario receipts, exact local source and unattested dependency pins | Source and synthetic reporter tests only; real execution/retention/attestation and independent sign-off PENDING |

| Current implementation audit | [`progress-audit-2026-10-19.md`](progress-audit-2026-10-19.md) | Repository/CI reconciliation, not a new signed release/cryptographic attestation; C4 and INT-03 protected exits remain open |
