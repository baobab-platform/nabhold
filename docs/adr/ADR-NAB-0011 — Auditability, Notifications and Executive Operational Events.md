# ADR-NAB-0011 — Auditability, Notifications and Executive Operational Events

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Identity/Security Audit Authority:** `baobab-platform/baobab-iam`  
**Platform Audit, Resolution and Readiness Authority:** `baobab-platform/baobab-cp`  
**Business Audit Authorities:** Applicable Baobab domain providers  
**Intelligence Authority:** `baobab-platform/baobab-pulse`  
**Contract Authority:** `baobab-platform/shared`  
**Notification Authority:** Governed notification capability/provider resolved through Baobab  
**Architecture Style:** Event-driven, source-authoritative, correlation-first, append-oriented, observable, idempotent, capability-centric, context-aware, auditable, partially degradable  
**Decision Type:** Executive operational events, notification, auditability and cross-domain observability architecture  

**Depends On:**

- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture
- ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority
- ADR-NAB-0008 — Executive Intelligence and Decision-Support Boundary
- ADR-NAB-0009 — Corporate Governance, Capital Allocation, Risk and Approval Authority
- ADR-NAB-0010 — Protected Corporate Documents, Classification and Information Access
- ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- Baobab IAM ADR-0017 — IAM Audit, Security Events and Observability
- ADR-ERP-006 — ERP Canonical Event Architecture
- ADR-ERP-011 — ERP Observability, Audit, Reconciliation and Operational Control Architecture
- CMS ADR-0018 — Payload Canonical Events, Webhooks, Transactional Outbox and Integration Reliability
- Applicable Pulse evidence, intelligence, outcome and feedback ADRs
- ADR-SHARED-007 — Canonical Capability Contracts, Composition Registry and Cross-Engine Provider Model
- Applicable Shared event-envelope, reason-code, context, classification and correlation contracts

**Supersedes:**

Any interpretation that allows:

```text
application log
=
audit record
```

or:

```text
canonical event
=
audit record
```

or:

```text
notification
=
authoritative business state
```

or:

```text
notification delivered
=
recipient read it
```

or:

```text
notification opened
=
recipient approved it
```

or:

```text
alert
=
business decision
```

or:

```text
email sent
=
workflow completed
```

or:

```text
frontend activity feed
=
enterprise event store
```

or:

```text
event replay
=
repeat business action
```

without explicit domain authority and idempotent processing semantics.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL provide executive situational awareness through **authoritative domain events, correlated audit evidence, governed alerts and derived notifications**.

The canonical operational flow SHALL be:

```text
Authoritative Domain
        │
        ├── Business State Change
        │
        ├── Domain Audit
        │
        └── Canonical Event
                 │
                 ▼
             Event Fabric
                 │
        ┌────────┼────────────┐
        ▼        ▼            ▼
    Projections  Pulse      Notifications
        │        │            │
        ▼        ▼            ▼
    Executive   Risks /      Delivery
      Views     Signals       Channels
        │        │            │
        └────────┼────────────┘
                 ▼
          NABHOLD EXECUTIVE
                 │
                 ▼
        Authorised Interaction
                 │
                 ▼
        Authoritative Capability
```

The governing rule is:

> **Authoritative domains record what happened. Canonical events communicate what happened. Audit proves who did what and under which authority. Alerts identify conditions requiring attention. Notifications deliver that attention. Nabhold composes the executive experience without becoming the source of those facts.**

---

# 2. Six Distinct Operational Artefacts

The architecture SHALL distinguish:

```text
AUDIT
EVENT
LOG
METRIC
TRACE
NOTIFICATION
```

and SHALL additionally distinguish:

```text
ALERT
```

as a condition requiring attention.

These concerns are related.

They are not interchangeable.

---

# 3. Audit

Audit answers:

> Who did what, when, to which governed resource, under which authority, and with what result?

Audit SHALL be durable enough for:

```text
governance
security investigation
business accountability
regulatory evidence
support investigation
```

according to the owning domain.

---

# 4. Canonical Event

A canonical event answers:

> Which meaningful state change did an authoritative domain publish for other systems to consume?

A canonical event is an integration contract.

It is not automatically an audit record.

---

# 5. Operational Log

A log answers:

> What occurred inside this component while it executed?

Logs are diagnostics.

They SHALL NOT become the primary business or governance audit mechanism.

---

# 6. Metric

A metric answers questions such as:

```text
how many?
how often?
how fast?
how healthy?
```

Metrics are aggregate operational telemetry.

They SHALL not substitute for transaction-level audit.

---

# 7. Trace

A trace answers:

> Through which distributed execution path did this request travel?

A trace connects components.

It SHALL not replace durable business audit.

---

# 8. Alert

An Alert answers:

> Which observed condition now requires human or automated attention?

An Alert may derive from:

```text
platform condition
business condition
security condition
risk
intelligence
threshold
```

It SHALL retain its source semantics.

---

# 9. Notification

A Notification answers:

> Which information should be delivered to which recipient through which channel?

A Notification is a delivery concern.

It is not the authoritative source event.

---

# 10. Fundamental Separation

The following SHALL remain binding:

```text
Audit
    !=
Event

Event
    !=
Notification

Notification
    !=
Alert

Alert
    !=
Decision

Log
    !=
Audit

Trace
    !=
Audit

Metric
    !=
Business Fact
```

---

# 11. Source Authority

Every canonical event SHALL originate from the authority that owns the state being reported.

Examples:

```text
IAM
→ identity/session/security lifecycle

Control Plane
→ context/grant/binding/readiness lifecycle

ERP
→ accounting/financial/ERP lifecycle

Trade
→ commerce lifecycle

CMS
→ editorial/content lifecycle

Pulse
→ intelligence lifecycle

Governance
→ proposal/decision/authority lifecycle

Document Domain
→ protected-document lifecycle
```

---

# 12. No False Event Authority

The Nabhold Digital Estate SHALL NOT publish:

```text
finance.invoice.posted
```

as though it owned ERP posting merely because it observed the result.

---

# 13. Estate-Owned Events

Nabhold MAY publish events for state it genuinely owns.

Examples MAY include estate-specific concerns such as:

```text
executive-view preference changed
notification preference changed
estate interaction state
```

where these are true Nabhold-owned concepts.

It SHALL not republish downstream business state as a competing authority.

---

# 14. Event Envelope

Canonical events SHALL use the Shared event-envelope conventions.

Conceptually:

```text
CanonicalEvent
├── event_id
├── event_type
├── schema_version
├── occurred_at
├── recorded_at?
├── producer
├── subject
├── tenant_id?
├── legal_entity_id?
├── digital_estate_id?
├── market_id?
├── correlation_id
├── causation_id?
├── trace_id?
├── classification
├── payload
└── metadata
```

Exact contracts SHALL remain owned by Shared.

---

# 15. Event Identity

Every canonical event SHALL have a stable unique event identifier.

Consumers SHALL use it for appropriate deduplication and traceability.

---

# 16. Event Type

Event type SHALL represent business/platform meaning.

