# ADR-NAB-0009 — Corporate Governance, Capital Allocation, Risk and Approval Authority

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Governance Authority:** Authoritative corporate-governance domain/capability resolved through Baobab  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Platform Context and Capability Authority:** `baobab-platform/baobab-cp`  
**Financial Execution Authority:** Applicable `baobab-platform/baobab-erp` capabilities  
**Intelligence Authority:** `baobab-platform/baobab-pulse`  
**Contract Authority:** `baobab-platform/shared`  
**Architecture Style:** Explicit-authority, effective-dated, policy-driven, evidence-backed, separation-of-duties-aware, human-governed, capability-centric, auditable, fail-closed  
**Decision Type:** Corporate governance, decision-rights, capital-allocation, risk-acceptance and approval architecture  

**Depends On:**

- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture
- ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority
- ADR-NAB-0008 — Executive Intelligence and Decision-Support Boundary
- ADR-BCP-003 — Capability Registry, Grants, Scopes, Bindings and Deterministic Resolution Model
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- ADR-BCP-012 — Intercompany and Inter-Branch Trading, Legal-Entity Relationship and Internal Settlement Model
- Baobab IAM ADR-0008 — Platform Authorization Architecture
- Baobab IAM ADR-0009 — Workforce SSO and Privileged Access
- Baobab IAM ADR-0015 — Credential Security, MFA, Passkeys and Account Recovery
- Baobab IAM ADR-0016 — Identity Lifecycle, Revocation and Deprovisioning
- Baobab IAM ADR-0017 — IAM Audit, Security Events and Observability
- ADR-ERP-008 — ERP Financial, Accounting and Multi-Currency Architecture
- ADR-ERP-010 — ERP Security, Identity, Authorization and Tenant-Isolation Architecture
- ADR-ERP-011 — ERP Observability, Audit, Reconciliation and Operational Control Architecture
- ADR-ERP-018 — ERP Reporting, Analytics, Data Export and Intelligence Integration Architecture
- ADR-PULSE-001 — Engine Mission, Authority and System Boundary
- ADR-PULSE-002 — Canonical Intelligence Domain Model and Aggregate Boundaries
- Applicable canonical contracts in `baobab-platform/shared`

**Supersedes:**

Any interpretation that allows:

```text
executive title
=
decision authority
```

or:

```text
Keycloak role
=
corporate approval authority
```

or:

```text
Pulse recommendation
=
approved decision
```

or:

```text
Nabhold button click
=
authoritative approval
```

or:

```text
board approval
=
ERP payment-release authority
```

or:

```text
capital allocation
=
cash disbursement
```

or:

```text
risk acknowledged
=
risk accepted
```

or:

```text
deployment administrator
=
corporate decision-maker
```

without an explicit, current and auditable authority basis.

---

# 1. Executive Decision

Nabhold Group Africa SHALL govern material corporate decisions through an **explicit corporate-governance authority model**.

The target decision chain SHALL be:

```text
Business Need / Risk / Opportunity
             │
             ▼
       Proposal / Request
             │
             ▼
      Authorised Context
             │
             ▼
   Evidence + Financial Facts
      + Pulse Intelligence
             │
             ▼
      Governance Policy
             │
             ▼
    Decision-Right Resolution
             │
     ┌───────┴────────┐
     ▼                ▼
 Individual        Committee /
 Authority            Board
     │                │
     └───────┬────────┘
             ▼
       Formal Decision
             │
             ▼
   Authorised Domain Command
             │
             ▼
       Domain Execution
             │
             ▼
           Outcome
             │
             ▼
 Audit / Reporting / Feedback
```

The governing principle is:

> **Identity proves who the actor is. Governance determines whether that actor has decision authority. The relevant domain determines whether and how the authorised decision may be executed.**

---

# 2. Governance Authority Is a Separate Concern

The following SHALL remain distinct:

```text
Authentication
    !=
Platform Entitlement
    !=
Governance Authority
    !=
Domain Permission
    !=
Operational Execution
```

A principal may successfully pass IAM and Control Plane checks while still lacking corporate decision authority.

---

# 3. Nabhold Digital Estate Role

`baobab-platform/nabhold` SHALL own:

```text
governance UX
proposal UX
decision-pack presentation
approval interaction
capital-request presentation
risk-acceptance interaction
committee/board workspace presentation
decision status presentation
server-side governance composition
```

It SHALL NOT become authoritative merely because these workflows are presented through Nabhold.

---

# 4. Authoritative Governance Domain

Canonical governance state SHALL be owned by an authoritative governance capability/domain.

That authority SHALL own, as applicable:

```text
decision rights
delegated authorities
authority limits
governance policies
proposal state
approval state
committee decisions
risk acceptance
capital-allocation decisions
decision records
governance evidence references
```

The exact provider is deliberately not selected in this ADR.

---

# 5. Provider Neutrality

The future governance capability might be implemented by:

```text
a Baobab-native governance provider
an approved GRC/governance system
an ERP-backed adapter for appropriate workflows
another approved provider
```

without changing Nabhold's governance semantics.

The Digital Estate SHALL depend upon governance capabilities, not the provider technology.

---

# 6. No Accidental Governance Database in Nabhold

This ADR rejects:

```text
Nabhold PostgreSQL
    │
    ├── approvals
    ├── board votes
    ├── delegations
    ├── authority limits
    └── capital decisions
```

becoming authoritative merely because implementing it locally is convenient.

Estate-specific read models MAY exist.

Canonical governance authority SHALL not arise accidentally from frontend persistence.

---

# 7. Transitional Development

Until an authoritative governance capability exists, Nabhold MAY use clearly identified:

```text
mock
preview
fixture
demo
```

governance states for UI development.

Such states SHALL NOT authorise production actions.

Production governance mutation SHALL fail closed rather than treating mock approval as real authority.

---

# 8. Sources of Governance Authority

Corporate decision authority MAY derive from governed sources such as:

```text
applicable law and regulation
corporate constitutional/governing documents
shareholder decisions
board resolutions
committee charters
delegation-of-authority policies
approved financial policies
risk policies
specific mandates
```

The technical system SHALL record authoritative references where required.

It SHALL NOT infer authority merely from organisational seniority.

---

# 9. No Universal Legal Hierarchy Is Invented Here

This ADR SHALL NOT attempt to encode one universal legal hierarchy applicable to every Nabhold jurisdiction.

Precedence between authority sources SHALL be explicitly governed through approved policy/configuration and applicable legal advice.

The Digital Estate SHALL consume the resolved authority outcome.

---

# 10. Core Governance Concepts

