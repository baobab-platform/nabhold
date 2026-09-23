I reviewed the current `baobab-platform/nabhold` architecture against the newer `baobab-cp` onboarding model, especially **ADR-BCP-017 — Organisation Admission, Subscription Classification and Tenant Onboarding Lifecycle Model** and the **Tenant Onboarding & Provisioning Technical Specification**.

The existing ten-gate rollout remains a good framework, but I would **restructure it rather than simply append a client-onboarding gate**. The new Control Plane architecture changes an important assumption: Nabhold is not merely a corporate frontend integrating directly with Payload, Pulse, ERP, etc. It is itself a **Baobab Digital Estate and an INTERNAL Baobab client consuming platform capabilities**.

The original distinction between ADR, technical specification, and rollout gate remains correct: gates are execution milestones, not architectural decisions.  The existing recommendation also correctly says local Nabhold ADRs should consume cross-repository decisions rather than duplicate them. 

## The architectural change that matters most

ADR-BCP-017 now makes the lifecycle explicit:

```text
Applicant / Internal Admission
        │
        ▼
ClientApplication
        │
        ▼
Admission Decision
        │
        ▼
Subscription Classification
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

For Nabhold Group entities, the classification is explicitly:

```text
subscription_type   = INTERNAL
monetary_charge     = 0
billing_required    = false

BUT

usage_metering      = true
entitlement_control = true
audit                = true
readiness_control    = true
isolation_control    = true
```

That is important. **Nabhold Group Africa, ZuriBeans, Thamani Global and Equator & Estate Co. do not bypass Baobab governance because they own the platform.** They are internal consumers of it.

Equally important, `INTERNAL` does not mean direct access to Medusa, Payload, iDempiere, Haystack or Keycloak.

The chain remains:

```text
Digital Estate
      │
      ▼
Business Capability
      │
      ▼
Control Plane
 ┌────┴──────────────────────────────┐
 │ Context                           │
 │ Subscription                     │
 │ CapabilityGrant                  │
 │ Scope                            │
 │ CapabilityBinding                │
 │ Readiness / Residency / Policy   │
 └────┬──────────────────────────────┘
      ▼
Capability Provider
      │
      ▼
Engine Instance
```

That changes the rollout quite substantially.

---

# One existing Nabhold decision now needs correction

There is a concrete architectural conflict in the current repository.

`ADR-0002` currently says:

```text
nabhold
   ↓
CorporateContentGateway
   ↓
PayloadCorporateContentGateway
   ↓
Payload REST API
```

and `docs/integrations/payload.md` implements exactly that.

Likewise `docs/integrations/pulse.md` currently expects:

```text
BAOBAB_PULSE_API_URL
BAOBAB_PULSE_API_TOKEN

GET /v1/executive-overview
```

That was a sensible architecture when these were written.

It no longer represents the Control Plane north star.

ADR-BCP-002 establishes:

> Digital Estates consume capabilities. Engines provide capabilities.

ADR-BCP-007 further places the normal interaction behind an estate server/BFF and says the browser must not authoritatively supply tenant, legal entity, provider, engine instance or capability-grant state.

So the target should become approximately:

```text
                      NABHOLD DIGITAL ESTATE
                               │
                 React Server Components / BFF
                               │
                       Estate Capability API
                               │
                         ┌─────▼─────┐
                         │ Baobab CP │
                         └─────┬─────┘
                               │
               Context + Grant + Binding Resolution
                               │
         ┌──────────┬──────────┼───────────┬──────────┐
         ▼          ▼          ▼           ▼          ▼
      Content     Identity   Finance   Intelligence   ...
        │            │          │           │
        ▼            ▼          ▼           ▼
     Payload       IAM      iDempiere    Haystack
```

The **ports already created in Nabhold are useful**. `CorporateContentGateway`, for example, should survive.

The provider-specific adapter should not.

In other words:

```text
GOOD

UI
 ↓
CorporateContentGateway
 ↓
Baobab content capability


NO LONGER TARGET

UI
 ↓
CorporateContentGateway
 ↓
PayloadCorporateContentGateway
 ↓