Preferred conceptual form:

```text
<domain>.<resource>.<past-tense-state-change>.vN
```

Exact convention SHALL remain governed by Shared.

---

# 17. Event Versioning

Canonical events SHALL be explicitly versioned.

A breaking semantic change SHALL require a new compatible contract/version rather than silently changing existing payload meaning.

---

# 18. Event Is a Statement of Past State Change

Events SHOULD normally describe something that happened.

For example:

```text
governance.decision.approved
```

is materially different from:

```text
governance.decision.approve
```

The first describes an event.

The second resembles a command.

---

# 19. Command Is Not Event

This SHALL remain:

```text
Command
    !=
Event
```

A command requests change.

An event reports change that has occurred.

---

# 20. Transactional Outbox

Where a domain performs a database transaction and emits a corresponding canonical event, production implementations SHOULD use a transactional outbox or equivalent reliability pattern.

Conceptually:

```text
Business Transaction
       │
       ├── State Change
       └── Outbox Record
              │
         COMMIT TOGETHER
              │
              ▼
        Event Publisher
              │
              ▼
          Event Fabric
```

---

# 21. No Dual-Write Assumption

This unsafe pattern SHALL be avoided:

```text
commit database
      │
      ▼
publish event
```

with no recovery mechanism.

A crash between the two operations could cause authoritative state and event propagation to diverge.

---

# 22. Inbox / Consumer Deduplication

Consumers SHOULD support idempotent event handling.

Conceptually:

```text
Receive Event
     │
     ▼
Already Processed event_id?
     │
   ┌─┴─┐
  YES  NO
   │    │
   ▼    ▼
 Ignore Process
        │
        ▼
 Record Receipt
```

where the processing architecture requires it.

---

# 23. Delivery Semantics

Baobab SHALL NOT assume that distributed event delivery is:

```text
exactly once
```

merely because duplicates are inconvenient.

Consumers SHALL be designed for realistic delivery semantics such as:

```text
at least once
+
idempotent processing
```

where applicable.

---

# 24. Duplicate Event Is Not Duplicate Business State

A duplicate delivery SHALL not automatically create:

```text
second payment
second approval
second notification decision
second purchase order
```

where one authoritative event was originally produced.

---

# 25. Event Replay

Replaying historical events SHALL not be interpreted as permission to repeat the original business action.

The event describes history.

---

# 26. Projection Rebuild

Event replay MAY rebuild:

```text
read models
search projections
analytics projections
notification indexes
```

where those projections are designed for replay.

---

# 27. Side-Effect Safety on Replay

Consumers performing external side effects SHALL distinguish:

```text
initial live processing
```

from:

```text
historical replay
```

where necessary.

---

# 28. Event Ordering

The platform SHALL not assume one global total ordering of all Baobab events.

Relevant ordering SHALL be defined at the appropriate:

```text
aggregate
entity
workflow
partition
```

scope.

---

# 29. Sequence

Where order is material, a domain MAY provide:

```text
aggregate version
sequence number
event version
```

or equivalent semantics.

---

# 30. Out-of-Order Delivery

Consumers SHALL account for possible out-of-order asynchronous delivery where the transport does not guarantee the required ordering.

---

# 31. Event Time

The architecture SHALL distinguish:

```text
occurred_at
published_at
received_at
processed_at
```

where applicable.

---

# 32. Late Event

A late event SHALL not automatically be interpreted as a newly occurring business fact.

The original occurrence time remains material.

---

# 33. Correlation Model

Cross-system activity SHALL use consistent correlation metadata.

At minimum, where applicable:

```text
request_id
correlation_id
trace_id
causation_id
decision_id
```

SHOULD remain distinguishable.

---

# 34. Request ID

`request_id` identifies one inbound request.

---

# 35. Correlation ID

`correlation_id` may span:

```text
multiple requests
events
retries
workflow stages
domain boundaries
```

for one broader business/operational flow.

---

# 36. Trace ID

`trace_id` connects technical execution spans.

It SHALL not automatically equal a business correlation ID.

---

# 37. Causation ID

`causation_id` identifies the event, command or action that directly caused another operation where appropriate.

---

# 38. Decision ID

A security or governance decision identifier MAY connect:

```text
authorisation decision
governance decision
domain execution
```

without collapsing their authorities.

---

# 39. End-to-End Example

A material capital workflow SHOULD eventually be reconstructable:

```text
Pulse Recommendation
       │
       ▼
Capital Proposal
       │
       ▼
Governance Decision
       │
       ▼
ERP Execution
       │
       ▼
Financial Event
       │
       ▼
Executive Notification
       │
       ▼
Outcome
```

using correlation rather than duplicated authority.

---

# 40. Actor and Subject

Human-initiated operations SHALL preserve:

```text
subject
=
human principal
```

and:

```text
actor
=
calling workload
```

where the server acts on the human's behalf.

---

# 41. System-Originated Operations

Where no human initiated the action:

```text
actor = workload/system
subject = absent or system-specific
```

SHOULD remain explicit.

---

# 42. Audit Source

Each domain SHALL own audit for actions within its authoritative state.

Examples:

```text
IAM
→ authentication / credential audit

CP
→ grant / binding / context audit

ERP
→ posting / finance audit

Governance
→ corporate decision audit

Documents
→ protected access / document lifecycle audit
```

---

# 43. Nabhold Shall Not Duplicate Authoritative Audit

Nabhold MAY retain estate-level interaction evidence.

It SHALL NOT create a second competing audit history of:

```text
ERP posting
board decision
IAM privilege grant
```

and treat it as equally authoritative.

---

# 44. Estate Audit

Nabhold MAY audit estate-specific activity such as:

```text
protected dashboard accessed
decision page opened
notification preference changed
executive export initiated
```

where useful and lawful.

Such activity SHALL retain clear estate provenance.

---

# 45. Audit Record

A material audit record SHOULD conceptually include:

```text
AuditRecord
├── audit_id
├── occurred_at
├── actor
├── subject?
├── tenant_id?
├── legal_entity_id?
├── resource_type
├── resource_id
├── action
├── previous_state?
├── new_state?
├── result
├── reason_code?
├── authority_reference?
├── correlation_id
├── causation_id?
├── request_id?
└── source_service
```

according to its domain.

---

# 46. Audit Shall Be Append-Oriented

Consequential audit history SHALL not be casually edited in place.

Corrections SHOULD preserve evidence of:

```text
original record
correction
reason
actor
timestamp
```

where applicable.

---

# 47. Audit Tamper Resistance

High-value governance/security/financial audit SHOULD receive appropriate tamper-evidence and privileged-access controls.

The exact storage technology is outside this ADR.

---

# 48. Audit Retention

Audit retention SHALL follow applicable:

```text
security
legal
financial
governance
domain
```

requirements.

Nabhold SHALL not invent one universal audit-retention period.

---

# 49. Logs Are Ephemeral Relative to Audit

Operational logs MAY have substantially shorter retention than governance audit.

That difference is valid.

---

# 50. Logs Shall Avoid Secrets

