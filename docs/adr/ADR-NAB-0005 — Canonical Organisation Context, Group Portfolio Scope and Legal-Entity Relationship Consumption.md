# ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Control-Plane Authority:** `baobab-platform/baobab-cp`  
**Contract Authority:** `baobab-platform/shared`  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Accounting Authority:** `baobab-platform/baobab-erp` where legal-entity relationships have accounting consequences  
**Architecture Style:** Canonical-identity-first, explicit-context, relationship-driven, multi-tenant, multi-legal-entity, multi-market, provider-neutral, fail-closed  
**Decision Type:** Foundational organisation-context and holding-company portfolio architecture  

**Depends On:**

- ADR-NAB-0001 — One Next.js estate with separated public and executive route groups
- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- Shared ADR-0003 — Separate Tenant, Legal Entity, and Digital Estate Identity
- Shared ADR-0004 — Canonical Cross-Engine Metadata
- ADR-SHARED-007 — Canonical Capability Contracts, Composition Registry and Cross-Engine Provider Model
- Baobab Canonical Mapping Model
- ADR-BCP-002 — Capability-Centric Baobab Platform Architecture and Digital Estate Consumption Model
- ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-005 — Product, Capability Composition, Subscription, Entitlement and Digital Estate Provisioning Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- ADR-BCP-011 — Market Participation, Trade Lanes and Cross-Market Trading Model
- ADR-BCP-012 — Intercompany and Inter-Branch Trading, Legal-Entity Relationship and Internal Settlement Model
- ADR-BCP-017 — Organisation Admission, Subscription Classification and Tenant Onboarding Lifecycle Model
- Baobab IAM ADR-0005 — Realm, Organization, Tenant and Legal-Entity Model
- Baobab IAM ADR-0008 — Platform Authorization Architecture
- Baobab IAM ADR-0009 — Workforce SSO and Privileged Access

**Supersedes:**

Any interpretation within `baobab-platform/nabhold` that treats:

```text
portfolio company
subsidiary
organisation
legal entity
tenant
Digital Estate
market
country
```

as interchangeable concepts.

It also supersedes any frontend implementation that establishes canonical Nabhold Group membership through a static subsidiary array, hard-coded slug, display name, CMS content record, email domain, tenant identifier, or other presentation-layer mechanism.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL consume an **authoritatively resolved organisational and portfolio context** from Baobab rather than establishing the Nabhold Group structure locally.

The current business portfolio is conceptually:

```text
Nabhold Group Africa
        │
        ├── ZuriBeans
        ├── Thamani Global
        └── Equator & Estate Co.
```

However, this representation is a human-readable corporate view.

It SHALL NOT imply that:

```text
Group
=
Tenant
```

or:

```text
Subsidiary
=
Tenant
```

or:

```text
Subsidiary
=
Digital Estate
```

or:

```text
Subsidiary
=
Market
```

or even permanently:

```text
Subsidiary
=
one Legal Entity
```

The canonical architecture SHALL preserve explicit separation between:

```text
Canonical Entity
Organisation
Legal Entity
Tenant
Business Unit
Digital Estate
Digital Property
Market
Jurisdiction
Country
Operating Footprint
Commercial Footprint
Group Relationship
```

The governing principle is:

> **Nabhold presents the Group; Baobab resolves the organisations, legal entities, tenancy, relationships and context that make the Group operationally meaningful.**

A second governing principle is:

> **Corporate ownership, operational tenancy, legal identity, market participation and Digital Estate ownership are related facts, not interchangeable identities.**

---

# 2. Purpose

Nabhold Group Africa requires an executive Digital Estate capable of answering questions such as:

```text
Which companies currently belong to the Group?

Which legal entities represent them?

Which entities may this executive view?

Which tenant context applies?

Which Digital Estates belong to each operating company?

In which markets does each company participate?

Which capabilities may Nabhold consume for each company?

Which information may be aggregated at Group level?

Which information must remain legal-entity specific?

What happens when a company is acquired, sold, reorganised or renamed?
```

These questions cannot safely be answered from a frontend configuration file.

They require canonical organisational context.

---

# 3. Core Architectural Separation

The following SHALL remain independent:

```text
Organisation
    ≠
Legal Entity

Legal Entity
    ≠
Tenant

Tenant
    ≠
Digital Estate

Digital Estate
    ≠
Organisation

Organisation
    ≠
Market

Market
    ≠
Country

Country
    ≠
Jurisdiction

Group Membership
    ≠
Tenant Membership

Group Membership
    ≠
Executive Access

Corporate Ownership
    ≠
Operational Authority
```

These concepts MAY coincide in a particular implementation.

They SHALL NOT be assumed equivalent.

---

# 4. Canonical Identity Principle

Every organisation or legal entity crossing platform boundaries SHALL be referenced through canonical Baobab identity.

The Digital Estate SHALL NOT use as canonical identity:

```text
display name
slug
company website
email domain
Payload document ID
iDempiere AD_Org_ID
Medusa identifier
URL path
brand name
local database ID
```

The general model remains:

```text
Canonical Identity
       │
       ├── Control Plane representation
       ├── ERP representation
       ├── CMS representation
       ├── Trade representation
       └── other provider representation
```

Operational representations remain local to their domains.

Canonical identity remains stable across those representations.

---

# 5. Canonical Identity Is Not Presentation Identity

The public estate may display:

```text
ZuriBeans
Thamani Global
Equator & Estate Co.
```

with:

```text
logo
tagline
description
hero image
sector narrative
website URL
```

Those are presentation attributes.

They SHALL NOT establish canonical group membership.

The relationship SHALL conceptually be:

```text
Canonical Organisation / Legal Entity
             │
             ▼
      Canonical Reference
             │
             ▼
   Corporate Editorial Record
             │
             ▼
    Public Portfolio Card
```

not:

```text
Payload Portfolio Card
        │
        ▼
"therefore subsidiary"
```

---

# 6. Public Portfolio Versus Canonical Portfolio

The Nabhold estate SHALL distinguish:

```text
PUBLIC PORTFOLIO
```

from:

```text
CANONICAL GROUP PORTFOLIO
```

The public portfolio answers:

> What companies does Nabhold publicly present as part of its portfolio?

The canonical Group portfolio answers:

