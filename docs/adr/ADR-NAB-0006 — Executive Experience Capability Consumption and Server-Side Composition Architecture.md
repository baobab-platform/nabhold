# ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Control-Plane Authority:** `baobab-platform/baobab-cp`  
**Contract Authority:** `baobab-platform/shared`  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Capability Providers:** Baobab domain providers resolved by the Control Plane  
**Architecture Style:** Server-first, BFF-oriented, capability-centric, contract-first, context-resolved, provider-neutral, compositional, fail-closed, partially degradable, observable  
**Decision Type:** Foundational Digital Estate runtime integration and executive composition architecture  

**Depends On:**

- ADR-NAB-0001 — One Next.js estate with separated public and executive route groups
- ADR-NAB-0002 — Payload CMS as authoritative corporate editorial content engine
- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-SHARED-007 — Canonical Capability Contracts, Composition Registry and Cross-Engine Provider Model
- ADR-BCP-002 — Capability-Centric Baobab Platform Architecture and Digital Estate Consumption Model
- ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-005 — Product, Capability Composition, Subscription, Entitlement and Digital Estate Provisioning Model
- ADR-BCP-006 — Capability Provider Lifecycle, Engine Topology, Health, Failover and Migration Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- Applicable Baobab IAM workload-identity, token, authorisation and audit ADRs
- Applicable domain ADRs for ERP, CMS, Pulse, Trade and future capability providers

**Supersedes:**

Any interpretation of the current Nabhold integration structure that makes provider-specific HTTP clients the enduring application architecture.

Specifically, existing patterns such as:

```text
src/lib/pulse
        │
        ▼
BAOBAB_PULSE_API_URL
```

and:

```text
src/integrations/payload
        │
        ▼
PAYLOAD_API_URL
```

are accepted as transitional integration mechanisms only.

They SHALL NOT become the template for adding:

```text
src/lib/erp
src/lib/trade
src/lib/payments
src/lib/documents
src/lib/other-engine
```

with each integration statically selecting its provider.

---

# 1. Executive Decision

The Nabhold executive experience SHALL operate as a **server-side composition layer over resolved Baobab capabilities**.

The normal runtime path SHALL be:

```text
Executive Browser
       │
       ▼
Nabhold Next.js Server / BFF
       │
       ├── validate session
       ├── resolve principal
       ├── resolve portfolio context
       └── establish request scope
       │
       ▼
Baobab Control Plane
       │
       ├── context
       ├── entitlement
       ├── capability
       ├── provider
       └── invocation resolution
       │
       ▼
Nabhold Server
       │
       ▼
Authorised Capability Provider
       │
       ├── validate workload/delegation
       ├── domain authorisation
       └── perform business operation
       │
       ▼
Canonical / Domain Response
       │
       ▼
Nabhold Composition
       │
       ▼
Estate-Owned View Model
       │
       ▼
Executive Experience
```

The governing rule is:

> **Nabhold SHALL resolve capabilities through the Control Plane, invoke business providers through the data plane, and compose their authorised results server-side into estate-owned executive views.**

The Control Plane SHALL decide:

```text
whether
where
under which context
under which grant
through which permitted provider
```

a capability may execute.

The provider SHALL execute the business operation.

The Nabhold estate SHALL compose the resulting experience.

---

# 2. Purpose

The executive Digital Estate will require information from multiple business domains.

Examples include:

```text
portfolio structure
financial performance
orders and commercial activity
cash and receivables
inventory exposure
market intelligence
FX intelligence
commodity intelligence
risk
governance
protected documents
operational alerts
```

These domains may currently be implemented by:

```text
iDempiere
MedusaJS
Payload CMS
Haystack
future Baobab providers
external providers
```

The estate must not become coupled to those technologies.

Without an explicit composition architecture, the repository would eventually become:

```text
Nabhold
├── Payload client
├── Pulse client
├── ERP client
├── Trade client
├── payments client
├── documents client
├── logistics client
└── many more provider-specific integrations
```

That would turn the Digital Estate into an accidental enterprise service bus.

This ADR rejects that outcome.

---

# 3. Architectural Identity of the Executive Runtime

The executive runtime SHALL be:

```text
Experience Layer
+
Backend for Frontend
+
Capability Consumer
+
View Composition Layer
```

It SHALL NOT become:

```text
Control Plane
API gateway for Baobab
enterprise service bus
canonical data warehouse
domain workflow engine
provider registry
master-data platform
general-purpose integration platform
```

---

# 4. Control Plane and Data Plane Separation

The estate SHALL preserve:

```text
CONTROL PLANE
     │
     │ decides
     ▼
DATA PLANE
     │
     │ executes
     ▼
DOMAIN PROVIDER
```

The Control Plane owns:

```text
context resolution
platform entitlement
capability resolution
provider eligibility
binding selection
isolation policy
residency policy
contract compatibility
```

The provider owns:

```text
business execution
domain validation
domain authorisation
transactional state
business workflow
```

Nabhold owns:

```text
experience composition
presentation
interaction
derived view models
```

---

# 5. Control Plane SHALL NOT Become Nabhold's Data Proxy

The target architecture is NOT:

```text
Nabhold
   │
   ▼
Baobab CP
   │
   ▼
every ERP / Pulse / CMS / Trade request
```

The Control Plane SHALL normally return a resolution decision.

The estate or another approved domain boundary SHALL then invoke the selected provider.

This avoids turning `baobab-cp` into:

```text
reverse proxy
API gateway
integration hub
business bottleneck
```

---

# 6. Nabhold SHALL NOT Become the Baobab Integration Hub

Conversely, this is also rejected:

```text
                 NABHOLD
        ┌──────────┼──────────┐
        ▼          ▼          ▼
       ERP       Pulse       CMS
        │          │          │
        ├────── Trade ────────┤
        │          │          │
        └── Future Providers ─┘
```

The correct abstraction is:

```text
              NABHOLD
                 │
                 ▼
          Business Capabilities
                 │
                 ▼
          CP Resolution Boundary
                 │
                 ▼
          Authorised Providers
```

---

# 7. Capability-First Integration

Every new executive integration SHALL begin by asking:

> What business capability is required?

It SHALL NOT begin with:

> Which engine should Nabhold call?

Examples:

```text
finance.statement.read
finance.receivable.read
portfolio.performance.read
intelligence.executive-overview.read
intelligence.fx.query
content.page.read
commerce.order.read
inventory.availability.read
documents.protected.read
risk.portfolio.read
```

Exact canonical capability names SHALL remain governed by Shared.

---

# 8. Capability Names SHALL Remain Provider-Neutral

This is valid:

```text
finance.statement.read
```

This is not:

```text
idempiere.statement.read
```

This is valid:

```text
intelligence.market.query
```

This is not:

```text
haystack.market.query
```

This is valid:

```text
content.page.read
```

This is not:

```text
payload.page.read
```

Provider replacement SHALL not require changing Digital Estate business semantics.

---

# 9. Shared Contracts

`baobab-platform/shared` SHALL remain the authority for portable cross-repository contracts.

The estate SHALL consume versioned contracts defining, as applicable:

```text
capability identity
request schema
response schema
context schema
resolution schema
reason codes
events
provider-neutral errors
```

Shared SHALL not become a runtime dependency service.

---

# 10. Estate BFF Boundary

The executive estate SHALL use its server runtime as the normal Backend-for-Frontend boundary.

The browser SHALL interact with:

```text
React Server Components
Route Handlers
Server Actions
approved BFF endpoints
```

rather than calling Baobab providers directly.

The preferred flow is:

```text
Browser
   │
   ▼
Nabhold BFF
   │
   ├── session
   ├── principal
   ├── context
   ├── capability resolution
   ├── provider invocation
   └── composition
   │
   ▼
Browser-Safe Result
```

---

# 11. Browser SHALL NOT Resolve Providers

The browser SHALL NOT receive authority to choose:

```text
provider_id
engine_id
engine_instance_id
service endpoint
isolation profile
binding
```

This is prohibited:

```typescript
fetch(providerFromQueryString)
```

as a platform routing mechanism.

---

# 12. Browser SHALL NOT Receive Provider Credentials

The browser SHALL never receive:

```text
ERP credentials
Pulse service credentials
Payload service credentials
provider API keys
client secrets
database credentials
private keys
```

Provider invocation is server-side.

---

# 13. Request Lifecycle

A protected executive request SHALL conceptually follow:

```text
Request
   │
   ▼
Authenticate Session
   │
   ▼
Resolve Canonical Principal
   │
   ▼
Resolve Portfolio / Platform Context
   │
   ▼
Determine Required Capabilities
   │
   ▼
Resolve Capabilities
   │
   ▼
Invoke Permitted Providers
   │
   ▼
Validate Responses
   │
   ▼
Map to Estate Models
   │
   ▼
Compose Executive View
   │
   ▼
Render
```

---

# 14. Context SHALL Precede Capability Resolution

A capability request SHALL not be resolved against ambiguous organisation state.

The order SHALL normally be:

```text
Identity
   │
   ▼
Context
   │
   ▼
Capability
   │
   ▼
Provider
```

not:

```text
Capability
   │
   ▼
guess tenant later
```

---

# 15. Resolved Context Is Immutable Per Operation

Once a `PlatformContext` or equivalent resolved context is established for an operation, the estate SHALL treat it as immutable.

A new:

```text
tenant
legal entity
portfolio company
market
channel
```

requires a new context resolution where relevant.

---

# 16. Capability Resolution

The estate SHALL consume the canonical capability-resolution contract.

Conceptually:

```text
CapabilityResolutionRequest
├── capability_key
├── required_contract_version
├── context
├── operation_scope
├── invocation_mode
└── correlation_id
```

The request SHALL NOT force a provider.

---

# 17. Resolution Result

A successful resolution may include conceptually:

```text
CapabilityResolution
├── decision
├── capability
├── contract_version
├── resolved_context
├── grant_reference
├── binding_reference
├── provider_reference
├── invocation_descriptor
├── isolation
├── residency
├── resolved_at
├── expires_at
├── resolution_id
└── provenance
```

The estate SHALL consume only those fields required to invoke the capability safely.

---

# 18. Resolution Is Permission to Attempt, Not Business Approval

A CP result:

```text
ALLOW
```

means:

> This principal/workload may attempt this capability through the selected provider in this context.

It does NOT mean:

> The domain business action is approved.

For example:

```text
CP:
finance.invoice.issue → ALLOW
```

may still result in:

```text
ERP:
DENY — accounting period closed
```

That is correct behaviour.

---

# 19. Domain Authorisation Remains Mandatory

Every provider SHALL retain domain authority.

Examples:

```text
ERP
→ financial roles
→ posting rules
→ period controls

Trade
→ order authority
→ commercial workflow

CMS
→ editorial workflow

Pulse
→ intelligence access policy
```

Nabhold SHALL not reproduce these rules.

---

# 20. Capability Invocation Descriptor

A successful resolution MAY provide a logical invocation descriptor.

The estate SHOULD prefer logical routing abstractions such as:

```text
service://...
```

or equivalent platform-approved service references over hard-coded physical host addresses.

The descriptor SHALL not contain secrets.

---

# 21. Workload Identity

Provider calls SHALL use authenticated service-to-service identity.

Conceptually:

```text
Nabhold Server
      │
      ▼
Baobab IAM
      │
      ▼
Short-Lived Workload Credential
      │
      ▼
Provider
```

Long-lived static provider tokens SHOULD be migrated away where platform support exists.

---

# 22. Human Delegation

When Nabhold invokes a provider because an executive initiated the operation, the platform SHALL preserve the distinction between:

```text
CALLER WORKLOAD
```

and:

```text
END-USER PRINCIPAL
```

The provider SHALL receive approved delegation or actor context where needed.

---

# 23. Workload Identity SHALL NOT Erase the Human

This outcome is unacceptable:

```text
Executive
    │
    ▼
Nabhold
    │
    ▼
Provider

Audit:
"nabhold-service performed action"
```

when the operation requires attribution to the executive.

Required audit should retain conceptually:

```text
human principal
+
calling workload
+
context
+
operation
```

---

# 24. Arbitrary Identity Headers Are Not Trusted

Headers such as:

```text
X-User-ID
X-Tenant-ID
X-Legal-Entity-ID
X-Role
```

SHALL not become trusted merely because Nabhold sends them.

Any propagated identity/context metadata SHALL derive from validated platform state and use approved trust mechanisms.

---

# 25. Batch Capability Resolution

The executive dashboard will often need multiple capabilities simultaneously.

The estate SHOULD therefore use CP batch resolution where appropriate.

Example:

```text
Executive Dashboard Bootstrap
          │
          ▼
Resolve Batch
          │
          ├── portfolio.performance.read
          ├── finance.summary.read
          ├── intelligence.executive-overview.read
          ├── risk.portfolio.read
          └── documents.executive.read
```

Each capability remains independently authorised.

---

# 26. Batch Resolution Is Not Transactional Atomicity

A batch result such as:

```text
portfolio.performance.read              ALLOW
finance.summary.read                    ALLOW
intelligence.executive-overview.read    DENY
risk.portfolio.read                     ALLOW
```

is valid.

The estate SHALL not assume:

```text
all capabilities must succeed
```

unless a particular experience explicitly requires that invariant.

---

# 27. Experience Bootstrap

Batch resolution MAY be used to determine which executive modules are available.

For example:

```text
Resolved capabilities
        │
        ├── Finance        ALLOW
        ├── Intelligence   ALLOW
        ├── Risk           DENY
        └── Governance     ALLOW
        │
        ▼
Executive Navigation / Modules
```

However:

> **UI availability is a projection of authorisation, not authorisation itself.**

Every actual provider request remains protected.

---

# 28. Estate-Owned Ports

Nabhold SHALL expose stable estate-facing interfaces.

Examples:

```text
PortfolioGateway
ExecutiveFinanceGateway
ExecutiveIntelligenceGateway
RiskGateway
GovernanceGateway
ProtectedDocumentGateway
CorporateContentGateway
```

Feature code SHALL depend on these interfaces or equivalent domain-oriented abstractions.

---

# 29. Ports SHALL Express Estate Requirements

Preferred:

```typescript
interface ExecutiveFinanceGateway {
  getGroupFinancialSummary(
    context: ExecutiveContext
  ): Promise<GroupFinancialSummary>
}
```

Not preferred:

```typescript
interface IDeMpiereClient {
  callADempiereProcess(...)
}
```

The first expresses a Nabhold use case.

The second leaks provider technology into the estate architecture.

---

# 30. Provider-Native DTOs SHALL Not Reach Feature Code

This pattern is rejected:

```text
ERP JSON
   │
   ▼
FinanceCard
```

The required model is:

```text
Provider Response
      │
      ▼
Contract Validation
      │
      ▼
Boundary Mapping
      │
      ▼
Estate Model
      │
      ▼
Feature
```

---

# 31. Estate Models

Nabhold MAY own presentation/composition models such as:

```text
GroupFinancialSummary
PortfolioPerformance
ExecutiveOverview
RiskSummary
GovernanceDecisionSummary
CorporateInsight
```

These models are not canonical platform aggregates unless Shared explicitly defines them as such.

They exist to support the estate experience.

---

# 32. Provider Translation Belongs at a Boundary

Where a provider already exposes the canonical Baobab capability contract, Nabhold SHOULD consume that contract directly through its capability layer.

Where translation remains necessary, it SHOULD occur in:

```text
provider adapter
capability adapter
domain boundary
```

and SHALL be isolated from feature code.

---

# 33. Translational Debt

If Nabhold temporarily translates a provider-specific response because a provider does not yet expose the canonical contract, that code SHALL be classified as:

```text
TRANSITIONAL ADAPTER DEBT
```

It SHALL NOT establish a new permanent architecture.

The preferred long-term location for provider-specific translation is the provider/domain integration boundary, not the Digital Estate.

---

# 34. Current Pulse Integration

The existing direct configuration:

```text
BAOBAB_PULSE_API_URL
BAOBAB_PULSE_API_TOKEN
GET /v1/executive-overview
```

SHALL be treated as transitional.

The long-term target is:

```text
ExecutiveIntelligenceGateway
          │
          ▼
Intelligence Capability
          │
          ▼
CP Resolution
          │
          ▼
Authorised Intelligence Provider
```

The estate SHALL not treat the current Pulse route as canonical merely because it exists first.

---

# 35. Current Payload Integration

The existing:

```text
CorporateContentGateway
        │
        ▼
PayloadCorporateContentGateway
        │
        ▼
Payload REST
```

remains acceptable during migration.

The long-term model is:

```text
CorporateContentGateway
        │
        ▼
Content Capability
        │
        ▼
CP Resolution
        │
        ▼
Authorised Content Provider
```

The estate-owned `CorporateContentGateway` is architecturally valuable and SHOULD be preserved.

The provider-specific routing beneath it SHALL evolve.

---

# 36. ERP Integration SHALL Be Capability-First

Unlike Payload and Pulse, ERP integration has not yet become deeply embedded in Nabhold.

Therefore ERP integration SHALL NOT introduce a permanent:

```text
IDEMPIERE_API_URL
```

as the architectural routing authority.

Finance integration SHALL begin with canonical finance/reporting capabilities and resolved context.

---

# 37. Future Integrations SHALL Start Correctly

Future capabilities such as:

```text
governance
documents
risk
payments
portfolio reporting
capital allocation
notifications
```

SHALL begin capability-first.

They SHALL not repeat transitional provider-direct patterns.

---

# 38. Executive Composition

Nabhold MAY combine independently authorised results into one executive experience.

Example:

```text
Portfolio Context
     │
     ├────► Finance Capability
     │
     ├────► Intelligence Capability
     │
     ├────► Risk Capability
     │
     └────► Operational Capability
                │
                ▼
        Executive Composition
                │
                ▼
        Executive Overview
```

The composed view SHALL remain derived.

---

# 39. Composition Does Not Transfer Authority

If Nabhold combines:

```text
ERP financial fact
+
Pulse intelligence
+
Trade operational metric
```

the estate does not become authoritative for those source facts.

Authority remains with the originating domains.

---

# 40. Fact, Analysis and Presentation SHALL Remain Distinguishable

The executive experience SHALL distinguish:

```text
AUTHORITATIVE FACT
```

from:

```text
DERIVED ANALYSIS
```

from:

```text
PRESENTATION DERIVATION
```

Example:

```text
ERP
→ Revenue = R10m
→ authoritative financial fact

Pulse
→ revenue trend faces FX pressure
→ derived intelligence

Nabhold
→ red trend indicator
→ presentation derivation
```

These SHALL not be silently collapsed.

---

# 41. Composition Provenance

A composed result SHOULD retain sufficient provenance to answer:

```text
Which capability supplied this?

Which legal entity applied?

Which tenant applied?

Which provider/domain supplied it?

When was it obtained?

Was it authoritative or derived?

Which correlation ID applies?
```

---

# 42. Composition Context

Every composition operation SHALL carry an explicit composition context.

Conceptually:

```text
ExecutiveCompositionContext
├── principal
├── platform_context
├── portfolio_scope
├── requested_view
├── capabilities
├── correlation_id
└── request_started_at
```

The estate SHALL not rely on global mutable context.

---

# 43. Composition Plan

Complex executive pages MAY define an explicit internal composition plan.

Conceptually:

```text
ExecutiveOverview
├── REQUIRED
│   └── portfolio.summary.read
│
├── IMPORTANT
│   ├── finance.summary.read
│   └── intelligence.executive-overview.read
│
└── OPTIONAL
    ├── risk.portfolio.read
    └── content.executive-announcement.read
```

This classification is an estate experience concern.

It SHALL not redefine capability dependencies in Shared.

---

# 44. Capability Dependencies Remain Platform Contracts

If capability A genuinely requires capability B to function, that dependency belongs in canonical capability contracts.

The estate SHALL not maintain a contradictory dependency graph.

Estate composition dependencies answer:

> What does this page need?

Canonical capability dependencies answer:

> What does this capability require?

These are different concerns.

---

# 45. Parallel Composition

Independent read capabilities SHOULD be invoked concurrently where safe.

Example:

```text
              Executive Request
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Finance      Pulse/Risk   Operations
        │            │            │
        └────────────┼────────────┘
                     ▼
                 Composition
```

This reduces avoidable waterfall latency.

---

# 46. Bounded Concurrency

Parallelism SHALL be bounded.

The estate SHALL not create unbounded fan-out across:

```text
subsidiaries
markets
capabilities
providers
```

A portfolio with many companies must not result in uncontrolled provider request storms.

---

# 47. N+1 Prevention

The estate SHOULD avoid patterns such as:

```text
for every subsidiary
  resolve context
  resolve capability
  fetch metric 1
  fetch metric 2
  fetch metric 3
```

where canonical batch or aggregate capabilities can safely reduce calls.

Approaches MAY include:

```text
batch CP resolution
provider-side batch contracts
canonical group-summary capabilities
bounded parallel composition
```

---

# 48. Aggregate Capabilities SHALL Not Be Invented for Performance Alone

Performance pressure SHALL NOT cause Nabhold to create fake canonical capabilities.

If a reusable group-level business capability is needed, it SHALL be defined through Shared and implemented by the appropriate domain.

Estate-specific presentation composition MAY remain local.

---

# 49. Server Components

React Server Components SHALL remain the default for read-heavy executive presentation where appropriate.

They support:

```text
server-only credentials
server-side composition
reduced client JavaScript
provider isolation
streaming
```

Client Components SHALL be introduced where interaction actually requires them.

---

# 50. Streaming and Suspense

Independent executive sections MAY use streaming and Suspense to avoid blocking the whole page on slower optional capabilities.

Example:

```text
Executive Shell
     │
     ├── Portfolio Summary   ready
     ├── Finance             loading
     ├── Intelligence        ready
     └── Risk                loading
```

This SHOULD be used only where partial rendering does not create misleading business meaning.

---

# 51. Atomic Business Views

Certain experiences MAY require all required data before rendering.

Examples could include:

```text
formal approval screen
financial sign-off
board-resolution execution
```

where partial data would be unsafe.

Those experiences SHALL define stronger composition requirements.

---

# 52. Partial Degradation

Read-oriented dashboards MAY degrade partially.

A valid result could be:

```text
Portfolio        AVAILABLE
Finance          AVAILABLE
Intelligence     TEMPORARILY UNAVAILABLE
Risk             AVAILABLE
```

The estate SHALL not fail an entire executive dashboard merely because one optional capability is unavailable.

---

# 53. Required Capability Failure

If a capability classified as required for the correctness of a view fails, the estate SHALL not fabricate a complete view.

The application SHOULD present:

```text
view unavailable
partial view explicitly identified
retry option
appropriate operational message
```

according to the experience.

---

# 54. Missing Is Not Zero

This invariant SHALL remain:

```text
UNAVAILABLE
    !=
0
```

```text
TIMEOUT
    !=
0
```

```text
NOT AUTHORISED
    !=
0
```

```text
NOT CONFIGURED
    !=
0
```

The estate SHALL not convert failure states into business values.

---

# 55. Error Taxonomy

The composition layer SHOULD distinguish at least:

```text
UNAUTHENTICATED
UNAUTHORISED
INVALID_CONTEXT
CAPABILITY_NOT_GRANTED
CAPABILITY_UNAVAILABLE
PROVIDER_UNAVAILABLE
CONTRACT_INCOMPATIBLE
TIMEOUT
UPSTREAM_VALIDATION_FAILED
DOMAIN_DENIED
PARTIAL_RESULT
INTERNAL_COMPOSITION_ERROR
```

Canonical platform reason codes SHALL be preserved where applicable.

---

# 56. Sensitive Diagnostics SHALL Not Leak

The browser MAY need to know:

```text
Financial data temporarily unavailable
```

It normally does not need:

```text
engine instance ei_abc failed health probe
```

Detailed topology diagnostics SHALL remain server/operations-side.

---

# 57. Provider Response Validation

Every external/provider response crossing into the estate SHALL be validated against the expected contract.

Malformed upstream data SHALL not pass directly into components.

The preferred sequence is:

```text
Provider
   │
   ▼
Contract Validation
   │
   ├── invalid → controlled failure
   │
   ▼
Mapper
   │
   ▼
Estate Model
```

---

# 58. Contract Version Compatibility

Capability resolution SHALL consider contract version.

The estate SHOULD state the contract version it requires.

If:

```text
estate requires 2.x
provider supports 1.x only
```

the system SHALL not silently reinterpret incompatible data.

Resolution SHOULD fail with an appropriate compatibility result.

---

# 59. No Silent Schema Guessing

The estate SHALL NOT respond to incompatible provider data by guessing:

```text
maybe this field means revenue
maybe this field is tenant ID
maybe this changed name
```

Contract incompatibility is an integration state requiring correction.

---

# 60. Timeout Policy

Every remote capability invocation SHALL have a bounded timeout.

Timeouts MAY differ according to capability type.

The estate SHALL not permit indefinite provider waits to exhaust server resources.

---

# 61. Retry Policy

Retries SHALL be capability- and operation-aware.

Read operations MAY permit bounded retries where safe.

Mutating operations SHALL NOT be blindly retried unless:

```text
the operation is idempotent
```

or:

```text
an approved idempotency mechanism exists
```

---

# 62. No Duplicate Financial or Governance Mutations

A timeout SHALL NOT automatically cause repeated:

```text
payment approval
journal posting
capital approval
governance decision
```

requests.

Mutation semantics must be explicitly safe.

---

# 63. Cancellation

Where the application runtime supports it, abandoned or superseded requests SHOULD propagate cancellation to downstream calls where practical.

This reduces unnecessary provider work.

---

# 64. Caching Layers

The estate SHALL distinguish:

```text
session cache
context-resolution cache
capability-resolution cache
domain-data cache
derived-view cache
public-content cache
```

They SHALL not be conflated.

---

# 65. Resolution Cache

