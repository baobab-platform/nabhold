# ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Platform Context and Entitlement Authority:** `baobab-platform/baobab-cp`  
**Contract Authority:** `baobab-platform/shared`  
**Domain Authorisation Authorities:** Applicable Baobab capability providers and domain engines  
**Architecture Style:** Federated identity, OIDC/OAuth, BFF-oriented, zero-trust, context-resolved, least-privilege, deny-by-default, fail-closed, multi-tenant, multi-legal-entity  
**Decision Type:** Foundational Digital Estate identity, authentication and executive authorisation architecture  

**Depends On:**

- ADR-NAB-0001 — One Next.js estate with separated public and executive route groups
- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- Baobab IAM ADR-0001 — Baobab Identity and Access Management Architecture
- Baobab IAM ADR-0002 — Keycloak as the Baobab Identity Provider
- Baobab IAM ADR-0003 — Identity Authority and Trust Boundaries
- Baobab IAM ADR-0004 — Canonical Identity and External Identity Mapping
- Baobab IAM ADR-0005 — Realm, Organization, Tenant and Legal-Entity Model
- Baobab IAM ADR-0006 — OIDC, OAuth and Token Profile
- Baobab IAM ADR-0007 — Workload Identity and Service-to-Service Authentication
- Baobab IAM ADR-0008 — Platform Authorization Architecture
- Baobab IAM ADR-0009 — Workforce SSO and Privileged Access
- Baobab IAM ADR-0015 — Credential Security, MFA, Passkeys and Account Recovery
- Baobab IAM ADR-0016 — Identity Lifecycle, Revocation and Deprovisioning
- Baobab IAM ADR-0017 — IAM Audit, Security Events and Observability
- Baobab IAM ADR-0018 — IAM Availability, Backup, Recovery and Disaster Resilience
- ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- ADR-BCP-017 — Organisation Admission, Subscription Classification and Tenant Onboarding Lifecycle Model

**Supersedes:**

Any interpretation of the existing `src/lib/auth` abstraction, local session handling, route protection or frontend role checks that allows `baobab-platform/nabhold` to become an independent identity or business-authorisation authority.

This ADR does not supersede Baobab IAM or Control Plane decisions. It defines how the Nabhold Digital Estate consumes them.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL use **Baobab IAM as the sole platform authority for human authentication** and SHALL use the **Baobab Control Plane as the authority for tenant, legal-entity, Digital Estate, portfolio-context and capability entitlement resolution**.

Authentication and authorisation SHALL remain separate.

The authoritative chain SHALL be:

```text
Human
  │
  ▼
Baobab IAM
  │
  │ authentication
  ▼
Authenticated Principal
  │
  ▼
Canonical Identity Resolution
  │
  ▼
Baobab Control Plane
  │
  │ tenant / legal entity /
  │ Digital Estate / capability context
  ▼
Authorised Platform Context
  │
  ▼
Capability Provider / Domain Engine
  │
  │ domain authorisation
  ▼
Business Operation
```

The governing rule is:

> **IAM determines who authenticated. The Control Plane determines the Baobab context and capability entitlement in which that identity may operate. Domain authorities determine whether the specific business operation is permitted. Nabhold presents the resulting authorised experience.**

A successful login SHALL NOT mean:

```text
all subsidiaries visible
all tenants accessible
all financial information accessible
all capabilities available
all domain operations permitted
executive = superuser
```

---

# 2. Purpose

The Nabhold Digital Estate has two fundamentally different security surfaces:

```text
NABHOLD DIGITAL ESTATE
│
├── PUBLIC INSTITUTIONAL EXPERIENCE
│   └── predominantly anonymous
│
└── EXECUTIVE DECISION EXPERIENCE
    └── authenticated + context-authorised
```

The public estate primarily exposes institutional information.

The executive estate may expose information concerning:

```text
Nabhold Group Africa
ZuriBeans
Thamani Global
Equator & Estate Co.
future group companies
group finance
portfolio performance
intelligence
risk
capital allocation
governance
protected corporate documents
```

Such access can cross:

```text
tenant boundaries
legal-entity boundaries
Digital Estate boundaries
domain boundaries
data-sensitivity boundaries
```

Authentication alone is therefore insufficient.

This ADR defines how identity, authentication, sessions, executive access, context switching, privileged operations, MFA, step-up authentication, revocation and security audit SHALL operate in the Nabhold Digital Estate.

---

# 3. Identity Authority

Baobab IAM SHALL remain authoritative for:

```text
human authentication
credentials
passwords
passkeys
WebAuthn
MFA
TOTP
authentication sessions
OIDC
OAuth
federation
authentication assurance
credential recovery
credential revocation
identity-provider integration
```

The Nabhold Digital Estate SHALL NOT:

```text
store passwords
verify passwords
store password hashes
issue authentication credentials
implement independent MFA
become an identity provider
become a password-reset authority
create competing user credentials
```

Credentials SHALL remain within Baobab IAM.

---

# 4. Identity Is Not Authorisation

The following invariants SHALL hold:

```text
Authenticated
    !=
Authorised
```

```text
Valid OIDC token
    !=
Valid Nabhold executive access
```

```text
Nabhold workforce member
    !=
Executive user
```

```text
Executive user
    !=
All-subsidiary access
```

```text
Subsidiary visibility
    !=
Operational authority
```

```text
MFA success
    !=
Business permission
```

```text
Keycloak role
    !=
ERP posting authority
```

No application layer SHALL infer more authority than the authoritative evidence proves.

---

# 5. Canonical Identity