Payload
```

Payload can remain the authoritative content engine. Nabhold simply should not need to know that Payload happens to be the provider.

That distinction will save an unpleasant architectural haircut later.

---

# Revised ten-gate rollout

I would **retain ten gates**, but change their content and dependency ordering.

| Gate   | Revised purpose                                       | Principal outcome                                                                             |
| ------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **1**  | Platform Consumption & Internal Onboarding Foundation | Nabhold is formally defined as an INTERNAL Baobab Digital Estate/client                       |
| **2**  | Corporate Content Capability                          | Public content moves behind Baobab capability consumption rather than direct Payload coupling |
| **3**  | Institutional Public Estate                           | Full public corporate experience                                                              |
| **4**  | Public Production Hardening                           | SEO, accessibility, caching, security, resilience                                             |
| **5**  | Identity, Principal & Context Foundation              | IAM authentication + CP authoritative organisational context                                  |
| **6**  | Executive Capability Gateway                          | Server-side BFF/capability-consumption spine                                                  |
| **7**  | Group Portfolio, ERP & Intelligence                   | Group/subsidiary financial, operational and intelligence composition                          |
| **8**  | Governance, Decisions & Protected Information         | Governance workflows, approvals, risks, documents and audit                                   |
| **9**  | Full-Estate Reconciliation & Hardening                | Security, readiness, revocation, drift, resilience, observability                             |
| **10** | Controlled Activation & Go-Live                       | Production activation based on CP readiness, not merely deployment                            |

This is more than renaming the gates. Gates 1, 2, 5, 6, 7, 9 and 10 now have materially different acceptance conditions.

---

## Gate 1 — Platform Consumption & Internal Onboarding Foundation

This becomes considerably more important than the former "Corporate definition" gate.

It should establish:

```text
Nabhold Group Africa
        │
        ▼
Governed INTERNAL admission
        │
        ▼
Tenant / Legal Entity topology
        │
        ▼
Nabhold Digital Estate
        │
        ▼
ProductSubscriptions
        │
        ▼
Capability Compositions
        │
        ▼
Capability Grants / Scopes
        │
        ▼
Provider requirements
        │
        ▼
Provisioning Plan
```

### Gate 1 must settle

The repository must know which canonical identities it consumes for:

```text
Nabhold Group Africa
ZuriBeans
Thamani Global
Equator & Estate Co.
Nabhold Digital Estate
```

But **Nabhold must not create these truths locally**.

There is also a topology question that should deliberately remain with CP/Shared rather than being smuggled into the frontend:

```text
Option A

Tenant: Nabhold Group
 ├── Legal Entity: Holding company
 ├── Legal Entity: ZuriBeans
 ├── Legal Entity: Thamani
 └── Legal Entity: Equator & Estate


Option B

Nabhold Tenant
ZuriBeans Tenant
Thamani Tenant
Equator Tenant

+ governed group relationships
```

ADR-BCP-012 permits a tenant to contain one or multiple legal entities. ADR-BCP-017 requires internal eligibility to derive from authoritative group/legal-entity relationships.

Therefore **the Nabhold repo should consume the chosen topology, not decide it**.

This is especially important for the executive dashboard.

### Gate 1 exit criteria

I would require:

```text
[ ] Nabhold recognised through INTERNAL admission
[ ] Digital Estate canonical identity established
[ ] authoritative tenant/legal-entity topology resolved
[ ] subsidiary relationships resolvable authoritatively
[ ] subscription/profile identified
[ ] requested capability composition established
[ ] required markets/contexts established
[ ] isolation/residency policy established
[ ] IAM requirements established
[ ] TenantOnboardingRequest generated
[ ] deterministic TenantProvisioningPlan generated
[ ] dry-run contains no unresolved blocker
```

No engine-specific credentials should be introduced to Nabhold during this gate.

---

# Gate 2 — Corporate Content Capability

The original CMS gate remains, but its architecture changes.

ADR-0002 should **remain authoritative about content ownership**, but be amended/superseded regarding the direct provider integration.

Target:

```text
Public Route
    │
    ▼
CorporateContentGateway
    │
    ▼
Baobab Capability Client
    │
    ▼
CP resolve(content capability)
    │
    ▼
Content Provider
    │
    ▼
Payload
```

The estate can still have excellent typed models:

```text
CorporateContentGateway
PortfolioCompany
Sector
Insight
Navigation
Homepage
SEO
```

What disappears from the estate architecture is the assumption:

```text
Content == Payload API
```

This is precisely what the capability-centric architecture is meant to prevent.

### Gate 2 exit criteria

Among others:

```text
[ ] no React component imports provider code
[ ] no browser talks to CMS
[ ] content capability defined in Shared
[ ] CP grant exists for Nabhold estate
[ ] provider binding resolves successfully
[ ] estate uses canonical context
[ ] provider outage obeys approved failure semantics
[ ] publishing/revalidation retains canonical event contracts
[ ] estate has no CMS database access
```

---

# Gate 3 — Institutional Public Estate

This remains quite close to the original plan.

It should deliver the actual holding-company institutional experience:

```text
Home
Group
Portfolio
 ├── ZuriBeans
 ├── Thamani Global
 └── Equator & Estate Co.
Sectors / Capabilities
Insights
Governance
Contact
Careers
```

But portfolio presentation needs two data classes:

```text
Editorial representation
        │
        └── Content capability

Canonical subsidiary identity
        │
        └── Control Plane
