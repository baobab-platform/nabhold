# ADR-NAB-0008 — Executive Intelligence and Decision-Support Boundary

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Intelligence Authority:** `baobab-platform/baobab-pulse`  
**Operational Authorities:** Applicable Baobab systems of record  
**Control-Plane Authority:** `baobab-platform/baobab-cp`  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Contract Authority:** `baobab-platform/shared`  
**AI Orchestration Provider:** Deepset Haystack behind the Baobab Pulse anti-corruption boundary  
**Architecture Style:** Evidence-grounded, provenance-first, confidence-aware, temporally explicit, human-governed, capability-centric, provider-neutral, explainable, decision-support-oriented  
**Decision Type:** Executive intelligence, AI-assisted analysis and decision-support architecture  

**Depends On:**

- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture
- ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority
- ADR-PULSE-001 — Engine Mission, Authority and System Boundary
- ADR-PULSE-002 — Canonical Intelligence Domain Model and Aggregate Boundaries
- ADR-PULSE-003 — External Source Adapter, Intelligence Acquisition and Commercial Research Fabric
- ADR-PULSE-004 — Raw Acquisition, Immutable Evidence and Research Reproducibility
- ADR-PULSE-005 — Canonical Observation Model and Domain-Specific Evidence Profiles
- ADR-PULSE-006 — Provenance, Lineage and Evidence Graph Architecture
- ADR-PULSE-007 — Temporal, Bitemporal and Data-Vintage Semantics
- ADR-PULSE-008 — Canonical Entity Resolution, Identity Matching and Cross-Source Reconciliation
- ADR-PULSE-009 — Data Quality, Evidence Reliability and Intelligence Confidence Architecture
- ADR-PULSE-010 — Embedding Deepset Haystack as Pulse's Headless AI Orchestration Engine
- ADR-ERP-018 — ERP Reporting, Analytics, Data Export and Intelligence Integration Architecture
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- Applicable Shared canonical intelligence, capability, event, identity and classification contracts

**Supersedes:**

Any interpretation within `baobab-platform/nabhold` that allows:

```text
AI-generated statement
=
authoritative fact
```

or:

```text
Pulse recommendation
=
executive decision
```

or:

```text
confidence score
=
certainty
```

or:

```text
forecast
=
actual
```

or:

```text
more citations
=
more independent evidence
```

or:

```text
Pulse access to information
=
authority to mutate the source domain
```

or:

```text
LLM output
=
canonical intelligence
```

without the evidence, validation, authority and lifecycle required by Baobab Pulse.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL use **Baobab Pulse as the System of Intelligence for executive decision support**, while retaining authoritative business facts, operational actions and executive decisions within their respective owning domains.

The fundamental architecture SHALL be:

```text
               AUTHORITATIVE SYSTEMS
          ERP / Trade / CMS / CP / others
                       │
                       ▼
                Authorised Facts
                       │
                       ▼
                 BAOBAB PULSE
          evidence + observations +
          analysis + intelligence
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Signals      Forecasts      Risks
          │            │            │
          └────────────┼────────────┘
                       ▼
              Insights / Opportunities
                       │
                       ▼
                Recommendations
                       │
                       ▼
              NABHOLD EXECUTIVE
                       │
                       ▼
             HUMAN / POLICY DECISION
                       │
                       ▼
              AUTHORITATIVE DOMAIN
                       │
                       ▼
                  Business Action
                       │
                       ▼
                    Outcome
                       │
                       ▼
              Pulse Feedback Loop
```

The governing rule is:

> **Pulse may observe, analyse, detect, explain, forecast, recommend and learn from outcomes. It SHALL NOT silently convert intelligence into business authority.**

---

# 2. System of Record Versus System of Intelligence

The Digital Estate SHALL maintain the distinction:

```text
SYSTEM OF RECORD
    │
    └── What happened?
```

versus:

```text
SYSTEM OF INTELLIGENCE
    │
    └── What might it mean?
```

versus:

```text
DECISION AUTHORITY
    │
    └── What shall we do?
```

These are separate responsibilities.

---

# 3. Authority Model

The architecture SHALL conceptually preserve:

| Information | Authority |
|---|---|
| Accounting facts | ERP |
| Commerce facts | Trade |
| Corporate content | CMS |
| Platform context | Control Plane |
| Identity/authentication | IAM |
| Intelligence objects | Pulse |
| Executive presentation | Nabhold |
| Executive/business decision | Authorised human or policy/domain workflow |
| Operational action | Applicable domain engine |

Nabhold SHALL compose these authorities.

It SHALL not collapse them.

---

# 4. Pulse Intelligence Authority

Pulse SHALL be authoritative for its own intelligence-domain entities, including as defined by applicable Pulse contracts:

```text
Observation
Evidence
EvidenceSet
Signal
Trend
Anomaly
Analysis
Insight
Opportunity
Risk
Forecast
Recommendation
DecisionRecord
Outcome
Feedback
Model
ModelVersion
ModelRun
IntelligenceProduct
```

Pulse being authoritative for an `Insight` does not make Pulse authoritative for the operational fact from which the Insight was derived.

---

# 5. Derived Authority

Consider:

```text
ERP:
accounts receivable = R4.2m
```

and:

```text
Pulse:
receivables concentration indicates
elevated short-term liquidity risk
```

The ERP amount is authoritative accounting state.

The Pulse risk assessment is authoritative as a Pulse intelligence object.

They have different meanings.

---

# 6. Intelligence Does Not Rewrite Facts

Pulse SHALL NOT transform:

```text
Analysis
```

into:

```text
replacement operational truth
```

For example:

```text
Pulse predicts inventory shortage
```

does not make:

```text
available inventory = 0
```

in the inventory domain.

---

# 7. Canonical Intelligence Flow

The preferred semantic chain SHALL be:

```text
Source
   │
   ▼
Dataset
   │
   ▼
Acquisition
   │
   ▼
Raw Evidence
   │
   ▼
Observation
   │
   ▼
Evidence Set
   │
   ▼
Analysis
   │
   ├── Signal
   ├── Insight
   ├── Opportunity
   ├── Risk
   └── Forecast
          │
          ▼
    Recommendation
          │
          ▼
       Decision
          │
          ▼
        Outcome
          │
          ▼
        Feedback
```

Not every intelligence workflow requires every stage.

Where a stage materially affects the interpretation, it SHALL remain explicit.

---

# 8. Observation Is Not Insight

An `Observation` represents an evidence-bearing claim.

Example:

```text
USD/ZAR = 18.40
```

An `Insight` represents an interpretation.

Example:

```text
ZAR depreciation is materially
increasing imported input costs.
```

The executive estate SHALL not present them as interchangeable.

---

# 9. Signal Is Not Observation