The authentication-provider subject SHALL not be treated as the canonical Baobab identity.

The correct relationship is:

```text
OIDC issuer
   +
OIDC subject
   │
   ▼
ExternalIdentity
   │
   ▼
CanonicalIdentity
```

Therefore:

```text
iss + sub
```

identifies the external authentication identity.

`sub` SHALL NOT be interpreted as:

```text
CanonicalIdentity ID
employee ID
tenant ID
legal-entity ID
organisation ID
customer ID
executive ID
```

The Nabhold estate SHALL consume canonical identity mapping rather than create its own mapping based on email address or username.

---

# 6. Email Is Not Identity Authority

The following is prohibited:

```text
email ends with @nabhold...
        │
        ▼
grant executive access
```

Likewise:

```text
email == known executive email
        │
        ▼
grant group access
```

is prohibited.

Email may be an identity attribute.

It SHALL NOT independently establish:

```text
workforce membership
executive status
tenant access
subsidiary access
privileged authority
INTERNAL subscription eligibility
```

---

# 7. Federated Identity

Baobab IAM MAY federate authentication through approved external identity providers.

Examples may include:

```text
enterprise identity provider
corporate directory
future Microsoft / Google enterprise federation
approved partner identity provider
```

The Nabhold estate SHALL NOT trust such external identity providers directly.

The trust path SHALL remain:

```text
External Identity Provider
          │
          ▼
      Baobab IAM
          │
          ▼
      OIDC assertion
          │
          ▼
        Nabhold
```

Nabhold SHALL trust only approved Baobab IAM issuers.

---

# 8. Workforce Single Sign-On

Nabhold executives and authorised workforce SHALL participate in Baobab workforce SSO.

The model is:

```text
Workforce User
      │
      ▼
  Baobab IAM
      │
      ▼
Canonical Identity
      │
      ▼
Control Plane Context
      │
      ▼
Nabhold Executive Estate
```

One workforce identity MAY support access to multiple authorised Baobab systems.

However:

> **One workforce identity does not mean one universal workforce privilege.**

SSO reduces credential duplication.

It SHALL NOT collapse application authorisation.

---

# 9. Dedicated Nabhold OIDC Client

The Nabhold protected estate SHALL use a dedicated IAM client registration.

Conceptually:

```text
nabhold-executive
```

The exact canonical client identifier SHALL be governed by IAM configuration.

The Nabhold application SHALL NOT reuse generic privileged clients such as:

```text
baobab-admin
global-admin
shared-platform-admin
```

A dedicated client provides:

```text
separate audience
separate redirect URIs
separate scopes
separate session policy
separate revocation
separate audit
reduced blast radius
```

---

# 10. Authentication Protocol

Human authentication SHALL use the OIDC/OAuth profile established by Baobab IAM.

The preferred interactive architecture SHALL use:

```text
Authorization Code
      +
PKCE
      +
OIDC
```

Where the estate operates as a confidential server-mediated application, PKCE SHOULD still be used where supported.

The Nabhold repository SHALL NOT invent an alternative login protocol.

---

# 11. BFF-Oriented Executive Architecture

The protected executive estate SHALL use a **Backend-for-Frontend-oriented security model**.

Target flow:

```text
Browser
   │
   │ Secure HttpOnly session
   ▼
Nabhold Server / BFF
   │
   │ OIDC / OAuth
   ▼
Baobab IAM
   │
   ▼
Access / session state
   │
   ▼
Baobab CP + authorised capabilities
```

Sensitive token material SHOULD remain server-side.

The browser SHALL receive only the minimum information required to render the experience.

---

# 12. Browser Token Storage

The target architecture SHALL NOT persist sensitive bearer tokens in:

```text
localStorage
sessionStorage
IndexedDB
ordinary JavaScript-readable cookies
```

where a server-side session architecture can avoid doing so.

The browser SHALL not receive:

```text
client secrets
refresh tokens intended for confidential clients
provider credentials
engine credentials
service credentials
```

---

# 13. Session Cookies

Where Nabhold uses a server-side/BFF session, cookies SHALL use appropriate protections including:

```text
Secure
HttpOnly
appropriate SameSite policy
bounded lifetime
CSRF protection
```

Production cookies SHALL only traverse authenticated encrypted connections.

Cookie policy SHALL be compatible with the approved OIDC redirect flow.

---

# 14. Refresh Tokens

Refresh tokens, where required, SHALL remain confined to the IAM/client interaction.

They SHALL:

```text
remain server-side where possible
never be exposed to ordinary resource APIs
be revocable
receive stronger storage protection
not be logged
```

The Nabhold browser SHALL not require direct possession of a refresh token under the target BFF architecture.

---

# 15. ID Tokens Versus Access Tokens

The following distinction SHALL be preserved:

```text
ID Token
→ authentication assertion for the client

Access Token
→ credential for protected API access
```

An ID Token SHALL NOT be used as a generic API bearer credential.

The estate SHALL validate tokens according to Baobab IAM policy.

---

# 16. Token Validation

Protected server boundaries SHALL validate applicable properties including:

```text
issuer
signature
audience
expiry
authorized client
required scopes
authentication state
```

A request SHALL fail closed where security-critical token validation cannot be established.

The request SHALL NOT select its own trusted issuer.

---

# 17. Redirect URI Security

Production authentication SHALL use explicitly registered redirect URIs.

The estate SHALL NOT expose unrestricted:

```text
redirect_uri
return_to
next
callback
```

behaviour.

For example:

```text
/login/callback?next=https://attacker.example
```