Production logs SHALL NOT contain:

```text
passwords
access tokens
refresh tokens
private keys
provider credentials
```

---

# 51. Logs Shall Minimise Sensitive Data

Logs SHOULD avoid unnecessary:

```text
bank accounts
tax identifiers
document bodies
legal advice
personal information
commercial secrets
```

---

# 52. Structured Logging

Production services SHOULD prefer structured logs over free-form strings for operational diagnostics.

---

# 53. Metrics

Executive Digital Estate metrics MAY include technical indicators such as:

```text
request latency
error rate
capability-resolution latency
partial-composition rate
notification delivery latency
```

These remain technical telemetry.

---

# 54. Business Metrics Are Different

Metrics such as:

```text
Group revenue
cash
orders
risks
```

remain governed business metrics per ADR-NAB-0007 and ADR-NAB-0008.

They SHALL not be confused with infrastructure telemetry.

---

# 55. Metric Cardinality

High-cardinality identifiers such as:

```text
invoice ID
document ID
customer ID
correlation ID
```

SHOULD generally not become ordinary metric labels.

They belong in audit/log/trace systems where appropriate.

---

# 56. Distributed Tracing

Nabhold SHOULD participate in platform-approved distributed tracing.

A typical executive request MAY span:

```text
Browser
   │
   ▼
Nabhold
   │
   ▼
IAM / CP
   │
   ▼
Finance / Pulse / Governance
```

Tracing SHOULD make this path observable.

---

# 57. Trace Sampling

Tracing MAY be sampled.

Audit correctness SHALL NOT depend on traces being sampled.

---

# 58. Alerts

Nabhold SHALL distinguish at least:

```text
OPERATIONAL ALERT
SECURITY ALERT
BUSINESS ALERT
INTELLIGENCE ALERT
GOVERNANCE ALERT
```

conceptually.

Exact canonical taxonomy SHALL be separately governed.

---

# 59. Operational Alert

Examples:

```text
mandatory capability not ready
provider degraded
reconciliation drift detected
```

Operational alerts reflect platform/service condition.

---

# 60. Security Alert

Examples:

```text
privileged access anomaly
identity compromise
critical revocation
```

Security alerts derive from security authorities.

---

# 61. Business Alert

Examples:

```text
receivables threshold exceeded
material contract approaching expiry
cash position threshold breached
```

Business alerts SHALL remain attributable to the relevant domain/approved rule.

---

# 62. Intelligence Alert

Examples:

```text
material new risk
forecast deviation
opportunity detected
important contradiction
```

Pulse SHALL remain the intelligence authority.

---

# 63. Governance Alert

Examples:

```text
approval awaiting decision
delegation expiring
decision condition overdue
risk acceptance due for review
```

Governance remains the state authority.

---

# 64. Alert Is Not Notification

An Alert is a condition/state requiring attention.

A Notification is an attempted delivery of that information to a recipient.

One Alert may produce:

```text
zero notifications
one notification
many notifications
```

according to policy.

---

# 65. Notification Is Derived

A Notification SHALL reference its source:

```text
event
alert
workflow state
scheduled condition
```

where applicable.

It SHALL not invent business state.

---

# 66. Notification Model

Conceptually:

```text
Notification
├── notification_id
├── recipient
├── source_type
├── source_reference
├── notification_type
├── severity
├── title
├── summary
├── target_reference?
├── classification
├── channel_policy
├── created_at
├── expires_at?
└── status
```

---

# 67. Delivery Attempt

Delivery SHOULD be separately represented.

Conceptually:

```text
DeliveryAttempt
├── delivery_id
├── notification_id
├── channel
├── destination_reference
├── attempted_at
├── provider_reference
├── result
├── retry_count
└── provider_message_reference?
```

---

# 68. Notification State and Business State Are Independent

This SHALL remain:

```text
business action completed
    !=
notification delivered
```

and:

```text
notification failed
    !=
business action failed
```

---

# 69. Delivery Success

A provider accepting a message MAY mean only:

```text
delivery request accepted
```

It does not necessarily mean:

```text
recipient read message
```

---

# 70. Read State

A notification MAY have application-level states such as:

```text
UNREAD
READ
DISMISSED
```

where appropriate.

These are user-experience states.

They are not domain-business states.

---

# 71. Notification Opened Is Not Approval

This invariant SHALL remain:

```text
Notification Opened
      !=
Governance Decision
```

---

# 72. Link Click Is Not Approval

Likewise:

```text
Clicked Approve Notification Link
```

must lead into the authoritative governance workflow.

The link itself SHALL not constitute approval.

---

# 73. Notification Does Not Carry Authority

A notification recipient SHALL not gain authority merely because the notification was addressed to them.

The linked capability SHALL resolve current authority again.

---

# 74. Deep-Link Reauthorisation

Every protected notification deep link SHALL resolve:

```text
identity
context
capability
domain authority
```

at access time.

---

# 75. Stale Notification

A notification may remain in an inbox after the underlying state changes.

Opening it SHALL show current authoritative state.

Example:

```text
Notification:
"Capital request awaits approval"

Current state:
Already approved by another authority
```

The UI SHALL not resurrect the old action.

---

# 76. Expiring Notifications

Notifications MAY expire when their source action is no longer relevant.

Expiry removes delivery/action relevance.

It does not delete authoritative history.

---

# 77. Notification Channels

The notification capability MAY support channels such as:

```text
in-app
email
push
SMS
enterprise messaging
```

where approved.

Channel selection is a provider/policy concern.

---

# 78. Provider Neutrality

Nabhold SHALL NOT couple notification semantics to a specific email/SMS/push vendor.

The target architecture is:

```text
Notification Capability
       │
       ▼
CP Resolution
       │
       ▼
Approved Provider
```

---

# 79. In-App Notifications

Nabhold MAY present an executive notification centre.

It SHALL be a derived delivery/read model, not a new business system of record.

---

# 80. Notification Centre

Conceptually:

```text
Executive Notification Centre
├── Immediate Attention
├── Approvals
├── Risks
├── Intelligence
├── Finance
├── Documents
├── Platform / Readiness
└── History
```

The UX taxonomy SHALL not redefine source-domain event taxonomy.

---

# 81. Notification Preferences

Users MAY configure preferences for eligible non-mandatory notifications.

Preferences MAY include:

```text
channel
category
digest frequency
quiet period
severity threshold
```

according to policy.

---

# 82. Mandatory Notifications

Certain notifications MAY be mandatory because of:

```text
security
governance
legal
operational
```

requirements.

A preference SHALL not suppress a mandatory delivery where policy requires it.

---

# 83. Preference Is Not Entitlement

Notification preference SHALL never grant access to underlying information.

---

# 84. Preference Cannot Expand Scope

Selecting:

```text
notify me about all subsidiaries
```

SHALL not extend the user's authorised portfolio scope.

---

# 85. Quiet Hours

Low-priority channels MAY respect user quiet-hour preferences.

Critical alerts MAY override those preferences only under explicitly governed policy.

---

# 86. Digest

Non-urgent notifications MAY be grouped into executive digests.