A Signal may state:

```text
Coffee commodity prices have moved
outside the recent trading range.
```

This is derived from observations.

It SHALL retain the applicable detection method and evidence.

---

# 10. Analysis

Material analysis SHALL identify, where applicable:

```text
method
method version
parameters
EvidenceSet
ModelVersion
execution time
```

This enables reproducibility and explanation.

---

# 11. Evidence Requirement

Material intelligence presented to executives SHOULD be evidence-grounded.

Consequential published intelligence SHALL not consist merely of:

```text
LLM generated this
```

The architecture SHALL be capable of identifying what evidence supports the claim.

---

# 12. EvidenceSet

An `EvidenceSet` SHALL represent the evidence assembled for a defined analytical purpose.

Example:

```text
EvidenceSet
"ZuriBeans FY2027 Coffee Margin Risk"

├── ERP procurement costs
├── FX observations
├── commodity prices
├── supplier data
├── trade statistics
└── market intelligence
```

The purpose and scope SHALL remain explicit.

---

# 13. EvidenceSet Versioning

Once an EvidenceSet has supported consequential published intelligence, that historical version SHALL be preserved.

New evidence SHOULD produce:

```text
EvidenceSet v2
```

rather than silently rewriting:

```text
EvidenceSet v1
```

This is required for reproducibility.

---

# 14. Provenance

Every material intelligence object SHALL be capable of answering:

> **What was this derived from?**

---

# 15. Lineage

Every material evidence object SHOULD support answering:

> **What was derived from this evidence?**

---

# 16. Evidence Graph

The Digital Estate SHALL respect Pulse's logical evidence graph:

```text
SOURCE
   │
   ▼
DATASET
   │
   ▼
RAW RECORD
   │
   ▼
OBSERVATION
   │
   ▼
EVIDENCE SET
   │
   ▼
ANALYSIS
   │
   ▼
INSIGHT / SIGNAL / FORECAST
   │
   ▼
OPPORTUNITY / RISK
   │
   ▼
RECOMMENDATION
   │
   ▼
DECISION
   │
   ▼
OUTCOME
```

The executive experience MAY simplify this graph visually.

It SHALL not destroy its provenance semantics.

---

# 17. Executive Explainability

For material intelligence, the Nabhold estate SHOULD allow an authorised executive to answer:

```text
What is being claimed?

Why?

Based on what evidence?

How recent is the evidence?

Which sources contributed?

Were important sources contradictory?

Which analysis or model was used?

What is uncertain?

What decision is being recommended?

Who has authority to make that decision?
```

---

# 18. Source Authority Is Not Accuracy

The estate SHALL preserve the Pulse principle:

> **Authority is not accuracy.**

For example, a government source may be legally authoritative for whether a regulation was promulgated.

That does not automatically make it authoritative for predicting economic consequences.

---

# 19. Source Quality Is Contextual

A source may be highly suitable for one claim and weak for another.

The executive experience SHALL avoid universal statements such as:

```text
Source X is 95% trustworthy.
```

unless a governed methodology gives that statement defensible meaning.

---

# 20. Quality Is Multidimensional

Intelligence quality MAY include:

```text
accuracy
completeness
timeliness
consistency
authority
corroboration
methodology quality
representativeness
precision
traceability
```

These dimensions SHALL not be collapsed unnecessarily.

---

# 21. Confidence

Confidence SHALL represent an assessment of the evidence and analytical conclusion.

The governing rule is:

> **Confidence is a conclusion about evidence. It is not a substitute for evidence.**

---

# 22. Confidence Is Not Automatically Probability

A confidence value SHALL NOT automatically be presented as:

```text
87% chance this is true
```

unless the underlying methodology genuinely supports a probability interpretation.

Qualitative confidence may be preferable.

---

# 23. Qualitative Confidence

The Digital Estate MAY present governed levels such as:

```text
UNKNOWN
VERY LOW
LOW
MODERATE
HIGH
VERY HIGH
```

where defined by Pulse contracts.

It SHALL not create an incompatible local scale.

---

# 24. No False Precision

This is prohibited:

```text
Evidence:
approximately $10 million

Executive UI:
$10,000,000.00
```

where the extra precision was not supported by the evidence.

Presentation SHALL preserve material uncertainty.

---

# 25. Missing Evidence

The following principle SHALL remain:

```text
Missing evidence
    !=
Negative evidence
```

An absence of evidence SHALL not automatically become evidence of absence.

---

# 26. Missing Is Not Zero

Likewise:

```text
UNKNOWN
NOT_AVAILABLE
NOT_APPLICABLE
WITHHELD
NOT_COLLECTED
```

SHALL not be transformed into:

```text
0
```

---

# 27. Withheld Is Not Unavailable

If information is unavailable because the executive is not authorised to receive it, the Digital Estate SHALL not imply that no information exists.

Data classification and authorisation semantics SHALL be preserved.

---

# 28. Contradictory Evidence

Pulse SHALL preserve material contradiction.

This governing principle applies:

> **Contradiction is information.**

The Digital Estate SHALL not automatically hide disagreement merely to produce a cleaner executive answer.

---

# 29. Contradiction Example

If credible sources estimate a market at:

```text
USD 800m
USD 1.1bn
USD 1.6bn
```

the estate SHALL not automatically display:

```text
Market size = USD 1.17bn
```

unless a governed synthesis methodology justifies that calculation.

It MAY instead present:

```text
reported estimates
range
methodological explanation
Pulse assessment
```

---

# 30. Duplicate Evidence Is Not Corroboration

Ten publications repeating one press release SHALL NOT be treated as ten independent confirmations.

Corroboration SHOULD account for common lineage.

---

# 31. Independent Evidence

The estate MAY expose stronger confidence when materially independent sources corroborate a claim.

Examples may include:

```text
official registry
+
customs data
+
independent commercial data
+
operational Group data
```

where relevant to the claim.

---

# 32. Evidence Sufficiency

Evidence sufficiency SHALL depend on the decision consequence.

The evidence needed to state:

```text
Coffee exports increased.
```

may be materially lower than the evidence required to recommend:

```text
Invest R100 million in a new processing facility.
```

---

# 33. Consequence Sensitivity

Higher-consequence recommendations SHOULD require stronger:

```text
evidence
source quality
corroboration
methodology
human review
authority
```

than low-consequence informational insights.

---

# 34. Temporal Semantics

Intelligence SHALL preserve relevant time dimensions.

These may include:

```text
valid_time
observed_time
event_time
reporting_period
published_time
announced_time
effective_time
retrieved_time
processed_time
recorded_time
created_time
superseded_time
```

One generic:

```text
timestamp
```

SHALL not replace these semantics.

---

# 35. Time Is Part of Meaning