SHALL NOT produce an external redirect unless explicitly authorised by a narrowly defined policy.

---

# 18. Public Surface

The public institutional estate SHALL ordinarily remain anonymous.

Public access SHALL NOT require creating unnecessary user sessions.

Authentication SHOULD only be introduced into public routes where an actual business requirement exists.

Examples such as:

```text
Home
Group
Portfolio
Sectors
Public Insights
Careers
Contact
```

SHOULD remain publicly accessible according to content policy.

---

# 19. Executive Surface

The executive route group SHALL be protected.

Conceptually:

```text
Request Executive Route
          │
          ▼
Server Session Exists?
     ┌────┴────┐
     │         │
    NO        YES
     │         │
     ▼         ▼
    IAM    Validate Identity
               │
               ▼
          Resolve Context
               │
               ▼
          Authorised Estate?
          ┌────┴────┐
         NO        YES
          │         │
          ▼         ▼
        DENY      RENDER
```

Client-side hiding of links SHALL NOT be considered route protection.

---

# 20. Three-Layer Authorisation

The executive estate SHALL use the Baobab layered authorisation model.

```text
┌────────────────────────────────────┐
│ Layer 1 — IAM                      │
│                                    │
│ identity                           │
│ session                            │
│ assurance                          │
│ coarse OAuth scopes                │
└──────────────────┬─────────────────┘
                   ▼
┌────────────────────────────────────┐
│ Layer 2 — Control Plane            │
│                                    │
│ tenant                             │
│ legal entity                       │
│ Digital Estate                     │
│ organisation                       │
│ capability                         │
│ context                            │
│ entitlement                        │
└──────────────────┬─────────────────┘
                   ▼
┌────────────────────────────────────┐
│ Layer 3 — Domain Authority         │
│                                    │
│ resource permission                │
│ workflow rule                      │
│ financial authority                │
│ operational rule                   │
└──────────────────┬─────────────────┘
                   ▼
              BUSINESS ACTION
```

All required layers SHALL allow the operation.

---

# 21. Deny Precedence

An authoritative denial at any layer SHALL stop the operation.

```text
IAM ALLOW
+
CP DENY
=
DENY
```

```text
IAM ALLOW
+
CP ALLOW
+
DOMAIN DENY
=
DENY
```

Nabhold SHALL NOT override an upstream or downstream authoritative denial.

---

# 22. Nabhold Executive Access

Executive access SHALL be explicitly authorised.

The platform SHALL NOT implement:

```text
executive = superuser
```

An executive MAY be authorised for:

```text
portfolio dashboards
group financial reporting
subsidiary reporting
strategic intelligence
risk visibility
governance information
capital-allocation information
```

without being authorised for:

```text
journal posting
payment release
supplier approval
customer refunds
IAM administration
Control Plane administration
CMS publication
infrastructure administration
```

Visibility and operational authority are distinct.

---

# 23. Executive Read Authority Versus Write Authority

The Digital Estate SHALL distinguish:

```text
READ / OBSERVE
```

from:

```text
DECIDE / APPROVE / MUTATE
```

Cross-group executive visibility SHALL NOT automatically provide write access to subsidiary domain systems.

For example:

```text
Executive can view:
Thamani sales performance
```

does not imply:

```text
Executive can modify:
Thamani order
```

and:

```text
Executive can view:
ZuriBeans accounts
```

does not imply:

```text
Executive can post:
ZuriBeans journal
```

---

# 24. Cross-Subsidiary Access

Cross-subsidiary access SHALL require explicit authoritative context.

Conceptually:

```text
Executive
    │
    ▼
Select ZuriBeans
    │
    ▼
Server receives requested context
    │
    ▼
Control Plane validates
    │
    ├── authorised ───► use ZuriBeans context
    │
    └── denied ───────► DENY
```

The same applies to:

```text
Thamani Global
Equator & Estate Co.
future subsidiaries
```

The company selector is an interface control.

It is not an authorisation mechanism.

---

# 25. No Wildcard Executive Authority

Ordinary executive application paths SHOULD NOT use unscoped:

```text
tenant = *
legal_entity = *
all_companies = true
```

authority merely for convenience.

Where a canonical group-level capability exists, it MAY return appropriately authorised group aggregates.

Otherwise, Nabhold SHALL operate over explicitly resolved contexts.

---

# 26. Group-Level Views

A group dashboard MAY compose information across multiple authorised contexts.

Conceptually:

```text
Executive
    │
    ▼
Authorised Portfolio Scope
    │
    ├── Nabhold
    ├── ZuriBeans
    ├── Thamani
    └── Equator & Estate
    │
    ▼
Server-side Composition
    │
    ▼
Group View
```

The group view SHALL NOT imply that a single unbounded superuser query occurred.

Each source SHALL remain traceable to its authorised context.

---

# 27. Context Selection Is Request Intent

Values received from UI controls such as:

```text
tenant
company
subsidiary
legal entity
market
portfolio company
```

SHALL be treated as **requested context**, not authoritative context.

The server SHALL resolve and validate the request.

This pattern is prohibited:

```text
GET /dashboard?tenant=thamani

therefore

tenant = thamani
```

The correct pattern is:

```text
requested tenant = thamani
        │
        ▼
CP resolution
        │
        ├── authorised
        └── denied
```

---

# 28. Capability Entitlement

Successful executive login SHALL NOT independently create capability access.

The chain remains:

```text
Authenticated Identity
        │
        ▼
Authorised Context
        │
        ▼
Capability Grant
        │
        ▼
Capability Resolution
        │
        ▼
Provider
        │
        ▼
Domain Authorisation
```