A digest SHALL retain links/provenance to the underlying authoritative items.

---

# 87. Digest Is Derived

A digest is a presentation artefact.

It does not become a replacement event store.

---

# 88. Deduplication

Notification policy SHOULD prevent unnecessary duplicate deliveries.

However, notification deduplication SHALL not merge distinct authoritative business events merely because the titles look similar.

---

# 89. Correlation-Based Grouping

Related events MAY be grouped using:

```text
correlation
subject
matter
workflow
```

where semantics permit it.

---

# 90. Event Storm Protection

High-volume source events SHALL not automatically generate one executive notification per event.

The notification policy MAY:

```text
aggregate
suppress
debounce
summarise
escalate
```

according to source semantics.

---

# 91. Do Not Lose Material Events

Aggregation SHALL not erase materially distinct:

```text
financial
security
governance
risk
```

events that require individual accountability.

---

# 92. Notification Severity

Notification severity SHOULD derive from source/policy semantics.

Nabhold SHALL not make every message:

```text
CRITICAL
```

merely to attract attention.

---

# 93. Alert Fatigue

The estate SHOULD deliberately minimise alert fatigue.

Executive attention is scarce.

Prioritisation SHOULD favour:

```text
materiality
urgency
decision deadline
risk
impact
authority requirement
```

where governed.

---

# 94. Pulse Priority

Pulse may recommend attention priority for intelligence.

That priority remains intelligence.

It SHALL not independently redefine governance urgency or security severity.

---

# 95. Escalation

Some notifications MAY escalate when:

```text
unread
unacknowledged
unresolved
deadline approaching
```

according to source-domain policy.

---

# 96. Escalation Is Not Authority Transfer

Escalating a notification to another executive SHALL not automatically delegate the original recipient's decision right.

---

# 97. Acknowledgement

The architecture SHALL distinguish:

```text
notification acknowledgement
```

from:

```text
business acknowledgement
```

and:

```text
risk acknowledgement
```

where those have separate domain meaning.

---

# 98. Read Receipts

Read receipts MAY be useful for delivery UX.

They SHALL not automatically satisfy governance or legal acknowledgement requirements.

---

# 99. Notification Templates

Presentation templates SHALL be separated from authoritative event contracts.

Changing email wording SHALL not require changing the source event semantics.

---

# 100. Localisation

Notifications MAY be localised.

Localisation SHALL not change the underlying business meaning.

---

# 101. Sensitive Notifications

Protected notifications SHOULD minimise sensitive content in external channels.

For example, prefer:

```text
"A restricted governance matter requires your attention."
```

over placing confidential transaction details directly into an SMS.

---

# 102. Classification

Notification classification SHALL reflect source sensitivity.

A notification derived from a highly restricted board matter SHALL not become public merely because the message is short.

---

# 103. Email Content

External email SHOULD contain the minimum protected information necessary.

The protected Digital Estate SHOULD remain the preferred location for detailed sensitive content.

---

# 104. Push Notification Content

Device push notifications may appear on lock screens.

Highly sensitive information SHOULD therefore be minimised according to policy.

---

# 105. Notification Metadata Can Be Sensitive

Even:

```text
title
recipient
matter type
timestamp
```

may reveal confidential activity.

Notification storage SHALL respect classification.

---

# 106. Recipient Resolution

Recipient selection SHALL derive from governed identity/authority/subscription context.

It SHALL not rely solely on:

```text
hard-coded email list
```

for production-critical workflows.

---

# 107. No Email-as-Identity Shortcut

A notification recipient SHOULD be linked to canonical identity where applicable.

Email remains a delivery destination, not the canonical person identity.

---

# 108. Destination Changes

Changing a user's email address SHALL not create a new corporate identity or duplicate business authority.

---

# 109. Group Notifications

Group-level executive notifications SHALL respect the principal's authorised Group/portfolio scope.

---

# 110. Cross-Subsidiary Notification Isolation

An executive authorised only for ZuriBeans SHALL not receive Thamani confidential operational notifications merely because both are Nabhold subsidiaries.

---

# 111. Tenant Isolation

Notification queues and inboxes SHALL preserve applicable tenant/legal-entity isolation.

---

# 112. Event Classification

Canonical event payloads SHOULD contain only the data needed for consumers.

Highly sensitive details SHOULD not be broadcast indiscriminately to the event fabric.

---

# 113. Event Is Not Data Dump

This is prohibited:

```text
invoice posted event
=
entire invoice + bank information + customer profile
```

unless the contract genuinely requires and protects that data.

---

# 114. Reference Over Duplication

Events SHOULD prefer stable canonical references where consumers can retrieve protected details through authorised capabilities.

---

# 115. Data Minimisation

Both event payloads and notifications SHALL observe data minimisation.

---

# 116. Event Residency

Event transport, storage and replication SHALL respect applicable data-residency policy.

---

# 117. Notification Residency

Notification content/storage SHALL likewise respect residency and provider-policy requirements.

---

# 118. External Notification Provider

Protected data SHALL not be transmitted to an external notification vendor without applicable:

```text
security review
contractual approval
privacy review
classification review
residency review
```

---

# 119. Secrets

Notification provider credentials SHALL remain server-side and in approved secret-management mechanisms.

---

# 120. Webhooks

Outbound webhooks SHALL be treated as external integration delivery mechanisms.

They SHALL require:

```text
authentication/signing
destination validation
retry policy
classification review
audit
```

where appropriate.

---

# 121. Webhook Delivery Is Not Business Completion

A successful `2xx` response means the receiver accepted the webhook request according to protocol.

It does not prove downstream business processing succeeded.

---

# 122. Webhook Retries

Webhook consumers SHALL assume retries are possible.

Receivers SHOULD use event identity/idempotency.

---

# 123. Inbound Webhooks

Inbound provider webhooks SHALL be authenticated/verified before affecting estate projections.

Unverified payloads SHALL not be trusted merely because they contain plausible JSON.

---

# 124. Notification Provider Webhooks

Delivery-status callbacks MAY update:

```text
delivery attempt status
```

They SHALL not alter the underlying business event.

---

# 125. Event Read Models

Nabhold MAY build derived read models to support:

```text
activity timeline
notification centre
executive inbox
operational pulse
recent decisions
```

These SHALL be rebuildable projections where practical.

---

# 126. Activity Timeline

An executive timeline MAY compose events from multiple domains.

Example:

```text
09:12  ZuriBeans finance report closed
09:35  Pulse risk published
10:02  Capital proposal submitted
10:44  Governance decision approved
11:03  Protected decision pack accessed
```

Each entry SHALL preserve its authoritative source.

---

# 127. Timeline Is Not Audit

A human-friendly timeline is a presentation projection.

It SHALL not replace the complete underlying audit records.

---

# 128. Timeline Filtering

Timeline entries SHALL be filtered by current authorised scope.

The estate SHALL not retrieve all Group events and hide unauthorised entries only in the browser.

---

# 129. Historical Access Changes

A user's current entitlement to an activity timeline does not necessarily imply current access to every underlying historical document.