The architecture SHALL distinguish at minimum:

```text
Governance Matter
Proposal
Decision Right
Authority Grant
Delegation
Approval Policy
Approval Step
Decision
Risk Acceptance
Capital Allocation
Execution Instruction
Outcome
Governance Evidence
```

Exact canonical contract names SHALL be governed through Shared.

---

# 11. Governance Matter

A governance matter represents something requiring formal consideration.

Examples:

```text
capital investment
material procurement
market entry
material contract
risk acceptance
strategic initiative
policy exception
subsidiary funding
asset acquisition
corporate restructuring
```

A governance matter does not itself represent approval.

---

# 12. Proposal

A Proposal SHALL represent the request submitted for consideration.

Conceptually:

```text
Proposal
├── proposal_id
├── proposal_type
├── proposer
├── sponsoring_organisation
├── legal_entity_scope
├── purpose
├── requested_action
├── amount?
├── currency?
├── supporting_evidence[]
├── intelligence_references[]
├── document_references[]
├── submitted_at
├── version
└── status
```

---

# 13. Proposal Versioning

A materially changed proposal SHALL not silently retain approvals obtained for an earlier version.

The architecture SHALL support:

```text
Proposal v1
    │
    ▼
Approved
    │
material amendment
    ▼
Proposal v2
    │
    ▼
Authority re-evaluation
```

where policy requires.

---

# 14. Material Change

Material-change rules MAY include changes to:

```text
amount
legal entity
counterparty
purpose
risk profile
funding source
market
scope
contract term
execution method
```

Exact rules SHALL be policy-governed.

---

# 15. Identity Is Not Authority

This invariant SHALL remain:

```text
Authenticated Executive
        !=
Authorised Decision-Maker
```

---

# 16. Title Is Not Authority

The following SHALL NOT independently establish authority:

```text
CEO
CFO
Director
Chair
Manager
Administrator
```

A title may contribute to authority resolution only through an approved governance relationship or policy.

---

# 17. IAM Role Is Not Governance Authority

Keycloak SHALL NOT contain the entire corporate delegation-of-authority model.

This is prohibited:

```text
realm-role:
capital-approver-up-to-ZAR-10m
```

as the primary corporate authority model.

IAM may provide identity and coarse access.

Governance policy owns the decision right.

---

# 18. Platform Entitlement Is Not Decision Authority

A Control Plane resolution:

```text
governance.capital-request.read → ALLOW
```

or equivalent means the capability may be attempted.

It does not mean the principal may approve the capital request.

---

# 19. Domain Authorization Is Still Required

After a governance decision, the executing domain SHALL continue to enforce its own controls.

For example:

```text
Board approval
      │
      ▼
Approved capital allocation
```

does not automatically mean:

```text
CFO can bypass ERP payment controls.
```

---

# 20. Decision Right

A `DecisionRight` or equivalent SHALL answer:

> **Who may make which decision, within what scope and subject to what conditions?**

Conceptually:

```text
DecisionRight
├── decision_type
├── applicable_scope
├── authority_holder_type
├── authority_reference
├── thresholds
├── conditions
├── required_assurance
├── effective_from
├── effective_to?
├── authority_source
└── version
```

---

# 21. Authority Holder Types

Authority MAY be granted to governed entities such as:

```text
individual
office
committee
board
governance body
```

Exact canonical types SHALL be explicitly defined.

---

# 22. Office Versus Person

Authority MAY attach to an office rather than permanently to one person.

Conceptually:

```text
Office
  "Group CFO"
      │
      ▼
Current Office Holder
      │
      ▼
Canonical Identity
```

The office-holder relationship SHALL be explicit and effective-dated.

---

# 23. Office Title Is Not Enough

A display title saying:

```text
Group CFO
```

does not itself prove that the principal currently occupies the governed office.

The relationship SHALL be resolved authoritatively.

---

# 24. Committee Authority

A committee MAY possess authority where defined by governance policy.

The architecture SHOULD support:

```text
committee identity
membership
membership terms
chair
decision scope
quorum rule
voting rule
recusal
effective dates
```

without hard-coding one governance model.

---

# 25. Board Authority

Board decision authority SHALL be treated separately from ordinary executive authority.

A person's executive access does not automatically grant:

```text
board vote
board approval
board document access
```

---

# 26. Committee Membership Is Temporal

Committee membership SHALL support:

```text
effective_from
effective_to
```

A former committee member SHALL not continue approving merely because an old application session exists.

---

# 27. Authority Grant

Authority SHALL be represented explicitly.

Conceptually:

```text
AuthorityGrant
├── authority_grant_id
├── grantee
├── decision_type
├── legal_entity_scope
├── organisation_scope?
├── market_scope?
├── amount_limit?
├── limit_currency?
├── conditions[]
├── delegable
├── delegation_depth?
├── effective_from
├── effective_to?
├── authority_source_reference
├── status
└── version
```

---

# 28. Authority Is Effective-Dated

The system SHALL determine whether authority was valid:

```text
at the time of decision
```

not merely whether the actor possesses authority now.

This preserves historical governance.

---

# 29. Authority Revocation

Revocation SHALL prevent future decisions according to policy.

Revocation SHALL not erase historical decisions legitimately made while authority was valid.

---

# 30. Historical Authority Provenance

A historical decision SHOULD remain explainable even if:

```text
the executive has left
the delegation expired
the committee changed
the policy changed
```

The system SHALL retain the authority basis applicable at decision time.

---

# 31. Delegation

Authority delegation SHALL be explicit.

Conceptually:

```text
Authority Holder
      │
      ▼
Delegation
      │
      ▼
Delegate
```

Delegation SHALL have:

```text
scope
effective dates
limits
conditions
source
```

---

# 32. Delegation Shall Not Expand Authority

A delegate SHALL NOT receive greater authority than the delegator was permitted to delegate.

Conceptually:

```text
DelegateAuthority
    ⊆
DelegableAuthority
```

---

# 33. Re-Delegation

A delegate SHALL NOT automatically have power to delegate again.

Re-delegation requires explicit policy.

---

# 34. Delegation Expiry

Temporary delegation SHALL expire automatically according to its governed period.

Expired delegation SHALL not remain usable because of stale UI/session state.

---

# 35. Delegation Audit

Governance audit SHALL record:

```text
delegator
delegate
authority scope
reason
effective period
approved by
created_at
revoked_at
```

where applicable.

---

# 36. Acting Authority

Temporary acting appointments SHALL be explicitly modelled rather than simulated by:

```text
copying someone else's role
```

---

# 37. Approval Policy