Examples:

```text
finance.statement.read
intelligence.executive-overview.read
governance.decision.read
```

shall only be consumable where the applicable capability grant exists.

Canonical capability names remain governed by Shared.

---

# 29. Domain Authorisation

Nabhold SHALL NOT reproduce domain authorisation rules in frontend code.

Examples:

```text
ERP
→ journal posting authority
→ payment approval
→ period close
→ accounting roles
```

```text
CMS
→ editorial publish authority
```

```text
Trade
→ order/refund/commercial authority
```

```text
Pulse
→ restricted intelligence/report authority
```

The estate MAY suppress unavailable controls as a user-experience measure.

That suppression SHALL NOT substitute for authoritative enforcement.

---

# 30. UI Authorisation Is Not Security Enforcement

This is prohibited as the sole control:

```typescript
if (user.role === "executive") {
  showFinancialData()
}
```

Likewise:

```typescript
if (user.isAdmin) {
  allowEverything()
}
```

UI state MAY reflect an authoritative decision.

It SHALL NOT manufacture the decision.

---

# 31. IAM Roles

IAM roles and scopes SHALL remain coarse.

Baobab SHALL avoid representing every Nabhold business permission as a Keycloak role.

Examples of concepts that SHOULD NOT be reduced directly to IAM roles include:

```text
may view ZuriBeans margin analysis
may approve capital request R-104
may release Thamani payment
may access specific board paper
may post an iDempiere journal
```

These depend upon CP and/or domain policy.

---

# 32. Authentication Assurance

The Nabhold executive estate contains sensitive corporate information.

Interactive executive access SHALL therefore require stronger authentication than ordinary anonymous/public access.

At minimum:

```text
protected executive access
→ MFA or equivalent strong multi-factor/passkey assurance
```

Phishing-resistant authentication SHOULD be preferred.

Suitable mechanisms include:

```text
passkeys
WebAuthn
hardware security keys
TOTP where stronger methods are unavailable
```

---

# 33. Passkey-First Direction

The executive estate SHOULD support the broader Baobab passkey-first trajectory.

Preferred direction:

```text
Passkey / WebAuthn
      │
      ├── preferred
      │
Password + MFA
      │
      └── transitional/fallback
```

The Nabhold repository SHALL NOT implement passkey cryptography itself.

Authentication remains an IAM responsibility.

---

# 34. MFA Does Not Grant Business Authority

The following remains binding:

```text
successful MFA
      !=
permission to perform operation
```

MFA establishes stronger identity assurance.

After MFA:

```text
CP authorisation
+
domain authorisation
```

remain mandatory.

---

# 35. Step-Up Authentication

The executive estate SHALL support IAM-driven step-up authentication for sufficiently sensitive actions.

Potential examples include:

```text
grant high-risk access
approve major capital allocation
approve exceptional financial action
open exceptionally restricted board material
change governance authority
invoke privileged administration
alter security-sensitive configuration
```

The exact business rule remains owned by the applicable platform/domain authority.

---

# 36. Step-Up Flow

```text
Existing Session
      │
      ▼
Sensitive Action Requested
      │
      ▼
Required Assurance Met?
   ┌──┴───┐
  YES     NO
   │       │
   │       ▼
   │   Baobab IAM
   │    Step-Up
   │       │
   └───┬───┘
       ▼
CP / Domain Authorisation
       │
   ┌───┴───┐
   ▼       ▼
 ALLOW    DENY
```

Applications SHALL use IAM assurance information such as approved:

```text
acr
amr
auth_time
```

where defined by the IAM contract.

Nabhold SHALL NOT invent incompatible MFA claims.

---

# 37. Local Password Re-Prompt Is Prohibited

The Nabhold estate SHOULD NOT implement:

```text
Enter your password again
```

as a locally verified security mechanism.

Where recent or stronger authentication is required, the estate SHALL invoke IAM-controlled step-up or reauthentication.

Credential verification belongs to IAM.

---

# 38. Privileged Sessions

Sessions involving privileged operations SHOULD use stricter security policy than ordinary read-only workforce sessions.

Policy MAY include:

```text
shorter idle lifetime
shorter absolute lifetime
stronger MFA
recent-authentication requirements
limited refresh persistence
step-up
```

Exact durations SHALL remain centrally governed rather than being independently invented by Nabhold UI code.

---

# 39. Privilege Segregation

The following authority domains SHALL remain separate:

```text
Nabhold executive visibility
IAM administration
Control Plane administration
ERP administration
finance authority
Trade administration
CMS administration
security administration
infrastructure administration
```

For example:

```text
Nabhold Group CEO
```

does not automatically mean:

```text
Keycloak realm administrator
```

and:

```text
CFO
```

does not automatically mean:

```text
iDempiere system administrator
```

Business position and technical privilege are distinct concepts.

---

# 40. Least Privilege

Every Nabhold executive, employee, contractor and administrator SHALL receive only the access required for approved responsibilities.

Default workforce onboarding SHALL NOT grant broad executive or administrative access.

This pattern is prohibited:

```text
Nabhold employee
      │
      ▼
all portfolio access
```

The correct pattern is:

```text
Canonical Identity
      │
      ▼
approved relationships
      │
      ▼
approved contexts
      │
      ▼
approved capabilities
```

---

# 41. Workforce Membership

Workforce status SHALL be modelled as a relationship to a Canonical Identity.

Conceptually:

```text
CanonicalIdentity
      │
      ├── WorkforceMembership
      │       │
      │       ├── organisation
      │       ├── legal entity
      │       └── lifecycle
      │
      ├── other valid relationships
      └── identity history
```