Capability resolutions MAY be cached only according to Control Plane semantics.

The rule is:

> **A cache may accelerate authorisation; it may never broaden authorisation.**

---

# 66. Resolution Cache Key

Every dimension that can change a resolution SHALL participate in the cache key.

Conceptually:

```text
principal/workload
tenant
legal entity
Digital Estate
market
channel
environment
isolation
capability
contract version
operation scope
policy/config version
```

as applicable.

---

# 67. Cache-Key Omission Is a Security Defect

If:

```text
legal_entity
```

or:

```text
market
```

changes provider eligibility but is omitted from the resolution cache key, reuse across contexts SHALL be treated as a security defect.

---

# 68. Resolution TTL

No universal capability-resolution TTL SHALL be hard-coded in the Nabhold estate.

TTL depends upon:

```text
capability sensitivity
grant volatility
provider health
revocation requirements
security policy
```

---

# 69. High-Risk Operations

Capabilities involving:

```text
payment release
financial posting
privileged administration
governance approval
```

MAY require:

```text
very short resolution TTL
```

or:

```text
no reusable resolution cache
```

according to platform policy.

---

# 70. Domain Data Caching

Business-data caching SHALL follow domain semantics.

Examples:

```text
public corporate content
→ longer cache acceptable

executive market intelligence
→ freshness-sensitive

financial account balance
→ potentially highly freshness-sensitive

governance approval state
→ current state required
```

One cache strategy SHALL NOT be applied across all capabilities.

---

# 71. Cached Business Data Is Not an Entitlement

Having a cached result SHALL not mean the current principal still has authority to receive it.

Authorisation SHALL be evaluated according to applicable current/cached resolution policy before protected cached data is returned.

---

# 72. Cross-Principal Cache Isolation

Protected cache keys SHALL include all relevant identity/context dimensions.

One executive SHALL never receive another executive's broader portfolio scope through cache reuse.

---

# 73. Event-Driven Invalidation

Canonical lifecycle events SHOULD invalidate affected caches where supported.

Examples:

```text
grant revoked
tenant suspended
relationship changed
provider unavailable
capability binding changed
content published
```

Events supplement bounded TTL.

They do not justify infinite caching.

---

# 74. Revocation

Revoked authority SHALL not remain effective merely because Nabhold cached an old `ALLOW`.

The application SHALL honour:

```text
expiry
revocation
invalidation
resolution assertions
```

according to CP contracts.

---

# 75. Provider Health

The estate SHALL not independently implement provider selection based on ad-hoc health checks.

Provider health and topology influence CP resolution.

Nabhold MAY monitor experienced provider latency/failure for its own observability but SHALL not use that monitoring to bypass CP routing.

---

# 76. Provider Failover

Where provider failover exists, it SHALL be governed by Control Plane bindings/provider lifecycle policy.

This is prohibited:

```text
Primary provider down
      │
      ▼
Nabhold hard-codes fallback URL
```

The correct pattern is:

```text
Primary provider unavailable
      │
      ▼
CP resolution / valid cached resolution policy
      │
      ▼
approved alternate provider
```

---

# 77. Isolation and Residency

Nabhold SHALL not relax:

```text
tenant isolation
legal-entity isolation
data residency
deployment-region policy
```

for executive convenience.

If no provider satisfies the required isolation or residency policy:

```text
resolution SHALL fail
```

rather than silently downgrade.

---

# 78. Cross-Border Portfolio Composition

A Group view may combine companies operating in different jurisdictions.

That does NOT mean:

```text
all source data may be copied into any region
```

Composition SHALL honour provider contracts, data classification and residency constraints.

---

# 79. Data Minimisation

The estate SHALL request only the information required to render the authorised experience.

If a dashboard requires:

```text
total receivables
```

it SHOULD NOT fetch:

```text
every customer invoice
```

unless necessary.

Capability contracts SHOULD support appropriately scoped reads.

---

# 80. Browser Data Minimisation

Server-side composition SHOULD prevent unnecessary confidential provider data from reaching the browser.

The server SHALL map source data into browser-safe view models.

---

# 81. Executive View Model

A browser-facing view model MAY conceptually contain:

```text
ExecutiveOverview
├── portfolio
├── finance
├── operations
├── intelligence
├── risk
├── governance
├── freshness
├── availability
└── presentation-safe provenance
```

It SHALL omit:

```text
provider credentials
engine topology
unnecessary identifiers
internal error bodies
private infrastructure information
```

---

# 82. Freshness Metadata

Where decision usefulness depends on time, the UI SHOULD expose meaningful freshness.

Examples:

```text
As of 10:30
Updated 5 minutes ago
Reporting period: FY2026 Q3
```

The estate SHALL not imply that cached historical information is live.

---

# 83. Staleness Semantics

A result MAY be:

```text
FRESH
STALE_BUT_ALLOWED
UNAVAILABLE
```

where the underlying capability policy supports those semantics.

The estate SHALL not invent stale-data acceptance for sensitive capabilities without domain approval.

---

# 84. Provenance Metadata

Internal composition models SHOULD support fields conceptually equivalent to:

```text
source_capability
context_id
resolution_id
source_domain
data_timestamp
retrieved_at
correlation_id
authoritative_classification
```

where appropriate.

---

# 85. Correlation

Every executive composition request SHOULD have a correlation identifier propagated across:

```text
Nabhold
   │
   ▼
Control Plane
   │
   ▼
Provider
```

This SHALL support distributed diagnostics and audit reconstruction.

---

# 86. Distributed Tracing

The estate SHOULD participate in approved platform distributed tracing.

Useful spans may include:

```text
authenticate
resolve-context
resolve-capabilities
invoke-finance
invoke-intelligence
invoke-risk
compose-view
render
```

Secrets and sensitive data SHALL not be recorded as trace attributes.

---

# 87. Metrics

Nabhold SHOULD observe:

```text
context-resolution latency
capability-resolution latency
provider invocation latency
composition latency
cache hit rate
timeout count
provider failure rate
partial-render rate
contract-validation failures
authorisation denials
```

These metrics describe estate behaviour.

They do not make Nabhold the platform observability authority.

---

# 88. Audit

Protected operations SHALL preserve sufficient evidence to reconstruct:

```text
principal
workload
portfolio member
tenant
legal entity
capability
resolution decision
provider/domain
business result
correlation ID
timestamp
```

The estate SHALL not replace domain audit with frontend logs.

---

# 89. Read Operations Versus Mutations

The executive estate SHALL distinguish:

```text
QUERY / OBSERVE
```

from:

```text
COMMAND / MUTATE
```