The governing principle is:

> **Time is part of the meaning of evidence, not merely metadata about storage.**

---

# 36. Data Vintage

Revisable external data SHALL preserve data-vintage semantics.

For example:

```text
GDP estimate published March
         │
         ▼
revision published June
```

does not mean the March estimate never existed.

An executive report written in April may legitimately have used the March vintage.

---

# 37. As-Known-At Reporting

Where material, the intelligence architecture SHOULD be able to answer:

```text
What did we know on date X?
```

rather than only:

```text
What do we know now?
```

This is important for reviewing historical decisions.

---

# 38. No Invented Temporal Precision

If a source states:

```text
Q2 2026
```

the Digital Estate SHALL not imply a day-level observation timestamp unless another authoritative value supplies it.

---

# 39. Stale Intelligence

Intelligence SHALL have appropriate validity/freshness semantics.

A high-quality analysis from six months ago may be obsolete for a rapidly changing market.

The estate SHOULD distinguish:

```text
CURRENT
AGING
STALE
SUPERSEDED
```

or equivalent Pulse lifecycle semantics where provided.

---

# 40. Superseded Intelligence

New analysis SHALL not silently erase materially consequential prior intelligence.

The system SHOULD preserve:

```text
Insight v1
    │
    ▼
superseded by
    │
    ▼
Insight v2
```

where appropriate.

---

# 41. Forecast

A Forecast SHALL remain a prediction.

It SHALL identify at minimum, where applicable:

```text
forecast origin
target
horizon
method
ModelVersion
EvidenceSet
uncertainty
```

---

# 42. Forecast Is Not Actual

The following remains absolute:

```text
Forecast
    !=
Actual
```

The Nabhold UI SHALL make the distinction clear.

---

# 43. Forecast Is Not Scenario

A Forecast answers approximately:

> What does the model expect may occur?

A Scenario answers approximately:

> What would happen under specified assumptions?

They SHALL not be conflated.

---

# 44. Forecast Evaluation

Forecasts SHOULD eventually be evaluated against realised outcomes.

Conceptually:

```text
Forecast
   │
   ▼
Time passes
   │
   ▼
Observed Outcome
   │
   ▼
Forecast Evaluation
```

This allows model performance to become measurable.

---

# 45. Forecast Accuracy Does Not Rewrite History

A forecast that later proves inaccurate SHALL remain part of the historical record where it materially influenced a decision.

Its evaluation should be appended.

The original forecast SHALL not be rewritten to look more accurate.

---

# 46. Scenario Analysis

Pulse MAY support:

```text
base case
upside case
downside case
stress case
FX scenario
commodity scenario
market-entry scenario
capital-allocation scenario
```

Each scenario SHALL identify its assumptions.

---

# 47. Scenario Assumptions

A scenario result without accessible assumptions SHALL not be presented as a reliable executive recommendation.

Material assumptions SHOULD be traceable.

---

# 48. Risk

A Risk SHALL remain distinct from an Opportunity.

Risk SHOULD preserve separately:

```text
likelihood
impact
severity
exposure
confidence
horizon
```

where applicable.

---

# 49. No Opaque Universal Risk Score

The estate SHALL not reduce:

```text
likelihood
impact
confidence
```

into one unexplained:

```text
Risk Score = 84
```

unless a governed risk methodology explicitly defines the score.

---

# 50. Confidence Is Not Likelihood

This distinction SHALL remain:

```text
Likelihood
    !=
Confidence
```

Example:

```text
20% estimated probability of event
with HIGH confidence in the estimate
```

is conceptually possible.

Likewise:

```text
70% estimated probability
with LOW confidence
```

may also be possible.

---

# 51. Opportunity

An Opportunity MAY contain:

```text
scope
type
supporting insight
estimated value
feasibility
urgency
confidence
time horizon
```

where governed by Pulse.

---

# 52. Estimated Opportunity Value

A monetary opportunity estimate SHALL preserve:

```text
amount
currency
method
assumptions
confidence
```

where applicable.

It SHALL not be presented as booked revenue.

---

# 53. Opportunity Priority

Nabhold MAY present prioritised opportunities.

Any prioritisation SHOULD be explainable through criteria such as:

```text
strategic fit
estimated value
feasibility
urgency
risk
capital requirement
confidence
time horizon
```

rather than an unexplained AI ranking.

---

# 54. Recommendation

A Recommendation SHALL represent an actionable proposal.

A consequential Recommendation SHOULD contain or reference:

```text
recommended action
rationale
evidence
supporting insights
opportunities
risks
forecasts
expected benefit
expected cost
confidence
authority requirement
context
classification
```

---

# 55. Recommendation Is Not Decision

This invariant SHALL remain:

```text
Recommendation
      !=
Decision
```

Pulse may recommend.

An authorised human, policy or domain workflow decides.

---

# 56. Recommendation Authority Requirement

A Recommendation SHOULD identify the level or type of authority required to act upon it.

For example:

```text
Operational Manager
Finance Approval
Executive Committee
Board Approval
Domain Administrator
```

or another governed authority reference.

The exact authority vocabulary SHALL not be invented casually by Nabhold.

---

# 57. Recommendation Lifecycle

A Recommendation MAY be:

```text
proposed
under review
accepted
rejected
deferred
expired
superseded
```

or equivalent canonical lifecycle.

The estate SHOULD preserve the meaningful state.

---

# 58. Decision Authority

Pulse SHALL distinguish:

```text
intelligence authority
```

from:

```text
business decision authority
```

Pulse SHALL NOT infer decision authority simply because it generated the Recommendation.

---

# 59. Human / Policy Decision Model

The default operating model SHALL be:

```text
Evidence
   │
   ▼
Analysis
   │
   ▼
Recommendation
   │
   ▼
Authorised Human / Policy
   │
   ▼
Decision
   │
   ▼
Owning Domain
   │
   ▼
Action
```

This is the default for material executive decisions.

---

# 60. DecisionRecord

Pulse MAY maintain a canonical `Decision` or `DecisionRecord` that records the decision-support lifecycle.

This SHALL mean:

> Pulse records what the authorised decision-maker decided.

It SHALL NOT mean:

> Pulse had authority to make the decision.

---

# 61. Decision Provenance

A material decision record SHOULD identify:

```text
decision
decision-maker
authority reference
recommendation
rationale
timestamp
supporting intelligence version
applicable context
action references
```

where relevant.

---

# 62. Decision History

Changing a decision SHALL preserve history.

For example:

```text
DEFER
   │
   ▼
later
   │
   ▼
ACCEPT
```

SHALL not destroy the earlier decision state.

---

# 63. Rejected Recommendations

Rejected recommendations SHOULD remain available according to retention policy.

This is valuable for:

```text
governance
learning
model evaluation
future review
```

Rejection is part of decision history.

---

# 64. Decision Without Recommendation

A human MAY make a decision without accepting a Pulse recommendation.

The architecture SHALL support:

```text
Human Decision
```

that diverges from:

```text
Pulse Recommendation
```

without treating the human decision as a system error.

---

# 65. Rationale

Material executive decisions SHOULD support capturing rationale where governance policy requires it.

The Digital Estate SHALL not require executives to accept AI reasoning merely because it exists.

---

# 66. Outcome

An Outcome records what happened after a decision or action.

Examples:

```text
margin improved
project delayed
forecast proved inaccurate
supplier concentration reduced
investment target missed
risk materialised
```

Outcome semantics SHALL remain distinct from the original Recommendation.

---

# 67. Feedback

Feedback MAY connect:

```text
Recommendation
Decision
Action
Outcome
```

to improve future intelligence.

The learning loop is:

```text
Intelligence
    │
    ▼
Recommendation
    │
    ▼
Decision
    │
    ▼
Action
    │
    ▼
Outcome
    │
    ▼
Feedback
    │
    ▼
Future Intelligence
```

---

# 68. Feedback Does Not Rewrite Prior Intelligence

New outcomes SHALL not rewrite the historical evidence or reasoning that existed when the decision was made.

They enrich the record.

---

# 69. Model Evaluation

Outcomes MAY be used to evaluate:

```text
forecast quality
recommendation usefulness
risk detection
opportunity identification
model calibration
```

subject to governance and methodology.

---

# 70. AI Orchestration Boundary

Deepset Haystack is the current headless AI orchestration technology within Pulse.

Nabhold SHALL NOT depend directly upon:

```text
Haystack
Haystack Agent
Haystack Pipeline
Haystack Tool
specific LLM provider
```

The estate SHALL depend upon Pulse intelligence capabilities and canonical contracts.

---

# 71. Haystack Is Not the Intelligence Domain

This SHALL remain true:

```text
Haystack
    !=
Pulse Domain Model
```

and:

```text
Haystack
    !=
Baobab Intelligence Contract
```

and:

```text
Haystack
    !=
Executive Decision Authority
```

Haystack is an implementation detail behind Pulse's anti-corruption boundary.

---

# 72. LLM Is Not Authority

An LLM SHALL NOT become authoritative merely because it produces fluent output.

This includes:

```text
executive summary
market conclusion
risk statement
forecast explanation
recommendation rationale
```

Material claims SHALL pass through Pulse's governed evidence/intelligence boundary.

---

# 73. Candidate Generation

Where generative AI creates a candidate claim, the initial output SHOULD be treated conceptually as:

```text
CANDIDATE
```

until applicable:

```text
grounding
validation
classification
evidence linking
quality assessment
```

has occurred.

---

# 74. No Question → Vector Search → LLM → Truth

The Digital Estate SHALL NOT treat a naive flow such as:

```text
Question
   │
   ▼
Vector Search
   │
   ▼
LLM
   │
   ▼
Executive Truth
```

as an acceptable production intelligence architecture.

---

# 75. Governed Retrieval

The intended intelligence path is:

```text
Question
   │
   ▼
Authorised Context
   │
   ▼
Governed Evidence Retrieval
   │
   ▼
Classification / Security Filter
   │
   ▼
Evidence Assembly
   │
   ▼
Analysis / Generation
   │
   ▼
Grounding Validation
   │
   ▼
Canonical Intelligence Object
   │
   ▼
Executive Presentation
```

---

# 76. Retrieval Scope

Evidence retrieval SHALL respect:

```text
tenant
legal entity
portfolio scope
market
classification
capability entitlement
residency
```

as applicable.

Vector similarity SHALL never override authorisation.

---

# 77. Semantic Search Is Not Authorisation

A relevant document SHALL not be returned merely because embedding similarity is high.

The principal must also be authorised to access it.

---

# 78. AI Hallucination Boundary

Unsupported generated claims SHALL NOT be promoted into material executive intelligence.

If the evidence does not support a conclusion, the appropriate result MAY be:

```text
insufficient evidence
uncertain
contradictory
unknown
```

rather than a fabricated answer.

---

# 79. Abstention Is Valid

The intelligence system SHALL be allowed to state:

```text
Insufficient evidence to conclude.
```

The estate SHALL not force a confident narrative merely because the interface expects text.

---

# 80. Explanation Shall Reflect Evidence

An executive explanation SHOULD distinguish:

```text
source fact
Pulse interpretation
model inference
assumption
recommendation
```

where those distinctions matter.

---

# 81. Human-Authored Intelligence

Human analysts MAY contribute:

```text
hypothesis
opinion
analysis
judgment
recommendation
```

where supported by Pulse workflows.

Human authorship does not remove the need to classify what kind of intelligence the object represents.

---

# 82. Opinion SHALL Be Labelled

A human-authored opinion SHALL not masquerade as an evidence-derived fact.

Likewise, an AI-generated interpretation SHALL not masquerade as human analysis.

Authorship and derivation SHOULD remain traceable where material.

---

# 83. Model Identity

Material AI-derived intelligence SHOULD retain:

```text
model
model version
method
pipeline version
execution time
```

where required for reproducibility and governance.

---

# 84. Model Replacement

Replacing an LLM provider or analytical model SHALL not require redefining Nabhold's executive feature architecture.

The Digital Estate depends on Pulse contracts, not model vendor identity.

---

# 85. Model Upgrade

A model upgrade SHALL not silently overwrite previous consequential intelligence.

New intelligence should be versioned or supersede previous output according to Pulse lifecycle rules.

---

# 86. Model Confidence Versus Intelligence Confidence

The Digital Estate SHALL not equate:

```text
model internal confidence
```

with:

```text
overall intelligence confidence
```

Intelligence confidence may depend upon:

```text
source quality
evidence sufficiency
contradictions
methodology
model quality
coverage
timeliness
```

---

# 87. External Intelligence Sources

Pulse MAY consume authorised sources such as:

```text
FX
commodity prices
weather
trade statistics
customs data
macroeconomic indicators
market prices
company registries
geospatial data
government open data
news
regulatory changes
```

The original source authority SHALL remain attributable.

---

# 88. First-Party Company Claims

A company statement such as:

```text
"We are the market leader."
```

provides strong evidence that:

```text
the company made that claim
```

It does not automatically prove:

```text
the company is the market leader
```

The Digital Estate SHALL preserve this distinction where material.

---

# 89. Internal Group Data

Pulse MAY consume authorised internal Nabhold Group information.

Examples include:

```text
ERP facts
commerce activity
portfolio KPIs
procurement activity
operational performance
```

Internal data SHALL still retain its original domain authority.