A person's identity SHALL not be duplicated merely because they become a Nabhold employee or executive.

---

# 42. Executive Status Is a Relationship

Executive status SHALL likewise not redefine the human identity.

Conceptually:

```text
CanonicalIdentity
      │
      ▼
Workforce Relationship
      │
      ▼
Approved Executive Access
      │
      ▼
Authorised Context / Capabilities
```

Changing executive responsibilities SHALL therefore trigger access reevaluation rather than identity recreation.

---

# 43. Joiner Lifecycle

Executive/workforce onboarding SHALL be explicit.

```text
Appointment / access requirement approved
               │
               ▼
Canonical Identity resolved
               │
               ▼
Workforce relationship established
               │
               ▼
IAM access provisioned
               │
               ▼
Required strong authenticator enrolled
               │
               ▼
Context memberships established
               │
               ▼
Capabilities granted
               │
               ▼
Domain access provisioned where needed
```

Identity provisioning alone SHALL NOT grant executive authority.

---

# 44. Mover Lifecycle

A change of position or responsibility SHALL trigger access reevaluation.

```text
Existing Access
     │
     ▼
Role / responsibility change
     │
     ▼
Identify obsolete authority
     │
     ▼
Revoke obsolete authority
     │
     ▼
Approve required new authority
     │
     ▼
Grant new authority
```

Privileges SHALL not simply accumulate through successive organisational moves.

---

# 45. Leaver Lifecycle

When a workforce relationship ends:

```text
Leaver Confirmed
      │
      ▼
Workforce authority revoked
      │
      ▼
Active sessions revoked
      │
      ▼
CP memberships / entitlements revoked
      │
      ▼
Domain roles revoked
      │
      ▼
Engine access disabled where appropriate
      │
      ▼
Historical identity retained
```

Deleting the identity is not the normal revocation strategy.

Audit history SHALL remain attributable.

---

# 46. Rehire

A previously verified Canonical Identity SHOULD normally be reused where appropriate.

Rehire SHALL NOT automatically restore old permissions.

```text
rehire
   !=
restore previous access graph
```

Access SHALL be freshly approved.

---

# 47. Revocation Granularity

Nabhold SHALL honour granular revocation.

For example:

```text
Thamani portfolio access revoked
```

SHALL NOT necessarily revoke:

```text
ZuriBeans access
```

Likewise:

```text
financial capability revoked
```

SHALL NOT necessarily revoke:

```text
intelligence capability
```

unless policy explicitly requires it.

---

# 48. Current Authorisation Over Stale Tokens

A self-contained access token may remain cryptographically valid until expiry.

That SHALL NOT force sensitive operations to continue accepting revoked authority.

Protected executive actions SHALL combine:

```text
short-lived authentication evidence
+
current CP authorisation
+
current domain authorisation
```

as required by the capability.

Token validity and current authority are separate concerns.

---

# 49. Session Revocation

The architecture SHALL support revocation at appropriate levels, including where supported:

```text
current session
selected sessions
all user sessions
credential
workforce membership
tenant membership
capability entitlement
Digital Estate access
domain role
identity
```

The narrowest effective revocation SHOULD be preferred unless security risk requires broader action.

---

# 50. Access Removal Must Take Effect Without Redeployment

The following SHALL be an architectural requirement:

```text
Executive loses Thamani access
          │
          ▼
Authoritative relationship/grant revoked
          │
          ▼
future Thamani context resolution denied
```

without requiring:

```text
frontend code change
application rebuild
deployment
hard-coded ACL edit
```

This is a key proof that access authority does not live in the Digital Estate.

---

# 51. Portfolio Navigation After Revocation

Where navigation previously displayed:

```text
Nabhold
ZuriBeans
Thamani
Equator & Estate
```

and Thamani access is revoked, subsequent authorised navigation SHOULD reflect the new scope.

However, hiding the navigation item is merely presentation.

The server SHALL continue to reject manually constructed Thamani requests.

---

# 52. Access Review

Sensitive executive and privileged access SHOULD be periodically reviewable.

The review SHOULD be capable of answering:

```text
Who has access?
To which estate?
To which legal entities?
To which subsidiaries?
To which capabilities?
Under which relationship?
Since when?
Until when?
Who approved it?
```

Time-bound contractor or exceptional access SHOULD support explicit expiry where applicable.

---

# 53. Self-Grant Prohibition

Users SHALL NOT normally be able to grant themselves stronger executive, platform or domain authority.

This applies especially to:

```text
IAM administration
CP administration
ERP finance administration
security administration
production access
high-risk group governance
```

Access-request and access-approval responsibilities SHOULD be separated where risk warrants it.

---

# 54. Separation of Duties

The Digital Estate SHALL preserve domain separation-of-duties decisions.

For example:

```text
request
    !=
approve
```

```text
prepare capital proposal
    !=
final capital approval
```

```text
create payment proposal
    !=
release payment
```

Where such rules belong to ERP or another domain authority, Nabhold SHALL consume their outcome rather than duplicate them.

---

# 55. Break-Glass Access

The ordinary Nabhold executive estate SHALL NOT itself implement a hidden bypass account.

Emergency administrative recovery remains governed by Baobab IAM and the platform break-glass architecture.

If break-glass access affects Nabhold, it SHALL be:

```text
strongly protected
rarely used
monitored
audited
time-limited where practical
reviewed after use
```

Break-glass SHALL NOT create a permanent executive superuser path.

---

# 56. Impersonation

