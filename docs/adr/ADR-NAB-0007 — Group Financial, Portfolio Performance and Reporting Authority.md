# ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Financial/Accounting Authority:** `baobab-platform/baobab-erp` / iDempiere for ERP-controlled financial state  
**Operational Authorities:** Applicable Baobab domain engines  
**Intelligence Authority:** `baobab-platform/baobab-pulse` for derived intelligence  
**Control-Plane Authority:** `baobab-platform/baobab-cp`  
**Contract Authority:** `baobab-platform/shared`  
**Architecture Style:** Accounting-authoritative, legal-entity-aware, multi-currency, period-aware, capability-centric, provenance-preserving, analytically separable, consolidation-aware, provider-neutral  
**Decision Type:** Financial authority, group reporting, portfolio-performance and management-information architecture  

**Depends On:**

- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture
- Shared ADR-0005 — ERP System of Record and Boundary Contracts
- ADR-SHARED-007 — Canonical Capability Contracts, Composition Registry and Cross-Engine Provider Model
- ADR-ERP-001 — Implement iDempiere as an Isolated, Headless, Multi-Tenant Baobab ERP Engine
- ADR-ERP-002 — ERP Tenant, Client and Organization Mapping
- ADR-ERP-005 — Baobab ERP Integration API Architecture
- ADR-ERP-006 — ERP Canonical Event Architecture
- ADR-ERP-007 — ERP Canonical Entity and External Reference Mapping Architecture
- ADR-ERP-008 — ERP Financial, Accounting and Multi-Currency Architecture
- ADR-ERP-009 — ERP Market Localisation, Jurisdiction and Regulatory Architecture
- ADR-ERP-011 — ERP Observability, Audit, Reconciliation and Operational Control Architecture
- ADR-ERP-014 — ERP Master Data Ownership, Synchronisation and Reference Data Architecture
- ADR-ERP-015 — ERP Inventory, Warehouse, Procurement and Supply-Chain Architecture
- ADR-ERP-016 — Commerce–ERP Integration and Order-to-Cash Architecture
- ADR-ERP-018 — ERP Reporting, Analytics, Data Export and Intelligence Integration Architecture
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-012 — Intercompany and Inter-Branch Trading, Legal-Entity Relationship and Internal Settlement Model
- Applicable accepted Baobab Pulse ADRs including ADR-PULSE-001 and ADR-PULSE-006

**Supersedes:**

Any interpretation within the Nabhold Digital Estate that allows:

```text
dashboard metric
=
financial truth
```

or:

```text
commerce value
=
accounting revenue
```

or:

```text
Pulse forecast
=
financial actual
```

or:

```text
Nabhold calculated group total
=
authoritative consolidated financial statement
```

without explicit domain authority, semantic definition, reconciliation and provenance.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL present financial and portfolio performance through **governed, source-aware, provenance-preserving Baobab capabilities**.

The fundamental authority model SHALL be:

```text
                    BUSINESS ACTIVITY
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Trade            ERP             Other Domains
    operations       accounting          operations
          │                │                │
          ▼                ▼                ▼
 Operational Facts   Financial Facts   Domain Facts
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                 Governed Reporting /
                 Analytical Projections
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
              Nabhold             Pulse
          presentation &       intelligence /
           composition          forecasting
                  │                 │
                  └────────┬────────┘
                           ▼
                  EXECUTIVE EXPERIENCE
```

The governing rule is:

> **Accounting truth belongs to the accounting domain. Operational truth belongs to the operational domain. Intelligence interprets authorised facts. Nabhold composes and presents them without becoming the authority for any of those underlying facts.**

---

# 2. Financial Truth

iDempiere SHALL remain authoritative for ERP-controlled accounting state including, where applicable:

```text
general ledger
accounts receivable
accounts payable
posted invoices
financial document status
accounting periods
accounting schemas
inventory valuation
costing
payment accounting
tax accounting
financial posting
realised FX
unrealised FX
```

The Nabhold Digital Estate SHALL NOT maintain a parallel authoritative representation of these financial facts.

---

# 3. No Shadow Ledger

Nabhold SHALL NOT implement:

```text
GroupLedger
ShadowLedger
ExecutiveLedger
DashboardLedger
```

or any equivalent local construct that becomes authoritative for posted accounting state.

The Digital Estate MAY retain:

```text
derived summaries
read models
cached projections
presentation calculations
```

provided they remain traceable to authoritative sources.

---

# 4. Portfolio Performance Is Broader Than Accounting

Not every executive KPI is an accounting fact.

Portfolio performance may include:

```text
revenue
gross margin
cash
receivables
orders
GMV
conversion
inventory availability
inventory valuation
shipment performance
customer activity
supplier activity
market exposure
project milestones
occupancy
pipeline
risk
intelligence indicators
```

Different metrics may have different authoritative domains.

Nabhold SHALL not force all executive metrics through ERP merely because ERP owns accounting.

---

# 5. Metric Authority SHALL Be Explicit

Every material executive metric SHALL have an explicit semantic definition containing conceptually:

```text
MetricDefinition
├── metric_key
├── name
├── description
├── source_domain
├── source_capability
├── calculation_semantics
├── scope
├── time_basis
├── currency_basis?
├── aggregation_rule
├── unit
├── freshness_expectation
├── authoritative_classification
└── version
```

Canonical reusable metric definitions SHOULD be governed through the appropriate Shared/domain contracts.

---

# 6. No Metric-by-Dashboard

This pattern is prohibited:

```text
Dashboard A:
Revenue = commerce orders

Dashboard B:
Revenue = posted ERP invoices

Dashboard C:
Revenue = cash received
```

while all three are labelled:

```text
Revenue
```

A business term SHALL have governed semantics.

Where different concepts are required, they SHALL be named differently.

---

# 7. Commerce GMV Is Not Accounting Revenue

This invariant SHALL remain binding:

```text
Commerce GMV
    !=
Accounting Revenue
```

Commerce may know:

```text
cart value
order total
checkout amount
gross merchandise value
promotion value
```

ERP may know:

```text
posted revenue
recognised revenue
invoice value
credits
accounting adjustments
```

They may reconcile.

They are not automatically identical.

---

# 8. Order Total Is Not Invoice Total

Likewise:

```text
Commerce Order Total
      != necessarily
ERP Posted Invoice Total
```

Differences may arise through:

```text
returns
credit notes
tax
cancellation
rounding
shipment timing
invoice timing
discount treatment
accounting policy
```

The Digital Estate SHALL not silently collapse these concepts.

---

# 9. Cash Is Not Revenue