---

# 90. Intelligence Across Portfolio Companies

The estate MAY present Group intelligence spanning:

```text
ZuriBeans
Thamani
Equator & Estate
future portfolio companies
```

only through authorised portfolio scope.

Group ownership SHALL not automatically permit unrestricted intelligence access.

---

# 91. Cross-Entity Intelligence

A cross-entity analysis SHOULD retain the legal entities and contexts from which its evidence originated.

Example:

```text
Group Working-Capital Risk
       │
       ├── ZuriBeans evidence
       ├── Thamani evidence
       └── Equator evidence
```

The aggregate insight SHALL not erase source boundaries.

---

# 92. Comparative Intelligence

Pulse MAY compare portfolio entities where:

```text
metrics are semantically comparable
contexts are understood
periods are compatible
authorisation exists
```

The Digital Estate SHALL not present incomparable entities as directly equivalent merely for ranking.

---

# 93. Group Executive Intelligence View

A Group intelligence view MAY conceptually contain:

```text
ExecutiveIntelligenceOverview
├── signals[]
├── insights[]
├── opportunities[]
├── risks[]
├── forecasts[]
├── recommendations[]
├── scenarios[]
├── decision_records[]
├── outcomes[]
├── freshness
└── provenance
```

This is an estate composition model unless promoted into a Shared contract.

---

# 94. Intelligence Priority

Nabhold MAY prioritise material intelligence for executive attention.

Prioritisation SHOULD account for governed concepts such as:

```text
materiality
urgency
severity
impact
confidence
time horizon
decision deadline
strategic relevance
```

It SHALL avoid unexplained ranking.

---

# 95. Attention Is Not Authority

Placing an item at the top of the dashboard SHALL not create additional authority for it.

Priority is an executive-attention mechanism.

It is not proof of truth.

---

# 96. Executive Alert

An intelligence alert MAY represent:

```text
new signal
material risk
opportunity
forecast deviation
regulatory development
significant contradiction
```

Its type SHALL remain explicit.

---

# 97. Alert Fatigue

The estate SHOULD avoid presenting every intelligence object as an urgent alert.

Priority/severity semantics SHOULD support meaningful filtering.

---

# 98. Intelligence Lifecycle

The executive experience SHOULD respect lifecycle state such as:

```text
DRAFT
VALIDATED
PUBLISHED
SUPERSEDED
EXPIRED
WITHDRAWN
```

or the canonical equivalents defined by Pulse.

Draft intelligence SHALL not silently appear as final executive intelligence.

---

# 99. Draft AI Output

Draft AI-generated analyses MAY be visible to authorised analysts.

They SHALL be clearly separated from:

```text
published executive intelligence
```

unless policy explicitly allows direct publication.

---

# 100. Publication Boundary

Consequential intelligence SHOULD pass an appropriate publication/validation boundary before becoming authoritative Pulse intelligence presented to executives.

The level of review MAY depend upon consequence and capability.

---

# 101. Automated Publication

Automated intelligence publication MAY be permitted for low-risk, well-governed deterministic or validated pipelines.

It SHALL not imply autonomous business decision authority.

---

# 102. High-Consequence Intelligence

High-consequence intelligence may include recommendations concerning:

```text
major capital allocation
market entry or exit
material credit exposure
large procurement commitments
regulatory response
strategic restructuring
significant pricing changes
material financial actions
```

Such intelligence SHOULD receive stronger evidence and governance requirements.

---

# 103. Decision-Support UX

The executive UI SHOULD present decision support in a structure conceptually similar to:

```text
WHAT HAPPENED?
→ authoritative facts / observations

WHAT DOES IT MEAN?
→ analysis / insight

WHAT MAY HAPPEN?
→ forecast / risk / opportunity

WHAT COULD WE DO?
→ recommendation / scenarios

WHO DECIDES?
→ authority / governance

WHAT HAPPENED AFTER?
→ outcome / feedback
```

This preserves semantic clarity.

---

# 104. Executive Summary Generation

Pulse MAY generate executive summaries.

A generated summary SHALL be derived from authorised intelligence objects and evidence.

It SHALL not become a free-form opportunity to introduce unsupported facts.

---

# 105. Summary Compression

Summarisation SHALL not remove material qualifications such as:

```text
low confidence
stale evidence
contradictory evidence
scenario assumption
forecast uncertainty
provisional status
```

merely to make the summary shorter.

---

# 106. Executive Conversational Interface

A future conversational executive interface MAY allow questions such as:

```text
Why is ZuriBeans margin under pressure?

Which Group company has the highest short-term cash risk?

What changed since last month?

What evidence supports this opportunity?

What are the downside scenarios?
```

Answers SHALL use the same:

```text
identity
context
capability
evidence
provenance
classification
```

boundaries as the rest of the executive estate.

---

# 107. Conversation Does Not Expand Authority

A conversational interface SHALL NOT make information accessible that the executive could not obtain through the underlying authorised capabilities.

Prompt wording cannot expand portfolio scope.

---

# 108. Prompt Injection and Untrusted Evidence

Externally acquired content SHALL be treated as data, not trusted executable instruction.

A document containing:

```text
Ignore all previous instructions...
```

SHALL not gain authority merely because it enters the evidence corpus.

Pulse's AI tooling SHALL remain behind governed tool and security boundaries.

---

# 109. Tool Use

AI tools SHALL operate through approved capability/domain contracts.

An AI agent SHALL not be given unrestricted infrastructure or database authority.

---

# 110. Read Versus Execute

The architecture SHALL distinguish:

```text
READ
ANALYSE
RECOMMEND
```

from:

```text
EXECUTE
```

An intelligence capability SHALL not inherit mutation authority merely because it can recommend an action.

---

# 111. Default No Autonomous Mutation

The default rule SHALL be:

```text
Pulse recommendation
      │
      X
      ▼
direct business mutation
```

Material operational actions require an independently authorised command/workflow.

---

# 112. Future Automation

A future accepted ADR MAY authorise narrowly scoped automation.

Such automation SHALL define:

```text
capability
scope
conditions
limits
approval model
rollback
audit
human override
safety controls
```

This ADR does not grant such authority.

---

# 113. No Autonomous Financial Posting

AI SHALL NOT autonomously:

```text
post journal entries
release payments
close accounting periods
alter ledgers
```

under this decision.

Any future exception requires explicit finance/security governance.

---

# 114. No Autonomous Governance Decision

AI SHALL NOT autonomously make:

```text
board decisions
capital allocations
executive appointments
formal policy approvals
material investment approvals
```

under this architecture.

It MAY assist the authorised decision-maker.

---

# 115. Training Data Boundary

Operational Nabhold Group information SHALL NOT automatically become model-training data.