Approval routing SHALL derive from a governed policy.

Conceptually:

```text
ApprovalPolicy
├── matter_type
├── applicable_scope
├── threshold_rules[]
├── approval_steps[]
├── segregation_rules[]
├── quorum_rules?
├── escalation_rules[]
├── assurance_requirements
├── effective_from
├── effective_to?
└── version
```

---

# 38. Approval Policy Is Versioned

A governance decision SHALL be attributable to the policy version used to evaluate it.

Policy changes SHALL not silently reinterpret historical decisions.

---

# 39. Approval Thresholds

Approval thresholds MAY depend upon:

```text
amount
currency
risk classification
legal entity
decision type
market
counterparty
contract duration
strategic classification
data sensitivity
```

The architecture SHALL support multidimensional policy.

---

# 40. Monetary Thresholds

Monetary limits SHALL use exact decimal semantics.

Conceptually:

```text
amount
currency
```

SHALL travel together.

---

# 41. No Currencyless Approval Limit

This is invalid:

```text
approval_limit = 1000000
```

without a governed currency or comparable policy basis.

---

# 42. Threshold Currency Conversion

Where a proposal currency differs from an authority-limit currency, threshold evaluation SHALL use an approved conversion policy.

It SHOULD preserve:

```text
source amount
source currency
comparison currency
exchange rate
rate type
effective date
rate authority
converted amount
```

where material.

---

# 43. Market FX Shall Not Determine Approval Authority Automatically

A current Pulse FX observation SHALL NOT automatically decide whether a transaction crosses a governance threshold.

Threshold FX SHALL use the approved governance/finance policy.

---

# 44. Boundary Semantics

Policies SHALL explicitly define whether an authority limit means:

```text
< limit
<= limit
```

or another condition.

The Digital Estate SHALL not guess.

---

# 45. Anti-Splitting Controls

Governance policy SHOULD support detection of attempts to split related commitments merely to remain beneath approval thresholds.

Examples may include:

```text
same initiative
same counterparty
same project
same contract
related purchase requests
short time window
```

The policy SHALL define relatedness where enforcement depends upon it.

---

# 46. Approval Sequence

Approval steps MAY be:

```text
sequential
parallel
conditional
```

according to policy.

The Digital Estate SHALL render the resolved workflow.

It SHALL not invent the routing independently.

---

# 47. Sequential Approval

Example:

```text
Business Sponsor
      │
      ▼
Finance Review
      │
      ▼
Risk Review
      │
      ▼
Executive Approval
      │
      ▼
Board Approval
```

where applicable.

---

# 48. Parallel Approval

Policy MAY require independent reviews such as:

```text
Finance ──────┐
Legal ────────┼──► Decision
Risk ─────────┘
```

The exact workflow remains governed.

---

# 49. Conditional Approval

Certain steps MAY be introduced only when a condition is met.

Example:

```text
amount > threshold
      │
      ▼
Board Review Required
```

---

# 50. Approval State

A governance workflow SHOULD distinguish states equivalent to:

```text
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
DEFERRED
WITHDRAWN
EXPIRED
SUPERSEDED
```

Exact canonical values SHALL be governed through contracts.

---

# 51. Approval by Silence

The default architecture SHALL NOT assume:

```text
no response
=
approval
```

Any approval-by-silence mechanism requires explicit policy.

---

# 52. Fail Closed

Where decision authority cannot be established:

```text
decision SHALL NOT proceed
```

The application SHALL not infer approval from seniority or urgency.

---

# 53. Separation of Duties

Material governance processes SHALL support segregation of duties.

Examples:

```text
request
    !=
approve
```

```text
prepare
    !=
final approve
```

```text
approve capital
    !=
release payment
```

```text
configure authority policy
    !=
use that new authority unchecked
```

---

# 54. Self-Approval

A principal SHALL NOT ordinarily approve their own material proposal unless an explicit governance policy permits that scenario.

Default design SHOULD detect proposer/approver conflicts.

---

# 55. Self-Grant

A user SHALL NOT grant themselves decision authority.

---

# 56. Authority Administrator Is Not Automatically Approver

A technical or governance administrator capable of maintaining policy SHALL NOT automatically possess the authority governed by that policy.

---

# 57. Policy Change Versus Business Decision

The authority to modify:

```text
approval thresholds
delegation rules
committee configuration
```

SHALL be separated from ordinary business approvals where risk warrants it.

---

# 58. Conflict of Interest

Governance workflows SHOULD support explicit conflict-of-interest handling.

Conceptually:

```text
Potential Conflict
       │
       ▼
Disclosure
       │
       ▼
Policy Evaluation
       │
    ┌──┴──┐
    ▼     ▼
 Recuse  Participate
```

---

# 59. Recusal

Where policy requires recusal, a conflicted participant SHALL not count as an approving vote merely because they are a committee member.

---

# 60. Recusal History

Recusal SHOULD preserve:

```text
participant
reason/reference
decision
timestamp
effect on quorum
```

as applicable.

---

# 61. Quorum

Collective decision bodies SHOULD support explicit quorum rules.

The Digital Estate SHALL not infer:

```text
majority of displayed users
=
quorum
```

---

# 62. Voting

Where voting is required, governance policy MAY define:

```text
simple majority
supermajority
unanimous
weighted vote
chair casting vote
```

or another lawful/governed rule.

This ADR does not prescribe one.

---

# 63. Abstention

The system SHOULD distinguish:

```text
APPROVE
REJECT
ABSTAIN
RECUSED
ABSENT
```

where collective governance requires these distinctions.

---

# 64. Vote Is Not Necessarily Final Decision

Individual votes may contribute to a committee resolution.

The final governance decision SHALL follow the governing decision rule.

---

# 65. Committee Decision Evidence

Where applicable, the final record SHOULD preserve:

```text
committee
members eligible
attendance
quorum
votes
recusals
resolution
authority basis
decision time
```

subject to information classification.

---

# 66. Step-Up Authentication

High-consequence governance actions SHOULD require appropriate authentication assurance.

Examples:

```text
major capital approval
risk acceptance above threshold
delegation of authority
governance policy change
board decision confirmation
```

IAM-controlled step-up SHALL be used rather than local password re-entry.

---

# 67. MFA Is Not Approval Authority

This remains binding:

```text
MFA success
    !=
authority to approve
```

MFA establishes confidence in actor authentication.

Governance policy establishes authority.

---

# 68. Capital Allocation

Capital allocation SHALL be treated as a governed decision domain.

A request MAY concern:

```text
equity funding
working capital
project investment
asset acquisition
market entry
strategic initiative
subsidiary funding
technology investment
property development
```