Queries are generally composable.

Mutations require stricter transactional, audit, idempotency and authorisation semantics.

---

# 90. Executive Dashboard Shall Be Read-Oriented by Default

The initial executive experience SHOULD primarily expose:

```text
visibility
reporting
analysis
decision support
```

rather than broad operational mutation capabilities.

Where a future workflow permits an executive to:

```text
approve
reject
allocate
authorize
instruct
```

that operation SHALL be governed by the responsible domain capability.

---

# 91. No Cross-Domain Transaction Coordinator in Nabhold

The estate SHALL NOT become a distributed transaction manager.

For example:

```text
approve capital
   │
   ├── write ERP
   ├── update governance
   ├── send notification
   └── update intelligence
```

SHALL not be orchestrated through ad-hoc frontend-side distributed transaction logic.

A domain workflow or platform capability SHALL own such consistency where required.

---

# 92. Commands SHALL Use Canonical Domain Capabilities

Where an executive command exists, Nabhold shall invoke:

```text
governance.approval...
finance.capital...
risk.acceptance...
```

or equivalent canonical capability.

It SHALL not mutate underlying provider databases directly.

---

# 93. No Direct Database Access

This remains absolute:

```text
Nabhold
  X
  │
Baobab-owned database
```

All interaction SHALL occur through governed contracts/APIs/capabilities.

---

# 94. No Cross-Provider Joins in Provider Databases

The estate SHALL NOT query:

```text
ERP database
JOIN
Trade database
JOIN
Pulse database
```

to build an executive dashboard.

Cross-domain composition occurs over contracts, not database joins.

---

# 95. Derived Read Models

Where performance eventually requires materialised executive read models, they SHALL be explicitly architected.

They must define:

```text
source authorities
event inputs
refresh semantics
data classification
tenant/legal-entity scope
provenance
retention
rebuild strategy
```

A hidden frontend cache SHALL not evolve accidentally into a data warehouse.

---

# 96. Executive Search

Search across portfolio capabilities SHALL follow the same context and capability rules.

An index SHALL not expose information the principal is not authorised to obtain from the underlying domains.

Search indexing architecture, if introduced, SHALL preserve:

```text
tenant
legal entity
portfolio scope
classification
```

as required.

---

# 97. Notifications

Executive notifications may link to composed experiences.

Opening a notification SHALL re-evaluate current authority.

A notification received yesterday SHALL not grant access today if the underlying entitlement has been revoked.

---

# 98. Public Versus Executive Composition

The public estate MAY also consume capabilities.

However, it has materially different characteristics:

```text
PUBLIC
→ anonymous
→ heavily cached
→ SEO oriented
→ mostly content

EXECUTIVE
→ authenticated
→ context-sensitive
→ confidentiality-sensitive
→ fresher operational data
```

The same capability architecture MAY support both.

Their cache/security/composition policies SHALL remain distinct.

---

# 99. Proposed Internal Architecture

The repository MAY evolve conceptually toward:

```text
src/
├── app/
│   ├── (public)/
│   └── (dashboard)/
│
├── features/
│   ├── executive-overview/
│   ├── portfolio/
│   ├── finance/
│   ├── intelligence/
│   ├── risk/
│   └── governance/
│
├── lib/
│   ├── auth/
│   ├── baobab/
│   │   ├── context/
│   │   ├── capabilities/
│   │   ├── resolution/
│   │   ├── invocation/
│   │   ├── delegation/
│   │   ├── provenance/
│   │   ├── errors/
│   │   └── observability/
│   │
│   ├── portfolio/
│   ├── finance/
│   ├── intelligence/
│   ├── risk/
│   └── governance/
│
└── integrations/
    └── transitional-adapters/
```

This is illustrative rather than prescriptive.

The architectural boundaries are normative.

---

# 100. Baobab Client Boundary

Nabhold SHOULD eventually expose one coherent internal platform-consumption boundary.

Conceptually:

```text
BaobabClient
├── resolveContext()
├── resolveCapability()
├── resolveCapabilities()
├── invoke()
└── invokeBatchWhereSupported()
```

This SHALL NOT become a generic uncontrolled HTTP client.

It SHALL enforce:

```text
contract validation
context propagation
resolution semantics
authentication
correlation
timeouts
error normalization
```

---

# 101. Capability Client Is Not Provider Registry

The Nabhold capability client SHALL not contain:

```text
if capability == finance → iDempiere
if capability == intelligence → Pulse
if capability == content → Payload
```

Provider selection belongs to CP.

---

# 102. No Provider Switch Statements

This pattern is prohibited as target architecture:

```typescript
switch (provider) {
  case "payload":
    ...
  case "idempiere":
    ...
  case "haystack":
    ...
}
```

inside feature/domain presentation code.

If protocol adaptation is temporarily necessary, it SHALL exist behind a narrow infrastructure boundary and be treated as migration debt.

---

# 103. Service Discovery

Physical provider endpoints SHOULD be hidden behind approved platform routing/discovery where feasible.

Engine relocation SHALL not require changing React components or executive feature logic.

---

# 104. Environment Separation

A production Nabhold context SHALL never resolve to:

```text
development
test
staging
```

provider instances.

Environment SHALL form part of provider eligibility.

---

# 105. Contract Tests

Nabhold SHALL maintain contract tests proving that its capability-consumption boundary conforms to released Shared contracts.

Tests SHOULD detect:

```text
missing required fields
incompatible contract versions
unexpected enum values
invalid resolution output
provider response drift
```

before production where possible.

---

# 106. Integration Tests

Integration tests SHOULD cover:

```text
IAM → CP → provider
context resolution
single capability resolution
batch resolution
provider invocation
delegated principal propagation
domain denial
provider unavailable
contract mismatch
partial dashboard composition
```

---

# 107. Failure Tests

The estate SHALL explicitly test:

```text
CP unavailable
provider unavailable
resolution expired
grant revoked
provider changed
engine instance changed
contract version incompatible
one optional capability timeout
one required capability timeout
malformed provider response
partial portfolio provider outage
```

---

# 108. Provider Replacement Test

The architecture SHALL prove provider neutrality by demonstrating conceptually that:

```text
Capability X
Provider A
    │
    ▼
CP binding change
    │
    ▼
Provider B
```

does not require changing the feature that consumes Capability X, assuming both implement the required canonical contract.

---

# 109. Multi-Entity Test

Tests SHALL prove the same executive feature can operate under different resolved legal-entity/tenant contexts without static provider configuration.

---

# 110. Cross-Context Cache Test

Tests SHALL verify that:

```text
ZuriBeans resolution/data
```

cannot be reused improperly for:

```text
Thamani
```

or another portfolio member.

---

# 111. Revocation Test

A previously authorised capability that is revoked SHALL cease to be usable according to the platform's revocation guarantees without:

```text
frontend redeployment
hard-coded ACL update
manual provider URL change
```

---

# 112. Partial-Degradation Test

Where an optional capability is unavailable, the estate SHALL prove that:

```text
available modules remain correct
unavailable module is explicit
no zero/fabricated value is substituted
```

---

# 113. Performance Budget

The executive composition architecture SHALL avoid making capability correctness incompatible with usable latency.

Performance work SHOULD focus on:

```text
batch resolution
bounded resolution caching
parallel provider invocation
provider aggregation where canonical
streaming
request deduplication
connection reuse
bounded concurrency
```

rather than bypassing platform resolution.

---

# 114. No Security Bypass for Performance

This is prohibited:

```text
CP is slow
  │
  ▼
hard-code provider
```

Likewise:

```text
authorisation expensive
  │
  ▼
skip checks for executives
```

Performance problems SHALL be solved within the architecture.

---

# 115. Authority Matrix

| Concern | Authority | Nabhold Role |
|---|---|---|
| Executive presentation | Nabhold | Owns |
| Page/view composition | Nabhold | Owns |
| Estate view models | Nabhold | Owns |
| Identity/authentication | IAM | Consumes |
| Organisational context | CP / canonical contracts | Consumes |
| Capability definitions | Shared | Imports |
| Capability entitlement | CP | Consumes |
| Provider resolution | CP | Consumes |
| Provider topology | CP | Does not own |
| Provider health selection | CP | Does not own |
| Business execution | Domain provider | Invokes |
| Domain authorisation | Domain provider | Respects |
| Financial truth | Finance/ERP | Presents |
| Intelligence | Intelligence domain | Presents |
| Content | Content domain | Presents |
| Commerce truth | Commerce domain | Presents where authorised |
| Composition provenance | Nabhold + platform metadata | Preserves |
| Canonical audit | Relevant authorities | Correlates |

---

# 116. Explicitly Prohibited Patterns

Nabhold SHALL NOT:

1. statically select providers as the normal architecture;
2. allow browsers to choose engines;
3. expose provider credentials to browsers;
4. treat CP as a universal data proxy;
5. become the platform API gateway;
6. create its own capability registry;
7. create its own provider registry;
8. invent capability keys without Shared governance;
9. treat resolution `ALLOW` as domain business approval;
10. bypass domain authorisation;
11. leak provider DTOs into feature code;
12. query Baobab databases directly;
13. join domain databases;
14. implement uncontrolled cross-provider distributed transactions;
15. assume every dashboard capability must succeed atomically;
16. convert missing data into zero;
17. retry unsafe mutations blindly;
18. cache protected results without context-sensitive keys;
19. ignore capability revocation because a cache exists;
20. hard-code fallback provider URLs;
21. downgrade isolation or residency to improve availability;
22. hide provider incompatibility through schema guessing;
23. erase human attribution behind generic workload identity;
24. allow provider architecture to determine UI architecture.

---

# 117. Migration Strategy

Migration SHALL be incremental.

### Stage 1 — Preserve stable estate ports

Retain useful abstractions such as:

```text
CorporateContentGateway
```

and equivalent estate-owned gateways.

### Stage 2 — Introduce Baobab consumption spine

Add:

```text
context resolution
capability resolution
workload identity
invocation
error normalization
provenance
```

### Stage 3 — Migrate direct Pulse routing

Move intelligence consumption behind canonical capability resolution.

### Stage 4 — Migrate direct Payload routing

Move content provider resolution beneath `CorporateContentGateway`.

### Stage 5 — Introduce ERP capability-first

Do not establish a provider-direct ERP precedent.

### Stage 6 — Enforce architectural checks

Prevent new feature code from directly importing provider-specific clients.

---

# 118. Transitional Compatibility

During migration, both paths MAY temporarily exist:

```text
Legacy Direct Adapter
```

and:

```text
Capability-Resolved Adapter
```

provided:

```text
production authority is unambiguous
migration ownership is documented
provider bypass is not introduced
tests distinguish both paths
```

The dual state SHALL not become permanent by neglect.

---

# 119. Documentation Consequences

Current documents that describe:

```text
Payload direct REST
Pulse direct HTTP
```

SHALL eventually be updated to distinguish:

```text
CURRENT TRANSITIONAL IMPLEMENTATION
```

from:

```text
TARGET CAPABILITY ARCHITECTURE
```

Documentation SHALL not misrepresent the transitional topology as the constitutional platform model.

---

# 120. Gate Impact

This ADR principally governs:

```text
Gate 1
Platform Consumption & Internal Onboarding Foundation

Gate 2
Corporate Content Capability

Gate 5
Identity, Principal & Context Foundation

Gate 6
Executive Capability Gateway

Gate 7
Group Portfolio, ERP & Intelligence

Gate 8
Governance and Protected Information

Gate 9
Full-Estate Reconciliation & Hardening

Gate 10
Controlled Activation & Go-Live
```

**Gate 6 is the primary implementation gate for this ADR.**

Gate 7 and later gates SHALL consume the composition spine rather than creating independent provider integrations.

---

# 121. Gate 6 Exit Architecture

Gate 6 SHOULD establish a reusable runtime spine capable of:

```text
IAM session
     │
     ▼
Canonical Principal
     │
     ▼
Resolved Portfolio Context
     │
     ▼
Batch Capability Resolution
     │
     ▼
Capability Invocation
     │
     ▼
Contract Validation
     │
     ▼
Estate Mapping
     │
     ▼
Executive Composition
```

Once established, new executive capabilities SHALL plug into this spine.

---

# 122. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Executive provider calls originate server-side.

[ ] Browser code does not resolve providers.

[ ] Browser code does not receive provider credentials.

[ ] A reusable Nabhold Baobab consumption boundary exists.

[ ] Context resolution precedes protected capability resolution.

[ ] Resolved context is immutable per operation.

[ ] Capability resolution uses canonical Shared contracts.

[ ] Consumers do not force provider selection.

[ ] Single and batch resolution are supported where appropriate.

[ ] Batch resolution decisions remain individually authoritative.

[ ] CP ALLOW is not interpreted as domain business approval.

[ ] Provider invocation uses authenticated workload identity.

[ ] Human-initiated operations preserve human attribution.

[ ] Feature code depends on estate/domain models rather than provider DTOs.

[ ] Provider responses are contract-validated.

[ ] Contract-version incompatibility fails explicitly.