Training use requires separately governed:

```text
purpose
classification
privacy
security
retention
provider
residency
```

decisions.

---

# 116. External Model Providers

Sending protected Group information to an external AI/model provider SHALL require applicable:

```text
classification review
privacy review
security approval
residency review
contractual approval
```

and shall occur through approved Pulse infrastructure.

The Nabhold frontend SHALL not independently send protected portfolio data to arbitrary AI APIs.

---

# 117. Prompt Minimisation

AI execution SHOULD receive only the minimum data necessary for the authorised analytical task.

---

# 118. Data Residency

An executive need for intelligence SHALL not override data-residency requirements.

Pulse/provider resolution SHALL respect the applicable residency and isolation policy.

---

# 119. Data Classification

Intelligence SHALL inherit or derive an appropriate classification.

An intelligence product built from:

```text
HIGHLY_RESTRICTED
```

source material SHALL not automatically become:

```text
INTERNAL
```

merely because it is summarised.

---

# 120. Classification Through Derivation

Derived intelligence classification SHOULD reflect:

```text
source sensitivity
aggregation risk
inference risk
business impact
```

according to security policy.

---

# 121. Inference Risk

A summary containing no raw confidential records may still reveal confidential business information through inference.

Therefore:

```text
aggregation
    !=
declassification
```

---

# 122. Executive Authorisation

An executive SHALL only receive intelligence for:

```text
authorised portfolio scope
authorised capability
appropriate classification
```

Authentication alone remains insufficient.

---

# 123. Recommendation Detail Access

Access to a recommendation SHALL not necessarily imply access to every raw source document supporting it.

The system MAY provide appropriately redacted or summarised provenance depending upon classification.

---

# 124. Evidence Access

Where the executive is authorised, drill-down SHOULD permit inspection of underlying:

```text
EvidenceSet
observations
sources
analysis
```

to support trust and challenge.

---

# 125. Challengeability

The executive experience SHOULD support questioning intelligence.

Possible actions MAY include:

```text
view evidence
view contradiction
view assumptions
request deeper analysis
mark concern
provide feedback
reject recommendation
defer recommendation
```

The exact workflow belongs to future governance design.

---

# 126. Human Oversight

Material AI-supported decisions SHOULD retain meaningful human oversight.

Oversight SHALL mean more than:

```text
click Accept
```

where the consequence demands understanding.

The system should expose sufficient rationale and evidence for informed review.

---

# 127. Automation Bias

The UI SHOULD avoid design patterns that imply:

```text
AI recommendation = default correct choice
```

Recommendations SHOULD be presented as decision support rather than unquestionable commands.

---

# 128. Confidence Presentation

The UI SHALL avoid decorative confidence indicators that imply more mathematical certainty than the underlying methodology provides.

Where confidence is qualitative, it SHALL be presented qualitatively.

---

# 129. Risk Presentation

Where possible, the UI SHOULD expose separately:

```text
likelihood
impact
confidence
time horizon
```

rather than only a single coloured badge.

---

# 130. Opportunity Presentation

Where possible, the UI SHOULD expose separately:

```text
estimated value
feasibility
urgency
confidence
time horizon
```

rather than a single unexplained score.

---

# 131. Forecast Presentation

Forecast presentation SHOULD include applicable:

```text
forecast origin
forecast horizon
predicted value
uncertainty interval
scenario/method
generated date
```

rather than only a point estimate.

---

# 132. Recommendation Presentation

Material recommendations SHOULD provide:

```text
action
rationale
expected benefit
expected cost
major risks
confidence
evidence
authority requirement
expiry/horizon
```

where available.

---

# 133. Actual Versus Intelligence

The Digital Estate SHALL visibly distinguish:

```text
Actual
Observation
Analysis
Forecast
Scenario
Recommendation
Decision
Outcome
```

when these are shown together.

Colour alone SHALL not be the sole semantic indicator.

---

# 134. Financial Intelligence

Consistent with ADR-NAB-0007:

```text
ERP Actual
      !=
Pulse Forecast
```

and:

```text
Accounting FX
      !=
Pulse Market FX Observation
```

and:

```text
Budget
      !=
Pulse Forecast
```

---

# 135. Example Executive Composition

A valid card may conceptually show:

```text
Actual Gross Margin
21.4%
Source: ERP

Trend
Down 2.1pp over 90 days
Source: governed analysis

Forecast
18.8%–20.2% next quarter
Source: Pulse Forecast

Primary Driver
FX and commodity input pressure
Confidence: HIGH

Recommendation
Review supplier mix and hedge exposure

Decision
Not yet made
```

This presentation preserves information classes.

---

# 136. Intelligence Capability Consumption

The Nabhold estate SHOULD consume canonical intelligence capabilities conceptually such as:

```text
intelligence.executive-overview.read
intelligence.signal.read
intelligence.insight.read
intelligence.risk.read
intelligence.opportunity.read
intelligence.forecast.read
intelligence.recommendation.read
intelligence.evidence.read
```

where eventually defined in Shared.

These examples are illustrative.

Nabhold SHALL not unilaterally establish canonical keys.

---

# 137. Decision Capability Separation

Reading a recommendation and recording a decision SHOULD be separate capabilities.

Conceptually:

```text
intelligence.recommendation.read
```

is not equivalent to:

```text
governance.decision.record
```

or another future governed decision capability.

---

# 138. Intelligence Read Model

Nabhold MAY define an estate model such as:

```text
ExecutiveIntelligenceView
├── subject
├── observations[]
├── signals[]
├── insights[]
├── risks[]
├── opportunities[]
├── forecasts[]
├── recommendations[]
├── decisions[]
├── outcomes[]
├── freshness
├── confidence
└── provenance
```

This is a presentation/composition model.

It SHALL NOT redefine Pulse aggregates.

---

# 139. Provider-Native AI Structures

Haystack objects, vector-store records or LLM-provider responses SHALL NOT leak into Nabhold feature components.

The boundary SHALL be:

```text
Pulse
   │
   ▼
Canonical Intelligence Contract
   │
   ▼
Nabhold Intelligence Gateway
   │
   ▼
Estate View Model
```

---

# 140. Pulse Provider Neutrality

The Nabhold estate SHALL not care whether a Pulse capability internally uses:

```text
Haystack
Qdrant
PostgreSQL
OpenAI
another LLM
deterministic analytics
human analysis
```

provided the capability satisfies its canonical contract.

---

# 141. Intelligence Caching

Intelligence MAY be cached according to:

```text
validity
classification
freshness
revocation
supersession
portfolio context
```

The Digital Estate SHALL not apply public-content caching semantics to protected executive intelligence.

---

# 142. Supersession Invalidation