> Which organisations/legal entities are authoritatively related to Nabhold under currently valid governed relationships?

They are related but distinct.

---

# 7. Public Portfolio Authority

Editorial information such as:

```text
company description
brand story
sector narrative
featured products
images
public website links
public achievements
```

belongs to the corporate content capability.

The CMS MAY reference canonical organisation/legal-entity identifiers.

It SHALL NOT become authoritative for:

```text
ownership percentage
legal relationship
tenant identity
active internal subscription
executive access
legal incorporation
platform entitlement
```

unless another accepted architecture explicitly assigns an editorial representation of such authoritative facts.

---

# 8. Canonical Group Relationship

Group membership SHALL be derived from governed relationships.

Conceptually:

```text
Organisation / Legal Entity
          │
          ▼
Canonical Relationship
          │
          ├── relationship_type
          ├── effective_from
          ├── effective_to
          ├── status
          ├── source
          └── provenance
```

Relevant relationship types MAY include canonical values such as:

```text
PARENT_SUBSIDIARY
SISTER_SUBSIDIARY
AFFILIATE
JOINT_VENTURE
BRANCH_OF
OPERATING_UNIT_OF
```

Exact vocabulary remains governed by Shared/Control Plane contracts.

Nabhold SHALL NOT create a competing relationship taxonomy.

---

# 9. Current Group Structure

The Digital Estate presently needs to represent:

```text
Nabhold Group Africa
        │
        ├── ZuriBeans
        ├── Thamani Global
        └── Equator & Estate Co.
```

The runtime SHALL treat these relationships as authoritative only where the canonical platform confirms them.

The frontend MAY assume this structure for:

```text
design mocks
storyboards
development fixtures
visual prototypes
```

provided such fixtures are clearly non-authoritative.

Production group membership SHALL come from canonical context.

---

# 10. Holding Company Is Not a Synthetic Wildcard Tenant

The architecture SHALL NOT invent:

```text
tenant = NABHOLD-GROUP-ALL
```

merely to allow executives to see multiple companies.

Likewise, it SHALL NOT use:

```text
tenant = *
```

or:

```text
legal_entity = *
```

as an ordinary application shortcut.

Group visibility SHALL be based upon:

```text
authenticated principal
+
authorised group relationship
+
explicit portfolio scope
+
required capability grants
```

---

# 11. Tenant Topology Remains Independent

This ADR SHALL NOT require that all Nabhold Group entities share one tenant.

Nor SHALL it require that every subsidiary possess a separate tenant.

The platform MAY legitimately resolve:

```text
one tenant
→ one legal entity
```

or:

```text
one tenant
→ several authorised legal entities
```

or:

```text
one legal entity
→ more than one tenant boundary
```

where the accepted Baobab architecture permits it.

The Digital Estate SHALL work with the resolved topology.

---

# 12. Default Tenant Boundary

Where the platform applies the established default:

```text
Legal Entity
      │
      ▼
Default Tenant Boundary
```

that relationship SHALL remain a default operational rule rather than identity equality.

The invariant remains:

```text
tenant_id != legal_entity_id
```

even where the two have a one-to-one operational mapping.

---

# 13. Tenant Identifiers

Tenant identifiers SHALL remain opaque platform identifiers.

The Digital Estate SHALL NOT infer company identity from:

```text
tn_zuribeans
tn_thamani
tn_equator
```

or any other name-like convention.

The platform SHOULD use canonical tenant IDs such as:

```text
tn_<opaque-id>
```

according to Control Plane rules.

Organisation/legal-entity resolution determines the associated business identity.

---

# 14. Legal Entity

A Legal Entity represents an organisation recognised under applicable law.

Legal-entity facts may include:

```text
legal name
registration number
jurisdiction
tax identity
incorporation state
registered address
effective dates
```

The Nabhold Digital Estate SHALL consume these facts from their authoritative domain.

It SHALL NOT infer legal identity from brand identity.

---

# 15. Brand Is Not Legal Entity

A brand MAY correspond to:

```text
one legal entity
multiple legal entities
one business unit
one product family
one Digital Estate
```

depending on the business.

Therefore:

```text
ZuriBeans brand
```

SHALL NOT by itself establish:

```text
one and only one LegalEntity
```

for all time.

The same rule applies to:

```text
Thamani Global
Equator & Estate Co.
```

---

# 16. Organisation

Organisation SHALL represent the applicable canonical business organisation concept defined by Baobab contracts.

This ADR SHALL NOT redefine the platform-wide canonical Organisation aggregate.

The Nabhold estate SHALL consume whatever accepted Shared/CP contract governs organisation identity.

It SHALL NOT invent an estate-local canonical `Organisation` merely because the executive UI requires an organisational tree.

---

# 17. Organisation Is Not IAM Organisation

This invariant SHALL remain:

```text
Business Organisation
        !=
Keycloak Organisation
```

An IAM organisation is an identity-side affiliation.

It may map to a business organisation.

It SHALL NOT establish legal ownership or corporate structure.

---

# 18. Organisation Is Not Legal Entity

A business organisation MAY correspond to a legal entity.

It may also represent an operational or business grouping broader or narrower than one legal entity.

Therefore:

```text
Organisation
    !=
Legal Entity
```

unless the canonical platform explicitly maps them in a particular context.

---

# 19. Digital Estate

A Digital Estate represents an independently deployed stakeholder-facing application or experience.

Examples include:

```text
Nabhold corporate estate
ZuriBeans estate
Thamani estate
future Equator & Estate estate
```

A Digital Estate SHALL NOT itself establish corporate ownership.

The existence of:

```text
baobab-platform/zuribeans
```

does not prove a parent-subsidiary relationship.

Repository ownership is not corporate authority.

---

# 20. Digital Estate Context

The Nabhold estate SHALL identify itself through its canonical Digital Estate identity when resolving capabilities.

The context SHALL conceptually include:

```text
principal
tenant
legal entity
organisation
digital estate
capability
```

plus other applicable dimensions.

The estate SHALL NOT impersonate a subsidiary Digital Estate merely to consume subsidiary information.

Cross-portfolio visibility must be explicitly authorised.

---

# 21. Market Independence

Portfolio membership SHALL NOT imply market participation.

For example:

```text
ZuriBeans
```

being a Nabhold subsidiary does not itself establish:

```text
Uganda market
South Africa market
```

Those relationships belong to MarketParticipation and contextual platform models.

Likewise:

```text
company operates in South Africa
```

does not necessarily mean:

```text
company incorporated in South Africa
```

---

# 22. Country Is Not Market

The estate SHALL preserve:

```text
Market
    !=
Country
```

A market may:

```text
span a country
span several countries
represent a commercial configuration within one country
```

depending upon accepted platform semantics.

Country-based UI filters SHALL therefore not substitute for Market context.

---

# 23. Jurisdiction Is Not Market

Likewise:

```text
Jurisdiction
    !=
Market
```

A legal entity may:

```text
be incorporated in jurisdiction A
operate in market B
sell into market C
host infrastructure in region D
```

No dimension SHALL be inferred solely from another.

---

# 24. Group Portfolio Scope

The Nabhold executive estate requires an estate-level read model conceptually called:

```text
ResolvedPortfolioScope
```

This SHALL be a **derived estate view**, not a new canonical source of organisation truth.

Conceptually:

```text
ResolvedPortfolioScope
├── scope_id
├── principal_id
├── root_organisation_reference
├── root_legal_entity_reference?
├── digital_estate_id
├── members[]
├── resolved_at
├── expires_at
├── correlation_id
└── provenance
```

Each member MAY conceptually contain:

```text
PortfolioMember
├── canonical_entity_id
├── organisation_id?
├── legal_entity_ids[]
├── tenant_ids[]
├── relationship_type
├── relationship_status
├── relationship_validity
├── permitted_capabilities[]
├── permitted_contexts[]
└── provenance
```

Exact canonical DTOs SHALL be defined in Shared/CP where cross-repository contracts are required.

---

# 25. Portfolio Scope Is Derived

`ResolvedPortfolioScope` SHALL answer:

> Which Group members and related contexts may this principal currently use through the Nabhold Digital Estate?

It SHALL NOT become:

```text
master company registry
ownership register
legal entity registry
tenant registry
identity store
```

The read model may be discarded and recomputed.

Canonical relationships remain authoritative.

---

# 26. Principal-Specific Scope

Portfolio scope SHALL be principal-specific for protected experiences.

Two executives MAY legitimately resolve different scopes.

Example:

```text
Executive A
├── ZuriBeans
├── Thamani
└── Equator & Estate

Executive B
├── ZuriBeans
└── Thamani
```

The difference SHALL arise from authoritative access/context policy.

It SHALL NOT require different frontend builds.

---

# 27. Public Portfolio Scope Is Different

Anonymous public portfolio presentation need not use the same access semantics as executive scope.

Conceptually:

```text
Public Portfolio
      │
      ▼
published corporate content
      +
authoritative canonical references
```

while:

```text
Executive Portfolio
      │
      ▼
authenticated principal
      +
resolved group relationships
      +
authorised context
      +
capability entitlement
```

The two views MAY overlap.

They SHALL not be conflated.

---

# 28. Requested Portfolio Context

The browser MAY request:

```text
company = ZuriBeans
```

or a canonical reference corresponding to it.

This is contextual intent only.

The server SHALL resolve:

```text
Requested Member
      │
      ▼
Canonical Entity
      │
      ▼
Group Relationship Valid?
      │
      ▼
Principal Authorised?
      │
      ▼
Tenant / Legal Entity Context Valid?
      │
      ▼
Capability Granted?
```

Only then may the context be used.

---

# 29. Resolved Portfolio Context

A successful portfolio-member selection SHALL produce a resolved context.

Conceptually:

```text
ResolvedPortfolioContext
├── principal
├── root_group
├── member_organisation
├── legal_entity
├── tenant
├── digital_estate
├── requested capability
├── market?
├── environment
├── isolation profile
├── context_id
├── valid_until
└── provenance
```

Not every operation requires every dimension.

Every relevant dimension SHALL be explicit.

---

# 30. Context Request Versus Context Result

The following SHALL remain distinct:

```text
ContextRequest
```

and:

```text
PlatformContext
```

A frontend parameter such as:

```text
?company=zuribeans
```

is a request.

It is not authoritative context.

---

# 31. Portfolio Navigation

The executive navigation MAY render portfolio companies from the resolved scope.

Conceptually:

```text
ResolvedPortfolioScope
        │
        ▼
Portfolio Navigation
        │
        ├── ZuriBeans
        ├── Thamani
        └── Equator & Estate
```

If a member is removed from the principal's authorised scope, the navigation SHALL reflect that change without code modification.

---

# 32. Hidden Navigation Is Not Authorisation

Removing a company from navigation SHALL NOT be the security control.

A manually constructed request for the removed context SHALL still fail server-side.

Therefore:

```text
not visible
```

and:

```text
not authorised
```

are related but separate concerns.

---

# 33. Cross-Tenant Portfolio Access

Where portfolio members reside in separate tenants, Nabhold MAY compose authorised views across them.

The pattern SHALL be:

```text
Nabhold Executive
      │
      ▼
Resolved Portfolio Scope
      │
      ├── Tenant A / Entity A
      ├── Tenant B / Entity B
      └── Tenant C / Entity C
      │
      ▼
Independent capability resolutions
      │
      ▼
Server-side portfolio composition
```

No cross-tenant visibility SHALL arise solely from the companies sharing the same parent.

---

# 34. Same-Tenant Multi-Entity Access

Where multiple Group legal entities reside within one tenant, the legal-entity boundary SHALL remain explicit.

The estate SHALL NOT reduce:

```text
tenant authorised
```

to:

```text
all legal entities authorised
```

Each applicable legal-entity context SHALL still be resolved.

---

# 35. Group Context Is Not a Substitute for Member Context

A Group-level executive view MAY exist.

It SHALL not erase the source member contexts.

For example:

```text
Group Revenue
```

may derive from:

```text
Entity A
+
Entity B
+
Entity C
```

The result SHALL preserve provenance sufficient to determine the contributing legal entities and authoritative source.

---

# 36. Group-Level Capability

Where Baobab defines an explicit canonical group-level capability such as a future:

```text
finance.group-summary.read
```

the estate MAY consume it directly.