Drill-down SHALL reauthorise.

---

# 130. Event Store

Nabhold SHALL NOT create a universal enterprise event store and claim ownership over all Baobab domain history merely to populate the dashboard.

---

# 131. Projection Store

Nabhold MAY maintain a bounded projection store for estate experience needs.

Such data SHALL be:

```text
derived
rebuildable where practical
source-attributed
scope-aware
```

---

# 132. Projection Authority

A projection becoming faster to query does not make it more authoritative than its source.

---

# 133. Projection Lag

The estate SHALL recognise that asynchronous projections may lag source state.

Where material, UX SHOULD expose:

```text
as of
updated at
delayed
```

semantics.

---

# 134. Strongly Current Actions

Operations requiring current authority/state SHALL query or validate against the authoritative capability rather than relying solely on asynchronous projections.

---

# 135. Notification Actions

Interactive notification actions such as:

```text
Review
Approve
Dismiss
Open
```

SHALL separate:

```text
delivery interaction
```

from:

```text
authoritative domain command
```

---

# 136. Approve Button

An in-notification `Approve` control, if ever implemented, SHALL invoke the same authoritative:

```text
identity
context
step-up
governance authority
domain
```

checks as the full workflow.

It SHALL not bypass them.

---

# 137. Idempotent Notification Action

Repeated clicking of an actionable notification SHALL not create duplicate consequential actions where idempotency is applicable.

---

# 138. Current State Validation

Before acting from a notification, the system SHALL verify that the underlying matter is still actionable.

---

# 139. Notification Race

If two executives receive the same actionable notification, one actor completing the matter SHALL cause the second actor to observe the new authoritative state.

The second notification SHALL not independently recreate authority.

---

# 140. Security Revocation Event

High-risk revocation events SHOULD invalidate affected estate:

```text
sessions where applicable
context caches
capability caches
protected projections
notification access
```

according to platform policy.

---

# 141. Readiness Events

Control Plane readiness/drift events MAY drive executive or operator awareness.

Not every technical readiness event belongs on an executive dashboard.

Notification policy SHALL differentiate:

```text
operator attention
```

from:

```text
executive attention
```

---

# 142. Technical Failure Versus Business Impact

Executive notifications SHOULD communicate business impact where possible.

Preferred:

```text
"ZuriBeans finance reporting is temporarily unavailable."
```

rather than exposing:

```text
"Engine instance ei_74f binding resolution failed."
```

to ordinary executives.

---

# 143. Operator Details

Detailed infrastructure diagnostics SHALL remain available to authorised operational personnel.

---

# 144. Readiness State

An estate MAY be:

```text
READY
DEGRADED
NOT_READY
BLOCKED
```

according to CP readiness.

The executive experience SHOULD consume—not redefine—this state.

---

# 145. Go-Live Events

Activation and go-live lifecycle events SHOULD be auditable.

A Digital Estate becoming ACTIVE SHALL not be inferred merely because a deployment succeeded.

---

# 146. Build Is Not Activation

This remains:

```text
Build Success
    !=
Deployment Success
    !=
Provisioning Complete
    !=
Readiness
    !=
Activation
```

---

# 147. Executive Operational Status

Nabhold MAY expose an executive operational summary containing:

```text
portfolio readiness
material provider degradation
critical governance deadlines
material finance exceptions
Pulse risks
protected-document issues
```

where appropriately authorised.

---

# 148. Operational Summary Is Derived

Such a dashboard is an estate composition.

It does not become the platform operations authority.

---

# 149. Notification Capability

The estate SHOULD eventually consume provider-neutral capabilities conceptually such as:

```text
notification.preference.read
notification.preference.manage
notification.inbox.read
notification.delivery.request
notification.delivery.status.read
```

where Shared later defines them.

These names are illustrative.

---

# 150. Audit Capability

Nabhold MAY consume authorised audit capabilities conceptually such as:

```text
audit.activity.read
audit.governance.read
audit.security.read
```

where appropriate.

Access to audit SHALL remain restricted.

---

# 151. Event Subscription Capability

Long-lived event consumption SHOULD be managed through governed infrastructure/configuration rather than ad hoc frontend subscriptions.

---

# 152. Browser Shall Not Consume Enterprise Event Bus Directly

This pattern is prohibited:

```text
Browser
   │
   ▼
Kafka / Event Bus
```

for privileged enterprise events.

The Nabhold server/projection boundary SHALL mediate executive consumption.

---

# 153. Server-Sent Updates

The browser MAY receive safe live updates through:

```text
SSE
WebSocket
polling
other controlled mechanisms
```

from Nabhold or an approved delivery boundary.

These SHALL carry presentation-safe information.

---

# 154. Real-Time Does Not Change Authority

A WebSocket message is not more authoritative than a REST response merely because it arrived faster.

---

# 155. Eventual Consistency

Executive activity projections MAY be eventually consistent.

The UX SHALL not hide this where timing materially affects decisions.

---

# 156. Audit Versus Eventual Projection

Authoritative audit may confirm an action before the Nabhold timeline projection updates.

The projection lag SHALL not be interpreted as absence of the action.

---

# 157. Notification Failure

A notification delivery failure SHOULD be observable.

It SHALL NOT roll back an already committed domain transaction.

---

# 158. Critical Delivery Failure

For governance/security processes requiring evidence of delivery or acknowledgement, the governing domain MAY require:

```text
retry
alternate channel
escalation
manual follow-up
```

according to policy.

---

# 159. Notification Provider Outage

If one notification provider fails:

```text
authoritative business state
```

SHALL remain valid.

Alternate provider/channel selection MAY occur through governed routing.

---

# 160. No Notification Bypass

The Digital Estate SHALL NOT send confidential production messages through an unapproved fallback service merely because the normal provider is unavailable.

---

# 161. Notification History

Users MAY view notification history according to retention policy.

Notification history is delivery history.

It SHALL not substitute for domain history.

---

# 162. Dismissal

Dismissing a notification SHALL normally affect the recipient's notification state only.

It SHALL not:

```text
close the business matter
accept the risk
approve the proposal
resolve the platform incident
```

unless a separately invoked authoritative action does so.

---

# 163. Unread Count

An unread count is a user-interface metric.

It SHALL not be treated as an operational risk measure.

---

# 164. Notification Retention

Notification retention MAY be shorter than business/audit retention.

Deleting an old notification SHALL not delete the source event or domain record.

---

# 165. Audit Access

Audit records are often more sensitive than ordinary operational views.

Access SHALL be independently authorised.

---

# 166. Executive Audit Access

Being a Group executive SHALL not automatically grant:

```text
all IAM audit
all security forensic logs
all employee access history
```

---

# 167. Security Operations

Security personnel MAY require audit access without receiving broad business decision authority.

Privilege domains SHALL remain separated.

---

# 168. Exporting Audit

Audit export SHALL follow:

```text
classification
purpose
scope
retention
access
```

policy.

---

# 169. Audit Integrity

Exporting audit into a spreadsheet does not make the spreadsheet the authoritative audit source.