```

The frontend must never turn a Payload portfolio document into canonical proof that a subsidiary exists.

---

# Gate 4 — Public Production Hardening

Mostly unchanged:

```text
SEO
structured metadata
accessibility
responsive design
performance
image optimisation
cache policy
content-security policy
rate controls
error handling
observability
Lighthouse budgets
```

But add one new concern:

### Capability degradation

The public site should have an explicit behaviour when CP or a capability provider is unavailable.

That should not mean:

```text
CP failed
   ↓
call Payload directly
```

That would defeat the architecture exactly when it matters most.

Approved caching/stale-content behaviour is fine.

Provider bypass is not.

---

# Gate 5 — Identity, Principal & Context Foundation

The former IAM gate needs to become an **IAM + CP boundary gate**.

The separation should be:

```text
              USER
                │
                ▼
             IAM
      Who is this actor?
                │
                ▼
        Authenticated Principal
                │
                ▼
              CP
 Where/for whom may they operate?
                │
                ▼
        Resolved Context
                │
                ▼
       Capability Resolution
```

For the executive surface, the browser must not decide:

```text
tenantId
legalEntityId
subsidiaryId
provider
engine
capability grant
```

Those values may appear in navigation requests, but they are claims to be resolved and validated—not authority.

### Exit criteria

```text
[ ] Keycloak/OIDC integration
[ ] server-side session
[ ] principal propagated correctly
[ ] CP context resolution
[ ] Digital Estate identity resolved
[ ] group/subsidiary scope resolved
[ ] capability assertions validated
[ ] fail-closed unauthorized context
[ ] session revocation tested
[ ] tenant/legal-entity spoofing tests
```

---

# Gate 6 — Executive Capability Gateway

This is where I would put the architectural spine that the current repository is missing.

Instead of accumulating:

```text
src/lib/pulse
src/integrations/payload
src/integrations/erp
src/integrations/trade
...
```

as provider-aware clients, introduce the estate-side capability boundary.

Conceptually:

```text
src/lib/baobab/
    context/
    capabilities/
    resolution/
    contracts/
    errors/
    provenance/

src/features/
    portfolio/
    finance/
    intelligence/
    governance/
```

The exact folder structure can vary, but the rule should not.

```text
Feature
   │
   ▼
Estate-owned Port
   │
   ▼
Baobab Capability Adapter
   │
   ▼
Control Plane
   │
   ▼
Resolved Provider
```

Gate 6 should therefore implement:

* typed Shared contracts;
* CP context client;
* capability resolution;
* batch resolution where appropriate;
* correlation/provenance;
* server-side BFF composition;
* capability failure model;
* canonical error mapping;
* no provider URLs in components;
* no provider-specific DTO leakage.

This gate becomes the foundation for everything that follows.

---

# Gate 7 — Group Portfolio, ERP & Pulse

The old "ERP/Pulse" gate was conceptually correct but too engine-centric.

It should become **executive portfolio composition**.

Nabhold executives need something like:

```text
                       NABHOLD EXECUTIVE EXPERIENCE
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
          Group Finance      Operations       Intelligence
                │                 │                 │
                ▼                 ▼                 ▼
      Finance capabilities   domain facts     intelligence.*
                │                                   │
                ▼                                   ▼
               ERP                                Pulse
```

And the authority boundary must remain:

```text
ERP
→ authoritative accounting and financial facts

Subsidiary domain engines
→ authoritative operational facts

Pulse
→ derived intelligence, signals, analysis, opportunities

Nabhold estate
→ composition and presentation
```

This matters enormously for the holding company.

A Pulse-generated observation such as:

```text
"ZuriBeans margins appear exposed to ..."
```

must never silently become:

```text
authoritative financial fact
```

### Group scope

This gate must also exercise the actual parent/subsidiary permission model.

For example:

```text
Executive Principal
        │
        ▼
Nabhold Group Context
        │
        ▼
Authorised Portfolio Scope
   ┌────┼───────────────┐
   ▼    ▼               ▼
 ZB   Thamani       Equator & Estate
```

Scope must derive from CP/legal relationships and explicit grants—not from a hard-coded subsidiaries array.

---

# Gate 8 — Governance, Decisions & Protected Information

The original gate remains appropriate, but again Nabhold should mainly **compose capabilities rather than become a new platform authority**.

Capabilities may include:

```text
board information
investment proposals
capital requests
approvals
risk registers
compliance information
policies
protected documents
portfolio reviews
decision records
notifications
```

The UI can own:

```text
presentation
interaction
estate-specific workflow experience
```

but should not silently invent another:

```text
identity system
approval authority
document authority
audit model
event vocabulary
financial workflow engine
```

---

# Gate 9 — Full-Estate Reconciliation & Hardening

The new CP ADRs make this gate substantially larger.

It should explicitly test:

```text
Desired state
     │
     ▼
