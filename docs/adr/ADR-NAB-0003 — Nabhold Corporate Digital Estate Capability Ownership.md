# ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries

**Status:** Accepted
**Date:** 2026-09-20
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture
**Repository:** `baobab-platform/nabhold`
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate
**Platform:** Baobab
**Architecture Style:** Capability-centric, server-first, provider-neutral, context-resolved, multi-tenant, multi-legal-entity, headless, contract-driven
**Contract Authority:** `baobab-platform/shared`
**Control-Plane Authority:** `baobab-platform/baobab-cp`
**Identity Authority:** `baobab-platform/baobab-iam`
**Content Authority:** Baobab content capability, initially provided by `baobab-platform/baobab-cms` / Payload CMS
**Financial Authority:** Baobab financial/accounting capabilities, initially provided by `baobab-platform/baobab-erp` / iDempiere
**Intelligence Authority:** Baobab intelligence capabilities, initially provided by `baobab-platform/baobab-pulse`
**Decision Type:** Foundational Digital Estate architecture and platform-consumption boundary

**Depends On:**

* ADR-NAB-0001 — One Next.js estate with separated public and executive route groups
* ADR-NAB-0002 — Payload CMS as authoritative corporate editorial content engine
* ADR-BCP-002 — Capability-Centric Baobab Platform Architecture and Digital Estate Consumption Model
* ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
* ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
* ADR-BCP-005 — Product, Capability Composition, Subscription, Entitlement and Digital Estate Provisioning Model
* ADR-BCP-006 — Capability Provider Lifecycle, Engine Topology, Health, Failover and Migration Model
* ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
* ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
* ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
* ADR-BCP-010 — Modular Control Plane Architecture, Governance Boundaries and Evolution Model
* ADR-BCP-012 — Intercompany and Inter-Branch Trading, Legal-Entity Relationship and Internal Settlement Model
* ADR-BCP-017 — Organisation Admission, Subscription Classification and Tenant Onboarding Lifecycle Model
* `BCP-TS-ONBOARDING-001` — Baobab Control Plane Tenant Onboarding & Provisioning Technical Specification
* Applicable accepted ADRs in `baobab-platform/shared`, `baobab-platform/baobab-iam`, `baobab-platform/baobab-cms`, `baobab-platform/baobab-erp`, and `baobab-platform/baobab-pulse`

**Supersedes:**

Any interpretation of Nabhold ADR-NAB-0001 or ADR-NAB-0002 that permits the Nabhold Digital Estate to become permanently coupled to a particular Baobab engine or provider technology.

Specifically, this ADR **partially supersedes the provider-direct transport model in ADR-NAB-0002** where that ADR requires `nabhold` to know and statically configure Payload CMS as its runtime provider.

It does **not** supersede ADR-NAB-0002's decision that corporate editorial content is authoritative outside this repository and is presently managed through the Baobab CMS/content domain.

---

# 1. Executive Decision

`baobab-platform/nabhold` SHALL operate as the **Nabhold Group Africa Corporate Digital Estate** and SHALL consume Baobab platform capabilities as a governed **INTERNAL** Baobab client.

The Nabhold Digital Estate SHALL own:

```text
presentation
interaction
experience composition
estate-specific view models
estate-specific navigation
estate-specific workflows
server-side orchestration of authorised capabilities
public institutional experience
executive decision experience
```

It SHALL NOT become authoritative for:

```text
tenant identity
legal-entity identity
group/subsidiary relationships
Digital Estate identity
market identity
canonical organisation truth
identity or authentication
platform entitlement
capability grants
provider selection
engine topology
accounting truth
commerce truth
subsidiary operational truth
content-engine topology
intelligence processing
canonical event contracts
platform audit semantics
platform provisioning
```

The governing principle is:

> **Nabhold is a Digital Estate that composes Baobab capabilities. It is not a replacement Control Plane, IAM system, ERP, CMS, intelligence engine, commerce engine, canonical registry, or integration hub.**

A second governing principle is:

> **The Nabhold Digital Estate SHALL depend on business capabilities and canonical Baobab contracts, not on the accidental choice of engine currently implementing those capabilities.**

The target relationship is therefore:

```text
                    NABHOLD DIGITAL ESTATE
                             │
                    Presentation / BFF
                             │
                             ▼
                    Business Capabilities
                             │
                             ▼
                       Baobab Control Plane
                    context + entitlement
                    resolution + readiness
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
        Content          Financial       Intelligence
       Capability       Capability        Capability
            │                │                │
            ▼                ▼                ▼
      Current Provider  Current Provider  Current Provider
         Payload          iDempiere          Pulse
```

The provider technologies shown above are current implementations, not Nabhold architectural dependencies.

---

# 2. Context

Nabhold Group Africa is a holding company whose portfolio currently includes:

```text
Nabhold Group Africa
│
├── ZuriBeans
├── Thamani Global
└── Equator & Estate Co.
```