The domain provider must define what that capability means.

The estate SHALL NOT simulate a platform-level aggregate merely by inventing a capability name locally.

---

# 37. Estate-Side Composition

Where no canonical group aggregate capability exists, the Nabhold server MAY compose results from separately authorised member contexts.

Example:

```text
ZuriBeans summary ────────┐
                          │
Thamani summary ──────────┼──► Nabhold Group View
                          │
Equator summary ──────────┘
```

Such composition SHALL remain:

```text
derived
presentation-oriented
provenance-preserving
non-authoritative
```

unless a domain contract explicitly states otherwise.

---

# 38. No Authoritative Shadow Group Database

The estate SHALL NOT create a database that silently becomes the master record for:

```text
subsidiaries
legal entities
tenants
ownership
group structure
markets
```

A cache or read model MAY exist for performance.

Its authority SHALL remain derivative.

---

# 39. Portfolio Read Model

A portfolio read model MAY store:

```text
canonical references
display projections
resolved relationship metadata
last resolved timestamp
provenance
cache expiry
```

It SHALL NOT establish new canonical identities.

It SHALL be rebuildable from authoritative platform sources.

---

# 40. Legal-Entity Relationships

The estate SHALL consume legal-entity relationships through accepted platform contracts.

Relevant relationships may include:

```text
PARENT_SUBSIDIARY
SISTER_SUBSIDIARY
BRANCH_OF
OPERATING_UNIT_OF
AFFILIATE
JOINT_VENTURE
EXTERNAL
```

The estate SHALL interpret these values according to their canonical semantics.

It SHALL NOT assign accounting treatment merely from the UI label.

---

# 41. Parent-Subsidiary Relationship

A valid:

```text
PARENT_SUBSIDIARY
```

relationship MAY support:

```text
group portfolio inclusion
internal subscription eligibility
executive scope evaluation
group reporting relationships
```

subject to applicable policy.

It SHALL NOT automatically provide:

```text
cross-tenant capability grants
write authority
ERP administrative authority
payment authority
unrestricted data access
```

---

# 42. Sister-Subsidiary Relationship

A sister-subsidiary relationship MAY establish corporate relationship.

It SHALL NOT automatically establish access between those entities.

For example:

```text
ZuriBeans
    │
 common parent
    │
Thamani
```

does not mean:

```text
ZuriBeans user
      │
      ▼
Thamani data
```

Cross-entity access remains explicitly authorised.

---

# 43. Branch Relationships

A branch MAY belong to a legal entity without itself being another legal entity.

Therefore:

```text
Branch
   !=
Legal Entity
```

The estate SHALL not display every operational branch as a subsidiary merely because it has a separate location or ERP organisation.

---

# 44. ERP Organisation Is Not Legal Entity

An iDempiere `AD_Org` or equivalent ERP construct SHALL remain an ERP-domain representation.

It SHALL not automatically become:

```text
Nabhold subsidiary
LegalEntity
Tenant
Canonical Organisation
```

Mappings SHALL be explicit.

---

# 45. Ownership Changes

Group relationships SHALL be temporal.

The platform SHALL support:

```text
effective_from
effective_to
status
```

or equivalent canonical semantics.

If a subsidiary is divested:

```text
ACTIVE GROUP MEMBER
        │
        ▼
relationship change
        │
        ▼
portfolio scope reconciliation
        │
        ├── remove future group visibility
        ├── review INTERNAL eligibility
        ├── adjust capability grants
        └── preserve history
```

Historical reporting SHALL remain possible according to applicable authority and retention policy.

---

# 46. Acquisition

A newly acquired company SHALL not become operationally visible merely because CMS content was published.

The intended lifecycle is:

```text
Acquisition / relationship approved
             │
             ▼
Canonical organisation/legal identity
             │
             ▼
Canonical group relationship
             │
             ▼
Tenant/onboarding state as required
             │
             ▼
Capability entitlements
             │
             ▼
Executive portfolio scope
             │
             ▼
Public editorial publication
```

The exact order may vary operationally.

Canonical group relationship SHALL not depend on publication.

---

# 47. Divestiture

Divestiture SHALL support removing future Group authority without destroying historical identity.

The system SHALL prefer:

```text
relationship retirement
```

over:

```text
identity deletion
```

where historical transactions and reports require attribution.

---

# 48. Renaming and Rebranding

Changing:

```text
legal name
brand name
trading name
website
logo
```

SHALL NOT require creation of a new canonical identity unless the underlying business/legal event genuinely creates a new entity.

The Digital Estate SHALL separate identity from presentation.

---

# 49. Mergers and Restructuring

The estate SHALL not attempt to solve mergers through frontend renaming.

Where:

```text
Entity A
+
Entity B
→
Entity C
```

canonical entity and relationship transitions SHALL be represented through Baobab authorities.

The frontend shall consume the resulting structure.

Historical data SHALL continue to reference the identities under which transactions occurred.

---

# 50. Internal Subscription Eligibility

The Nabhold Digital Estate SHALL NOT determine whether a company qualifies for:

```text
subscription_type = INTERNAL
```

That classification belongs to the Control Plane's governed onboarding/subscription process.

A valid group relationship may provide eligibility evidence.

It SHALL not be interpreted locally as the subscription itself.

---

# 51. Internal Does Not Mean Same Tenant

Two Nabhold Group entities MAY both hold:

```text
subscription_type = INTERNAL
```

while remaining separate tenant boundaries.

Therefore:

```text
INTERNAL
    !=
same tenant
```

and:

```text
same parent
    !=
shared data boundary
```

---

# 52. Market Participation

The portfolio view MAY display where an operating company participates.

That information SHALL be obtained from canonical market-participation context.

Example:

```text
ZuriBeans
├── Uganda
└── South Africa
```

in a UI does not mean those country labels themselves are authoritative `Market` identifiers.

The presentation layer SHALL map canonical market references to appropriate display information.

---

# 53. Market Selector

A company selector and a market selector represent separate contextual dimensions.

Conceptually:

```text
Select Company
      │
      ▼
Resolved Organisation / Legal Entity
      │
      ▼
Select Market
      │
      ▼
Validate Market Participation
      │
      ▼
Resolved Operational Context
```

The estate SHALL NOT infer the market merely from the selected company.

