# Evidence index

Masterplan §10.3: evidence classes are not interchangeable. An ADR is not an implementation, a green CI run is not an active binding, and a simulated provider proves nothing about production.

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