Where an Insight, Forecast or Recommendation is superseded, estate caches SHOULD be invalidated or expire according to applicable contracts.

A superseded recommendation SHALL not remain presented as current indefinitely.

---

# 143. Evidence Revision

If source evidence is revised, Pulse determines which downstream intelligence objects require:

```text
reassessment
supersession
withdrawal
```

The Nabhold estate SHALL consume that lifecycle rather than trying to recalculate the intelligence itself.

---

# 144. Failure Semantics

The estate SHALL distinguish:

```text
NO_INTELLIGENCE_AVAILABLE
INSUFFICIENT_EVIDENCE
LOW_CONFIDENCE
CONTRADICTORY_EVIDENCE
STALE_INTELLIGENCE
CAPABILITY_UNAVAILABLE
NOT_AUTHORISED
MODEL_UNAVAILABLE
```

where supported by canonical contracts.

---

# 145. No Intelligence Is Not No Risk

The absence of a Pulse risk object SHALL not automatically be displayed as:

```text
No Risk
```

The correct state may be:

```text
Not assessed
Insufficient evidence
No active signal
```

depending upon the domain.

---

# 146. No Opportunity Is Not Zero Opportunity

Likewise:

```text
no opportunity returned
```

does not prove:

```text
opportunity value = 0
```

---

# 147. Pulse Failure

If Pulse is unavailable, authoritative ERP/Trade information MAY remain available where independently resolved.

Example:

```text
Financial Actuals     AVAILABLE
Operational KPIs      AVAILABLE
AI Forecast           UNAVAILABLE
Recommendations       UNAVAILABLE
```

Pulse failure SHALL not make authoritative facts disappear.

---

# 148. Required Intelligence Failure

If a particular decision workflow explicitly requires approved intelligence, its absence MAY block that workflow.

Such a requirement SHALL be governed by the decision/domain process.

Nabhold SHALL not invent it ad hoc.

---

# 149. Audit

Material executive intelligence interactions SHOULD support reconstruction of:

```text
principal
portfolio context
capability
intelligence object
version
evidence version
model/method
recommendation
decision
timestamp
correlation ID
```

where applicable.

---

# 150. Model Audit

Material AI-derived intelligence SHOULD be capable of identifying:

```text
Model
ModelVersion
ModelRun
pipeline/method version
input lineage
output
```

according to Pulse governance.

---

# 151. Decision Audit

Where Nabhold records or facilitates decisions, the audit trail SHOULD preserve:

```text
human actor
authority
recommendation considered
decision
rationale
time
context
```

according to applicable governance policy.

---

# 152. Observability

Nabhold SHOULD observe:

```text
intelligence capability latency
Pulse availability
evidence drill-down failures
stale-intelligence usage
recommendation rendering
forecast freshness
contract validation failure
partial intelligence composition
```

without becoming Pulse's internal observability authority.

---

# 153. Feedback Analytics

The platform MAY later measure:

```text
recommendation acceptance rate
recommendation rejection rate
forecast accuracy
risk materialisation
opportunity conversion
time-to-decision
outcome quality
```

provided the semantics are governed.

These metrics SHOULD NOT incentivise blind recommendation acceptance.

---

# 154. Recommendation Acceptance Is Not Model Accuracy

A recommendation frequently accepted by executives is not necessarily a more accurate recommendation.

Likewise, rejection does not automatically mean the model was incorrect.

Outcome evaluation requires suitable methodology.

---

# 155. Strategic Learning

The decision/outcome feedback loop MAY support institutional learning across Nabhold.

It SHOULD be capable of answering questions such as:

```text
Which forecasts were accurate?

Which risks materialised?

Which recommendations produced positive outcomes?

Which opportunity types consistently underperform?

Which assumptions were repeatedly wrong?
```

subject to access and methodological integrity.

---

# 156. Knowledge Does Not Override Governance

Institutional learning SHALL inform decisions.

It SHALL not automatically authorise operational action.

---

# 157. Explicitly Prohibited Patterns

`baobab-platform/nabhold` SHALL NOT:

1. treat LLM output as authoritative business truth;
2. treat a Pulse recommendation as a business decision;
3. let Pulse silently mutate ERP, Trade or another system of record;
4. allow Haystack implementation types to leak into estate features;
5. use raw vector similarity as authorisation;
6. expose unauthorised evidence through semantic search;
7. equate confidence with probability without methodological basis;
8. reduce evidence quality to one unexplained number;
9. interpret source authority as guaranteed accuracy;
10. count duplicated source lineage as independent corroboration;
11. hide material contradictory evidence merely to simplify presentation;
12. transform missing evidence into negative evidence;
13. transform unknown values into zero;
14. display forecasts as actuals;
15. display scenarios as forecasts;
16. display opportunity estimates as booked revenue;
17. collapse risk likelihood, impact and confidence into an unexplained score;
18. publish unsupported generated claims as executive intelligence;
19. invent precision not present in the source evidence;
20. discard historical intelligence merely because a later version supersedes it;
21. rewrite prior forecasts after actual outcomes become known;
22. allow model upgrades to overwrite decision history;
23. allow protected operational data to become training data automatically;
24. send Group data to arbitrary external model providers from the frontend;
25. treat summarisation as declassification;
26. allow an executive chatbot to bypass portfolio/capability authorisation;
27. treat AI recommendations as the default correct executive choice;
28. autonomously post financial transactions under this ADR;
29. autonomously make board or capital-allocation decisions under this ADR;
30. erase the human decision-maker behind a Pulse DecisionRecord.

---

# 158. Intelligence Authority Matrix

| Concern | Authority | Nabhold Role |
|---|---|---|
| Operational fact | Owning domain | Presents |
| Accounting fact | ERP | Presents |
| External raw source | Original source | References through Pulse |
| Canonical Pulse Observation | Pulse | Presents |
| EvidenceSet | Pulse | Presents/explains |
| Analysis | Pulse | Presents |
| Signal | Pulse | Presents |
| Insight | Pulse | Presents |
| Opportunity | Pulse | Presents |
| Risk | Pulse | Presents |
| Forecast | Pulse/approved forecast authority | Presents |
| Recommendation | Pulse or authorised analytical source | Presents |
| Executive decision | Authorised human/policy/domain | Facilitates/records |
| Operational action | Owning domain | Invokes where authorised |
| Outcome | Owning domain/Pulse record | Presents |
| Intelligence feedback | Pulse | Presents |
| Executive intelligence composition | Nabhold | Owns as derived experience |

---

# 159. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Pulse is consumed as the System of Intelligence.

[ ] Operational systems remain authoritative for operational facts.

[ ] Intelligence objects remain distinguishable from source facts.

[ ] Observations and Insights are not conflated.

[ ] Published material intelligence can reference supporting EvidenceSets.