The corporate Digital Estate serves two materially different experiences:

```text
NABHOLD DIGITAL ESTATE
│
├── Public Institutional Experience
│   ├── Group profile
│   ├── portfolio
│   ├── sectors
│   ├── capabilities
│   ├── insights
│   ├── governance
│   ├── careers
│   └── corporate information
│
└── Executive Decision Experience
    ├── portfolio visibility
    ├── group performance
    ├── subsidiary performance
    ├── financial information
    ├── intelligence
    ├── risk
    ├── governance
    ├── capital allocation
    └── protected corporate information
```

ADR-NAB-0001 correctly established these as two route groups within one independently deployable Next.js estate.

ADR-NAB-0002 correctly established that corporate editorial content SHALL NOT be authored as hard-coded frontend truth.

However, the Baobab Control Plane architecture has since evolved.

Baobab now establishes a stronger platform rule:

```text
Digital Estates consume capabilities.
Products compose capabilities.
Subscriptions establish commercial/platform intent.
Capability grants establish runtime entitlement.
Bindings establish eligible providers.
The Control Plane resolves providers.
Engines implement capabilities.
```

The Nabhold Digital Estate SHALL therefore evolve from:

```text
Nabhold
   │
   ├── directly knows Payload
   ├── directly knows Pulse
   ├── directly knows ERP
   └── eventually knows more engines
```

towards:

```text
Nabhold
   │
   ▼
Baobab capability contracts
   │
   ▼
Control Plane resolution
   │
   ▼
Authorised provider
```

Without this decision, every new executive or public capability would risk adding another provider-specific integration to the Digital Estate until `nabhold` itself became an integration platform.

That outcome is explicitly rejected.

---

# 3. Architectural Identity of Nabhold

`baobab-platform/nabhold` SHALL be treated as:

```text
Digital Estate
+
server-side experience composition layer
+
public institutional interface
+
protected executive decision interface
```

It SHALL NOT be treated as:

```text
Control Plane
API gateway for the entire platform
canonical master-data service
identity provider
ERP
CMS
commerce engine
analytics engine
event broker
workflow platform
data warehouse
```

Its fundamental responsibility is to transform authorised business capabilities into coherent human experiences for:

```text
public visitors
Nabhold executives
authorised group personnel
future authorised governance participants
```

---

# 4. Internal Baobab Client Classification

Nabhold Group Africa SHALL consume Baobab under the internal-client architecture established by ADR-BCP-017.

Where Nabhold Group Africa is authoritatively recognised as eligible for internal platform participation:

```text
subscription_type   = INTERNAL
monetary_charge     = 0
billing_required    = false
usage_metering      = true
entitlement_control = true
audit                = true
readiness_control    = true
isolation_control    = true
```

The Digital Estate SHALL NOT interpret:

```text
INTERNAL
```

as:

```text
unrestricted
trusted-by-default
unmetered
unaudited
provider-direct
cross-tenant
cross-entity
authorization-free
```

The invariant is:

> **Internal ownership of Baobab does not exempt Nabhold Group entities from Baobab governance.**

Zero monetary charge SHALL NOT mean zero platform governance.

---

# 5. Admission and Provisioning Boundary

The Nabhold Digital Estate SHALL NOT invent its own tenant-provisioning mechanism.

Nabhold Group Africa SHALL enter the platform through the same governed model used by the Control Plane:

```text
Authoritative Internal Eligibility
              │
              ▼
       Admission Decision
              │
              ▼
    INTERNAL Classification
              │
              ▼
   TenantOnboardingRequest
              │
              ▼
   TenantProvisioningPlan
              │
              ▼
         Provisioning
              │
              ▼
       Reconciliation
              │
              ▼
          Readiness
              │
              ▼
            ACTIVE
```

The repository MAY contain configuration describing its requirements.

It SHALL NOT create canonical tenant, legal-entity, subscription, capability-grant or provider-binding state independently of the Control Plane.

---

# 6. Tenant and Legal-Entity Topology Is Not Decided Here

This ADR deliberately SHALL NOT decide whether:

```text
Nabhold Group Africa
ZuriBeans
Thamani Global
Equator & Estate Co.
```

operate:

```text
as legal entities within one tenant
```

or:

```text
as separate tenants connected through governed group relationships
```

or through another topology subsequently approved by Baobab architecture.

That is a platform-level canonical modelling decision.

The Digital Estate SHALL consume the authoritative topology resolved through Baobab.

Therefore the following are prohibited:

```text
const subsidiaries = [...]
const allowedTenantIds = [...]
const groupLegalEntities = [...]
if (tenantId === "zuribeans") ...
if (company === "Thamani") ...
```

when such structures purport to establish canonical authority.

Static configuration MAY be used for presentation metadata only where it does not redefine authoritative organisational truth.

---

# 7. Group and Portfolio Scope

The executive experience SHALL NOT infer group access merely because a legal entity is publicly identified as a Nabhold subsidiary.