The following SHALL remain distinct:

```text
Revenue
Cash Receipt
Accounts Receivable
Order Value
Invoice Value
```

An executive summary SHALL use the correct semantic label.

---

# 10. Financial Reporting Classes

Nabhold SHALL distinguish at least:

```text
Operational Reporting
Financial Reporting
Statutory Reporting
Management Reporting
Analytical Reporting
Intelligence / Forecasting
```

These classes have different authority and freshness requirements.

---

# 11. Operational Reporting

Operational reporting may include:

```text
open orders
open purchase orders
unreceived purchases
pending invoices
outstanding receivables
pending payments
inventory movements
shipment status
```

The authoritative source SHALL be the domain that owns the operational state.

---

# 12. Financial Reporting

Financial reporting includes:

```text
trial balance
general ledger
income statement
balance sheet
cash-flow supporting schedules
accounts receivable aging
accounts payable aging
posted financial balances
```

Such reports SHALL derive from authoritative ERP accounting state.

---

# 13. Statutory Reporting

Statutory reporting SHALL remain governed by:

```text
legal entity
jurisdiction
accounting schema
local accounting policy
tax configuration
statutory requirements
```

The Nabhold executive estate SHALL not reinterpret statutory reporting merely for group presentation convenience.

---

# 14. Management Reporting

Management reporting MAY introduce dimensions such as:

```text
subsidiary
business unit
Digital Estate
market
channel
product category
customer segment
sector
investment
project
```

These dimensions SHALL NOT rewrite statutory ledgers.

---

# 15. Management Reporting Is Derived

Management reporting MAY reorganise authoritative business facts into decision-useful views.

For example:

```text
ERP Revenue
        │
        ├── Market
        ├── Channel
        ├── Product Group
        └── Portfolio Company
        │
        ▼
Management View
```

The management view remains derived.

---

# 16. Portfolio Company Performance

Nabhold SHALL support portfolio-company reporting within the authorised `ResolvedPortfolioScope`.

Conceptually:

```text
Nabhold Group
    │
    ├── ZuriBeans
    │     └── authorised metrics
    │
    ├── Thamani
    │     └── authorised metrics
    │
    └── Equator & Estate
          └── authorised metrics
```

A portfolio company SHALL not inherit another company's performance data merely because both belong to the Group.

---

# 17. Legal-Entity Scope

Accounting facts SHALL ultimately retain the responsible LegalEntity.

A tenant may contain multiple legal entities.

Therefore:

```text
Tenant
    !=
Ledger
```

and:

```text
Portfolio Company
    != necessarily
one Ledger
```

Nabhold SHALL resolve the relevant legal-entity scope explicitly.

---

# 18. Market Is Not Accounting Entity

The following remains binding:

```text
Market
    !=
Legal Entity
```

A company operating in:

```text
Uganda
South Africa
Kenya
```

does not automatically have three separate accounting entities.

Market-level performance and legal-entity financial reporting SHALL therefore remain distinct dimensions.

---

# 19. Period Semantics

Financial and performance reporting SHALL declare the applicable time basis.

Relevant concepts include:

```text
document_date
accounting_date
posted_at
occurred_at
reporting_period
event_time
data_timestamp
```

These SHALL not be treated as interchangeable.

---

# 20. Financial Period Reporting

Official financial period reporting SHALL normally use accounting semantics.

For example:

```text
FY2026 Q3 revenue
```

SHALL be determined according to approved accounting/reporting period policy, not simply:

```text
records ingested during Q3
```

---

# 21. Late Data

Late event delivery SHALL not move an accounting transaction into an incorrect financial period.

The estate SHALL respect authoritative accounting dates and reporting semantics.

---

# 22. Restatement

Where financial results are restated:

```text
Original Published Result
         │
         ▼
Accounting Restatement
         │
         ▼
Restated Result
```

the system SHALL preserve explicit restatement semantics.

Historical published values SHOULD NOT be silently rewritten without traceability.

---

# 23. Snapshot Reporting

Period-end snapshots MAY be retained where necessary for:

```text
reproducibility
board reporting
historical comparison
audit
```

The snapshot SHALL retain sufficient source and period provenance.

---

# 24. Currency Roles

The architecture SHALL distinguish:

```text
Functional Currency
Document Currency
Price-List Currency
Settlement Currency
Reporting Currency
Consolidation Currency
```

A currency code may occupy several roles.

The roles SHALL not be conflated.

---

# 25. Functional Currency

Each applicable accounting book SHALL have its governed functional/accounting currency.

This currency is not automatically:

```text
tenant currency
market currency
presentation currency
```

---

# 26. Reporting Currency

Nabhold MAY allow executives to view management reporting in a selected or governed reporting currency.

Reporting currency SHALL not alter the underlying financial ledger.

---

# 27. Consolidation Currency

Group financial reporting MAY require a designated consolidation currency.

Conceptually:

```text
ZuriBeans
Functional Currency A
          │
          ▼

Thamani
Functional Currency B
          │
          ▼

Equator
Functional Currency C
          │
          ▼

Approved Translation
          │
          ▼
Group Consolidation Currency
```

The selected consolidation currency is a governance/accounting decision.

It SHALL NOT be chosen ad hoc by a React component.

---

# 28. FX Authority

Nabhold SHALL distinguish:

```text
Market FX Observation
```

from:

```text
Authorised Accounting FX Rate
```

Pulse or external market-data providers MAY observe current market FX.

They SHALL NOT automatically determine accounting conversion.

---

# 29. Accounting FX Provenance

Material converted financial results SHOULD retain:

```text
source currency
target currency
rate
rate type
effective date
rate authority
```

where relevant.

---

# 30. Reporting FX

Management reporting MAY require approved:

```text
average rates
closing rates
management reporting rates
```

depending on financial policy.

Such rates SHALL be explicit.

---

# 31. Scenario FX

Pulse or another analytical capability MAY model:

```text
USD/ZAR +10%
USD/UGX -5%
```

for scenarios.

These SHALL be labelled:

```text
SCENARIO
FORECAST
SENSITIVITY
```

and SHALL not replace official accounting rates.

---

# 32. Historical FX Integrity

Previously posted accounting history SHALL not change merely because a newer market FX rate exists.

The executive estate SHALL consume the authoritative accounting result.

---

# 33. Group Consolidation

Nabhold Group reporting MAY consolidate independently governed legal entities.

Conceptually:

```text
Legal Entity A
      │
Legal Entity B
      │
Legal Entity C
      │
      ▼
Group Reporting Mapping
      │
      ▼
Currency Translation
      │
      ▼
Intercompany Identification
      │
      ▼
Eliminations
      │
      ▼
Consolidated Group View
```