---

# 69. Capital Request

Conceptually:

```text
CapitalRequest
├── request_id
├── sponsor
├── beneficiary
├── legal_entity_scope
├── purpose
├── requested_amount
├── currency
├── funding_source?
├── use_of_funds
├── expected_benefit
├── financial_case
├── risk_references[]
├── intelligence_references[]
├── supporting_documents[]
├── requested_by
├── submitted_at
├── version
└── status
```

Exact canonical shape SHALL be separately governed.

---

# 70. Capital Decision Package

A material capital request SHOULD compose information such as:

```text
proposal
financial actuals
budget
cash position
forecast
business case
risk
Pulse intelligence
supporting documents
prior approvals
```

without moving those authorities into the governance domain.

---

# 71. Pulse Role in Capital Allocation

Pulse MAY provide:

```text
opportunity analysis
market analysis
scenario analysis
forecast
risk
recommendation
```

Pulse SHALL NOT approve the capital allocation.

---

# 72. ERP Role in Capital Allocation

ERP MAY provide:

```text
actual financial state
budget information where authoritative
cash information
commitments
accounting consequences
```

ERP financial state does not itself constitute board or executive approval.

---

# 73. Capital Approval Is Not Cash Disbursement

This distinction SHALL remain absolute:

```text
Approved Capital Allocation
          !=
Payment Released
```

A capital allocation establishes authority to proceed according to its terms.

Cash execution remains subject to finance-domain controls.

---

# 74. Capital Approval Is Not Procurement Approval

Likewise:

```text
Capital Approval
    !=
Purchase Order Approval
```

unless an explicit domain policy establishes combined authority.

---

# 75. Capital Approval Is Not Journal Posting

A corporate investment decision SHALL NOT allow Nabhold to bypass ERP accounting controls.

---

# 76. Budget Authority

Being included in an approved budget SHALL not automatically establish unrestricted spending authority.

The architecture SHALL support distinctions such as:

```text
budget exists
capital approved
commitment authorised
procurement authorised
payment authorised
```

---

# 77. Capital Envelope

Governance policy MAY establish pre-approved capital envelopes.

A request within an envelope still SHALL satisfy applicable:

```text
scope
purpose
amount
authority
risk
execution controls
```

---

# 78. Conditional Approval

A capital decision MAY be:

```text
APPROVED SUBJECT TO CONDITIONS
```

where governance contracts support such semantics.

Conditions MAY include:

```text
maximum amount
expiry
co-funding
legal review
milestone
risk mitigation
specific funding source
```

---

# 79. Approval Expiry

An approval MAY expire.

An expired capital decision SHALL not remain indefinitely executable.

---

# 80. Execution Deadline

Where approval is valid only until a defined date, execution after expiry SHALL require re-authorisation or another governed exception.

---

# 81. Partial Capital Approval

The system SHOULD support:

```text
requested = R10m
approved = R6m
```

without treating the request as wholly approved.

---

# 82. Decision Conditions

The authoritative decision record SHALL preserve approved:

```text
amount
currency
scope
conditions
expiry
```

rather than only:

```text
approved = true
```

---

# 83. Risk Governance

Corporate risk governance SHALL distinguish:

```text
risk identification
risk assessment
risk monitoring
risk treatment
risk acceptance
```

These are different actions.

---

# 84. Pulse Risk Is Not Risk Acceptance

Pulse may produce:

```text
Risk
```

with:

```text
likelihood
impact
confidence
horizon
```

A governance authority may subsequently:

```text
accept
mitigate
avoid
transfer
escalate
```

the risk according to policy.

---

# 85. Risk Acknowledgement Is Not Acceptance

This invariant SHALL hold:

```text
Acknowledged
    !=
Accepted
```

Viewing or acknowledging a risk does not necessarily mean the organisation accepts the exposure.

---

# 86. Risk Acceptance

A material risk acceptance SHOULD identify:

```text
risk reference
scope
decision-maker
authority basis
current assessment
residual risk
rationale
conditions
review date
expiry where applicable
```

---

# 87. Risk Appetite

Risk appetite, limits or tolerances SHALL be governed corporate-policy concepts.

Pulse SHALL not independently determine Nabhold's risk appetite.

---

# 88. Risk Threshold Escalation

Where a risk exceeds applicable delegated authority:

```text
Current Authority
       │
       X
       ▼
Accept
```

the matter SHALL escalate to the required governance authority.

---

# 89. Risk Acceptance Does Not Change the Risk Fact

Approving risk acceptance does not mean:

```text
risk no longer exists
```

The risk and the acceptance decision SHALL remain distinct records.

---

# 90. Risk Treatment

A risk decision MAY require:

```text
mitigation plan
owner
deadline
monitoring condition
residual-risk assessment
```

without implying that Pulse owns execution.

---

# 91. Expiring Risk Acceptance

Risk acceptance MAY require periodic review.

Expired acceptance SHALL not silently remain valid.

---

# 92. Governance Decision

A formal Decision SHALL preserve conceptually:

```text
Decision
├── decision_id
├── matter_reference
├── proposal_version
├── decision_type
├── decision_result
├── decision-maker/body
├── authority_reference
├── policy_version
├── rationale?
├── conditions[]
├── decided_at
├── effective_at?
├── expires_at?
├── supporting_evidence[]
└── execution_references[]
```

Exact canonical contract SHALL be defined separately.

---

# 93. Decision Result

Depending on the governance matter, valid outcomes MAY include:

```text
APPROVE
APPROVE_WITH_CONDITIONS
REJECT
DEFER
RETURN_FOR_REVISION
```

or equivalent canonical values.

---

# 94. Decision Is Append-Oriented

A consequential decision SHALL not be destructively overwritten.

If changed:

```text
Decision v1
     │
     ▼
Superseding Decision
```

or another auditable history mechanism SHALL be used.

---

# 95. Decision History

A transition such as:

```text
DEFER
  │
  ▼
APPROVE
```

SHALL preserve the previous decision.

---

# 96. Decision Record Versus Pulse DecisionRecord

Pulse may record a decision for intelligence lineage.

The authoritative governance decision SHALL remain governed by the governance domain.

Pulse's record SHOULD reference the authoritative governance decision rather than become an alternative authority.

---

# 97. Decision Package Integrity

A decision SHALL be traceable to the proposal version and material evidence available to the decision-maker.

This supports later reconstruction:

> What did the decision-makers know when they decided?

---

# 98. Evidence Changes After Decision

Later evidence SHALL not rewrite the historical decision package.