---

# 170. Event and Audit Privacy

Cross-domain events and audit SHALL avoid unnecessary personal information while retaining accountability.

---

# 171. Subject Identifiers

Canonical identity references SHOULD be preferred over mutable usernames/email addresses where possible.

---

# 172. Deleted/Deactivated User

Audit history SHALL remain attributable after:

```text
employee departure
identity disablement
email change
```

according to retention policy.

---

# 173. Historical Resolution

Investigations SHOULD be able to determine which:

```text
tenant
legal entity
authority
capability
provider
```

applied when the historical action occurred.

Current configuration SHALL not rewrite the historical record.

---

# 174. Configuration Changes

Changes to:

```text
notification policy
event subscription
alert threshold
audit policy
```

SHOULD themselves be auditable where consequential.

---

# 175. Alert Threshold Authority

Material business alert thresholds SHALL be governed by the domain/policy that understands the metric.

React components SHALL not define enterprise thresholds as unreviewed constants.

---

# 176. Notification Rule Authority

Notification routing logic MAY be configured separately from business-rule authority.

For example:

```text
ERP:
receivable threshold breached
```

may cause:

```text
Notification Policy:
send CFO in-app + email
```

The notification system does not own the receivable rule.

---

# 177. Event-to-Notification Flow

Preferred:

```text
Authoritative Event
        │
        ▼
Notification Policy
        │
        ├── recipient resolution
        ├── priority
        ├── classification
        ├── channel
        └── deduplication
        │
        ▼
Notification
        │
        ▼
Delivery Provider
```

---

# 178. Event-to-Pulse Flow

A canonical event MAY also feed Pulse where authorised:

```text
Domain Event
     │
     ▼
Pulse Observation / Evidence
     │
     ▼
Analysis
```

The event remains a domain event.

Pulse's interpretation becomes a distinct intelligence object.

---

# 179. Pulse-to-Notification Flow

A Pulse Risk/Opportunity/Recommendation MAY produce an executive Alert/Notification according to policy.

The notification SHALL reference the Pulse intelligence object.

---

# 180. Governance-to-Notification Flow

A governance matter MAY notify an authorised decision-maker.

The recipient SHALL still undergo current authority resolution before deciding.

---

# 181. Document-to-Notification Flow

A protected-document event MAY generate:

```text
document shared
new board-pack version
legal document available
```

notification.

Notification content SHALL preserve document classification.

---

# 182. Finance-to-Notification Flow

Finance-related events MAY generate executive alerts such as:

```text
material reporting exception
period close completed
cash threshold reached
```

according to governed policy.

The notification SHALL not redefine the accounting fact.

---

# 183. Event Contract Compatibility

Consumers SHALL declare/observe supported event contract versions.

An incompatible event contract SHALL fail explicitly rather than be guessed.

---

# 184. No Schema Guessing

This is prohibited:

```text
field renamed
    │
    ▼
maybe this means old field
```

for consequential event processing.

---

# 185. Dead-Letter Handling

Failed asynchronous processing SHOULD support controlled dead-letter/quarantine semantics where infrastructure requires them.

---

# 186. Dead Letter Is Not Lost Business State

A failed consumer does not invalidate the authoritative producer state.

Operational processes SHALL permit:

```text
inspect
repair
retry/replay
reconcile
```

as appropriate.

---

# 187. Poison Event

A malformed or incompatible event SHOULD be quarantined rather than causing an endless uncontrolled retry loop.

---

# 188. Reconciliation

Where critical projections or notifications depend on events, periodic reconciliation SHOULD provide a correctness backstop.

Events accelerate propagation.

Reconciliation establishes convergence.

---

# 189. Event Loss Detection

Critical consumers SHOULD be able to detect relevant gaps or reconcile against source state where technically feasible.

---

# 190. Events Are Not Complete Database Replication

A canonical event stream SHALL not automatically be assumed to contain every field required to reconstruct an entire provider database.

---

# 191. CDC Is Not Canonical Event

This remains:

```text
Change Data Capture
      !=
Canonical Business Event
```

Raw database changes do not automatically have governed business semantics.

---

# 192. Webhook Is Not Canonical Event

Likewise:

```text
Provider Webhook
      != necessarily
Canonical Baobab Event
```

Provider-specific messages SHOULD be adapted at the domain boundary where needed.

---

# 193. Notification Is Not Event Archive

A notification inbox SHALL not become the canonical historical event store.

---

# 194. Activity Feed Is Not Audit Archive

Likewise:

```text
Executive Activity Feed
      !=
Canonical Audit Archive
```

---

# 195. Failure Semantics

The Nabhold estate SHOULD distinguish:

```text
SOURCE_UNAVAILABLE
PROJECTION_DELAYED
EVENT_PROCESSING_FAILED
NOTIFICATION_PROVIDER_UNAVAILABLE
NOTIFICATION_DELIVERY_FAILED
ALERT_STALE
AUDIT_UNAVAILABLE
NOT_AUTHORISED
```

where appropriate.

---

# 196. Partial Degradation

The estate MAY remain usable when some notification/event-derived features are degraded.

Example:

```text
Financial Dashboard        AVAILABLE
Pulse Intelligence         AVAILABLE
Activity Timeline          DELAYED
Email Notifications        UNAVAILABLE
In-App Notifications       AVAILABLE
```

---

# 197. Mandatory Safety Boundary

Failure of notification delivery SHALL not cause Nabhold to assume the recipient knows about a material matter.

Where the business requires acknowledgement, acknowledgement SHALL be explicitly modelled.

---

# 198. Acknowledgement Capability

A future domain MAY define:

```text
acknowledgement.record
```

where an acknowledgement has business/legal meaning.

An in-app read receipt SHALL not substitute for it.

---

# 199. Notification Readiness

Notification capability readiness MAY depend upon:

```text
provider configured
credentials valid
templates valid
sender identity configured
classification policy available
recipient mapping operational
delivery callbacks operational
audit operational
```

as applicable.

---

# 200. Event-Consumption Readiness

An executive event projection SHOULD not be marked ready unless:

```text
subscription configured
contract compatible
consumer healthy
checkpoint valid
deduplication operational
dead-letter handling available
reconciliation strategy defined
```

where required.

---

# 201. Go-Live Readiness

Nabhold SHALL not be marked production-ready merely because:

```text
the dashboard loads
```

or:

```text
test emails are delivered
```

Go-live SHALL prove:

```text
audit
event propagation
correlation
projection correctness
notification routing
classification
revocation
idempotency
partial failure
reconciliation
```

end to end.

---

# 202. Authority Matrix

| Concern | Authority | Nabhold Role |
|---|---|---|
| Authentication audit | IAM | Correlates |
| Platform context/grant audit | CP | Correlates |
| Financial audit | ERP | Presents where authorised |
| Commerce audit | Trade | Presents where authorised |
| Governance audit | Governance domain | Presents where authorised |
| Document access audit | Document authority | Presents where authorised |
| Intelligence lifecycle | Pulse | Presents |
| Canonical event schema | Shared/domain contracts | Consumes |
| Event publication | Owning domain | Consumes |
| Executive activity projection | Nabhold | Owns as derived view |
| Executive notification UX | Nabhold | Owns |
| Notification delivery | Notification provider/domain | Consumes |
| Source business state | Owning domain | Does not own |