The consolidation process SHALL remain governed.

---

# 34. Consolidation Does Not Change Subsidiary Authority

This invariant SHALL remain:

```text
Group Consolidation
      !=
Transfer of Transaction Authority
```

A consolidated Nabhold view does not make Nabhold the owner of subsidiary ledger transactions.

---

# 35. Subsidiary Ledgers Remain Intact

Consolidation SHALL NOT silently rewrite subsidiary accounting books.

The model is:

```text
Subsidiary Ledgers
      │
      ▼
Consolidation Process
      │
      ▼
Group Reporting
```

not:

```text
Group Reporting
      │
      ▼
rewrite subsidiary ledgers
```

---

# 36. Intercompany Transactions

Intercompany transactions SHALL remain explicitly identifiable.

Relevant facts may include:

```text
origin legal entity
destination legal entity
relationship
intercompany document linkage
due-to
due-from
settlement state
currency
```

These semantics remain governed by ERP and ADR-BCP-012.

---

# 37. Intercompany Eliminations

Consolidation eliminations SHALL be explicit consolidation/reporting facts.

They SHALL NOT silently delete or alter underlying subsidiary transactions.

Conceptually:

```text
Entity A Revenue      +100
Entity B Expense      -100
        │
        ▼
Intercompany Elimination
        │
        ▼
Group External Effect    0
```

The original entity-level transactions remain intact.

---

# 38. Elimination Provenance

An elimination SHOULD retain sufficient evidence to identify:

```text
source entities
source transactions
elimination rule
amount
currency
period
created/approved state
```

according to the responsible finance-domain model.

---

# 39. Group Chart of Accounts

Subsidiaries MAY require different local statutory charts of accounts.

Group reporting MAY therefore use:

```text
Local Chart
      │
      ▼
Explicit Group Mapping
      │
      ▼
Group Reporting Taxonomy
```

Account equivalence SHALL not be inferred merely because two subsidiaries use the same account number or name.

---

# 40. Group Reporting Taxonomy

A future group-level financial taxonomy MAY standardise:

```text
Revenue
Cost of Sales
Gross Profit
Operating Expense
EBITDA
Assets
Liabilities
Cash
Receivables
Payables
```

and other management concepts.

Such taxonomy SHALL be explicitly governed.

It SHALL not replace local statutory accounting structures.

---

# 41. Consolidation Authority

Nabhold's Digital Estate SHALL NOT independently implement authoritative accounting consolidation logic.

If consolidation is implemented through:

```text
ERP
finance capability
governed consolidation service
analytical reporting capability
```

the estate SHALL consume the resulting governed capability.

---

# 42. Temporary Presentation Aggregation

Before a formal consolidation capability exists, Nabhold MAY compose clearly identified management summaries from authorised entity-level data.

Such output SHALL be classified as:

```text
MANAGEMENT VIEW
DERIVED
NON-STATUTORY
```

unless it has passed the applicable reconciliation and consolidation governance.

---

# 43. No False Consolidated Label

A simple sum such as:

```text
ZuriBeans Revenue
+
Thamani Revenue
+
Equator Revenue
```

SHALL NOT automatically be labelled:

```text
Consolidated Group Revenue
```

because proper consolidation may require:

```text
currency translation
intercompany elimination
account mapping
reporting-policy adjustments
ownership treatment
period alignment
```

---

# 44. Analytical Financial Dataset

A financial analytical dataset MAY support group reporting.

Such a dataset SHALL be:

```text
derived
governed
traceable
reconcilable
```

and SHALL retain canonical identifiers.

---

# 45. Reconciliation Gate

A dataset presented as authoritative financial reporting SHALL reconcile to the applicable ERP-controlled financial source.

A material unresolved reconciliation failure SHALL prevent the dataset from being labelled authoritative financial reporting.

---

# 46. Trial Balance Reconciliation

Where ledger-level reporting is involved, analytical projections SHOULD be reconcilable to the ERP trial balance for:

```text
legal entity
period
book/schema
currency basis
```

as applicable.

---

# 47. Reconciliation Status

Executive financial views MAY expose quality/reconciliation state such as:

```text
RECONCILED
PENDING
EXCEPTION
RESTATED
```

where the underlying reporting capability supports such semantics.

The exact canonical vocabulary SHALL be governed outside the UI.

---

# 48. Reporting Plane

Nabhold SHALL consume reporting capabilities rather than treating the production ERP database as a reporting warehouse.

The target architecture is:

```text
iDempiere
   │
   ├── Governed APIs
   ├── Canonical Events
   ├── Reporting Projections
   ├── Governed Exports
   └── Analytical Replication
            │
            ▼
   Reporting / Analytical Plane
            │
            ▼
         Nabhold
```

---

# 49. No Direct BI Against ERP Primary Database

The following is prohibited as the Nabhold architecture:

```text
Nabhold Dashboard
      │
      ▼
ERP PostgreSQL
```

or:

```text
BI Query
      │
      ▼
ERP Primary DB
```

or:

```text
Pulse
      │
      ▼
ERP Primary DB
```

Governed APIs, projections, exports or analytical products SHALL be used instead.

---

# 50. No Cross-Engine SQL

This remains prohibited:

```sql
SELECT *
FROM medusa.orders o
JOIN idempiere.c_invoice i
  ON ...
```

as a Digital Estate integration architecture.

Cross-domain analysis SHALL use canonical identity and governed analytical contracts.

---

# 51. Operational and Analytical Planes

The architecture SHALL distinguish:

```text
Transactional Plane
Reporting Plane
Analytical Plane
Intelligence Plane
Presentation Plane
```

Conceptually:

```text
TRANSACTIONAL
ERP / Trade / Other Domains
        │
        ▼
REPORTING
authoritative / operational reports
        │
        ▼
ANALYTICAL
history / cross-domain / aggregation
        │
        ▼
INTELLIGENCE
forecast / anomaly / recommendation
        │
        ▼
PRESENTATION
Nabhold Executive Estate
```

---

# 52. Authority Does Not Move Downstream

Copying authoritative ERP data into:

```text
warehouse
lake
lakehouse
analytical database
search index
Pulse
Nabhold cache
```

does not transfer accounting authority.

---

# 53. Derived Data SHALL Be Rebuildable

Analytical and presentation projections SHOULD be rebuildable from authoritative inputs where practical.

The Digital Estate SHALL not contain irreplaceable financial truth.

---

# 54. Operational KPI Authority