The required model is:

```text
Authenticated Executive
        │
        ▼
      Baobab IAM
        │
        ▼
Authenticated Principal
        │
        ▼
    Baobab Control Plane
        │
        ├── tenant context
        ├── legal-entity context
        ├── organisation context
        ├── Digital Estate context
        ├── relationship context
        ├── capability grants
        └── authorised scope
        │
        ▼
Resolved Portfolio Scope
        │
   ┌────┼───────────────┐
   ▼    ▼               ▼
ZuriBeans  Thamani   Equator & Estate
```

The subsidiaries shown above are illustrative of the current group.

Their visibility to a principal SHALL depend on resolved authority.

A user having access to Nabhold's executive estate SHALL NOT automatically imply access to every subsidiary's protected information.

---

# 8. Capability-Centric Consumption

All new Baobab integrations SHALL begin with a business capability requirement.

Examples include:

```text
corporate.content.read
portfolio.organisation.read
finance.group-summary.read
finance.statement.read
finance.budget.read
intelligence.executive-overview.read
intelligence.market-signals.read
governance.decision.read
governance.approval.manage
document.protected.read
risk.portfolio.read
```

The exact canonical keys SHALL be defined by `baobab-platform/shared`.

The Nabhold repository SHALL NOT independently invent canonical capability keys.

The runtime model SHALL conceptually be:

```text
Feature
   │
   ▼
Estate-owned port
   │
   ▼
Capability request
   │
   ▼
Resolved context
   │
   ▼
Capability grant
   │
   ▼
Capability resolution
   │
   ▼
Authorised provider
   │
   ▼
Domain operation
```

---

# 9. Control Plane Versus Data Plane

The Nabhold Digital Estate SHALL respect the Control Plane/Data Plane separation.

The Control Plane SHALL answer:

```text
Is this capability permitted?

In which context?

Under which grant?

Using which provider?

On which eligible provider instance?

Subject to which isolation/residency constraints?

With which resolution assertion?
```

The domain provider SHALL perform the business operation.

Therefore:

```text
Nabhold
   │
   │ authenticate
   ▼
IAM
   │
   ▼
Nabhold BFF / server boundary
   │
   │ resolve capability
   ▼
Baobab CP
   │
   │ resolution
   ▼
Nabhold BFF / domain boundary
   │
   │ invoke authorised capability provider
   ▼
Provider
   │
   ▼
Domain Authorisation
   │
   ▼
Business Result
```

The Control Plane SHALL NOT normally become a proxy for all business traffic.

The Digital Estate SHALL NOT bypass Control Plane resolution by statically selecting a provider.

---

# 10. Server-Side Composition Boundary

Baobab capability consumption SHALL normally occur from trusted server-side code.

The preferred topology is:

```text
Browser
   │
   ▼
Next.js
React Server Components
Route Handlers / Server Actions
Estate BFF
   │
   ├── IAM session
   ├── context resolution
   ├── capability resolution
   ├── domain invocation
   └── response composition
   │
   ▼
Browser-safe view model
```

The browser SHALL NOT be trusted to authoritatively declare:

```text
tenant_id
legal_entity_id
organisation_id
DigitalEstate_id
capability grant
provider id
engine id
engine instance id
isolation profile
residency profile
subscription classification
```

Client-submitted values MAY represent requested navigation or context-selection intent.

They SHALL be validated against authoritative server-side context before use.

---

# 11. Provider Neutrality

Provider implementation details SHALL NOT leak into feature or presentation components.

The following is rejected:

```text
ExecutiveDashboard
    │
    ▼
PulseResponseDTO

PortfolioPage
    │
    ▼
PayloadDocument

FinanceCard
    │
    ▼
iDempiereResponse
```

The required direction is:

```text
ExecutiveDashboard
    │
    ▼
ExecutiveOverview

PortfolioPage
    │
    ▼
PortfolioCompany

FinanceCard
    │
    ▼
FinancialSummary
```

Provider DTOs SHALL be translated at the appropriate capability or integration boundary.

Provider replacement SHALL NOT require wholesale changes to estate feature components.

---

# 12. Estate-Owned Ports

The Nabhold repository MAY and SHOULD own stable interfaces representing what its experiences require.

Conceptually:

```text
CorporateContentGateway
PortfolioGateway
ExecutiveFinanceGateway
ExecutiveIntelligenceGateway
GovernanceGateway
ProtectedDocumentGateway
RiskGateway
```

These interfaces SHALL represent estate needs.

They SHALL NOT encode provider identity.

For example:

```text
interface ExecutiveIntelligenceGateway {
    getExecutiveOverview(context): ExecutiveOverview;
}
```

is acceptable.

An architectural contract equivalent to:

```text
interface HaystackPulseClient {
    getHaystackExecutiveOverview(...);
}
```

is not the intended estate abstraction.

---

# 13. Corporate Content Authority