New evidence MAY trigger:

```text
review
reconsideration
superseding decision
```

according to policy.

---

# 99. Execution Instruction

A governance decision MAY authorise a downstream action.

It SHALL NOT itself perform the domain transaction.

Conceptually:

```text
Governance Decision
        │
        ▼
Authorised Execution Instruction
        │
        ▼
Domain Capability
```

---

# 100. Domain Execution

The owning domain remains authoritative for executing actions such as:

```text
create purchase order
release payment
post journal
execute trade
change operational configuration
```

---

# 101. Governance Decision Reference

Where an operational command requires prior governance approval, the request SHOULD include or resolve a trustworthy governance decision reference.

The provider SHALL NOT trust:

```json
{
  "approved": true
}
```

from the browser.

---

# 102. Approval Validation

The executing domain SHOULD be capable of validating, as appropriate:

```text
decision exists
decision applies to this operation
decision is current
amount/scope fits
conditions satisfied
decision not revoked/expired
```

before material execution.

---

# 103. Signed Assertions

Future architecture MAY use short-lived signed approval/decision assertions where appropriate.

Such assertions SHALL reference authoritative governance state.

They SHALL not become self-contained permanent authority disconnected from revocation.

---

# 104. Approved Is Not Executed

This invariant SHALL remain:

```text
APPROVED
    !=
EXECUTED
```

---

# 105. Executed Is Not Completed

Likewise:

```text
EXECUTED
    !=
COMPLETED
```

---

# 106. Completed Is Not Successful Outcome

A completed investment or payment workflow does not guarantee the intended strategic result.

Outcome evaluation remains separate.

---

# 107. Execution Idempotency

Material downstream actions SHOULD use idempotency controls where technically applicable.

An executive double-click SHALL not create:

```text
two payments
two purchase orders
two investment commitments
```

where one authorised action was intended.

---

# 108. Partial Execution

If an approved matter is executed only partially, the system SHOULD retain:

```text
approved amount/scope
executed amount/scope
remaining authority
expiry
```

where the business domain requires it.

---

# 109. Revocation Before Execution

Where governance policy permits revocation:

```text
Approved
   │
   ▼
Revoked before execution
```

future execution SHALL be denied.

---

# 110. Revocation After Execution

Revoking authority after an action was validly executed SHALL NOT erase the executed transaction.

Any corrective action SHALL follow the owning domain's governed process.

---

# 111. Governance Capabilities

Nabhold SHOULD eventually consume canonical capabilities conceptually such as:

```text
governance.proposal.read
governance.proposal.submit
governance.authority.resolve
governance.approval.read
governance.approval.record
governance.decision.read
governance.decision.record
governance.capital-request.read
governance.capital-request.manage
governance.risk-acceptance.read
governance.risk-acceptance.manage
```

These names are illustrative.

Canonical keys SHALL be governed by Shared.

---

# 112. Read Versus Decide Capability

The architecture SHALL distinguish:

```text
read governance matter
```

from:

```text
make governance decision
```

Viewing a board paper does not grant voting authority.

---

# 113. Propose Versus Approve

Likewise:

```text
proposal.create
    !=
proposal.approve
```

---

# 114. Approve Versus Execute

Likewise:

```text
governance approval
    !=
domain execution authority
```

---

# 115. Governance Gateway

The Nabhold estate SHOULD consume governance through an estate-facing abstraction such as:

```text
GovernanceGateway
```

Conceptually:

```text
GovernanceGateway
├── getMatter()
├── getDecisionPackage()
├── resolveAuthority()
├── submitProposal()
├── recordDecision()
├── getApprovalStatus()
└── getGovernanceHistory()
```

Exact APIs remain implementation details.

---

# 116. Gateway Shall Be Provider-Neutral

This is undesirable:

```text
BoardManagementVendorClient
```

inside Nabhold feature code.

Features SHALL depend upon governance semantics, not vendor API shapes.

---

# 117. Server-Side Enforcement

Material governance operations SHALL occur through the trusted Nabhold server/BFF boundary.

The browser SHALL NOT authoritatively declare:

```text
approver identity
approval limit
committee membership
authority source
policy version
approved amount
```

---

# 118. Requested Decision Context

A browser may request:

```text
approve request CR-102
```

The server SHALL resolve:

```text
principal
context
authority
current proposal version
applicable policy
```

before allowing a decision.

---

# 119. Stale UI Authority

A page rendered while a user had approval authority SHALL not guarantee authority remains valid when the user later clicks:

```text
Approve
```

Sensitive decision authority SHOULD be revalidated at command time.

---

# 120. Current Authority Over Cached Authority

Governance decisions SHOULD favour current authoritative resolution over stale application state.

High-consequence approvals MAY prohibit reusable authority caching entirely or require very short validity.

---

# 121. Assurance Requirements

Approval policy MAY require stronger authentication assurance based on:

```text
decision type
amount
risk
classification
```

The governance capability SHALL consume approved IAM assurance information.

---

# 122. Public Surface

No protected governance workflow SHALL be available through anonymous public routes.

Governance functionality belongs within authorised executive/workforce surfaces.

---

# 123. Confidentiality

Governance matters may contain:

```text
board material
strategy
financial plans
acquisition discussions
employment matters
legal advice
commercial negotiations
risk information
```

Access SHALL follow classification and least privilege.

ADR-NAB-0010 SHALL refine protected-document handling.

---

# 124. Decision Package Access

Authority to decide a matter does not automatically imply unrestricted access to unrelated confidential documents.

Document access SHALL remain independently authorised.

---

# 125. Document References

Governance records SHOULD reference protected documents through governed identifiers rather than duplicating uncontrolled copies in Nabhold.

---

# 126. Version-Bound Documents

Where a document materially supports a decision, the decision package SHOULD identify the document version considered.

Later editing SHALL not silently alter the historical decision evidence.

---

# 127. Minutes and Resolutions

Where formal minutes or resolutions are required, the architecture SHALL preserve their governance-document authority separately from UI summaries.

Nabhold presentation text SHALL not become the formal resolution merely by being rendered on a page.

---

# 128. Electronic Signature

Where legally or procedurally required, a future approved signing mechanism MAY provide electronic signatures.

The estate SHALL NOT label an ordinary button click:

```text
legally binding electronic signature
```

without an approved signature architecture and applicable legal basis.

---

# 129. Audit

Governance audit SHALL answer:

```text
Who?
Under which authority?
Decided what?
For which legal entity?
Against which proposal version?
Under which policy version?
When?
With what assurance?
Using which evidence?
With what result?
What was later executed?
```

---