---

# 54. Currency Independence

Selecting:

```text
South Africa
```

SHALL NOT necessarily imply:

```text
currency = ZAR
```

for every operation.

Currency may be:

```text
accounting currency
transaction currency
reporting currency
pricing currency
presentation currency
```

and SHALL be resolved according to the relevant domain contract.

---

# 55. Portfolio Aggregation Currency

Group reporting across entities operating in different currencies SHALL NOT be performed by naïvely adding local-currency values.

Financial aggregation and currency translation SHALL remain governed by the financial/reporting domain.

ADR-NAB-0007 SHALL define that boundary in detail.

---

# 56. Group Structure and Accounting Structure

The corporate structure presented by Nabhold SHALL not automatically define:

```text
ERP consolidation hierarchy
accounting elimination hierarchy
tax group
transfer-pricing relationship
```

These may correlate.

They remain domain-specific governed structures.

---

# 57. Organisational Hierarchy Versus Access Hierarchy

Corporate ownership hierarchy SHALL NOT automatically become the access-control hierarchy.

Example:

```text
Nabhold
   │
   └── Subsidiary
```

does not mean:

```text
all Nabhold employees
       │
       ▼
all subsidiary information
```

The access hierarchy depends upon principal-specific authority established by ADR-NAB-0004 and CP/domain policy.

---

# 58. Executive Portfolio Context

The normal executive flow SHALL be:

```text
Executive
    │
    ▼
Baobab IAM
    │
    ▼
Canonical Principal
    │
    ▼
Nabhold Digital Estate
    │
    ▼
Resolve Group / Portfolio Scope
    │
    ▼
Authorised Portfolio Members
    │
    ▼
Select / Compose Context
    │
    ▼
Resolve Capability
    │
    ▼
Invoke Authorised Provider
```

---

# 59. No Context Escalation Through Query Parameters

This is prohibited:

```text
/dashboard?company=unknown-company
```

resulting in:

```text
trust unknown-company
```

or:

```text
/dashboard?tenant=tn_other
```

resulting in:

```text
access tn_other
```

All such inputs SHALL be validated against resolved scope.

---

# 60. Canonical References in URLs

URLs MAY contain stable canonical references or public slugs.

For public content:

```text
/portfolio/zuribeans
```

is acceptable as a presentation route.

The slug SHALL resolve to an underlying canonical reference where protected or operational identity is required.

A slug SHALL NOT itself become platform authority.

---

# 61. Public Slug Changes

Changing a public slug SHALL not change canonical organisation identity.

Redirects MAY preserve SEO and navigation continuity.

Canonical mapping remains unaffected.

---

# 62. Provider Identifiers

Provider-native identifiers SHALL stay behind provider boundaries.

Nabhold SHALL NOT persist as canonical identity:

```text
Payload document IDs
iDempiere Client IDs
iDempiere Org IDs
Medusa IDs
Keycloak Organization IDs
Pulse-internal IDs
```

Such identifiers MAY appear in controlled mapping infrastructure.

They SHALL not become presentation-layer business identity.

---

# 63. Canonical Mapping

Where Nabhold must associate external representations, it SHALL rely on canonical mapping.

Conceptually:

```text
CanonicalEntity
      │
      ├── ExternalReference → Payload
      ├── ExternalReference → iDempiere
      ├── ExternalReference → Medusa
      └── ExternalReference → other provider
```

No equality SHALL be inferred merely because attributes happen to match.

---

# 64. Display Names

Display names SHALL never be used as mapping keys.

For example:

```text
"ZuriBeans"
```

MAY be changed or localised.

Canonical identifiers and explicit mappings SHALL remain stable.

---

# 65. Historical Resolution

The architecture SHALL preserve enough historical relationship information to answer questions such as:

```text
Was this company a Group member at reporting date X?

Which legal entity owned this transaction?

Which tenant context applied?

Which organisation relationship existed when this decision was made?
```

Current organisational structure SHALL not overwrite historical truth.

---

# 66. Effective-Dated Executive Reporting

Executive reports spanning historical periods SHOULD resolve applicable organisational structure according to report semantics.

For example:

```text
Current Portfolio View
```

may use current relationships.

Whereas:

```text
FY2025 historical consolidated report
```

may require the organisational/accounting structure applicable to FY2025.

The relevant reporting domain SHALL determine the correct interpretation.

---

# 67. Portfolio Scope Caching

Resolved portfolio scope MAY be cached.

Caching SHALL be:

```text
bounded
principal-sensitive
context-sensitive
revocation-aware
expiry-aware
```

The estate SHALL NOT cache portfolio membership indefinitely.

A revoked group relationship or access grant must be capable of invalidating or outliving the cache only according to approved policy.

---

# 68. Public Portfolio Caching

Public portfolio editorial content MAY use longer-lived caching than executive organisational scope.

The estate SHALL distinguish:

```text
public content cache
```

from:

```text
authoritative context cache
```

Invalidation semantics differ.

---

# 69. Failure Semantics

Where canonical portfolio scope cannot be established for a protected operation:

```text
DENY / UNAVAILABLE
```

is preferred over:

```text
assume previous group structure
```

unless an explicitly approved bounded cached context remains valid.

The estate SHALL fail closed for security-critical ambiguity.

---

# 70. Partial Portfolio Degradation

If one subsidiary capability provider is unavailable, the Group dashboard MAY present:

```text
ZuriBeans       AVAILABLE
Thamani         TEMPORARILY UNAVAILABLE
Equator         AVAILABLE
```

where permitted.

Failure of one member SHALL not necessarily prevent presentation of all independently authorised members.

The UI SHALL clearly distinguish unavailable data from zero-valued data.

---

# 71. Missing Data Is Not Zero

The estate SHALL not represent:

```text
provider unavailable
```

as:

```text
revenue = 0
```

or:

```text
no risk
```

or:

```text
no activity
```

Missing, unavailable, stale and zero are different states.

---

# 72. Provenance

Every protected group-composed result SHOULD preserve enough provenance to determine:

```text
canonical member
legal entity
tenant
capability
provider/domain
resolution time
data timestamp
correlation ID
authoritative versus derived status
```

This becomes particularly important when combining subsidiaries.

---