User impersonation SHALL be disabled or unavailable to Nabhold application users unless an explicit platform decision permits a defined support/security use case.

If later supported, impersonation SHALL require:

```text
explicit privilege
strong assurance
clear user-visible indication
audit event
original actor identity
impersonated identity
reason
start time
end time
```

It SHALL never erase the identity of the real operator.

---

# 57. Public and Executive Sessions Shall Remain Distinct

Anonymous public usage SHALL not automatically create or extend executive authentication sessions.

The route groups have different security characteristics.

Conceptually:

```text
(public)
→ anonymous/cacheable

(dashboard)
→ authenticated/dynamic/context-aware
```

Caching behaviour SHALL respect this boundary.

---

# 58. Protected Response Caching

Protected executive responses SHALL NOT be cached as public content.

Any private caching SHALL be carefully scoped according to:

```text
principal
tenant
legal entity
Digital Estate
capability
data classification
```

where applicable.

No cache entry SHALL cause one executive to receive another principal's protected context.

---

# 59. Authentication Failure

Where authentication is absent or invalid:

```text
protected executive route
        │
        ▼
authentication required
```

The application MAY redirect to IAM or return the appropriate unauthenticated response.

It SHALL NOT silently provide protected fallback data.

---

# 60. Authorisation Failure

Where authentication succeeds but access does not:

```text
authenticated
+
unauthorised
=
DENY
```

The estate SHOULD distinguish:

```text
not authenticated
```

from:

```text
authenticated but not authorised
```

without disclosing unnecessary sensitive information about inaccessible tenants, companies or resources.

---

# 61. IAM Failure

If Baobab IAM cannot establish a new authenticated session:

```text
new protected login
=
UNAVAILABLE / DENIED
```

The application SHALL NOT introduce an emergency local password system.

Existing sessions MAY continue only according to their normal cryptographic validity, session state and security policy.

---

# 62. Control Plane Failure

If authoritative executive context or capability entitlement cannot be established, protected operations SHALL fail closed.

This is prohibited:

```text
CP unavailable
      │
      ▼
trust tenant from browser
```

and:

```text
CP unavailable
      │
      ▼
assume executive can access everything
```

Explicitly approved bounded cached resolution MAY be used only according to the Control Plane's caching and revocation semantics.

---

# 63. Domain Failure

If a domain authority rejects a business operation, Nabhold SHALL propagate an appropriate denial.

The Digital Estate SHALL not reinterpret:

```text
ERP DENY
```

as:

```text
executive therefore ALLOW
```

Executive status does not override the system of record.

---

# 64. Workload Identity

The Nabhold server may require machine authentication for service-owned operations.

Such operations SHALL use Baobab IAM workload identity according to the approved service-to-service profile.

Conceptually:

```text
Nabhold Server
      │
      ▼
Workload Authentication
      │
      ▼
Baobab IAM
      │
      ▼
Short-Lived Workload Token
      │
      ▼
Control Plane / Capability Provider
```

Workload identity SHALL not be inferred from:

```text
source IP
hostname
client_id in request JSON
internal network location
```

---

# 65. Human Context Must Not Disappear Behind Workload Identity

Where the server acts because a human initiated a protected operation, the architecture SHALL preserve human attribution as required by platform contracts.

This anti-pattern is prohibited:

```text
Executive
    │
    ▼
Nabhold server
    │
    ▼
generic service credential
    │
    ▼
business action

Audit result:
"nabhold-service did it"
```

when the business action must be attributable to the actual human.

Delegation or actor-context propagation SHALL follow approved Baobab contracts.

---

# 66. Service Credentials

Service credentials SHALL:

```text
remain server-side
be minimally scoped
be rotatable
not be logged
not be exposed to React client code
not be committed to source control
```

Production secrets SHALL be supplied through approved deployment secret-management infrastructure.

---

# 67. CSRF

State-changing BFF/session operations SHALL include appropriate CSRF protection.

The existence of an authenticated session cookie SHALL not make arbitrary cross-site requests trustworthy.

The exact mechanism SHALL align with the chosen session architecture.

---

# 68. XSS

The executive estate SHALL treat XSS as a security-critical threat because malicious script executing in the application origin can act with the user's session capabilities.

The application SHALL therefore apply appropriate:

```text
output encoding
safe rendering
content security policy
dependency hygiene
secure cookie design
minimal browser token exposure
```

controls.

---

# 69. Account Recovery

Nabhold SHALL not create a parallel account-recovery mechanism.

Recovery SHALL be performed through Baobab IAM.

Recovery SHALL restore authentication capability only.

It SHALL NOT automatically restore:

```text
revoked workforce membership
revoked portfolio access
expired executive authority
revoked capability entitlement
domain privileges
```

Recovery is not an authorisation bypass.

---

# 70. Authentication Audit

Security-sensitive authentication events SHALL remain attributable through IAM audit.

Examples include:

```text
login success
login failure
MFA challenge
passkey enrollment
credential reset
session revocation
account suspension
step-up authentication
```

Nabhold MAY observe or correlate these events where required.

It SHALL NOT claim authority over IAM audit history.

---

# 71. Authorisation Audit

Protected executive requests SHOULD preserve sufficient evidence to reconstruct:

```text
who acted
which Canonical Identity
which Digital Estate
which tenant
which legal entity
which subsidiary/context
which capability
which domain
which authorisation decision
which correlation ID
when
what result
```

The Nabhold application log SHALL not substitute for CP or domain audit.

---

# 72. Correlation

The estate SHALL propagate approved correlation metadata such as:

```text
trace_id
request_id
correlation_id
decision_id
```

where available.

Cross-system investigation SHOULD be capable of tracing:

```text
Browser
  │
  ▼
Nabhold
  │
  ▼
IAM
  │
  ▼
Control Plane
  │
  ▼
Capability Provider
```

without exposing credentials or bearer tokens to logs.

---

# 73. Logging Prohibitions

The following SHALL NOT be logged:

```text
passwords
refresh tokens
access tokens
client secrets
recovery codes
WebAuthn private material
TOTP secrets
session secrets
```

Sensitive claims SHALL be redacted according to platform policy.

---

# 74. Route Protection

Executive protection SHALL be enforced at trusted server boundaries.

Suitable enforcement points MAY include:

```text
server layouts
server-side route guards
BFF handlers
server actions
route handlers
authorised data-access boundaries
```

Client Components MAY improve navigation UX.

They SHALL NOT be the security perimeter.

---

# 75. Authentication and Authorisation API Boundary

Feature components SHOULD consume stable estate-level abstractions.

Conceptually:

```text
getCurrentPrincipal()
resolveExecutiveContext()
requireCapability()
requireAssurance()
```

Exact API names are implementation details.

These abstractions SHALL ultimately consume IAM/CP contracts rather than maintaining independent canonical access truth.

---

# 76. No Static Production Executive ACL

The repository SHALL NOT rely upon production configuration such as:

```text
EXECUTIVE_EMAILS=
ALLOWED_USERS=
ADMIN_EMAILS=
SUBSIDIARY_ACCESS_JSON=
```

as the canonical authority for protected access.

Such mechanisms MAY only exist in explicitly non-production testing fixtures where clearly identified as non-authoritative.

---

# 77. Development Preview

Development mocks MAY simulate authenticated executive states for UI development.

They SHALL:

```text
be clearly identified
be disabled by default in production
never satisfy production authorisation
never create production bypass routes
never accept arbitrary identity claims in production
```

Any existing dashboard preview mechanism SHALL remain fail-closed in production.

---

# 78. Relationship to ADR-NAB-0003

ADR-NAB-0003 establishes that:

```text
Nabhold owns experience and composition
Baobab owns platform resolution
canonical authorities own truth
providers implement capabilities
```

This ADR applies that rule specifically to identity and access.

Therefore:

```text
Nabhold owns:
login UX
logout UX
access-denied UX
context-selector UX
session-aware routing
step-up initiation UX
security-status presentation
```

while:

```text
IAM owns:
authentication
credentials
sessions
assurance

CP owns:
canonical context
portfolio scope
capability entitlement

Domains own:
business authorisation
```

---

# 79. Relationship to ADR-NAB-0005

This ADR intentionally does not define the complete Nabhold Group organisational and portfolio-scope model.

ADR-NAB-0005 SHALL establish:

```text
canonical organisation context
holding-company relationship consumption
subsidiary scope
legal-entity context
portfolio scope resolution
group aggregation semantics
```

ADR-NAB-0004 establishes the security rule that any such context SHALL be resolved authoritatively rather than trusted from frontend state.

---

# 80. Proposed Runtime Flow

The protected executive runtime SHOULD follow:

```text
┌──────────────────────┐
│      EXECUTIVE       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   NABHOLD BROWSER    │
└──────────┬───────────┘
           │
           │ secure session
           ▼
┌──────────────────────┐
│ NABHOLD SERVER / BFF │
└──────────┬───────────┘
           │
      validate session
           │
           ▼
┌──────────────────────┐
│     BAOBAB IAM       │
│ authentication       │
│ assurance            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     BAOBAB CP        │
│ identity mapping     │
│ context              │
│ entitlement          │
│ capability           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ CAPABILITY PROVIDER  │
│ domain authorization │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ AUTHORISED VIEW /    │
│ BUSINESS ACTION      │
└──────────────────────┘
```

---

# 81. Security Invariant

Every protected executive operation SHALL conceptually require:

```text
Authenticated
AND
IdentityValid
AND
SessionValid
AND
AssuranceSufficient
AND
DigitalEstateAllowed
AND
ContextValid
AND
TenantAllowed
AND
LegalEntityAllowed
AND
CapabilityGranted
AND
ProviderEligible
AND
DomainAuthorized
```

Otherwise:

```text
DENY
```

Not every operation requires every optional dimension, but every applicable security dimension SHALL pass.

---

# 82. Alternatives Considered

## 82.1 Local Nabhold accounts

```text
Nabhold DB
├── username
├── password
└── role
```

**Rejected.**

This would duplicate IAM, complicate SSO, weaken revocation and create a second credential authority.

---

## 82.2 Keycloak roles contain all business permissions

**Rejected.**

This would create role explosion and move ERP, governance, portfolio and domain policy into IAM.

---

## 82.3 Any authenticated Nabhold employee can use the executive dashboard

**Rejected.**

Workforce identity is not executive authority.

---

## 82.4 Executive role grants all subsidiary access

**Rejected.**

Executive portfolio visibility requires explicit Control Plane context.

---

## 82.5 Executive equals superuser

**Rejected.**

Executive visibility and technical/business administrative privilege are separate.

---

## 82.6 Browser stores access and refresh tokens

**Rejected as the target architecture.**

A server-mediated BFF model better matches the sensitivity of the protected executive estate.

---

## 82.7 Frontend ACL determines subsidiary access

**Rejected.**

Frontend state is not authoritative platform context.

---

## 82.8 Shared generic Baobab admin client

**Rejected for ordinary Nabhold executive access.**