# 130. Audit Is Not Logging

Application logs SHALL NOT substitute for governance audit history.

---

# 131. Immutable Decision Evidence

Consequential governance records SHOULD be append-oriented and tamper-evident according to future implementation policy.

Ordinary users SHALL not be able to rewrite decision history.

---

# 132. Correlation

Governance operations SHOULD propagate:

```text
correlation_id
decision_id
proposal_id
context_id
```

as applicable.

---

# 133. End-to-End Traceability

A capital decision SHOULD eventually be traceable:

```text
Opportunity / Business Need
        │
        ▼
Capital Request
        │
        ▼
Decision
        │
        ▼
ERP Commitment / Payment / Asset
        │
        ▼
Outcome
```

without transferring authority between domains.

---

# 134. Governance Event Contracts

The authoritative governance domain SHOULD emit canonical lifecycle events.

Conceptually:

```text
proposal.submitted
approval.recorded
decision.approved
decision.rejected
decision.deferred
authority.delegated
authority.revoked
risk.accepted
capital.allocated
```

Exact canonical event names SHALL be governed in Shared.

---

# 135. Events Do Not Grant Authority

Receiving:

```text
decision.approved
```

does not by itself allow an arbitrary consumer to execute the decision.

The executing system SHALL still validate its own authority and applicable governance reference.

---

# 136. Notifications

Governance events MAY drive notifications.

Notifications SHALL NOT become approval evidence.

Clicking a link from an email or notification does not bypass authority resolution.

---

# 137. Deep-Link Safety

Opening:

```text
/governance/requests/CR-102
```

SHALL resolve current access and authority.

Possession of the URL is not authorisation.

---

# 138. Emergency Decisions

Governance MAY define exceptional emergency authority.

Such authority SHALL be:

```text
explicit
limited
time-bound where practical
audited
subject to post-event review
```

---

# 139. Emergency Is Not Hidden Superuser

The estate SHALL NOT implement:

```text
emergency = approve anything
```

as an undocumented bypass.

---

# 140. Break-Glass Versus Governance Emergency Authority

IAM break-glass access and emergency corporate decision authority are separate concepts.

Administrative system recovery does not confer corporate decision rights.

---

# 141. After-the-Fact Review

Emergency decisions MAY require mandatory ratification/review according to governance policy.

The emergency decision SHALL remain historically visible regardless of later ratification.

---

# 142. Policy Exceptions

A policy exception SHALL itself be governed.

A user lacking authority under Policy A cannot simply select:

```text
Exception
```

to bypass Policy A.

---

# 143. Exception Authority

The authority to approve exceptions MAY require a different decision right from the authority for the underlying ordinary transaction.

---

# 144. Legal-Entity Scope

A decision right granted for:

```text
ZuriBeans
```

SHALL not automatically apply to:

```text
Thamani
```

or:

```text
Equator & Estate Co.
```

unless the authority explicitly has Group scope.

---

# 145. Group Authority

A Group-level authority SHALL be represented explicitly.

It SHALL NOT be inferred from:

```text
Nabhold employee
```

or:

```text
executive = true
```

---

# 146. Sister Subsidiary Authority

Authority in one subsidiary SHALL NOT flow laterally to a sister subsidiary merely because both share the same parent.

---

# 147. Intercompany Decisions

An intercompany matter MAY require authority from more than one legal entity.

Example:

```text
ZuriBeans
    │
    ├── sell asset
    │
    ▼
Thamani
    │
    └── acquire asset
```

Each entity's applicable governance authority SHALL remain independently enforceable.

---

# 148. Shared Tenant Does Not Collapse Authority

Even where two legal entities share one Baobab Tenant:

```text
same Tenant
    !=
same corporate decision authority
```

---

# 149. Market Scope

Authority MAY be market-scoped where governance policy requires it.

Market scope SHALL not replace legal-entity scope.

---

# 150. Time-Limited Authority

Project-specific or acting authority MAY be valid only for:

```text
a defined initiative
a defined transaction
a defined period
a defined amount
```

The platform SHOULD support such constrained authority.

---

# 151. One-Time Mandate

Governance MAY authorise one specific transaction without creating broad reusable authority.

This is preferable to over-granting a permanent role where the business need is narrow.

---

# 152. Authority Invariants

The following SHALL remain true:

```text
Identity
    !=
Authority

Role
    !=
Decision Right

Decision Right
    !=
Decision

Decision
    !=
Execution

Execution
    !=
Outcome

Recommendation
    !=
Decision

Risk
    !=
Risk Acceptance

Budget
    !=
Spending Authority

Capital Allocation
    !=
Payment Release

Committee Membership
    !=
Valid Vote in every matter

MFA
    !=
Approval Authority
```

---

# 153. Governance Read Model

Nabhold MAY own a composition model such as:

```text
ExecutiveGovernanceView
├── pending_matters[]
├── capital_requests[]
├── risks_requiring_decision[]
├── recommendations[]
├── decisions[]
├── delegated_authorities[]
├── upcoming_expiries[]
├── governance_alerts[]
└── provenance
```

This SHALL remain an estate presentation model.

---

# 154. Decision Package View

A decision package MAY conceptually present:

```text
Matter
│
├── Proposal
├── Financial Position
├── Budget Context
├── Forecasts
├── Pulse Analysis
├── Risks
├── Alternatives
├── Supporting Documents
├── Required Authority
├── Existing Approvals
└── Decision Controls
```

Every section retains its original authority.

---

# 155. Executive UX Shall Not Nudge Approval Through Design

The UI SHOULD avoid patterns in which the recommended action is visually presented as inevitable or already selected merely because Pulse recommends it.

The authorised person SHALL remain able to:

```text
approve
reject
defer
request revision
```

according to governance policy.

---

# 156. Recommendation Is Context, Not Instruction

A Pulse recommendation MAY be important evidence.

It SHALL not bypass independent executive judgment or formal authority.

---

# 157. Approval Reason

Governance policy MAY require rationale for:

```text
approval
rejection
deferment
exception
risk acceptance
```

especially for consequential decisions.

---

# 158. Decision Quality

The platform MAY later analyse decision outcomes.

It SHALL NOT define governance quality solely by:

```text
how often executives followed Pulse
```

---

# 159. Governance Feedback

Outcome information MAY flow back to Pulse:

```text
Proposal
   │
   ▼
Decision
   │
   ▼
Execution
   │
   ▼
Outcome
   │
   ▼
Pulse Learning
```

without allowing Pulse to rewrite the original decision.

---

# 160. Provider Failure

If the authoritative governance capability is unavailable, material new governance decisions SHALL fail closed.