[ ] CorporateContentGateway remains provider-neutral at its estate boundary.

[ ] Direct Pulse routing has an explicit capability-based migration path.

[ ] ERP integration is capability-first.

[ ] Future integrations are prohibited from establishing new permanent
    provider-direct architecture without an ADR exception.

[ ] Independent dashboard capabilities can be resolved in batch.

[ ] Independent read capabilities can execute concurrently with bounded
    concurrency.

[ ] Optional capability failure can produce explicit partial degradation.

[ ] Required capability failure does not fabricate a complete result.

[ ] Missing data is never converted to zero.

[ ] All provider calls have bounded timeout policy.

[ ] Retry policy distinguishes reads from mutations.

[ ] Unsafe mutations are not blindly retried.

[ ] Context/resolution/data caches are separate.

[ ] Resolution cache keys contain all security-relevant dimensions.

[ ] Protected cache data cannot leak across principals or legal entities.

[ ] Capability revocation invalidates or expires cached authority according
    to CP semantics.

[ ] Provider failover is controlled by CP, not hard-coded in Nabhold.

[ ] Isolation/residency failure cannot be overridden by the estate.

[ ] Executive composition retains provenance.

[ ] Correlation identifiers propagate across CP and providers.

[ ] Operational metrics distinguish resolution, invocation and composition
    latency.

[ ] Provider-specific diagnostics are not leaked to browsers.

[ ] No Baobab-owned database is accessed directly.

[ ] No cross-provider database joins exist in Nabhold.

[ ] No provider switch statement exists in business feature code.

[ ] Changing a capability provider does not require changing the consuming
    executive feature when the contract remains compatible.

[ ] Cross-context cache isolation is tested.

[ ] Revocation without redeployment is tested.

[ ] Partial provider outage behaviour is tested.

[ ] Production capability readiness participates in go-live evaluation.
```

---

# 123. Architectural Invariants

The following SHALL remain binding:

```text
Capability
    !=
Provider

Provider
    !=
Engine

Engine
    !=
Engine Instance

Resolution
    !=
Business Execution

CP ALLOW
    !=
Domain ALLOW

Estate Composition
    !=
Canonical Domain Truth

Provider DTO
    !=
Estate View Model

Cached Result
    !=
Current Entitlement

Workload Identity
    !=
Human Principal

Partial Failure
    !=
Zero

Unavailable
    !=
Empty Business Result

Control Plane
    !=
Universal Proxy

Nabhold BFF
    !=
Enterprise Service Bus
```

---

# 124. Alternatives Considered

## 124.1 Direct provider clients for every engine

**Rejected.**

This would gradually turn Nabhold into an integration hub.

---

## 124.2 Route every business request through CP

**Rejected.**

This would turn the Control Plane into the universal data proxy.

---

## 124.3 Browser calls providers directly

**Rejected.**

This exposes provider topology, complicates identity and expands the attack surface.

---

## 124.4 One universal executive API backed by a new Nabhold database

**Rejected as the default.**

It would risk creating a shadow operational/data authority.

Explicit read-model architecture may be considered later if justified.

---

## 124.5 Provider-specific feature modules

**Rejected as target architecture.**

Features SHALL model business requirements, not vendor technologies.

---

## 124.6 Fail the entire dashboard if one capability fails

**Rejected for ordinary read-oriented executive views.**

Partial degradation is preferable where business meaning remains correct.

---

## 124.7 Always render partial results

**Rejected.**

Some sensitive or decision-critical views require complete required data.

Composition policy determines when partial rendering is safe.

---

# 125. Consequences

## Positive

This architecture provides:

```text
provider replaceability
stable estate contracts
clean server boundaries
stronger isolation
better executive security
consistent context propagation
partial-degradation support
lower provider coupling
better testing
better provenance
better observability
future capability extensibility
```

It allows Nabhold to evolve from:

```text
Payload + Pulse
```

to:

```text
content
finance
commerce
intelligence
risk
documents
governance
notifications
future capabilities
```

without creating a new architectural integration pattern for each engine.

## Costs

The architecture requires:

```text
capability client implementation
context resolution
workload identity
contract validation
provider-neutral errors
batch resolution
careful caching
composition planning
distributed tracing
migration from existing direct adapters
```

These costs are accepted because they establish a reusable integration spine before the executive estate becomes substantially more complex.

---

# 126. Relationship to ADR-NAB-0003

ADR-NAB-0003 states:

```text
Digital Estates consume capabilities.
```

This ADR defines how Nabhold does so at runtime.

---

# 127. Relationship to ADR-NAB-0004

ADR-NAB-0004 establishes:

```text
principal
authentication
authorisation
workload identity
```

This ADR carries those identities through capability resolution and provider invocation.

---

# 128. Relationship to ADR-NAB-0005

ADR-NAB-0005 establishes:

```text
ResolvedPortfolioScope
ResolvedPortfolioContext
```

This ADR consumes those contexts to resolve and invoke capabilities.

The sequence is therefore:

```text
Identity
   │
   ▼
Portfolio Context
   │
   ▼
Capability Resolution
   │
   ▼
Provider Invocation
   │
   ▼
Executive Composition
```

---

# 129. Follow-On Decision

The next ADR SHALL be:

**ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority**

It SHALL establish:

```text
financial source of truth
management reporting
group-versus-legal-entity reporting
portfolio KPIs
consolidation boundary
currency translation
intercompany effects
budget versus actuals
operational versus accounting metrics
reporting periods
financial provenance
executive financial read models
ERP authority
Pulse analytical augmentation
```

without allowing the Nabhold estate or Pulse to become accounting authority.

---

# 130. Final Decision

The Nabhold executive Digital Estate SHALL consume Baobab through a reusable, server-side, capability-centric composition spine.

The enduring runtime architecture is:

```text
                    EXECUTIVE
                        │
                        ▼
                NABHOLD BROWSER
                        │
                        ▼
              NEXT.JS SERVER / BFF
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
     Baobab IAM                 Baobab Control Plane
   authentication               context + resolution
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
               CAPABILITY DECISIONS
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Finance     Intelligence    Operations
      Provider       Provider       Provider
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
               CONTRACT VALIDATION
                        │
                        ▼
                ESTATE-OWNED MODELS
                        │
                        ▼
              SERVER-SIDE COMPOSITION
                        │
                        ▼
                EXECUTIVE EXPERIENCE
```

The enduring rule is:

> **The executive estate composes business capabilities; it does not wire itself permanently to engines. The Control Plane resolves where a capability may execute, providers execute it, domain authorities protect business behaviour, and Nabhold turns the authorised results into a coherent executive experience.**