Observed state
     │
     ▼
Drift
     │
     ▼
Reconciliation
     │
     ▼
Readiness
```

And security tests need to cover:

```text
cross-tenant access
cross-legal-entity access
subsidiary scope escalation
estate impersonation
context spoofing
stale grants
revoked grants
provider bypass
provider failover
residency violation
stale session
suspended subscription
suspended tenant
```

A particularly important test:

```text
Remove executive's access to Thamani
             │
             ▼
CP grant/context changes
             │
             ▼
Nabhold estate stops showing Thamani operational data

without:
restart
redeploy
manual frontend ACL edit
```

That is the sort of test that proves the architecture is real.

---

# Gate 10 — Controlled Activation & Go-Live

The new onboarding ADR changes the definition of "go live."

It is not:

```text
CI green
+
container deployed
+
DNS works
=
LIVE
```

It should be:

```text
DEPLOYED
    │
    ▼
Provisioned
    │
    ▼
Reconciled
    │
    ▼
Readiness Verified
    │
    ▼
Authorised Activation
    │
    ▼
ACTIVE
```

Go-live acceptance should therefore require evidence from:

```text
IAM
CP
Content capability
Financial/reporting capabilities
Pulse/intelligence capabilities
required provider bindings
observability
security
backup/recovery
audit
estate E2E tests
```

And the activation state should remain distinguishable from deployment state.

---

# The ADR suite should also be slightly adjusted

I would **not create another ADR merely called "Client Onboarding."**

BCP-017 already governs that.

The recommended Nabhold ADR suite in the earlier plan remains largely correct.  But I would sharpen three of them:

```text
ADR-0003
Nabhold Corporate Digital Estate Capability Ownership,
Platform Consumption and Authority Boundaries
```

It should explicitly say:

> Nabhold is an INTERNAL Baobab client and Digital Estate consuming capabilities through Baobab platform contracts.

Then:

```text
ADR-0005
Canonical Organisation Context,
Portfolio Scope and Group Relationship Consumption
```

should make clear that Nabhold does **not** create group/tenant/legal-entity topology.

And:

```text
ADR-0006
Executive Experience Capability Consumption
and Server-Side Composition Architecture
```

should explicitly prohibit normal direct engine integrations.

ADR-0002 should receive an amendment because its current **direct Payload REST consumption** is now inconsistent with the capability-centric Digital Estate model.

---

# Revised dependency flow

I would make the rollout dependency graph:

```text
            ┌───────────────────────────────────┐
            │ G1 Internal Platform Onboarding   │
            │ + Architecture/Context Lock       │
            └──────────────────┬────────────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌────────────────┐        ┌─────────────────┐
        │ G2 Content     │        │ G5 IAM/Context  │
        │ Capability     │        │ Foundation      │
        └───────┬────────┘        └────────┬────────┘
                │                          │
                ▼                          ▼
        ┌────────────────┐        ┌─────────────────┐
        │ G3 Public      │        │ G6 Capability   │
        │ Estate         │        │ Gateway/BFF     │
        └───────┬────────┘        └────────┬────────┘
                │                          │
                ▼                          ▼
        ┌────────────────┐        ┌─────────────────┐
        │ G4 Public      │        │ G7 Portfolio /  │
        │ Hardening      │        │ ERP / Pulse     │
        └───────┬────────┘        └────────┬────────┘
                │                          │
                │                          ▼
                │                 ┌─────────────────┐
                │                 │ G8 Governance   │
                │                 └────────┬────────┘
                │                          │
                └────────────┬─────────────┘
                             ▼
                    ┌─────────────────┐
                    │ G9 Full-Estate  │
                    │ Hardening       │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ G10 Activation  │
                    │ & Go-Live       │
                    └─────────────────┘
```

There are effectively **two parallel rollout streams after Gate 1**: the institutional/public estate and the protected executive estate. They converge at Gate 9.

That matches the original two-surface ADR much better than forcing the whole estate through one linear pipeline.

## Overall assessment

The existing rollout plan is **architecturally salvageable and still useful**, but the new CP ADRs make four corrections mandatory:

1. **Gate 1 must become an INTERNAL Baobab onboarding and platform-context gate**, not merely corporate definition.
2. **Nabhold must consume capabilities rather than engines.** The existing direct Payload and Pulse integrations should be refactored toward this model.
3. **Executive group/subsidiary scope must be resolved from authoritative CP relationships and grants**, never hard-coded in the estate.
4. **Go-live must mean CP-provisioned, reconciled, ready and ACTIVE**, not simply successfully deployed.

The result is a much cleaner definition of `baobab-platform/nabhold`: **a holding-company Digital Estate that presents and composes Baobab capabilities for public institutional communication and authorised group executive decision-making, while remaining deliberately ignorant of which underlying engine happens to provide each capability.**
