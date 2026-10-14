# P0-03 — South African registered-business verification path

**Implementation:** preparation implemented; authenticated execution deferred by sponsor instruction, 14 October 2026.  
**Accepted task exit remains:** accepted real case, not fixture (masterplan §21).  
**Authority:** ADR-NAB-0014; CP ADR-BCP-023, ADR-BCP-026 and ADR-BCP-027; Shared evidence/v1.  
**Runtime owners:** CP owns verification and Organisation identity; IAM owns Principals; approved infrastructure owns binary custody.

Nabhold Group Africa and Thamani Global are legally registered South African
companies. This packet uses their actual documentary registration facts to
implement the path now. No IAM setup is required for offline preparation.
The sponsor has deferred authenticated execution and protected staging; these
remain explicit follow-up steps, not reasons to stop source implementation.

## 1. Documentary baseline

| Business | Full declared registered name | Registration number | Effective date | Certificate issued | Evidence reference |
|---|---|---|---|---|---|
| Nabhold | NABHOLD GROUP AFRICA (Pty) Ltd | 2026/029839/07 | 2026-01-16 | 2026-01-16 | [Nabhold certificate note](../evidence/G01/production/2026-01-16-cipc-registration.md) |
| Thamani | THAMANI GLOBAL (Pty) Ltd | 2026/291672/07 | 2026-04-09 | 2026-04-13 | [Thamani certificate note](https://github.com/baobab-platform/thamani/blob/main/docs/legal/evidence/2026-04-09-cipc-registration.md) |

These records are real metadata, not synthetic companies. The source PDFs remain
outside Git; their personal addresses, director identifiers and tax numbers are
not required in this packet. No ownership, tax, current status, current director,
legal-actor mandate or cross-tenant access is inferred from registration.

Thamani's certificate prints `THAMANI GLOBAL`; the sponsor confirmed the full
name including `(Pty) Ltd`. Both values are preserved. Independent official-source
review must resolve any difference; the compiler never silently removes a legal
suffix to obtain a match. Nabhold and Thamani retain separate cases/subjects.
Thamani verification is useful programme work, not a universal prerequisite for
Nabhold's own admission (masterplan G01B).

## 2. Preparation implemented now

Run from the Nabhold checkout:

```bash
pnpm verification:prepare
```

The offline tool validates the closed metadata packet and reports preparation
readiness separately from submission, independent verification and production
permission. It makes no network call, reads no credential, writes no file and
cannot set an accepted status. The packet is intentionally free of Organisation,
Tenant, case, claim, evidence and Principal IDs until issued by the owning authority.

Later, an operator can compile draft reviewer requests for an actual CP-issued
Organisation UUID:

```bash
pnpm verification:prepare --business NABHOLD --organisation-id "$CP_ISSUED_NABHOLD_ORGANISATION_ID"
pnpm verification:prepare --business THAMANI-GLOBAL --organisation-id "$CP_ISSUED_THAMANI_ORGANISATION_ID"
```

These commands remain offline. UUID syntax alone is not proof of CP issuance:
the authenticated operator must independently confirm each business/UUID pairing
in CP before using any output. The deterministic case idempotency key is a replay
key, not an evidence hash or a verification case identifier. Case creation supports
`Idempotency-Key`; claim creation does not advertise that header, so never replay
claim POSTs blindly after an uncertain response. Reconcile CP's claim list first.

## 3. Deferred authenticated execution

| Step | Owner / authority | Action and exit |
|---|---|---|
| 1. Resolve business identity | CP / registered independent operator | Obtain the actual PRIMARY Organisation UUID for each business; do not mint UUIDs in this estate or derive them from company names. No Tenant is needed to open an Organisation verification case. |
| 2. Create case | CP; `verification:write` | POST `/v1/admin/verification-cases` with `case_request`, correlation UUID and `Idempotency-Key`; preserve CP's actual case ID/version/Location. |
| 3. Add registration/name claims | CP; `verification:write` | POST `/v1/admin/verification-cases/{case_id}/claims` with each `claim_requests` item. The reviewer who asserted a claim cannot verify or decide it. Record real returned claim IDs. |
| 4. Collect/custody source | CP source workers / infrastructure | Register purpose-bound evidence through existing governance. Sponsor PDF/markdown is documentary input, not an authoritative API observation. Uploads remain quarantined until independent scan; approved official-source capture requires certified configuration and authorised access. |
| 5. Verify registration first | Independent CP reviewer | Current official registration check must match the exact case, Organisation, ZA jurisdiction and registration number; record independent evidence/check/result. A current VERIFIED registration result is required by the CP adapter before checking legal name. |
| 6. Verify name | Independent CP reviewer | Use that same-case verified registration binding; compare official legal name without guessing through the certificate/full-name difference. A discrepancy must be reviewed explicitly, never overwritten. |
| 7. Current policy and other claims | CP / applicable domain | Obtain current status or legal-existence proof only through supported claim-specific semantics; add representative authority, ownership, tax or other claims only when the operation's policy requires them. The packet does not fabricate these from an old certificate. |
| 8. Independent conclusion | CP; `verification:decide` | Record real reviewer/decider Principals, required independent dimensions, source/custody provenance, effective dates and policy-controlled expiry. Conclude the case through `/v1/admin/verification-cases/{case_id}/conclusion` with optimistic version control. |
| 9. Evidence and handoff | CP / programme | Record immutable real case/result/acceptance pointers. Close P0-03 only for the scope actually accepted; proceed to P0-04 identity and P0-05 controlled onboarding. No Tenant/capability/production activation follows automatically. |

A Company Secretary appointment is not required merely to review registration.
It is required only if a claimed office-holder role is used as authority. Names in
certificate notes do not provision Principals. The existing maker/checker and
self-verification restrictions apply even to founders/directors.

### Dependencies to provision later

- actual CP Organisation identities and independently authorised human Principals;
- reviewer/decider scopes and separation of duties;
- protected non-production CP/IAM endpoint and token issuance;
- approved official-source access, source configuration/certification and encrypted custody;
- current independent observation, legal-name discrepancy handling, case conclusion
  and protected acceptance evidence.

The certificate dates are historic facts. They are not stamped with a new current
observation date; the estate invents no expiry period or freshness policy. CP
must reject stale/mismatched/revoked/forged evidence under its accepted policy.

## 4. Validation and boundaries

- Closed schemas reject added verification flags, credentials, authority fields,
  fabricated current status, swapped company numbers/references and duplicates.
- Draft case/claim requests conform to the bounded subset of Shared's existing
  `VerificationCaseCreateRequest` and `EvidenceClaimSubmission` used here.
- Negative tests cover business/subject isolation, malformed UUIDs, outcome
  injection, stable replay keys and CLI refusal of credential/execution flags.
- No changes to Shared source trust, CP results, admission policy, provider
  support, IAM registries or staging configuration are made by this increment.

Consulted snapshots: Shared `8733be2b57004785801a3ce88f54bf3d2693df6c`
(evidence schemas/source registry/legal-entity registry); CP
`989a61fa858c9173b0756cf99a6d92ae86c85f7c` (accepted ADRs,
CIPC registration-binding adapter and PEO-03 source/custody programmes); Thamani
certificate-note blob `f62da076e3528eb77845b5de9be349d1932eb1ed`.

**P0-03 source preparation is implemented. The accepted-real-case exit and G01B
remain pending authenticated execution; no acceptance record is fabricated.**