---

# 203. Explicitly Prohibited Patterns

`baobab-platform/nabhold` SHALL NOT:

1. use application logs as the canonical audit trail;
2. treat canonical events as identical to audit records;
3. publish events for business state Nabhold does not own as competing authority;
4. consume the enterprise event bus directly from privileged browser code;
5. assume exactly-once event delivery;
6. execute non-idempotent duplicate side effects on repeated event delivery;
7. replay historical events as new business commands;
8. assume global ordering across unrelated event streams;
9. silently guess incompatible event schemas;
10. expose sensitive event payloads more broadly than source access permits;
11. use the event stream as unrestricted database replication;
12. treat CDC as canonical business semantics;
13. treat provider webhooks as automatically canonical;
14. treat notification delivery as proof of business completion;
15. treat notification open as approval;
16. treat notification dismissal as business resolution;
17. grant authority because a user received a notification;
18. allow stale actionable notifications to bypass current-state validation;
19. expose confidential details unnecessarily through email/SMS/push;
20. let user preferences suppress mandatory security/governance notices where policy prohibits it;
21. permit notification preferences to expand portfolio scope;
22. let delivery-provider failure roll back authoritative business state;
23. send confidential data through an unapproved fallback provider;
24. treat an executive activity feed as authoritative audit;
25. treat the notification inbox as the canonical event store;
26. let stale projections authorize material commands;
27. treat traces as durable audit;
28. store secrets in logs/events/notifications;
29. hard-code enterprise alert thresholds casually in UI components;
30. treat event replay or retries as permission for duplicate payments, approvals or commitments.

---

# 204. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Audit, event, log, metric, trace, alert and notification semantics
    are documented and distinct.

[ ] Each canonical event has a clear authoritative producer.

[ ] Nabhold does not publish competing copies of domain authority.

[ ] Canonical event envelopes use Shared conventions.

[ ] Event IDs support deduplication.

[ ] Producers requiring atomic state/event publication use an outbox or
    equivalent reliability mechanism.

[ ] Consumers of retryable event delivery are idempotent.

[ ] Event replay does not repeat external business side effects improperly.

[ ] Relevant out-of-order event cases are handled.

[ ] occurrence, publication and processing times remain distinguishable.

[ ] correlation_id propagates across executive workflows.

[ ] causation relationships are retained where applicable.

[ ] human principal and acting workload remain distinguishable.

[ ] Domain audit remains authoritative in the owning domain.

[ ] Nabhold estate audit is clearly identified as estate-level evidence.

[ ] Audit history is not based solely on logs.

[ ] Secrets are absent from event/log/notification payloads.

[ ] Sensitive telemetry is minimised.

[ ] Distributed tracing is available for key capability paths.

[ ] Trace sampling cannot destroy audit correctness.

[ ] Alerts retain their source classification and authority.

[ ] Notifications reference authoritative source state.

[ ] Notification delivery status is distinct from source workflow state.

[ ] In-app read state is distinct from business acknowledgement.

[ ] Protected notification links reauthorise on open.

[ ] Actionable notifications revalidate current business state.

[ ] Notification actions pass through authoritative domain capabilities.

[ ] Notification recipients derive from governed identity/context.

[ ] Notification preferences cannot expand entitlement.

[ ] Mandatory notices cannot be suppressed contrary to policy.

[ ] Notification channels remain provider-neutral.

[ ] Sensitive external-channel content is minimised.

[ ] Notification data respects classification and residency.

[ ] Notification provider credentials remain server-side.

[ ] Webhook deliveries are authenticated/signed where required.

[ ] Webhook retry processing is idempotent.

[ ] Nabhold's activity timeline is a derived projection.

[ ] Activity projections preserve source authority and provenance.

[ ] Projection lag is observable.

[ ] Material commands do not rely solely on stale projections.

[ ] Event-consumer failure supports quarantine/dead-letter handling where
    applicable.

[ ] Critical event-derived projections have reconciliation backstops.

[ ] Provider outage can degrade notifications without corrupting source state.

[ ] Critical notification failure is observable/escalatable.

[ ] Notification deletion does not delete source business history.

[ ] Historical audit remains attributable after identity changes.

[ ] Alert/notification policy changes are auditable where consequential.

[ ] End-to-end readiness covers audit, events, projections, alerts and
    notifications before go-live.
```

---

# 205. Required Tests

The implementation SHALL test at minimum:

```text
duplicate canonical event
out-of-order event
late event
incompatible event version
event producer failure before commit
event publisher failure after business commit
outbox retry
consumer crash before acknowledgement
consumer replay
projection rebuild
duplicate side-effect prevention
dead-letter event
poison event
correlation propagation
causation chain
human subject versus workload actor
revoked identity after notification creation
cross-tenant notification isolation
cross-legal-entity notification isolation
notification preference scope
mandatory notification override
notification provider outage
delivery retry
delivery callback duplication
expired notification deep link
stale actionable notification
two executives acting on same notification
notification opened without authority
notification dismissal without source-state change
protected email-content minimisation
push notification classification
webhook signature failure
webhook duplicate delivery
event projection lag
reconciliation after missed event
audit-versus-log separation
trace sampling without audit loss
secret-redaction validation
```

---

# 206. Gate Impact

This ADR spans the final production lifecycle and principally governs:

```text
Gate 1
Platform Consumption & Internal Onboarding Foundation

Gate 4
Public Production Hardening

Gate 5
Identity, Principal & Context Foundation

Gate 6
Executive Capability Gateway

Gate 7
Group Portfolio, ERP & Intelligence

Gate 8
Governance, Decisions & Protected Information

Gate 9
Full-Estate Reconciliation & Hardening

Gate 10
Controlled Activation & Go-Live
```

**Gate 9 is the primary cross-estate implementation gate for this ADR.**

Gate 10 SHALL verify its activation and operational-readiness requirements.

---

# 207. Gate 9 Target Architecture

Gate 9 SHOULD prove:

```text
                 AUTHORITATIVE DOMAINS
      ┌──────────────┼────────────────┐
      ▼              ▼                ▼
     IAM             CP            Business
      │              │              Domains
      └──────────────┼────────────────┘
                     ▼
             CANONICAL EVENTS
                     │
       ┌─────────────┼──────────────┐
       ▼             ▼              ▼
    Audit /       Nabhold         Pulse
    Security     Projections    Intelligence
                     │
              ┌──────┴──────┐
              ▼             ▼
            Alerts      Notifications
              │             │
              └──────┬──────┘
                     ▼
                 EXECUTIVE
                     │
                     ▼
          AUTHORISED CAPABILITY
                     │
                     ▼
             AUTHORITATIVE DOMAIN