# 73. Group-Level Data Provenance

A Group result such as:

```text
Portfolio Revenue
```

SHOULD allow the platform to explain:

```text
Nabhold Group Revenue
        │
        ├── ZuriBeans contribution
        ├── Thamani contribution
        └── Equator contribution
```

subject to finance-domain definitions.

The UI does not need to display all provenance continuously.

The system should retain enough information to audit it.

---

# 74. Audit

Protected context selection and sensitive portfolio access SHOULD be correlatable.

Audit SHOULD be capable of answering:

```text
Who accessed which company?

Through which Nabhold session?

Under which tenant/legal-entity context?

Which capability was used?

Was access allowed or denied?

Which relationship justified the scope?

When?
```

Nabhold application logs SHALL not substitute for canonical audit.

---

# 75. Events

Changes to canonical relationships MAY produce platform events.

The Nabhold estate MAY consume such events to:

```text
invalidate portfolio scope
refresh navigation
invalidate group read models
refresh public references where appropriate
```

It SHALL consume event contracts from Shared.

It SHALL NOT invent a competing canonical event model.

---

# 76. Relationship Change Event Behaviour

Conceptually:

```text
Canonical Relationship Changed
            │
            ▼
      Platform Event
            │
            ▼
      Nabhold Consumer
            │
      ┌─────┴─────┐
      ▼           ▼
 invalidate    reconcile
   cache        view model
```

The event triggers presentation reconciliation.

It does not transfer relationship authority to Nabhold.

---

# 77. Portfolio Capability Boundary

The Nabhold estate MAY own an estate-level port such as:

```text
PortfolioGateway
```

Conceptually:

```text
interface PortfolioGateway {
    resolvePortfolioScope(principal): ResolvedPortfolioScope
    getPortfolioMember(context): PortfolioMemberView
}
```

This represents Nabhold experience requirements.

It SHALL ultimately consume Baobab canonical context/capability contracts.

---

# 78. Portfolio Gateway Is Not a Registry

The `PortfolioGateway` SHALL NOT expose mutation operations such as:

```text
createCanonicalSubsidiary()
changeLegalOwnership()
createTenant()
changeCanonicalLegalEntity()
```

unless a future accepted platform capability explicitly exposes a governed workflow and the Nabhold estate is authorised to invoke it.

Ordinary portfolio presentation remains read/composition oriented.

---

# 79. Public CMS Integration

A CMS portfolio record SHOULD carry canonical references where applicable.

Example conceptual record:

```text
PortfolioCompanyContent
├── canonicalEntityId
├── organisationId?
├── slug
├── publicName
├── summary
├── description
├── logo
├── hero
└── publicLinks
```

The CMS SHOULD not duplicate authoritative:

```text
tenant ID
ownership status
executive entitlement
legal relationship status
```

unless represented explicitly as synchronised non-authoritative projections.

---

# 80. Source Authority Matrix

| Concern | Authority | Nabhold Estate Role |
|---|---|---|
| Group presentation | Nabhold/content capability | Presents |
| Canonical organisation identity | Shared/CP governed model | Consumes |
| Legal-entity identity | Shared/CP governed model | Consumes |
| Tenant identity | Control Plane | Consumes |
| Group relationships | Canonical relationship authority / CP | Consumes |
| Executive scope | IAM + CP + capability policy | Consumes |
| Digital Estate identity | Control Plane | Consumes |
| Market participation | Control Plane | Consumes |
| Public company narrative | Content capability | Presents |
| ERP organisational representation | ERP | Does not redefine |
| Accounting consolidation | ERP/finance domain | Presents |
| Capability entitlement | Control Plane | Consumes |
| Provider binding | Control Plane | Consumes resolution |
| Portfolio composition UI | Nabhold | Owns |
| Portfolio presentation model | Nabhold | Owns as derived view |

---

# 81. Explicitly Prohibited Patterns

The following SHALL NOT establish production authority:

```typescript
const subsidiaries = [
  "zuribeans",
  "thamani",
  "equator-estate"
];
```

```typescript
if (companySlug === "zuribeans") {
  tenantId = "tn_zuribeans";
}
```

```typescript
if (user.email.endsWith("@nabhold.example")) {
  return allSubsidiaries;
}
```

```typescript
if (cmsRecord.parent === "Nabhold") {
  grantExecutiveAccess();
}
```

```typescript
if (country === "Uganda") {
  market = "uganda";
}
```

Such structures MAY exist as non-authoritative presentation fixtures.

They SHALL NOT determine canonical context or protected access.

---

# 82. Acquisition-Safe Architecture

The Digital Estate SHALL be capable of adding a future subsidiary without requiring architectural redesign.

Conceptually:

```text
Canonical Relationship Added
          │
          ▼
Tenant / Platform Provisioning
          │
          ▼
Capabilities Granted
          │
          ▼
Portfolio Scope Resolves New Member
          │
          ▼
Nabhold UI Presents New Member
```

A new subsidiary should not require:

```text
new authorisation architecture
new hard-coded tenant logic
new IAM realm
new provider-specific frontend
```

merely because the company joined the Group.

---

# 83. Divestiture-Safe Architecture

Likewise, removing a company from the Group SHALL not require deleting source code.

Conceptually:

```text
Relationship Ends
      │
      ▼
Scope Recalculated
      │
      ▼
Future Access Removed
      │
      ▼
Historical References Preserved
```

This is a major reason corporate structure SHALL be canonical data rather than source-code configuration.

---

# 84. Future Group Complexity

The architecture SHALL support future structures such as:

```text
Nabhold Group Africa
│
├── Subsidiary A
│   ├── Operating Entity A1
│   └── Operating Entity A2
│
├── Subsidiary B
│
├── Joint Venture C
│
└── Affiliate D
```

without assuming every node has identical:

```text
ownership
tenant structure
legal status
market participation
access policy
capability entitlement
```

---

# 85. No Tree-Only Assumption

Corporate and operational relationships MAY form a graph rather than a perfect tree.

For example, an entity may have:

```text
ownership relationship
management relationship
service relationship
joint venture relationship
shared capability relationship
```

with different organisations.

The UI MAY render a tree for usability.

The canonical model SHALL not be reduced to the UI tree.

---

# 86. Portfolio Relationship Semantics