ADR-NAB-0002 remains authoritative in establishing that corporate editorial content SHALL NOT be hard-coded as canonical content in the frontend.

Corporate content includes:

```text
group profile
portfolio narratives
sector narratives
capability descriptions
homepage editorial content
navigation
footer content
insights
news
publications
careers content
SEO editorial metadata
```

The present implementation provider is Baobab CMS using Payload CMS.

The authority chain SHALL conceptually become:

```text
Public Experience
      │
      ▼
CorporateContentGateway
      │
      ▼
Baobab content capability
      │
      ▼
Control Plane resolution
      │
      ▼
authorised content provider
      │
      ▼
Payload CMS
```

Payload therefore remains the current authoritative editorial engine.

What changes is the estate's architectural dependency.

The Nabhold Digital Estate SHALL depend upon:

```text
content capability
```

rather than:

```text
Payload as permanent platform topology
```

---

# 14. Partial Supersession of ADR-NAB-0002

ADR-NAB-0002 remains valid regarding:

```text
editorial authority
server-side access
DTO validation
estate-owned content models
no database coupling
cache discipline
canonical references
public rendering strategy
separation of content and intelligence
```

This ADR supersedes the interpretation that:

```text
Nabhold
   │
   ▼
statically configured Payload REST endpoint
```

is the final target architecture.

Existing direct Payload integration MAY remain temporarily during migration.

It SHALL be classified as:

```text
TRANSITIONAL IMPLEMENTATION
```

rather than:

```text
TARGET PLATFORM ARCHITECTURE
```

No additional provider-direct CMS coupling SHALL be introduced merely because the transitional implementation exists.

---

# 15. Intelligence Boundary

Baobab Pulse or any future intelligence provider SHALL remain responsible for derived intelligence.

The Digital Estate MAY present:

```text
market signals
opportunity signals
risk signals
portfolio intelligence
FX intelligence
commodity intelligence
executive summaries
analytical observations
```

It SHALL distinguish these from authoritative facts.

The invariant is:

```text
ERP / domain facts
        ≠
Pulse-derived intelligence
```

For example:

```text
ERP:
ZuriBeans gross revenue = authoritative recorded financial fact

Pulse:
ZuriBeans margin may face increasing FX exposure
= derived analysis
```

The Digital Estate SHALL preserve provenance sufficient for an executive user to distinguish facts from derived intelligence.

Pulse output SHALL NOT silently overwrite authoritative domain state.

---

# 16. Financial and Accounting Boundary

Financial and accounting facts SHALL originate from the appropriate Baobab finance/ERP capability.

The Nabhold estate SHALL NOT calculate or persist authoritative:

```text
general ledger balances
trial balances
accounts receivable
accounts payable
statutory financial statements
intercompany accounting
financial consolidation
journal entries
tax accounting
```

unless a future accepted ADR assigns a specific derived calculation to the estate.

The estate MAY calculate presentation-only values from authoritative inputs where:

```text
the calculation is deterministic
the provenance is retained
the result is clearly derived
the result does not become accounting truth
```

Group financial composition SHALL respect legal-entity and accounting authority boundaries.

---

# 17. Subsidiary Operational Truth

Nabhold executives MAY require visibility into subsidiary operations.

That requirement does not transfer domain authority into the holding-company estate.

For example:

```text
ZuriBeans trade/order truth
→ relevant ZuriBeans/domain capability

Thamani commerce truth
→ relevant Thamani/domain capability

Equator & Estate property/project truth
→ relevant authoritative capability

Nabhold
→ authorised presentation and composition
```

The Digital Estate SHALL NOT reproduce subsidiary operational databases locally merely to build executive dashboards.

Where cross-domain executive read models become necessary, their authority, provenance and lifecycle SHALL be explicitly designed rather than silently introduced as frontend persistence.

---

# 18. Identity Boundary

`baobab-platform/baobab-iam` SHALL remain authoritative for:

```text
identity
authentication
credentials
sessions
MFA
passkeys
OIDC/OAuth
federation
identity lifecycle
authentication assurance
credential revocation
workload identity
```

The Nabhold Digital Estate MAY own:

```text
sign-in UX
sign-out UX
session-aware routing
access-denied UX
account presentation
security prompts
```

It SHALL NOT own credential truth.

Authentication SHALL NOT imply business authorization.

The security chain remains:

```text
Identity
   │
   ▼
Context
   │
   ▼
Entitlement
   │
   ▼
Capability
   │
   ▼
Provider Eligibility
   │
   ▼
Domain Authorisation
   │
   ▼
Business Operation
```

Every applicable layer SHALL succeed.

---

# 19. Public and Executive Surfaces

ADR-NAB-0001 remains authoritative.

The estate SHALL continue to expose two principal experience classes:

```text
                    NABHOLD DIGITAL ESTATE
                             │
             ┌───────────────┴───────────────┐
             │                               │
             ▼                               ▼
     PUBLIC INSTITUTIONAL              EXECUTIVE
        EXPERIENCE                 DECISION EXPERIENCE
             │                               │
       cache-oriented                   dynamic
       indexable                        protected
       SEO-oriented                     non-indexable
       mostly content                   context-sensitive
       anonymous/public                 authenticated
```

These surfaces MAY share:

```text
brand system
design tokens
layout primitives
domain presentation models
deployment
observability infrastructure
```

They SHALL NOT be assumed to share:

```text
cache policy
authentication policy
authorization policy
data sensitivity
rendering policy
session behaviour
```

---

# 20. Public Capability Consumption

Anonymous public access SHALL NOT mean provider-direct access.

Public server workloads MAY consume capabilities through a Digital Estate workload identity or another approved public consumption model.

A public browser SHALL never receive privileged service credentials.

For high-volume public content, bounded capability-resolution caching MAY be used according to Control Plane contracts.

A previously validated provider resolution MAY only be reused according to its:

```text
TTL
resolution assertion
revocation semantics
health policy
cache policy
```

The estate SHALL NOT invent an unlimited provider-resolution cache.

---

# 21. Failure and Degradation Semantics

Provider failure SHALL NOT automatically permit provider bypass.

The following pattern is prohibited:

```text
Control Plane unavailable
        │
        ▼
"Just call Payload/Pulse/ERP directly"
```

Approved degradation MAY include:

```text
cached public content
stale-while-revalidate content
partial executive dashboard
explicit unavailable state
bounded cached capability resolution
read-only degraded mode
```

where authorised by the applicable capability and Control Plane policies.

Protected or security-sensitive operations SHALL fail closed where authoritative context, entitlement or provider eligibility cannot be established.

---

# 22. Caching

Caching SHALL distinguish:

```text
content cache
capability-resolution cache
session cache
domain-data cache
derived-view cache
```

These are not interchangeable.

Public editorial content MAY have comparatively long cache lifetimes.

Executive financial or operational information MAY require much shorter or no persistent application caching.

Capability-resolution caching SHALL comply with Control Plane revocation and validity rules.

A cached business result SHALL never be treated as an enduring capability grant.

---

# 23. Canonical References

The Nabhold estate MAY carry canonical identifiers in its view and content models.

Examples:

```text
organisation_id
legal_entity_id
digital_estate_id
market_id
canonical_entity_id
```

Such identifiers are references.

They SHALL NOT make the Digital Estate authoritative for those entities.

The estate SHALL NOT establish cross-database foreign keys into Baobab engine databases.

The estate SHALL NOT connect directly to another Baobab component's authoritative database.

---

# 24. Events

The Nabhold Digital Estate SHALL consume and emit canonical Baobab events only through contracts governed by `baobab-platform/shared`.

The repository SHALL NOT create a parallel Nabhold-specific canonical event namespace.

Events relevant to Nabhold may include:

```text
content lifecycle
capability availability
portfolio changes
financial reporting
intelligence signals
governance decisions
notifications
access changes
readiness changes
```

Where the estate receives an event merely to invalidate or refresh a view, that action SHALL NOT cause the estate to become authority for the underlying aggregate.

---

# 25. Audit and Provenance

Executive composition SHALL preserve sufficient provenance to determine:

```text
which capability produced the information
which authoritative domain supplied it
which tenant/legal-entity context applied
when it was obtained
which principal requested it
which correlation identifier applies
whether the information is authoritative or derived
```

The estate SHALL propagate platform correlation identifiers through downstream requests where contracts permit.

It SHALL NOT substitute application logs for canonical platform audit.

---

# 26. Observability

Nabhold SHALL instrument its own estate responsibilities, including:

```text
page/server latency
capability-resolution latency
provider invocation latency
render failures
authorization failures
cache effectiveness
dependency health
correlation IDs
user-visible degradation
```

The estate SHALL NOT attempt to become the global platform observability authority.

Cross-platform observability remains a shared operational concern governed by the respective platform ADRs.

---

# 27. Security Model

The Digital Estate SHALL operate:

```text
deny by default
least privilege
server-first
fail closed for security-critical uncertainty
context aware
capability aware
provider neutral
```

It SHALL specifically defend against:

```text
tenant spoofing
legal-entity spoofing
portfolio-scope escalation
Digital Estate impersonation
provider bypass
stale entitlement reuse
cross-subsidiary leakage
cross-tenant leakage
browser-supplied authority
provider credential exposure
session replay
revoked-access reuse
```

A successful authentication alone SHALL never satisfy these controls.

---

# 28. Configuration Rules

Environment configuration SHOULD identify stable Baobab platform boundaries.

The target architecture SHOULD favour configuration such as:

```text
BAOBAB_CP_URL
BAOBAB_IAM_ISSUER
BAOBAB_DIGITAL_ESTATE_KEY
BAOBAB_ENVIRONMENT
```

over permanent provider-specific routing configuration such as:

```text
PAYLOAD_API_URL
PULSE_API_URL
IDEMPIERE_API_URL
MEDUSA_API_URL
```

Provider-specific configuration MAY exist temporarily during migration or in an isolated provider adapter where the architecture explicitly requires it.

It SHALL NOT become the estate's authoritative provider-selection mechanism.

---

# 29. Proposed Internal Integration Structure

The implementation MAY evolve toward a structure conceptually similar to:

```text
src/
├── app/
│   ├── (public)/
│   └── (dashboard)/
│
├── features/
│   ├── portfolio/
│   ├── finance/
│   ├── intelligence/
│   ├── governance/
│   └── risk/
│
├── lib/
│   ├── auth/
│   ├── baobab/
│   │   ├── context/
│   │   ├── capabilities/
│   │   ├── resolution/
│   │   ├── assertions/
│   │   ├── provenance/
│   │   └── errors/
│   │
│   ├── content/
│   ├── finance/
│   ├── intelligence/
│   └── governance/
│
└── integrations/
    └── transitional-or-specialised-adapters/
```

This is illustrative, not a mandatory physical package structure.

The architectural requirement is separation between:

```text
presentation
estate domain ports
Baobab capability consumption
provider implementation details
```

---

# 30. Authority Matrix

| Concern                        | Authority                           | Nabhold responsibility    |
| ------------------------------ | ----------------------------------- | ------------------------- |
| Corporate presentation         | `nabhold`                           | **Owns**                  |
| Public UX                      | `nabhold`                           | **Owns**                  |
| Executive UX                   | `nabhold`                           | **Owns**                  |
| Estate-specific composition    | `nabhold`                           | **Owns**                  |
| Tenant identity                | Control Plane / canonical contracts | Consumes                  |
| Legal-entity identity          | Canonical Baobab authority          | Consumes                  |
| Group relationships            | Canonical relationship authority    | Consumes                  |
| Digital Estate identity        | Control Plane                       | Consumes                  |
| Market/context resolution      | Control Plane                       | Consumes                  |
| Capability entitlement         | Control Plane                       | Consumes                  |
| Provider selection             | Control Plane                       | Consumes resolution       |
| Authentication                 | IAM                                 | Integrates                |
| Credential/session authority   | IAM                                 | Integrates                |
| Corporate editorial content    | Content capability / CMS domain     | Presents                  |
| Accounting truth               | ERP/finance domain                  | Presents/composes         |
| Commerce truth                 | Commerce/domain engine              | Presents where authorised |
| Intelligence processing        | Pulse/intelligence domain           | Presents/composes         |
| Canonical capability contracts | Shared                              | Imports                   |
| Canonical event contracts      | Shared                              | Imports                   |
| Platform audit semantics       | Platform authorities                | Propagates evidence       |
| Provider infrastructure        | Infrastructure/provider repos       | Does not own              |

---

# 31. Explicitly Prohibited Responsibilities

`baobab-platform/nabhold` SHALL NOT:

1. create a second tenant registry;
2. create a second legal-entity registry;
3. determine group membership from frontend configuration;
4. establish internal subscription eligibility;
5. mint capability grants;
6. select engines using hard-coded tenant logic;
7. create provider-specific access rules in UI components;
8. store Keycloak credentials;
9. become an ERP;
10. maintain an authoritative shadow ledger;
11. duplicate subsidiary operational databases;
12. treat Pulse output as financial truth;
13. let Payload content establish canonical corporate structure;
14. accept a browser-provided provider ID as authority;
15. accept a browser-provided tenant or legal-entity ID without authoritative validation;
16. bypass the Control Plane because an engine endpoint is reachable;
17. redefine canonical Baobab events;
18. invent local capability semantics that conflict with Shared;
19. connect directly to Baobab-owned databases;
20. activate itself merely because deployment succeeded.

---

# 32. Go-Live and Readiness

Deployment and platform activation SHALL remain separate.

The lifecycle is:

```text
Build
  │
  ▼
Deploy
  │
  ▼
Provision
  │
  ▼
Reconcile
  │
  ▼
Verify Capability Readiness
  │
  ▼
Verify Security
  │
  ▼
Verify Estate Readiness
  │
  ▼
Authorised Activation
  │
  ▼
ACTIVE
```

A green deployment pipeline alone SHALL NOT mean that the Nabhold Digital Estate is platform-ready.

Go-live SHALL depend upon the required Control Plane readiness state and the readiness of mandatory capabilities.

---

# 33. Rollout Implications

This ADR governs the Nabhold rollout programme.

The high-level gate relationship is:

```text
G1  Platform Consumption & Internal Onboarding Foundation
 │
 ├──────────────┐
 ▼              ▼
G2 Content     G5 Identity & Context
 │              │
 ▼              ▼
G3 Public      G6 Executive Capability Gateway
 │              │
 ▼              ▼
G4 Public      G7 Portfolio / Finance / Intelligence
Hardening       │
                ▼
               G8 Governance
 │              │
 └───────┬──────┘
         ▼
G9 Full-Estate Reconciliation & Hardening
         │
         ▼
G10 Controlled Activation & Go-Live
```