Operational KPIs SHALL remain attributable to the domains that own their source events/state.

Examples:

| Metric | Likely authority |
|---|---|
| Posted accounting revenue | ERP |
| Accounts receivable | ERP |
| Cash accounting balance | ERP/finance |
| Order count | Trade/commerce |
| GMV | Trade/commerce |
| Inventory valuation | ERP |
| Operational inventory availability | Inventory capability |
| Shipment status | Logistics capability |
| Content engagement | Relevant analytics domain |
| Market-risk signal | Pulse |
| FX market observation | Pulse/external intelligence source |

The exact contract SHALL govern each metric.

---

# 55. Portfolio KPI Model

A portfolio KPI MAY conceptually contain:

```text
PortfolioMetric
├── metric_key
├── portfolio_member
├── legal_entity_scope
├── market_scope?
├── reporting_period
├── value
├── unit
├── currency?
├── source_capability
├── source_domain
├── authoritative_classification
├── data_timestamp
├── retrieved_at
├── status
└── provenance
```

This is an estate view concept unless elevated into a Shared canonical contract.

---

# 56. KPI Classification

Nabhold SHOULD distinguish executive metrics as:

```text
ACCOUNTING
OPERATIONAL
MANAGEMENT
ANALYTICAL
INTELLIGENCE
```

or equivalent governed classification.

This helps prevent visually similar metrics from being interpreted as equivalent authority.

---

# 57. Actuals

The term:

```text
Actual
```

in a financial context SHALL normally refer to authoritative recorded business/accounting state for the applicable metric.

For ledger-derived financial actuals, the source SHALL be ERP-controlled accounting information.

---

# 58. Budget

Budget information SHALL have an explicitly designated authoritative planning source.

That source MAY be:

```text
ERP planning capability
finance planning capability
future budgeting/planning provider
```

as approved by subsequent platform architecture.

The Nabhold Digital Estate SHALL NOT itself become the canonical budget database.

---

# 59. Forecast

Forecasts SHALL remain distinct from actuals and budgets.

A forecast may originate from:

```text
finance planning process
management forecast
Pulse intelligence model
authorised analytical process
```

The source and methodology SHALL be identified.

---

# 60. Budget Is Not Forecast

This invariant SHALL hold:

```text
Budget
    !=
Forecast
```

A budget normally represents an approved planning baseline.

A forecast represents an updated expectation.

The Digital Estate SHALL not merge them merely because both contain future-period numbers.

---

# 61. Forecast Is Not Actual

Likewise:

```text
Forecast
    !=
Actual
```

Predicted revenue SHALL never be displayed as posted revenue.

---

# 62. Budget Versus Actual

Where supported by governed finance/planning capabilities, Nabhold MAY present:

```text
Budget
Actual
Variance
Variance %
```

The calculations SHALL use governed definitions.

Conceptually:

```text
Variance = Actual - Budget
```

may appear simple, but sign conventions and favourable/unfavourable interpretation depend upon metric semantics.

---

# 63. No Generic Variance Semantics

For example:

```text
Revenue Actual > Budget
```

and:

```text
Expense Actual > Budget
```

may have opposite managerial interpretations.

The estate SHALL not encode universal:

```text
positive variance = good
```

logic.

---

# 64. Forecast Versus Actual

Executive views MAY compare:

```text
Actual
Forecast
Latest Estimate
```

provided each has explicit:

```text
source
version
as-of date
scenario
```

where relevant.

---

# 65. Forecast Versioning

Forecasts SHOULD support version identity.

Examples:

```text
FY2027 Budget
FY2027 Forecast v1
FY2027 Forecast v2
FY2027 Latest Estimate
```

The latest model SHALL not silently overwrite earlier decision history where historical comparison is required.

---

# 66. Scenario Analysis

Scenario analysis MAY include:

```text
base case
upside
downside
stress
FX sensitivity
commodity-price sensitivity
volume sensitivity
```

Scenario values SHALL be visually and semantically separated from actual financial reporting.

---

# 67. Pulse Role

Baobab Pulse SHALL act as the System of Intelligence.

It MAY consume authorised financial and operational data to produce:

```text
forecasts
signals
trends
anomalies
risk assessments
recommendations
scenario analyses
```

It SHALL NOT become the financial system of record.

---

# 68. Pulse SHALL Not Create Accounting Facts

Pulse MAY state:

```text
Margin compression risk is increasing.
```

It SHALL NOT independently create:

```text
posted gross margin = X
```

as accounting truth.

---

# 69. Pulse Forecast

A Pulse forecast SHALL remain:

```text
derived intelligence
```

and SHOULD retain:

```text
model identity
model version
input lineage
generated_at
forecast horizon
confidence/evidence where applicable
```

---

# 70. Pulse Recommendation

A recommendation such as:

```text
reduce FX exposure
increase working capital buffer
review supplier concentration
```

does not constitute the underlying executive or finance decision.

Decision authority remains with the authorised human/policy/domain workflow.

---

# 71. Intelligence Provenance

Material intelligence displayed beside financial actuals SHALL retain lineage to the facts and evidence used to derive it.

The user SHOULD be able to distinguish:

```text
Actual
```

from:

```text
Forecast
```

from:

```text
Recommendation
```

without relying solely on colour.

---

# 72. Financial Intelligence Composition

A valid executive experience may therefore render:

```text
Revenue Actual
R 20.4m
Source: ERP

Budget
R 21.0m
Source: Finance Planning

Variance
- R 0.6m
Derived Management Metric

Forecast
R 20.1m
Source: Pulse / Approved Forecast

Risk
"FX exposure increasing"
Source: Pulse
```

The visual composition does not merge their authority.

---

# 73. Financial Read Model

Nabhold MAY own an estate-specific read model such as:

```text
ExecutiveFinancialOverview
├── reporting_scope
├── reporting_period
├── actuals
├── budget?
├── forecast?
├── variances[]
├── working_capital
├── cash
├── portfolio_metrics[]
├── intelligence[]
├── reconciliation_status
├── freshness
└── provenance
```

This SHALL remain a composition model.

It SHALL not become the ledger.

---

# 74. Group Financial Summary

A `GroupFinancialSummary` or equivalent view MAY combine:

```text
entity-level actuals
approved consolidation adjustments
approved FX translation
portfolio KPIs
planning data
intelligence
```

provided each component retains its classification and provenance.

---

# 75. Source Labels

The estate SHOULD provide meaningful source/freshness indicators where they materially affect interpretation.

Examples:

```text
ERP Actual
Management Forecast
Pulse Forecast
Operational Metric
As of 31 August 2026
Updated 10 minutes ago
```