The estate SHALL distinguish relationship semantics.

For example:

```text
SUBSIDIARY
```

is not equivalent to:

```text
AFFILIATE
```

and:

```text
JOINT_VENTURE
```

is not equivalent to:

```text
WHOLLY_OWNED_SUBSIDIARY
```

where such distinctions exist in canonical contracts.

The Digital Estate SHALL not flatten materially different relationships merely for convenience.

---

# 87. Ownership Percentage

If ownership percentage becomes necessary for investment or governance presentation, its source authority SHALL be explicitly defined.

Nabhold SHALL NOT derive ownership percentage from:

```text
relationship label
frontend configuration
CMS text
```

Such data may have legal, accounting and governance consequences.

---

# 88. Context Immutability Per Operation

Once resolved for an operation, `PlatformContext` SHALL be treated as immutable for that operation.

A request SHALL NOT begin in:

```text
ZuriBeans context
```

and silently mutate into:

```text
Thamani context
```

mid-operation.

A new context resolution SHALL occur where the principal changes scope.

---

# 89. Context Provenance

Resolved context SHOULD preserve:

```text
how identity was resolved
which relationships were used
which requested hints were accepted
which capability was requested
which policy produced the result
when the resolution occurred
when it expires
```

The Nabhold estate SHALL retain or propagate relevant provenance according to CP contracts.

---

# 90. Context-Sensitive Capability Resolution

Capability resolution SHALL follow the resolved member context.

For example:

```text
finance.statement.read
```

for ZuriBeans and:

```text
finance.statement.read
```

for Thamani MAY resolve to:

```text
different grants
different engine instances
different isolation profiles
different provider topology
```

while exposing the same canonical capability to the estate.

That provider difference SHALL not leak into the UI.

---

# 91. Same Capability, Different Provider

The architecture SHALL permit:

```text
ZuriBeans
   │
   ▼
finance capability
   │
   ▼
Provider A
```

and:

```text
Future Subsidiary
   │
   ▼
finance capability
   │
   ▼
Provider B
```

without requiring separate Nabhold feature architectures.

This is consistent with the capability-centric platform model.

---

# 92. Same Company, Different Context

The same organisation MAY participate in different contexts.

For example:

```text
ZuriBeans
├── Uganda
│   └── Capability Context A
└── South Africa
    └── Capability Context B
```

The organisation reference alone may therefore be insufficient for an operational capability request.

The Digital Estate SHALL request enough context for deterministic resolution.

---

# 93. Context Resolution API Boundary

The estate SHALL consume a stable context-resolution boundary.

Conceptually:

```text
ContextRequest
      │
      ▼
Baobab CP
      │
      ▼
Resolved PlatformContext
```

Nabhold SHALL not recreate CP resolution logic locally.

---

# 94. Estate Context Library

The Nabhold repository MAY provide estate-specific abstractions such as:

```text
src/lib/baobab/context/
    resolve-portfolio-scope
    resolve-member-context
    require-member-context
    context-errors
    context-provenance
```

Exact physical structure is an implementation matter.

The logic SHALL delegate canonical resolution to Baobab.

---

# 95. Domain Feature Isolation

Feature code SHOULD consume resolved context rather than raw selector values.

Preferred:

```text
FinancialDashboard(
    resolvedPortfolioContext
)
```

rather than:

```text
FinancialDashboard(
    companySlug,
    tenantIdFromQueryString,
    marketFromCookie
)
```

This reduces accidental authority leakage.

---

# 96. Context Switch

Changing portfolio member SHALL conceptually produce:

```text
Current Context
      │
      ▼
User Selects Another Member
      │
      ▼
New ContextRequest
      │
      ▼
CP Resolution
      │
   ┌──┴──┐
   ▼     ▼
ALLOW   DENY
   │
   ▼
New Resolved Context
```

A context switch is a security-relevant operation.

It is not merely a cosmetic frontend state change.

---

# 97. Deep Links

Protected executive deep links SHALL undergo the same context validation as normal navigation.

A bookmarked URL such as:

```text
/executive/portfolio/zuribeans/finance
```

SHALL not bypass context resolution merely because the route exists.

---

# 98. Search

Executive search across Group companies SHALL respect authorised portfolio scope.

Search SHALL NOT reveal:

```text
company names
documents
financial information
intelligence
resource metadata
```

outside the principal's resolved authority merely because the underlying search provider contains them.

---

# 99. Notifications

Portfolio-related notifications SHALL carry sufficient canonical context to route the user safely.

A notification referencing a subsidiary SHALL not guarantee the recipient still has authority when it is opened.

Access SHALL be re-evaluated where appropriate.

---

# 100. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Nabhold does not maintain a canonical hard-coded subsidiary registry.

[ ] Canonical organisation and legal-entity references come from
    approved Baobab contracts.

[ ] Tenant, legal entity, organisation, Digital Estate and market remain
    separately represented.

[ ] Tenant identifiers are not derived from company names.

[ ] Group membership is based on authoritative canonical relationships.

[ ] Public portfolio records reference canonical identity without becoming
    its authority.

[ ] The CMS cannot grant group membership or executive access.

[ ] A ResolvedPortfolioScope or equivalent derived view can be produced
    for an authenticated executive.

[ ] Portfolio scope is principal-specific where required.

[ ] Browser-supplied company/tenant/legal-entity parameters are treated
    as requested context only.

[ ] Protected context is validated through Control Plane resolution.

[ ] Cross-tenant portfolio visibility requires explicit authority.

[ ] Same-tenant access still retains explicit legal-entity scope.

[ ] Group-level views preserve member provenance.

[ ] Group presentation does not create accounting consolidation rules.

[ ] Company selection and market selection remain independent dimensions.

[ ] Market does not equal country or jurisdiction.

[ ] ERP organisation IDs do not become canonical legal-entity identity.

[ ] Payload document IDs do not become canonical organisation identity.

[ ] Keycloak Organisation IDs do not become canonical business identity.

[ ] Canonical mappings are explicit.

[ ] Display names and slugs are not identity keys.

[ ] Historical group relationships can be retained.

[ ] Acquisitions can add portfolio members without changing the
    authorisation architecture.

[ ] Divestitures can remove current portfolio access without deleting
    historical identity.