This ADR SHALL NOT duplicate detailed gate tasks.

Those belong in the Nabhold rollout technical specification.

---

# 34. Gate 1 Architectural Requirement

Before engine-dependent executive development proceeds, Nabhold SHALL establish:

```text
authoritative Digital Estate identity
INTERNAL platform classification
tenant/legal-entity context
portfolio/group relationship consumption
product/profile assignment
required capability composition
capability grants
provider requirements
isolation/residency requirements
IAM requirements
deterministic onboarding plan
readiness requirements
```

The Digital Estate SHALL not hard-code unresolved platform topology merely to allow frontend development to continue.

Mocks MAY model expected shapes.

Mocks SHALL be clearly non-authoritative.

---

# 35. Migration of Existing Direct Integrations

Existing provider-direct integrations SHALL be reviewed and classified:

| Existing concern  | Current implementation                          | Target disposition                                                             |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| Corporate content | Direct Payload REST adapter                     | Preserve content port; migrate provider selection toward capability resolution |
| Pulse             | Direct Pulse URL/token abstraction              | Replace static provider routing with intelligence capability resolution        |
| Authentication    | Local abstraction awaiting platform integration | Integrate with IAM + CP context boundary                                       |
| ERP               | Not yet fully coupled                           | Implement capability-first; do not introduce direct engine coupling            |
| Future providers  | Not yet integrated                              | Capability-first from inception                                                |

Migration SHOULD proceed incrementally.

The estate need not be rewritten in one destructive change.

Existing estate-owned ports SHOULD be retained where semantically sound.

---

# 36. Backward Compatibility

This ADR preserves the major valid decisions in ADR-NAB-0001 and ADR-NAB-0002.

It does not require:

```text
changing Next.js
splitting the public and executive estates into separate repositories
embedding Control Plane runtime inside Nabhold
embedding Keycloak inside Nabhold
embedding Payload inside Nabhold
moving CMS editorial ownership into Nabhold
moving ERP truth into Nabhold
moving intelligence processing into Nabhold
```

It requires only that the integration architecture mature from provider-aware toward capability-aware consumption.

---

# 37. Alternatives Considered

## 37.1 Direct engine integration from Nabhold

```text
Nabhold
├── Payload
├── Pulse
├── ERP
├── Trade
└── future engines
```

**Rejected.**

This makes the Digital Estate an integration hub and couples its lifecycle to provider technologies.

---

## 37.2 Route every provider request through the Control Plane

```text
Nabhold
   │
   ▼
CP
   │
   ▼
Provider
```

for all business traffic.

**Rejected as the default.**

The Control Plane resolves capability execution.

The data plane performs business execution.

The Control Plane SHALL not unnecessarily become a universal data proxy.

---

## 37.3 Trust internal Nabhold users without normal platform entitlement

**Rejected.**

Internal group ownership is a subscription classification, not an authorization mechanism.

---

## 37.4 Hard-code group subsidiaries in the frontend

**Rejected as canonical authority.**

Group relationships evolve and have legal, security and accounting implications.

The frontend MAY retain presentation metadata but SHALL consume authoritative organisational relationships.

---

## 37.5 Replicate subsidiary data into Nabhold for convenience

**Rejected as the default architecture.**

Executive visibility SHALL be obtained through governed capabilities or explicitly designed read models with clear provenance.

---

## 37.6 Make Payload the permanent public-data gateway

**Rejected.**

Payload is an editorial content provider.

It SHALL NOT become authority for tenancy, organisations, finance, operations or intelligence merely because the public website already uses it.

---

# 38. Consequences

## Positive

This decision provides:

```text
provider replaceability
clear authority boundaries
consistent tenant isolation
central entitlement governance
safer executive access
reusable capability contracts
reduced engine coupling
auditable group visibility
cleaner Digital Estate code
future product/provider flexibility
controlled failure behaviour
```

It also means the Nabhold Digital Estate can evolve without knowing whether a capability is eventually implemented by:

```text
Payload
another CMS
iDempiere
another ERP
Haystack
another intelligence engine
Medusa
another commerce engine
```

provided the replacement satisfies the canonical capability contract and Control Plane policies.

## Costs

This architecture adds:

```text
context-resolution calls
capability-resolution logic
workload identity
additional contract discipline
provider-resolution caching
more integration testing
readiness dependencies
migration work for existing direct adapters
```

These costs are accepted because they prevent considerably more expensive cross-platform coupling later.

---

# 39. Architectural Invariants

The following SHALL remain true:

```text
Nabhold presentation
    != canonical platform truth

Digital Estate
    != Tenant

Tenant
    != Legal Entity

Legal Entity
    != Organisation

Organisation
    != portfolio presentation record

Authentication
    != authorization

Subscription
    != capability grant

Capability grant
    != capability binding

Capability binding
    != provider

Provider
    != capability

Product
    != engine

Content
    != intelligence

Intelligence
    != accounting truth

Deployment
    != readiness

Readiness
    != activation
```

---

# 40. Definition of Done

This ADR is considered correctly implemented when the Nabhold Digital Estate can demonstrate that:

```text
[ ] Nabhold has an authoritative Baobab Digital Estate identity.

[ ] Nabhold Group Africa participates under the governed INTERNAL
    subscription model where applicable.

[ ] Canonical tenant, legal-entity and group relationships are not
    redefined inside the frontend.

[ ] Public and executive route groups remain separated according to
    ADR-NAB-0001.

[ ] Estate features depend on estate-owned or Shared capability contracts,
    not provider-native DTOs.

[ ] Server-side workloads can resolve required capabilities through
    the Control Plane.

[ ] Provider selection is not statically determined by UI code.

[ ] Public browser code receives no privileged provider credentials.

[ ] Executive sessions are authenticated through Baobab IAM.

[ ] Executive context and portfolio scope are resolved authoritatively.

[ ] Cross-subsidiary access cannot be gained through frontend parameter
    manipulation.

[ ] Existing Payload integration has an explicit migration path from
    direct-provider routing to capability-based routing.

[ ] Pulse/intelligence consumption no longer requires permanent
    provider-specific topology in estate feature code.

[ ] ERP/financial integration is introduced capability-first.

[ ] The estate has no direct access to Baobab-owned databases.

[ ] Provider failures cannot silently trigger ungoverned provider bypass.

[ ] Capability-resolution caching honours TTL, invalidation and
    revocation semantics.

[ ] Authoritative facts and derived intelligence remain distinguishable.

[ ] Audit/provenance can trace protected executive information to its
    context and capability source.

[ ] Required capabilities participate in readiness evaluation.

[ ] Production activation is distinct from successful deployment.
```

---

# 41. Documentation Consequences

The Nabhold documentation suite SHALL evolve toward the naming convention:

```text
ADR-NAB-0001-...
ADR-NAB-0002-...
ADR-NAB-0003-...
ADR-NAB-0004-...
...
```

The existing ADR-0001 and ADR-0002 decisions SHOULD be renamed into this convention without changing their accepted architectural meaning.

The rollout programme SHALL be maintained separately from ADRs, for example:

```text
docs/
├── adr/
│   ├── ADR-NAB-0001-...
│   ├── ADR-NAB-0002-...
│   └── ADR-NAB-0003-...
│
└── specifications/
    └── nabhold-corporate-digital-estate-rollout.md
```

ADRs SHALL record durable decisions.

The rollout specification SHALL record:

```text
gates
tasks
dependencies
affected repositories
implementation sequencing
verification
exit criteria
go-live acceptance
```

---

# 42. Follow-On Decisions

The following Nabhold-specific ADRs SHOULD follow this decision:

```text
ADR-NAB-0004
Federated Identity, Authentication and Executive Authorisation

ADR-NAB-0005
Canonical Organisation Context, Group Portfolio Scope
and Legal-Entity Relationship Consumption

ADR-NAB-0006
Executive Experience Capability Consumption
and Server-Side Composition Architecture

ADR-NAB-0007
Group Financial, Portfolio Performance
and Reporting Authority

ADR-NAB-0008
Executive Intelligence and Decision-Support Boundary

ADR-NAB-0009
Corporate Governance, Capital Allocation,
Risk and Approval Authority

ADR-NAB-0010
Protected Corporate Documents,
Classification and Information Access

ADR-NAB-0011
Auditability, Notifications
and Executive Operational Events
```

Those ADRs SHALL refine specific concerns without contradicting the constitutional ownership boundary established here.

---

# 43. Final Decision

The Nabhold Corporate Digital Estate SHALL be a **thin but powerful experience and composition layer over governed Baobab capabilities**.

Its architectural identity is:

```text
                  NABHOLD GROUP AFRICA
                         │
                         ▼
                NABHOLD DIGITAL ESTATE
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
 Public Institutional              Executive
     Experience                 Decision Experience
          │                             │
          └──────────────┬──────────────┘
                         │
                         ▼
               Server-Side Composition
                         │
                         ▼
                 Baobab Capabilities
                         │
                         ▼
                  Baobab Control Plane
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
     Content          Finance         Intelligence
       │                 │                 │
       ▼                 ▼                 ▼
 Provider resolved   Provider resolved  Provider resolved
   by platform         by platform        by platform
```

The enduring rule is:

> **Nabhold owns the experience. Baobab owns platform resolution. Canonical authorities own truth. Providers implement capabilities. The Digital Estate composes the result.**

This boundary SHALL govern subsequent Nabhold architecture, implementation, rollout, security hardening and production activation.