The experience SHOULD not overwhelm users with infrastructure detail.

---

# 76. As-Of Semantics

Every executive view containing material time-sensitive information SHALL have clear as-of semantics.

Conceptually:

```text
reporting_period
data_as_of
generated_at
retrieved_at
```

are separate concepts.

---

# 77. Mixed-Freshness Views

A composed dashboard MAY contain:

```text
ERP actuals as of yesterday
Trade orders live
Pulse forecast generated three hours ago
```

The estate SHALL not imply one uniform freshness timestamp where the sources differ materially.

---

# 78. Stale Financial Data

A cached financial result MAY only be displayed as stale where domain policy permits it.

The estate SHALL not display stale data as current without indication.

---

# 79. Missing Versus Zero

This remains mandatory:

```text
Missing
    !=
Zero
```

```text
Not Reconciled
    !=
Zero
```

```text
Capability Unavailable
    !=
Zero
```

```text
Not Authorised
    !=
Zero
```

---

# 80. Data Quality

Executive reporting SHOULD surface material quality/reconciliation issues where relevant.

Examples may include:

```text
reconciliation pending
source delayed
period not closed
forecast provisional
data incomplete
```

The estate SHALL not conceal uncertainty by presenting false precision.

---

# 81. Closed Periods

Financial results from closed accounting periods SHOULD be presented according to ERP's authoritative state.

If a period is later reopened and restated, the view SHALL follow explicit restatement semantics.

---

# 82. Preliminary Results

A result for an open accounting period MAY be:

```text
PRELIMINARY
```

or equivalent.

The estate SHALL not describe open-period results as final audited/statutory figures unless that status is actually established.

---

# 83. Group-Level Operational Performance

Portfolio performance may aggregate non-financial KPIs.

For example:

```text
orders
shipments
inventory
customers
suppliers
projects
occupancy
sales pipeline
```

Aggregation SHALL only occur where the metric has compatible definitions across contributing entities.

---

# 84. Do Not Sum Incompatible Metrics

The following is prohibited:

```text
ZuriBeans B2B orders
+
Thamani B2C checkouts
=
Group Orders
```

unless a governed metric definition establishes that those units are semantically comparable.

---

# 85. Common Metric Contract

For a KPI to be aggregated across portfolio companies, it SHOULD have:

```text
same metric definition
compatible unit
compatible time basis
compatible scope
compatible currency treatment
```

or a governed transformation between them.

---

# 86. Weighted and Ratio Metrics

Metrics such as:

```text
gross margin %
conversion %
inventory turns
average order value
occupancy %
```

SHALL not normally be aggregated using simple arithmetic averages unless the metric definition explicitly permits that calculation.

---

# 87. No Dashboard Mathematics Without Semantics

The frontend MAY perform deterministic display calculations.

It SHALL NOT invent financial or management methodology.

For example:

```text
sum
percentage change
variance
ratio
```

is only safe where the underlying metric contract defines the semantics.

---

# 88. Materialised Reporting Models

Where scale requires precomputed financial or portfolio reporting, Baobab MAY introduce governed analytical/read models.

Such a model SHALL define:

```text
source systems
source capabilities
scope
refresh
reconciliation
schema
retention
lineage
security
rebuild procedure
```

Nabhold SHALL consume it as a capability.

---

# 89. No Accidental Data Warehouse in Nabhold

A local cache or read model SHALL not gradually become:

```text
Nabhold Finance Database
```

without an explicit architecture decision.

Large-scale historical analytics belongs in a governed analytical plane.

---

# 90. Group Reporting Read Model

A future analytical capability MAY materialise:

```text
GroupReportingModel
├── canonical_legal_entity
├── reporting_period
├── group_account
├── functional_amount
├── translated_amount
├── reporting_currency
├── consolidation_adjustments
├── elimination_reference
├── reconciliation_state
└── provenance
```

The Digital Estate MAY consume such a model.

It SHALL not independently define its accounting semantics.

---

# 91. Authorisation

Financial reporting SHALL respect the executive's resolved:

```text
portfolio scope
legal-entity scope
tenant scope
capability entitlement
data classification
```

Being authorised for:

```text
group performance summary
```

does not necessarily imply access to:

```text
individual supplier invoices
employee payroll
bank details
customer-level receivables
```

---

# 92. Aggregated Access Versus Detail Access

Capability policy MAY distinguish:

```text
finance.summary.read
```

from:

```text
finance.transaction.read
```

or equivalent canonical capabilities.

The Digital Estate SHALL honour that distinction.

---

# 93. Data Minimisation

The Nabhold dashboard SHOULD request the least-detailed data sufficient for the executive use case.

An executive summary requiring:

```text
total receivables
```

SHOULD NOT necessarily retrieve every invoice.

---

# 94. Sensitive Finance Data

Highly sensitive classes MAY include:

```text
bank account details
payroll
individual compensation
tax identifiers
supplier bank changes
payment instructions
```

Ordinary executive dashboard visibility SHALL not automatically expose them.

---

# 95. Financial Commands

If future Nabhold workflows support:

```text
approve budget
approve capital allocation
approve financial exception
```

the action SHALL invoke the authoritative governance/finance capability.

The Nabhold estate SHALL not directly mutate ledger tables.

---

# 96. Financial Posting

The executive estate SHALL NOT directly implement:

```text
journal posting
invoice posting
period close
payment release
```

as local frontend state transitions.

Such commands belong to ERP/domain workflows.

---

# 97. Separation of Duties

Any financial command SHALL retain applicable segregation such as:

```text
prepare
    !=
approve

create journal
    !=
post journal

payment proposal
    !=
payment release
```

Nabhold shall consume these policies rather than replace them.

---

# 98. Financial Audit

Material financial reporting SHALL be traceable.

The platform SHOULD be capable of reconstructing:

```text
principal
portfolio member
legal entity
reporting period
metric definition
source capability
source domain
currency basis
reconciliation state
data timestamp
resolution ID
correlation ID
```

as applicable.

---

# 99. Executive Report Provenance

A generated executive report SHOULD preserve enough provenance that a reviewer can answer:

```text
Where did this value come from?
Which entity did it belong to?
Which period did it represent?
Which currency was used?
Was it actual, budget or forecast?
Was it consolidated?
Were eliminations applied?
Was it reconciled?
```

---

# 100. Report Export

If executives export:

```text
PDF
CSV
spreadsheet
board pack
```

the exported artefact SHOULD preserve:

```text
report title
scope
reporting period
as-of date
currency
status
generated_at
appropriate provenance
```

according to its classification.