```

with correlation, idempotency, source authority and failure semantics preserved.

---

# 208. Gate 10 Activation Requirements

Before production activation, Nabhold SHOULD demonstrate:

```text
IAM security events observable
CP readiness/drift observable
mandatory capability failures surfaced
financial events traceable
Pulse risks traceable
governance decisions traceable
protected document access auditable
notification routing operational
notification failure observable
deep links reauthorise
event retries idempotent
projection reconciliation works
critical correlations span domain boundaries
```

---

# 209. Relationship to ADR-NAB-0004

ADR-NAB-0004 establishes:

```text
who is acting
```

and:

```text
under which authenticated session/assurance
```

This ADR ensures that fact remains correlatable across downstream events and audit.

---

# 210. Relationship to ADR-NAB-0005

ADR-NAB-0005 establishes authorised portfolio scope.

This ADR ensures events, projections and notifications respect that scope.

---

# 211. Relationship to ADR-NAB-0006

ADR-NAB-0006 defines synchronous capability consumption.

This ADR complements it with asynchronous operational awareness.

Together:

```text
Request / Response
+
Events / Notifications
```

form the Digital Estate runtime interaction model.

---

# 212. Relationship to ADR-NAB-0007

Financial facts and metrics remain governed by ADR-NAB-0007.

This ADR may notify executives about them.

It SHALL not redefine their financial semantics.

---

# 213. Relationship to ADR-NAB-0008

Pulse owns:

```text
signals
risks
opportunities
forecasts
recommendations
```

This ADR governs how those objects may become executive alerts and notifications without transferring decision authority.

---

# 214. Relationship to ADR-NAB-0009

Governance owns formal corporate decisions.

This ADR may:

```text
notify decision-makers
track delivery
surface deadlines
```

but notification state SHALL never become governance state.

---

# 215. Relationship to ADR-NAB-0010

Protected document access is independently authorised.

A notification containing a document link SHALL not bypass ADR-NAB-0010 controls.

---

# 216. Complete Nabhold Architectural Sequence

The Nabhold Corporate Digital Estate architecture is now defined by:

```text
ADR-NAB-0001
Digital Estate application boundary

        │
        ▼

ADR-NAB-0002
Corporate content authority

        │
        ▼

ADR-NAB-0003
Capability ownership and platform consumption

        │
        ▼

ADR-NAB-0004
Federated identity and executive authorisation

        │
        ▼

ADR-NAB-0005
Canonical organisation and portfolio context

        │
        ▼

ADR-NAB-0006
Executive capability consumption and composition

        │
        ▼

ADR-NAB-0007
Financial and portfolio reporting authority

        │
        ▼

ADR-NAB-0008
Executive intelligence and decision support

        │
        ▼

ADR-NAB-0009
Governance, capital, risk and approvals

        │
        ▼

ADR-NAB-0010
Protected documents and information access

        │
        ▼

ADR-NAB-0011
Auditability, operational events and notifications
```

Together they define the enduring constitutional architecture for the Nabhold Corporate Digital Estate.

---

# 217. Architecture Closure

The sequence establishes the following end-to-end chain:

```text
IDENTITY
    │
    ▼
CONTEXT
    │
    ▼
CAPABILITY
    │
    ▼
AUTHORITATIVE DOMAIN
    │
    ▼
BUSINESS FACT
    │
    ├───────────────┐
    ▼               ▼
REPORTING        INTELLIGENCE
    │               │
    └───────┬───────┘
            ▼
       GOVERNANCE
            │
            ▼
         DECISION
            │
            ▼
        EXECUTION
            │
            ▼
          EVENT
            │
      ┌─────┼─────┐
      ▼     ▼     ▼
    AUDIT ALERT NOTIFICATION
      │     │     │
      └─────┼─────┘
            ▼
       EXECUTIVE
```

No step absorbs the authority of the others.

---

# 218. Constitutional Invariants

The completed Nabhold architecture SHALL preserve:

```text
Digital Estate
    !=
Platform

Tenant
    !=
Legal Entity

Legal Entity
    !=
Organisation

Capability
    !=
Provider

Identity
    !=
Authority

Authentication
    !=
Authorisation

Authorisation
    !=
Governance Decision

Recommendation
    !=
Decision

Decision
    !=
Execution

Execution
    !=
Outcome

Financial Actual
    !=
Forecast

Intelligence
    !=
Operational Truth

Document
    !=
File URL

Audit
    !=
Log

Event
    !=
Command

Event
    !=
Audit

Alert
    !=
Decision

Notification
    !=
Authority

Notification Delivery
    !=
Business Completion
```

---

# 219. No Further Foundational Nabhold ADR Required Before Rollout

With ADR-NAB-0011 accepted, the initial **foundational architecture-decision suite for the Nabhold Corporate Digital Estate is complete**.

Further ADRs SHOULD be created only when implementation discovers a genuinely durable architectural decision not already governed by:

```text
Nabhold ADRs
Baobab Control Plane ADRs
Shared contracts
IAM ADRs
ERP ADRs
CMS ADRs
Pulse ADRs
other authoritative domain ADRs
```

Implementation milestones SHALL NOT be converted into ADRs merely because work remains.

---

# 220. Next Artefact

The next major artefact SHALL be the implementation specification:

**`docs/specifications/nabhold-corporate-digital-estate-rollout.md`**

It SHALL translate ADR-NAB-0001 through ADR-NAB-0011 into the agreed implementation gates:

```text
Gate 1
Platform Consumption & Internal Onboarding Foundation

Gate 2
Corporate Content Capability

Gate 3
Institutional Public Estate

Gate 4
Public Production Hardening

Gate 5
Identity, Principal & Context Foundation

Gate 6
Executive Capability Gateway

Gate 7
Group Portfolio, ERP & Intelligence

Gate 8
Governance, Decisions & Protected Information

Gate 9
Full-Estate Reconciliation & Hardening

Gate 10
Controlled Activation & Go-Live
```

The rollout specification SHALL reference these ADRs rather than restating or redefining their architectural decisions.

---

# 221. Final Decision

The Nabhold Corporate Digital Estate SHALL be an **observable, auditable and event-aware consumer of Baobab capabilities**.

The enduring operational architecture is:

```text
                 AUTHORITATIVE DOMAIN
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        AUTHORITATIVE STATE     DOMAIN AUDIT
              │
              ▼
        CANONICAL EVENT
              │
     ┌────────┼──────────────┐
     ▼        ▼              ▼
 Projection  Pulse         Alert Policy
     │        │              │
     │        ▼              ▼
     │    Intelligence   Notification
     │                       │
     └───────────┬───────────┘
                 ▼
          NABHOLD EXECUTIVE
                 │
                 ▼
        AUTHORISED INTERACTION
                 │
                 ▼
          CAPABILITY RESOLUTION
                 │
                 ▼
          AUTHORITATIVE DOMAIN
```

The enduring rule is:

> **Nabhold must always be able to tell the executive what happened, why it matters, where it came from, whether attention is required, and where to act—without confusing observation with authority. Audit proves the past, events propagate the past, alerts prioritise attention, notifications deliver attention, and only authoritative capabilities change the business.**