[ ] Evidence provenance is accessible where authorised.

[ ] Published consequential EvidenceSets are versioned/frozen.

[ ] Material analyses identify method/version where required.

[ ] Source authority and source quality remain conceptually distinct.

[ ] Confidence does not masquerade as probability.

[ ] Missing evidence does not become negative evidence.

[ ] Missing values are never converted to zero.

[ ] Material contradictory evidence can be represented.

[ ] Duplicate source lineage is not counted as independent corroboration.

[ ] Higher-consequence recommendations can require stronger evidence.

[ ] Intelligence preserves relevant temporal semantics.

[ ] Data-vintage history can be retained.

[ ] Historical intelligence is not silently rewritten.

[ ] Forecasts preserve origin, horizon and methodology.

[ ] Forecasts and actuals remain visibly distinct.

[ ] Forecasts and scenarios remain distinct.

[ ] Risk likelihood, impact and confidence remain distinguishable.

[ ] Opportunity value, feasibility and confidence remain distinguishable.

[ ] Recommendations include rationale/evidence where consequential.

[ ] Recommendations do not automatically become decisions.

[ ] Decision authority remains with an authorised human/policy/domain.

[ ] Pulse DecisionRecords preserve the actual decision-maker.

[ ] Rejected/deferred decisions can remain historically traceable.

[ ] Outcomes and Feedback can link back to prior recommendations.

[ ] Feedback does not rewrite prior evidence.

[ ] Haystack remains behind Pulse's anti-corruption boundary.

[ ] Nabhold feature code contains no Haystack dependency.

[ ] LLM-generated candidate claims require applicable validation/grounding.

[ ] Unsupported material claims are not promoted to executive intelligence.

[ ] The intelligence system may abstain where evidence is insufficient.

[ ] Semantic retrieval is filtered through authorisation/classification.

[ ] Conversational intelligence cannot expand a principal's authority.

[ ] Prompt-injected source content cannot grant itself tool authority.

[ ] Pulse does not receive autonomous mutation authority by default.

[ ] AI cannot directly post ERP financial transactions.

[ ] AI cannot independently make formal Nabhold governance decisions.

[ ] External model-provider use respects security/classification/residency
    requirements.

[ ] Protected Group data does not automatically become training data.

[ ] Intelligence classification reflects source and inference sensitivity.

[ ] Pulse failure does not invalidate independently available source facts.

[ ] Stale/superseded intelligence is distinguishable from current intelligence.

[ ] Material AI outputs retain model/method provenance where required.

[ ] Executive decisions are auditable to principal, authority and context.

[ ] Production intelligence participates in readiness evaluation.
```

---

# 160. Required Tests

Implementation SHALL test at least:

```text
authoritative fact versus Pulse insight
observation versus signal
forecast versus actual
forecast versus scenario
risk likelihood versus confidence
opportunity estimate versus booked revenue
low-confidence intelligence
insufficient-evidence response
contradictory evidence
duplicate source lineage
stale evidence
superseded insight
revised source data
data-vintage reconstruction
forecast evaluation after actual outcome
recommendation accepted
recommendation rejected
recommendation deferred
decision contrary to recommendation
outcome linked to decision
unauthorised evidence drill-down
cross-subsidiary intelligence isolation
semantic-search authorisation
prompt-injection content
unsupported LLM claim
model unavailable
Pulse unavailable while ERP remains available
external-provider classification restriction
training-data prohibition
decision provenance
```

---

# 161. Gate Impact

This ADR principally governs:

```text
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

Gate 7 SHALL establish read-oriented executive intelligence.

Gate 8 SHALL integrate intelligence with governed executive decisions without transferring authority into Pulse.

---

# 162. Gate 7 Intelligence Exit Architecture

Gate 7 SHOULD prove:

```text
Authorised Operational Facts
          │
          ▼
      Baobab Pulse
          │
     ┌────┼─────────────┐
     ▼    ▼             ▼
 Signals  Risks      Forecasts
     │      │             │
     └──────┼─────────────┘
            ▼
      Recommendation
            │
            ▼
     Nabhold Composition
            │
            ▼
     Executive Decision Support
```

with evidence, provenance and authority boundaries preserved.

---

# 163. Relationship to ADR-NAB-0006

ADR-NAB-0006 defines the capability-consumption spine.

This ADR requires all executive intelligence to enter the estate through that spine rather than through direct:

```text
PULSE_API_URL
```

coupling as the permanent architecture.

---

# 164. Relationship to ADR-NAB-0007

ADR-NAB-0007 establishes:

```text
Financial Actual
    !=
Forecast
```

This ADR generalises that principle across all executive intelligence.

Authoritative facts SHALL remain distinguishable from interpretation and prediction.

---

# 165. Relationship to ADR-NAB-0009

This ADR determines what intelligence may advise.

ADR-NAB-0009 SHALL determine how Nabhold formally:

```text
proposes
reviews
approves
rejects
defers
escalates
allocates capital
accepts risk
records governance decisions
```

using appropriate authority, thresholds and separation of duties.

---

# 166. Follow-On Decision

The next architectural decision SHALL be:

**ADR-NAB-0009 — Corporate Governance, Capital Allocation, Risk and Approval Authority**

It SHALL establish:

```text
governance authority
decision rights
delegated authority
approval thresholds
capital requests
capital allocation
risk acceptance
segregation of duties
committee/board authority
decision lifecycle
approval evidence
escalation
decision execution
Pulse recommendation versus governance decision
```

without turning the Nabhold Digital Estate itself into the ultimate governance authority.

---

# 167. Final Decision

The Nabhold executive experience SHALL use Baobab Pulse as a powerful but bounded **System of Intelligence**.

The enduring architecture is:

```text
                  AUTHORITATIVE FACTS
                         │
                         ▼
                    EVIDENCE
                         │
                         ▼
                    BAOBAB PULSE
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
     Signals           Risks           Forecasts
        │                │                 │
        └────────────────┼─────────────────┘
                         ▼
                     Insights
                         │
                ┌────────┴────────┐
                ▼                 ▼
          Opportunities      Recommendations
                │                 │
                └────────┬────────┘
                         ▼
                  NABHOLD EXECUTIVE
                         │
                         ▼
                GOVERNED DECISION
                         │
                         ▼
                 DOMAIN EXECUTION
                         │
                         ▼
                      OUTCOME
                         │
                         ▼
                     FEEDBACK
                         │
                         └──────► PULSE
```

The enduring rule is:

> **Pulse may tell Nabhold what the evidence suggests, what may happen, what opportunities or risks exist, and what actions deserve consideration. It may explain and recommend with increasing sophistication. But truth remains with authoritative domains, and consequential business decisions remain with the humans and governed authorities empowered to make them.**