---

# 101. Export Is Not New Authority

Exporting an ERP-derived result into a spreadsheet does not make the spreadsheet the accounting authority.

The same applies to:

```text
PDF
presentation
download
email attachment
```

---

# 102. Historical Reporting

Historical reporting SHALL preserve the applicable historical:

```text
legal-entity mappings
group relationships
reporting periods
currency assumptions
account mappings
```

where those materially affect interpretation.

Current organisational structure SHALL not silently rewrite history.

---

# 103. Acquisitions

When a new subsidiary joins the Group, the Digital Estate SHALL not automatically include all historical results as if the entity had always been consolidated.

The applicable finance/consolidation policy SHALL determine:

```text
effective reporting date
ownership treatment
historical comparatives
consolidation treatment
```

---

# 104. Divestitures

When an entity leaves the Group, historical reporting MAY still retain prior-period contribution according to reporting policy.

Current portfolio scope and historical group reporting therefore need not be identical.

---

# 105. Group Ownership Percentage

Where consolidation or portfolio reporting depends upon ownership percentages, the percentage SHALL originate from an authoritative governance/legal/finance source.

The frontend SHALL not infer ownership from:

```text
SUBSIDIARY
```

alone.

---

# 106. Joint Ventures and Affiliates

Not every Group-related entity SHALL be treated as a wholly owned subsidiary.

Future reporting SHALL support distinctions such as:

```text
wholly owned
majority controlled
joint venture
associate
affiliate
```

where governed financial/reporting policy requires them.

---

# 107. Ownership and Consolidation Method

The Digital Estate SHALL not itself determine:

```text
full consolidation
equity method
proportionate treatment
non-consolidation
```

Such decisions belong to financial/governance authority.

---

# 108. Capital Allocation Performance

Nabhold MAY present portfolio capital allocation metrics such as:

```text
capital invested
budget allocated
capital deployed
return
cash generated
variance
```

provided their definitions and sources are governed.

ADR-NAB-0009 SHALL govern the decision/approval workflow around capital allocation.

---

# 109. Investment Return Metrics

Metrics such as:

```text
ROI
ROIC
IRR
NPV
```

SHALL have explicit methodology before use.

The frontend SHALL not invent financial methodology merely to display attractive executive KPIs.

---

# 110. Operational Versus Accounting Profitability

A domain may calculate:

```text
commercial margin
contribution margin
unit margin
```

while ERP provides:

```text
accounting gross profit
operating profit
```

These SHALL be separately named and defined.

---

# 111. Inventory Value Versus Availability

This distinction SHALL remain:

```text
ERP Inventory Valuation
      !=
Operational Inventory Availability
```

The former is accounting/valuation state.

The latter is an operational fulfilment concern.

---

# 112. Cash Position

Where Nabhold presents a Group cash position, the definition SHALL state whether it represents:

```text
ledger cash accounts
bank-reconciled balances
available liquidity
cash + equivalents
forecast liquidity
```

These concepts SHALL not be labelled interchangeably.

---

# 113. Working Capital

A working-capital metric SHALL have governed components, such as applicable:

```text
receivables
inventory
payables
```

The exact formula SHALL be explicit.

---

# 114. Executive Alerts

Financial alerts MAY originate from:

```text
ERP control state
analytical thresholds
Pulse intelligence
risk capabilities
```

The alert SHALL retain its authority class.

For example:

```text
Accounting period closed
→ ERP fact

Receivables exceed approved threshold
→ deterministic analytical/control rule

Cash-flow pressure likely within 30 days
→ forecast/intelligence
```

---

# 115. Materiality

Reporting and alerting MAY eventually use materiality thresholds.

Such thresholds SHALL be governed business/finance policy.

They SHALL not be arbitrary frontend constants.

---

# 116. Precision

Financial values SHALL use exact decimal semantics.

The estate SHALL NOT perform canonical financial computation using binary floating-point arithmetic where exact monetary values are required.

---

# 117. Currency Precision

The estate SHALL not assume:

```text
all currencies use 2 decimal places
```

Currency precision SHALL follow governed contracts.

---

# 118. Quantity Versus Monetary Precision

Quantity precision SHALL remain independent of financial precision.

This matters especially for:

```text
coffee
commodities
agricultural products
bulk trade
```

where quantities and unit prices may require higher precision.

---

# 119. Rounding

Rounding SHALL follow source/domain rules.

The Digital Estate SHALL not independently re-round authoritative totals and then present the changed value as accounting truth.

---

# 120. Financial Capability Consumption

The executive estate SHOULD consume business-facing capabilities conceptually such as:

```text
finance.summary.read
finance.statement.read
finance.receivable.read
finance.payable.read
finance.cash-position.read
finance.management-report.read
finance.group-report.read
finance.budget.read
finance.forecast.read
```

where these are eventually defined by Shared.

These examples are illustrative.

Nabhold SHALL not unilaterally canonicalise them.

---

# 121. Capability Composition

A financial dashboard may require:

```text
portfolio context
        │
        ▼
resolve capabilities
        │
        ├── finance actuals
        ├── operational KPIs
        ├── planning data
        └── intelligence
        │
        ▼
server-side composition
```

Each capability SHALL retain independent authority.

---

# 122. Financial Dashboard Composition

Conceptually:

```text
                      EXECUTIVE
                          │
                          ▼
                  NABHOLD SERVER
                          │
             ┌────────────┼─────────────┐
             │            │             │
             ▼            ▼             ▼
          Finance      Operations     Planning
           Actuals        KPIs       Budget/Forecast
             │            │             │
             └────────────┼─────────────┘
                          │
                          ▼
                   Pulse Intelligence
                          │
                          ▼
                 Executive Composition
                          │
                          ▼
                  Financial Dashboard
```

Pulse remains analytical.

It does not sit upstream of authoritative actuals.

---

# 123. Dashboard Presentation Categories

The UI SHOULD visually distinguish:

```text
Actual
Budget
Forecast
Scenario
Operational KPI
Intelligence
```

where multiple categories occur together.

Colour alone SHOULD NOT be the only distinction.

---

# 124. Group Versus Entity View

The executive experience SHOULD allow authorised movement between:

```text
Group
   │
   ├── Portfolio Summary
   │
   └── Consolidated / Management View

Entity
   │
   ├── ZuriBeans
   ├── Thamani
   └── Equator & Estate
```

A Group number SHALL preserve the ability to explain its contributing scope.

---

# 125. Drill-Down

Drill-down SHALL respect capability entitlement.

A user authorised for:

```text
group financial summary
```

may not necessarily be authorised for:

```text
invoice-level detail
```

The UI SHALL not assume hierarchical drill-down authority.

---

# 126. Cross-Company Comparison

The Digital Estate MAY compare portfolio companies where metrics are semantically compatible.

Example:

```text
Revenue Growth
Gross Margin
Cash Conversion
Operating Expense
```

The comparison SHALL use:

```text
compatible periods
compatible definitions
appropriate currency basis
```

or clearly disclose differences.

---

# 127. Benchmarking

Comparisons across subsidiaries SHALL not obscure materially different:

```text
business models
accounting bases
market contexts
currency bases
reporting periods
```

The estate MAY normalize presentation only under governed metric semantics.

---

# 128. Financial Intelligence Boundary

The definitive chain SHALL be:

```text
ERP / Domain Facts
        │
        ▼
Governed Reporting / Analytics
        │
        ▼
Pulse Intelligence
        │
        ▼
Recommendation / Forecast
        │
        ▼
Executive Decision
```

Never:

```text
Pulse Prediction
      │
      ▼
Financial Actual
```

---

# 129. Provider Neutrality

Although iDempiere is currently the authoritative ERP provider, Nabhold features SHALL depend upon finance/reporting capabilities.

The UI SHOULD NOT depend upon:

```text
AD_Client
AD_Org
C_Invoice
Fact_Acct
```

or other iDempiere-native objects.

Provider-native structures SHALL remain behind capability/domain boundaries.

---

# 130. ERP Replacement

If a future finance capability provider replaces iDempiere while preserving canonical contracts, the executive finance experience SHOULD not require wholesale redesign.

Provider migration is not a reason to redefine financial semantics.

---

# 131. Error Semantics

Financial composition SHALL distinguish:

```text
NOT_AUTHORISED
NOT_AVAILABLE
NOT_RECONCILED
PERIOD_OPEN
PERIOD_CLOSED
PROVISIONAL
RESTATED
STALE
CAPABILITY_UNAVAILABLE
PROVIDER_UNAVAILABLE
```

where supported.

These SHALL not be flattened into:

```text
error
```

when the distinction affects executive interpretation.

---

# 132. Partial Financial Views

Partial financial views MAY be displayed where semantically safe.

Example:

```text
Revenue         AVAILABLE
Receivables     AVAILABLE
Cash Forecast   UNAVAILABLE
Risk Analysis   AVAILABLE
```

The absence of one optional analytical capability need not remove valid actuals.

---

# 133. Decision-Critical Completeness

Where an executive action requires complete financial information, partial composition SHALL not silently enable the action.

Example:

```text
capital approval
```

may require:

```text
actuals
budget
cash
risk
approval state
```

according to the governing workflow.

---

# 134. Reporting Security

Protected financial results SHALL not be cached publicly.

Private caching SHALL remain:

```text
principal-aware
legal-entity-aware
tenant-aware
capability-aware
classification-aware
```

where applicable.

---

# 135. Reporting Data Residency

Group reporting SHALL respect data residency.

The fact that Nabhold executives require consolidated visibility does not automatically permit unrestricted replication of:

```text
detailed financial data
personal data
customer data
supplier data
```

between regions.

Aggregate capabilities MAY reduce unnecessary data movement.

---

# 136. Data Minimisation for Group Views

Where a Group dashboard needs:

```text
revenue
cash
margin
```

it SHOULD prefer governed aggregate capabilities rather than transferring all underlying ledger lines to the Digital Estate.

---

# 137. Audit and Correlation

Executive financial requests SHOULD propagate:

```text
correlation_id
context_id
resolution_id
```

as supported.

The estate SHALL be able to correlate the presented result with the authoritative provider request.

---

# 138. Observability

Nabhold SHOULD observe:

```text
finance capability latency
report freshness
reconciliation exceptions
provider failures
contract validation failures
partial financial views
stale-report usage
```

without becoming the ERP observability authority.

---

# 139. Financial Reporting Readiness

A finance capability being technically reachable SHALL NOT automatically mean it is reporting-ready.

Readiness MAY depend upon:

```text
legal entity provisioned
accounting schema configured
chart configured
currency configured
period configured
canonical mappings complete
reporting contract available
reconciliation passed
required entitlements active
```

---

# 140. Go-Live Gate

The Nabhold executive financial experience SHALL not be marked production-ready merely because the UI renders cards.

Financial go-live SHALL require end-to-end evidence that:

```text
authoritative sources
context
capability resolution
provider response
metric semantics
currency
period
reconciliation
security
provenance
```

behave correctly.

---

# 141. Authority Matrix

| Information | Authority | Nabhold Role |
|---|---|---|
| General ledger | ERP | Presents |
| Posted accounting revenue | ERP | Presents |
| AR/AP | ERP | Presents |
| Accounting periods | ERP | Consumes |
| Inventory valuation | ERP | Presents |
| Order/GMV metrics | Trade | Presents |
| Operational inventory | Inventory/domain capability | Presents |
| Group organisation scope | CP/canonical relationships | Consumes |
| Accounting FX | Finance/ERP policy | Presents |
| Market FX observations | Intelligence/external source | Presents |
| Budget | Approved planning authority | Presents |
| Forecast | Approved forecasting authority | Presents |
| Consolidation adjustments | Finance/consolidation authority | Presents |
| Intercompany eliminations | Finance/consolidation authority | Presents |
| Management KPI definitions | Governed semantic authority | Consumes |
| Intelligence/forecast models | Pulse/intelligence domain | Presents |
| Executive financial composition | Nabhold | Owns as derived experience |
| Accounting truth | ERP | **Does not own** |

---

# 142. Explicitly Prohibited Patterns

`baobab-platform/nabhold` SHALL NOT:

1. maintain a shadow general ledger;
2. treat Commerce GMV as accounting revenue without an approved definition;
3. treat order totals as posted invoice totals;
4. treat cash receipts as revenue;
5. invent financial metric definitions in React components;
6. use market FX as accounting FX without financial authority;
7. silently retranslate posted history using current FX;
8. sum subsidiary financials and call the result consolidated without governed consolidation;
9. eliminate intercompany transactions by deleting underlying facts;
10. rewrite subsidiary ledgers for Group presentation;
11. infer accounting entity from market;
12. infer functional currency from country;
13. query the ERP production database directly;
14. allow Pulse unrestricted ERP database access;
15. perform cross-engine SQL joins;
16. make Pulse authoritative for financial actuals;
17. label forecasts as actuals;
18. merge budget and forecast semantics;
19. create a canonical budget database inside Nabhold;
20. create canonical consolidation logic inside frontend code;
21. ignore reporting-period semantics;
22. overwrite published historical results without restatement semantics;
23. present unavailable data as zero;
24. aggregate incompatible portfolio KPIs;
25. average ratios without governed aggregation rules;
26. expose transaction-level data merely because summary access exists;
27. treat export files as new accounting authority;
28. downgrade financial security for dashboard convenience.