[ ] A company rename does not require a new canonical identity.

[ ] Portfolio-scope caches are bounded and revocation-aware.

[ ] Relationship/context failure fails closed for protected operations.

[ ] One unavailable subsidiary is distinguishable from zero-valued data.

[ ] Portfolio composition retains canonical provenance.

[ ] Deep links undergo normal context resolution.

[ ] Search respects authorised portfolio scope.

[ ] Context switching triggers authoritative re-resolution.

[ ] Capability resolution uses the resolved member context.

[ ] Provider differences remain invisible to estate features.

[ ] No production path uses tenant = *, legal_entity = *,
    or equivalent wildcard shortcuts for executive convenience.
```

---

# 101. Required Tests

The rollout SHALL include tests covering:

```text
authorised subsidiary selection
unauthorised subsidiary selection
cross-tenant context spoofing
cross-legal-entity context spoofing
invalid relationship
expired relationship
revoked relationship
company renamed
public slug changed
subsidiary added
subsidiary divested
same tenant / multiple legal entities
different tenants / common parent
multiple markets for one company
invalid market participation
deep-link context bypass attempt
search leakage across portfolio scope
stale cached portfolio scope
relationship revocation while session remains active
one provider unavailable
group composition with partial failure
historical relationship resolution
```

---

# 102. Gate Impact

This ADR principally governs:

```text
Gate 1
Platform Consumption & Internal Onboarding Foundation

Gate 3
Institutional Public Estate

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
```

Gate 1 SHALL establish the canonical organisational references required by later implementation.

Gate 5 SHALL establish principal-specific context resolution.

Gate 6 SHALL establish the server-side context/capability composition boundary.

Gate 7 SHALL consume the resolved portfolio scope for executive reporting.

---

# 103. Consequences

## Positive

This decision provides:

```text
acquisition-safe portfolio architecture
divestiture-safe access
clear tenant/legal-entity separation
canonical organisation identity
explicit group relationships
secure cross-subsidiary visibility
multi-market correctness
provider neutrality
auditable portfolio composition
historical organisational context
reduced frontend hard-coding
```

It allows Nabhold to evolve from:

```text
3 subsidiaries
```

to:

```text
many subsidiaries
joint ventures
affiliates
multiple legal entities
multiple tenants
multiple markets
```

without rewriting the core estate architecture.

## Costs

The architecture requires:

```text
context resolution
relationship contracts
canonical mappings
portfolio-scope resolution
more explicit identifiers
revocation-aware caching
cross-context testing
historical relationship management
```

These costs are accepted because organisational structure is too consequential to be encoded casually in frontend source code.

---

# 104. Architectural Invariants

The following SHALL remain binding:

```text
Group
    !=
Tenant

Group
    !=
Legal Entity

Organisation
    !=
Legal Entity

Legal Entity
    !=
Tenant

Tenant
    !=
Digital Estate

Digital Estate
    !=
Market

Market
    !=
Country

Country
    !=
Jurisdiction

Brand
    !=
Legal Entity

ERP Organisation
    !=
Canonical Organisation

IAM Organisation
    !=
Canonical Organisation

CMS Portfolio Record
    !=
Canonical Organisation

Public Portfolio
    !=
Authorised Executive Portfolio Scope

Group Relationship
    !=
Access Grant

Executive Access
    !=
Universal Subsidiary Authority

Current Group Structure
    !=
Historical Group Structure
```

---

# 105. Relationship to ADR-NAB-0003

ADR-NAB-0003 establishes that Nabhold does not own canonical organisation truth.

This ADR specifies how that principle applies to the Group portfolio.

Therefore:

```text
Baobab
→ canonical identity
→ relationships
→ tenant/legal-entity context
→ market participation

Nabhold
→ portfolio experience
→ context selection
→ composition
→ presentation
```

---

# 106. Relationship to ADR-NAB-0004

ADR-NAB-0004 establishes:

```text
login != authority
```

This ADR extends that rule to organisational scope:

```text
executive identity
    !=
all Group entities
```

The principal's effective portfolio is resolved from:

```text
identity
+
relationships
+
context
+
capability entitlement
```

---

# 107. Relationship to ADR-NAB-0006

ADR-NAB-0006 SHALL define how the executive estate uses the context established here to consume multiple Baobab capabilities through a server-side composition architecture.

The dependency shall be:

```text
ADR-NAB-0004
Identity / Authorisation
       │
       ▼
ADR-NAB-0005
Organisation / Portfolio Context
       │
       ▼
ADR-NAB-0006
Capability Consumption / Composition
```

---

# 108. Follow-On Decision

The next ADR SHALL be:

**ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture**

It SHALL establish:

```text
Estate BFF boundary
capability-resolution client
estate-owned ports
provider invocation
batch capability resolution
context propagation
view-model composition
error/degradation semantics
provider-neutral integration
caching boundaries
correlation and provenance
```

without allowing `nabhold` to become an integration hub.

---

# 109. Final Decision

The Nabhold Group portfolio SHALL be represented in the Digital Estate as a **resolved view over authoritative Baobab organisational, legal-entity, tenant and relationship context**.

The enduring architecture is:

```text
                    NABHOLD GROUP AFRICA
                     Corporate Identity
                            │
                            ▼
                Canonical Group Relationships
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      ZuriBeans         Thamani         Equator & Estate
          │                 │                 │
          ▼                 ▼                 ▼
   Canonical Entity   Canonical Entity   Canonical Entity
          │                 │                 │
     ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
     ▼         ▼       ▼         ▼       ▼         ▼
 Legal      Tenant   Legal     Tenant   Legal     Tenant
 Entity    Context   Entity   Context   Entity   Context
     │                 │                 │
     └─────────────────┼─────────────────┘
                       │
                       ▼
            RESOLVED PORTFOLIO SCOPE
                       │
                       ▼
             NABHOLD DIGITAL ESTATE
                       │
                       ▼
             Executive Composition
```

The exact number of legal entities and tenants beneath each portfolio member is deliberately not fixed by the diagram.

The enduring rule is:

> **Nabhold may present a simple corporate portfolio to people while preserving a rigorous, explicit and independently governed organisational model underneath it. The UI may simplify the picture; it may never simplify away the authority boundaries.**