Dedicated clients reduce privilege coupling and blast radius.

---

# 83. Positive Consequences

This decision provides:

```text
centralised authentication
single workforce identity
stronger SSO
consistent MFA
provider-independent access model
explicit cross-subsidiary authority
reliable revocation
reduced credential proliferation
clear auditability
stronger least privilege
reduced frontend security logic
safer executive dashboards
future federation support
```

---

# 84. Costs and Trade-Offs

The architecture introduces additional complexity through:

```text
OIDC client configuration
BFF/session infrastructure
CP context resolution
capability checks
stronger MFA
step-up flows
revocation handling
security testing
cross-system audit correlation
```

These costs are accepted because the executive estate will expose information spanning multiple companies, systems and authority domains.

A simpler login-and-role check would be cheaper initially and considerably more expensive after the first serious access-control problem.

---

# 85. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Nabhold executive authentication uses Baobab IAM.

[ ] A dedicated Nabhold OIDC client exists.

[ ] Authorization Code + PKCE is used according to IAM policy.

[ ] The target executive architecture uses a server-mediated/BFF session.

[ ] Sensitive access/refresh tokens are not persisted in browser storage.

[ ] Session cookies are Secure and HttpOnly in production.

[ ] Production redirect URIs are explicitly constrained.

[ ] OIDC issuer and audience are validated.

[ ] OIDC sub is not treated as CanonicalIdentity.

[ ] Canonical identity is resolved through approved Baobab mappings.

[ ] Public routes remain independently accessible without executive login.

[ ] Protected executive routes are enforced server-side.

[ ] Executive access requires appropriate MFA/strong authentication.

[ ] Passkeys/WebAuthn are supported by the IAM trajectory.

[ ] Sensitive operations can invoke IAM-controlled step-up.

[ ] MFA success does not bypass CP/domain authorisation.

[ ] Cross-subsidiary access is validated through authoritative context.

[ ] Browser-supplied tenant/legal-entity values are treated only as
    requested context.

[ ] No executive role implies automatic superuser authority.

[ ] Executive read access is separate from operational write authority.

[ ] Capability grants remain controlled by CP.

[ ] Domain permissions remain controlled by domain authorities.

[ ] No production executive ACL is based on hard-coded email lists.

[ ] No local password or MFA database exists in Nabhold.

[ ] Revoked subsidiary access takes effect without code deployment.

[ ] Workforce joiner/mover/leaver processes can alter access independently
    of CanonicalIdentity deletion.

[ ] Session and membership revocation are tested.

[ ] Authentication failure fails closed.

[ ] CP/context-resolution failure fails closed for protected operations.

[ ] Domain denial cannot be overridden by Nabhold.

[ ] Service credentials remain server-side.

[ ] Human-attributable operations retain human actor provenance.

[ ] CSRF controls protect session-based state changes.

[ ] Secrets and bearer tokens are absent from logs.

[ ] Security events are correlatable across Nabhold, IAM, CP and providers.

[ ] Development authentication mocks cannot operate as production bypasses.
```

---

# 86. Required Security Tests

The rollout SHALL include tests for at least:

```text
anonymous access to executive route
expired session
revoked session
invalid issuer
invalid audience
tampered token
insufficient authentication assurance
missing MFA
cross-tenant context spoofing
cross-legal-entity context spoofing
unauthorised subsidiary selection
manually constructed protected URL
revoked subsidiary access
revoked capability
domain-level denial
stale browser state after revocation
open redirect attempt
CSRF attempt
session fixation
privilege escalation
hard-coded role bypass
production preview/mock bypass
```

A successful UI test alone SHALL NOT satisfy this requirement.

---

# 87. Gate Impact

This decision principally governs:

```text
Gate 1
Platform Consumption & Internal Onboarding Foundation

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

Gate 5 SHALL be the main implementation gate for this ADR.

Later gates SHALL consume the identity and authorisation spine rather than reopen it.

---

# 88. Required Follow-On Work

Implementation SHALL eventually include:

```text
IAM client registration
OIDC callback/logout flows
server-side session adapter
principal abstraction
canonical identity resolution
CP context integration
executive route guard
capability-aware access boundary
assurance/step-up handling
context-selector authorisation
session revocation handling
security-event correlation
auth-related E2E tests
```

Provider-specific business authorisation SHALL remain outside this ADR.

---

# 89. Follow-On ADR

The next architectural decision SHALL be:

**ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption**

It SHALL determine how the Nabhold holding-company estate resolves:

```text
Nabhold Group Africa
        │
        ├── ZuriBeans
        ├── Thamani Global
        └── Equator & Estate Co.
```

without turning the frontend into canonical organisation authority.

---

# 90. Final Decision

The Nabhold executive estate SHALL be secured through federated Baobab identity and layered authorisation.

The enduring architecture is:

```text
                     HUMAN
                       │
                       ▼
                 BAOBAB IAM
                authentication
             credentials / MFA
                       │
                       ▼
               CANONICAL IDENTITY
                       │
                       ▼
                  BAOBAB CP
             context + entitlement
                       │
                       ▼
              NABHOLD EXECUTIVE
                 COMPOSITION
                       │
                       ▼
              CAPABILITY PROVIDER
                       │
                       ▼
             DOMAIN AUTHORISATION
                       │
                       ▼
               AUTHORISED RESULT
```

The enduring rule is:

> **Login proves identity, not authority. Executive status does not create superuser privilege. Every protected Nabhold operation must be authorised in its actual tenant, legal-entity, Digital Estate and capability context, with business authority remaining in the appropriate domain.**