---

# 143. Definition of Done

This ADR is correctly implemented when:

```text
[ ] ERP remains authoritative for posted accounting state.

[ ] Nabhold contains no shadow ledger.

[ ] Financial actuals identify their authoritative source.

[ ] Operational KPIs identify their owning domain.

[ ] GMV and accounting revenue remain distinct.

[ ] Order value and invoice value remain distinct.

[ ] Group financial views retain legal-entity context.

[ ] Market and legal-entity reporting dimensions remain separate.

[ ] Financial reporting uses explicit reporting periods.

[ ] Original, restated and preliminary states can be distinguished.

[ ] Functional, document, reporting and consolidation currencies remain
    semantically distinct.

[ ] Accounting FX is not derived directly from a market FX observation.

[ ] Material currency conversions preserve rate provenance.

[ ] Group consolidation does not rewrite subsidiary ledgers.

[ ] Intercompany transactions remain identifiable.

[ ] Eliminations are explicit consolidation facts.

[ ] Group reporting taxonomy does not destroy local statutory charts.

[ ] A simple sum is not labelled consolidated unless consolidation policy
    permits it.

[ ] Authoritative financial datasets can reconcile to ERP.

[ ] Material failed reconciliation prevents authoritative labelling.

[ ] Nabhold never queries the production ERP database directly.

[ ] Cross-engine SQL is absent.

[ ] Analytical/reporting projections preserve canonical IDs.

[ ] Budget has an explicit authority outside Nabhold.

[ ] Forecast has an explicit source/version.

[ ] Budget, forecast, scenario and actual are visibly distinct.

[ ] Variance semantics are governed by metric definition.

[ ] Pulse-derived finance intelligence remains marked as derived.

[ ] Pulse forecasts retain provenance/model identity where material.

[ ] Executive financial models retain source and freshness metadata.

[ ] Portfolio KPI definitions are governed.

[ ] Incompatible KPI definitions cannot be blindly aggregated.

[ ] Ratio and percentage aggregation follows governed methodology.

[ ] Missing/unavailable financial data is not represented as zero.

[ ] Summary access does not automatically permit transaction-level detail.

[ ] Sensitive financial data remains separately authorised.

[ ] Financial actions use authoritative domain capabilities.

[ ] The Nabhold estate performs no direct ledger mutation.

[ ] Financial reports remain context- and legal-entity-aware.

[ ] Provider-native iDempiere objects do not leak into feature components.

[ ] Finance capability provider replacement does not require redesign of
    executive features when contracts remain compatible.

[ ] Reporting readiness is verified before financial go-live.
```

---

# 144. Required Tests

The implementation SHALL test at least:

```text
ERP actual versus commerce GMV
order versus invoice reconciliation
multi-legal-entity reporting
multi-currency reporting
reporting-currency translation
accounting versus market FX
historical FX preservation
intercompany transactions
intercompany elimination
group consolidation
unconsolidated management view
budget versus actual
forecast versus actual
forecast version change
scenario analysis
period open/closed state
financial restatement
portfolio scope revocation
summary-versus-detail authorisation
partial finance capability outage
stale financial report
failed reconciliation
cross-tenant finance-cache isolation
Pulse intelligence without ERP authority
```

---

# 145. Gate Impact

This ADR principally governs:

```text
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

**Gate 7 is the primary implementation gate for this ADR.**

---

# 146. Gate 7 Exit Requirements

Gate 7 SHOULD prove:

```text
Resolved Portfolio Scope
        │
        ▼
Finance Capability Resolution
        │
        ▼
Legal-Entity-Aware ERP Reporting
        │
        ├── Actuals
        ├── Receivables
        ├── Payables
        ├── Cash
        └── other approved facts
        │
        ▼
Operational KPIs
        │
        ▼
Approved Planning / Forecast Inputs
        │
        ▼
Pulse Intelligence
        │
        ▼
Executive Composition
```

with provenance and correct authority boundaries.

---

# 147. Relationship to ADR-NAB-0005

ADR-NAB-0005 determines:

```text
which portfolio members
which legal entities
which tenant contexts
```

are visible to an executive.

This ADR determines how financial/performance information is interpreted once that scope has been established.

---

# 148. Relationship to ADR-NAB-0006

ADR-NAB-0006 establishes the capability composition spine.

This ADR requires finance, operations, planning and intelligence to plug into that spine rather than creating provider-specific dashboard integrations.

---

# 149. Relationship to ADR-NAB-0008

The next ADR SHALL define the intelligence boundary in more detail.

ADR-NAB-0007 establishes the non-negotiable premise:

```text
Financial Actual
      !=
Pulse Intelligence
```

ADR-NAB-0008 SHALL define how Pulse intelligence may:

```text
explain
forecast
detect
recommend
prioritise
```

without silently becoming domain truth or executive decision authority.

---

# 150. Follow-On Decision

The next architectural decision SHALL be:

**ADR-NAB-0008 — Executive Intelligence and Decision-Support Boundary**

It SHALL define:

```text
authoritative facts versus intelligence
evidence
confidence
provenance
signals
forecasts
risks
opportunities
recommendations
scenario analysis
explainability
human decision authority
decision records
feedback/outcomes
AI-assisted executive experience
```

---

# 151. Final Decision

Nabhold's financial executive experience SHALL present a coherent Group view while preserving the authority of every contributing domain.

The enduring architecture is:

```text
              NABHOLD GROUP PORTFOLIO
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   ZuriBeans         Thamani       Equator & Estate
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
              AUTHORITATIVE DOMAINS
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
       ERP            Trade          Other Domains
   accounting        operations       operations
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
                GOVERNED REPORTING
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
      Group / Management       Pulse Intelligence
         Reporting             Forecast / Risk
             │                     │
             └──────────┬──────────┘
                        ▼
                 NABHOLD SERVER
                   COMPOSITION
                        │
                        ▼
                EXECUTIVE EXPERIENCE
```

The enduring rule is:

> **Nabhold may aggregate the view, but it may not aggregate away the truth boundaries. Accounting facts remain accounting facts, operational metrics remain domain facts, forecasts remain forecasts, intelligence remains intelligence, and every Group number must remain explainable back to its authoritative source and reporting context.**