This is prohibited:

```text
Governance provider unavailable
          │
          ▼
store "approved" locally in browser
```

---

# 161. Read-Only Degradation

Bounded cached governance information MAY permit read-only viewing where security and validity policy permit.

Mutation SHALL not proceed if authoritative approval state cannot be established.

---

# 162. Partial Degradation

A decision package MAY show:

```text
ERP Financials       AVAILABLE
Pulse Intelligence   UNAVAILABLE
Governance State     AVAILABLE
```

where policy permits decision-making without that optional intelligence.

If a required input is unavailable, the action SHALL be blocked.

---

# 163. Required Inputs

Approval policy MAY classify inputs as:

```text
REQUIRED
ADVISORY
OPTIONAL
```

Nabhold SHALL consume this determination rather than hard-code it per page.

---

# 164. Decision Completeness

A material decision SHALL not be marked valid if required:

```text
approvals
quorum
assurance
documents
risk review
financial review
```

are incomplete.

---

# 165. Governance Readiness

A governance capability being technically reachable does not mean it is ready.

Readiness MAY require:

```text
canonical legal entities configured
authority policies loaded
decision types registered
delegations valid
committee membership configured
IAM integration operational
CP grants/bindings active
audit functioning
document integration functional
domain execution integration tested
```

---

# 166. No Production Governance by Spreadsheet Alone

Spreadsheets MAY support analysis.

They SHALL NOT become the sole authoritative decision-rights system for production automation unless explicitly governed as an external source and integrated through approved contracts.

---

# 167. No Email Approval as Unstructured Authority

An email saying:

```text
Approved.
```

SHALL not automatically become machine-authoritative execution permission.

If email approval is ever supported, it SHALL enter through a governed identity, evidence and decision-capture process.

---

# 168. No Chat Approval as Unstructured Authority

The same applies to:

```text
WhatsApp
Teams
Slack
SMS
```

or another communication channel.

Communication is not automatically a canonical governance decision.

---

# 169. External Governance Artefacts

Where a lawful decision occurs outside Baobab, the platform MAY record it through a governed external-decision import process.

Such an import SHALL preserve:

```text
source
decision-maker/body
authority evidence
decision date
scope
document/evidence reference
recorded_by
recorded_at
```

---

# 170. Imported Does Not Mean Unverified

Externally originated decisions SHOULD be subject to appropriate verification before enabling automated execution.

---

# 171. Security Classification

Governance information SHALL receive appropriate classification.

Many governance matters SHOULD be treated as at least:

```text
INTERNAL
TENANT_CONFIDENTIAL
RESTRICTED
HIGHLY_RESTRICTED
```

depending on content.

Exact policy remains governed by platform security contracts.

---

# 172. Inference Risk

Even a short summary such as:

```text
Board considering acquisition
```

may be highly sensitive.

Summarisation SHALL NOT automatically downgrade classification.

---

# 173. Audit Access

Ordinary executives SHALL not automatically receive unrestricted governance audit data.

Audit access itself SHALL be authorised.

---

# 174. Data Residency

Governance records SHALL respect applicable data residency and legal requirements.

Board visibility across countries SHALL not automatically permit unrestricted replication of every underlying protected document.

---

# 175. Retention

Consequential governance records SHOULD support retention requirements appropriate to:

```text
corporate records
audit
legal obligations
financial governance
risk
```

Exact retention policy SHALL be separately governed.

---

# 176. Deletion

Governance history SHALL not be casually deleted when:

```text
an employee leaves
an approver changes
a proposal closes
```

where retention requirements apply.

---

# 177. Privacy

Governance audit SHALL minimise unnecessary personal information while retaining enough identity provenance to establish accountability.

---

# 178. Alternatives Considered

## 178.1 Use Keycloak roles as the approval matrix

**Rejected.**

IAM establishes identity and coarse access, not corporate monetary/risk decision rights.

---

## 178.2 Use Nabhold frontend database as governance authority

**Rejected.**

This would convert the Digital Estate into an accidental system of record.

---

## 178.3 Make Pulse the decision authority

**Rejected.**

Pulse provides intelligence and recommendations.

It does not possess corporate authority merely because it analysed the matter.

---

## 178.4 Put all governance into ERP

**Rejected as the universal architecture.**

ERP owns accounting and appropriate financial workflows.

Board, strategic, risk and corporate decision authority is broader than ERP.

ERP MAY implement provider capabilities where appropriate, but governance semantics remain independent.

---

## 178.5 Executive role means approve everything

**Rejected.**

Authority SHALL be explicit, scoped and effective-dated.

---

## 178.6 Approval means execution

**Rejected.**

Governance authorisation and operational execution remain separate.

---

## 178.7 Hard-code approval thresholds in React

**Rejected.**

Thresholds are governed policy.

---

## 178.8 Use email/chat messages as machine authority

**Rejected by default.**

Unstructured communication lacks the required canonical authority and lifecycle guarantees.

---

# 179. Consequences

## Positive

This decision provides:

```text
explicit decision rights
clear accountability
delegation control
legal-entity separation
capital governance
risk-governance discipline
separation of duties
committee/board support
auditable decisions
provider neutrality
safer automation
clear Pulse boundary
clear ERP boundary
```

## Costs

The architecture introduces:

```text
authority modelling
policy versioning
delegation lifecycle
approval resolution
governance capability/provider work
committee semantics
decision audit
document integration
execution validation
more complex testing
```

These costs are accepted because implicit authority is inappropriate for high-value corporate decisions.

---

# 180. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Governance authority is not inferred from IAM roles.

[ ] Governance authority is not inferred solely from executive title.

[ ] Decision rights are explicitly resolvable.

[ ] Authority can be scoped by legal entity.

[ ] Authority can be effective-dated.

[ ] Authority source/provenance can be retained.

[ ] Authority revocation affects future decisions without erasing history.

[ ] Delegation cannot silently broaden authority.

[ ] Temporary delegation expires correctly.

[ ] Re-delegation follows explicit policy.

[ ] Approval policies are versioned.

[ ] Monetary thresholds include currency semantics.

[ ] Threshold currency conversion uses governed FX policy.

[ ] Approval boundary semantics are deterministic.

[ ] Material proposal amendment can trigger reapproval.

[ ] Request and approval responsibilities can be segregated.

[ ] Self-grant is prohibited.

[ ] Self-approval is governed and denied by default for material matters.

[ ] Conflict-of-interest/recusal can be represented.

[ ] Committee quorum can be evaluated where required.

[ ] Committee voting outcomes preserve individual participation.

[ ] High-risk approvals can require IAM step-up.

[ ] MFA cannot substitute for governance authority.

[ ] Capital requests preserve purpose, amount, currency and context.

[ ] Capital approval is distinct from payment release.

[ ] Capital approval is distinct from procurement execution.

[ ] Capital approval is distinct from journal posting.

[ ] Partial/conditional approvals can be represented.

[ ] Approval expiry can prevent later execution.

[ ] Risk identification is distinct from risk acceptance.

[ ] Risk acknowledgement is distinct from acceptance.

[ ] Risk acceptance preserves authority, rationale and review semantics.

[ ] Pulse risk/recommendation objects cannot approve themselves.

[ ] Governance decisions retain proposal/evidence version provenance.

[ ] Decisions are append-oriented and historically traceable.

[ ] Pulse DecisionRecords reference rather than replace governance authority.

[ ] Operational domains validate required governance authority before
    consequential execution.

[ ] The browser cannot submit trusted "approved=true" state.

[ ] Approved, executed and completed remain distinct.

[ ] Idempotency prevents duplicate material execution where applicable.

[ ] Sister-subsidiary authority is not inherited laterally.

[ ] Shared tenant membership does not collapse legal-entity authority.

[ ] Group-level authority requires explicit scope.

[ ] Governance capabilities are consumed server-side.

[ ] Provider-specific governance DTOs do not leak into feature components.

[ ] Governance provider failure fails closed for new material decisions.

[ ] Development mocks cannot approve production actions.

[ ] Protected governance documents remain independently authorised.

[ ] Historical document versions can remain linked to decisions.

[ ] Governance audit is distinct from ordinary application logging.

[ ] Correlation exists from proposal through decision to domain execution.

[ ] Governance readiness participates in production go-live evaluation.
```

---

# 181. Required Tests

Implementation SHALL test at minimum:

```text
authenticated executive without decision authority
expired authority grant
revoked authority
future-dated authority
wrong legal-entity scope
cross-subsidiary authority attempt
Group versus subsidiary authority
temporary delegation
expired delegation
illegal delegation expansion
prohibited re-delegation
self-approval attempt
self-grant attempt
conflict-of-interest recusal
committee quorum failure
committee quorum success
abstention
proposal material amendment
old approval against new proposal version
threshold just below limit
threshold exactly at limit
threshold just above limit
multi-currency threshold
incorrect FX source attempt
split-request threshold avoidance
capital approval without payment authority
capital approval without procurement authority
risk acknowledgement versus acceptance
risk acceptance above delegated limit
expired risk acceptance
conditional approval
partial approval
expired capital approval
revoked decision before execution
duplicate execution attempt
browser-supplied approved=true
Pulse recommendation without governance approval
IAM admin attempting business approval
technical admin attempting corporate decision
governance provider unavailable
stale approval UI after revocation
step-up required but absent
decision audit reconstruction
```

---

# 182. Gate Impact

This ADR principally governs:

```text
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

**Gate 8 is the primary implementation gate for this ADR.**

---

# 183. Gate 8 Target Architecture

Gate 8 SHOULD prove:

```text
Pulse Recommendation
        │
        ▼
Governance Matter
        │
        ▼
Proposal / Decision Package
        │
        ▼
Authority Resolution
        │
        ▼
Approval / Board / Committee Workflow
        │
        ▼
Formal Governance Decision
        │
        ▼
Authorised Domain Command
        │
        ▼
ERP / Trade / Other Domain Execution
        │
        ▼
Outcome
        │
        ▼
Audit + Pulse Feedback
```

---

# 184. Relationship to ADR-NAB-0004

ADR-NAB-0004 proves:

```text
who authenticated
```

This ADR determines:

```text
whether that authenticated person possesses
the required decision right
```

The two SHALL not be confused.

---

# 185. Relationship to ADR-NAB-0005

ADR-NAB-0005 determines authorised portfolio and legal-entity context.

This ADR scopes decision authority within that context.

---

# 186. Relationship to ADR-NAB-0006

ADR-NAB-0006 establishes the capability-resolution spine.

Governance SHALL use the same:

```text
context
capability
provider resolution
domain authorisation
```

architecture.

---

# 187. Relationship to ADR-NAB-0007

ADR-NAB-0007 supplies governed:

```text
actuals
budgets
cash
forecasts
portfolio performance
```

to decision packages.

Financial information informs governance.

It does not itself create governance authority.

---

# 188. Relationship to ADR-NAB-0008

ADR-NAB-0008 allows Pulse to:

```text
analyse
forecast
identify risk
identify opportunity
recommend
```

This ADR establishes who may:

```text
decide
approve
accept risk
allocate capital
```

---

# 189. Relationship to ADR-NAB-0010

Governance depends heavily upon protected corporate records.

ADR-NAB-0010 SHALL define:

```text
protected documents
classification
board papers
decision attachments
legal documents
access controls
versioning
download/export policy
document evidence
retention
```

without making the Nabhold UI the authoritative document repository.

---

# 190. Follow-On Decision

The next ADR SHALL be:

**ADR-NAB-0010 — Protected Corporate Documents, Classification and Information Access**

It SHALL determine how the executive estate securely consumes and presents:

```text
board papers
committee packs
financial reports
legal material
strategy documents
capital proposals
risk reports
confidential contracts
governance evidence
```

under explicit classification, document authority and access policy.

---

# 191. Final Decision

The Nabhold Corporate Digital Estate SHALL make corporate governance **explicit, contextual, evidence-backed and auditable**.

The enduring architecture is:

```text
                   BUSINESS MATTER
                         │
                         ▼
                PROPOSAL / REQUEST
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
   Financial Facts   Pulse Intelligence   Risk
        │                │                 │
        └────────────────┼─────────────────┘
                         ▼
                  DECISION PACKAGE
                         │
                         ▼
                 GOVERNANCE POLICY
                         │
                         ▼
                AUTHORITY RESOLUTION
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         Executive    Committee     Board
             │           │           │
             └───────────┼───────────┘
                         ▼
                 GOVERNED DECISION
                         │
                         ▼
                DOMAIN AUTHORISATION
                         │
                         ▼
                 DOMAIN EXECUTION
                         │
                         ▼
                       OUTCOME
                         │
                         ▼
              AUDIT + PULSE FEEDBACK
```

The enduring rule is:

> **Nabhold may present the decision, Pulse may inform the decision, IAM may prove the decision-maker's identity, and the Control Plane may establish platform context—but only the explicitly authorised governance authority may make the corporate decision, and only the owning domain may execute the resulting business action.**