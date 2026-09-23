# ADR-NAB-0010 — Protected Corporate Documents, Classification and Information Access

**Status:** Accepted  
**Date:** 2026-09-20  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** `baobab-platform/nabhold`  
**Digital Estate:** Nabhold Group Africa Corporate Digital Estate  
**Document Authorities:** Applicable authoritative document/content/records domains resolved through Baobab  
**Content Authority:** `baobab-platform/baobab-cms` / Payload CMS for editorial content  
**ERP Evidence Authority:** `baobab-platform/baobab-erp` for ERP-owned records and attachments  
**Governance Authority:** Authoritative governance capability/domain for governance records  
**Identity Authority:** `baobab-platform/baobab-iam`  
**Platform Context and Capability Authority:** `baobab-platform/baobab-cp`  
**Contract Authority:** `baobab-platform/shared`  
**Architecture Style:** Classification-aware, provider-neutral, version-preserving, context-authorised, least-privilege, evidence-preserving, encrypted, auditable, retention-aware, fail-closed  
**Decision Type:** Protected information, corporate-document, records-access and evidence architecture  

**Depends On:**

- ADR-NAB-0003 — Nabhold Corporate Digital Estate Capability Ownership, Platform Consumption and Authority Boundaries
- ADR-NAB-0004 — Federated Identity, Authentication and Executive Authorisation
- ADR-NAB-0005 — Canonical Organisation Context, Group Portfolio Scope and Legal-Entity Relationship Consumption
- ADR-NAB-0006 — Executive Experience Capability Consumption and Server-Side Composition Architecture
- ADR-NAB-0007 — Group Financial, Portfolio Performance and Reporting Authority
- ADR-NAB-0008 — Executive Intelligence and Decision-Support Boundary
- ADR-NAB-0009 — Corporate Governance, Capital Allocation, Risk and Approval Authority
- ADR-CMS-0011 — Adopt Payload CMS as the Baobab Content Engine
- ADR-CMS-0012 — Payload CMS Multi-Tenancy and Content Isolation Architecture
- ADR-CMS-0013 — Payload Canonical Content Identity and External Mapping
- ADR-CMS-0016 — Payload Media, Asset Storage and Delivery Architecture
- ADR-CMS-0017 — Payload Identity, Authentication, Authorisation and Editorial Administration
- ADR-CMS-0019 — Payload Content Schema Governance, Versioning and Migration
- ADR-ERP-017 — ERP Document, Attachment, Records Retention and Evidence Architecture
- ADR-BCP-004 — Context, Market, Geography, Legal-Entity and Digital Estate Resolution Model
- ADR-BCP-007 — Control Plane APIs, Capability Resolution Contracts, Caching, Resolution Assertions and Service-to-Service Consumption Model
- ADR-BCP-008 — Control Plane Audit, Observability, Reconciliation, Readiness and Operational Governance Model
- ADR-BCP-009 — Capability-Centric Security, Isolation, Residency, Revocation and Failure Semantics
- Baobab IAM ADR-0008 — Platform Authorization Architecture
- Baobab IAM ADR-0009 — Workforce SSO and Privileged Access
- Baobab IAM ADR-0015 — Credential Security, MFA, Passkeys and Account Recovery
- Baobab IAM ADR-0016 — Identity Lifecycle, Revocation and Deprovisioning
- Baobab IAM ADR-0017 — IAM Audit, Security Events and Observability
- ADR-SHARED-007 — Canonical Capability Contracts, Composition Registry and Cross-Engine Provider Model
- Applicable canonical classification, evidence, records, storage and event contracts

**Supersedes:**

Any interpretation that allows:

```text
document visible in Nabhold
=
document owned by Nabhold
```

or:

```text
same tenant
=
all documents visible
```

or:

```text
executive
=
all corporate documents accessible
```

or:

```text
board member
=
all board material accessible forever
```

or:

```text
signed URL
=
document identity
```

or:

```text
download permission
=
view permission
```

or:

```text
summary
=
declassified source
```

or:

```text
document copied into AI/vector store
=
safe for broader retrieval
```

or:

```text
file deleted from UI
=
record lawfully destroyed
```

without explicit authority, classification, retention and lifecycle policy.

---

# 1. Executive Decision

The Nabhold Corporate Digital Estate SHALL consume protected corporate information through **authoritative, classification-aware document capabilities**.

The normal protected-document path SHALL be:

```text
Authenticated Executive
          │
          ▼
Nabhold Server / BFF
          │
          ▼
Resolve Principal + Context
          │
          ▼
Resolve Document Capability
          │
          ▼
Authoritative Document Provider
          │
     ┌────┼─────────┐
     │    │         │
     ▼    ▼         ▼
 Access  Classification
 Policy  & Lifecycle
     │    │
     └────┼─────────┘
          ▼
Authorised Document Representation
          │
          ▼
Nabhold Protected Experience
```

The governing rule is:

> **Nabhold may present protected corporate information, but document identity, authoritative content, classification, version history, retention and evidence integrity remain with the domain authorised to own them.**

---

# 2. Document Is Not One Domain

Baobab SHALL NOT assume every file or document belongs to the same system.

Examples:

```text
Public corporate article
→ CMS

Brand presentation
→ CMS

ERP invoice attachment
→ ERP evidence domain

Supplier financial evidence
→ applicable supplier/ERP domain

Board paper
→ governance/protected-document domain

Capital proposal
→ governance domain

Signed contract
→ contract/governance/document authority

Pulse intelligence report
→ Pulse

Statutory financial report
→ ERP/reporting authority
```

The binary format does not determine domain ownership.

---

# 3. File Is Not Document Authority

A PDF file existing in object storage does not determine:

```text
who owns it
what it means
who may read it
how long it must be retained
whether it may be deleted
```

Authority comes from the governing domain.

---

# 4. Nabhold Shall Not Become the Corporate DMS Accidentally

This architecture rejects:

```text
nabhold database
├── board PDFs
├── contracts
├── legal papers
├── capital proposals
├── financial packs
└── risk reports
```

becoming the Group's authoritative document repository merely because the executive frontend needs access to those artefacts.

---

# 5. Provider-Neutral Protected-Document Capability

Nabhold SHOULD consume protected documents through an abstraction such as:

```text
ProtectedDocumentGateway
```

Conceptually:

```text
ProtectedDocumentGateway
├── getDocument()
├── getVersion()
├── listVersions()
├── getMetadata()
├── getAuthorisedPreview()
├── requestDownload()
├── getDecisionEvidence()
└── getAccessHistory()
```

Exact interfaces remain implementation details.

---

# 6. Possible Providers

A protected-document capability MAY resolve to:

```text
Payload CMS
ERP document/evidence provider
governance provider
future enterprise DMS
approved records system
specialised legal/document provider
```

Provider selection SHALL be resolved through Baobab architecture rather than embedded in React components.

---

# 7. Payload CMS Boundary

Payload CMS remains authoritative for editorial content including, where applicable:

```text
pages
articles
news
campaigns
brand documents
public media
editorial documents
publication state
editorial metadata
```

Payload SHALL NOT automatically become authoritative for:

```text
board resolutions
signed contracts
statutory evidence
ERP attachments
capital-allocation decisions
formal legal records
```

merely because it can store files.

---

# 8. ERP Evidence Boundary

ERP SHALL remain authoritative for records and attachments whose meaning derives from ERP business state.

Examples may include:

```text
invoice attachments
purchase-document evidence
payment evidence
accounting supporting documents
procurement records
asset evidence
```

Copying such a document into another store SHALL not transfer ERP evidence authority.

---

# 9. Governance Document Boundary

Documents forming material governance evidence SHOULD be associated with the authoritative governance matter.

Examples:

```text
board paper
committee pack
capital proposal
risk paper
resolution
approval memorandum
decision evidence
```

The governance record SHALL reference the exact document/version considered.

---

# 10. Pulse Intelligence Documents

Pulse may produce:

```text
Executive Brief
Opportunity Report
Risk Report
Research Report
Market Study
```

Such artefacts remain Pulse intelligence products.

They SHALL not become formal governance decisions merely because attached to a board pack.

---

# 11. Document Categories

Nabhold's protected estate SHOULD support documents such as:

```text
Board Papers
Committee Papers
Strategy Documents
Capital Proposals
Risk Reports
Legal Documents
Contracts
Financial Reports
Policies
Governance Evidence
Audit Material
Confidential Intelligence
Corporate Records
```

This list does not assign ownership.

---

# 12. Document Versus Record

The architecture SHALL distinguish:

```text
working document
```

from:

```text
official record
```

A draft PowerPoint and an approved board resolution may both be files.

Their governance semantics are materially different.

---

# 13. Working Document

A working document MAY allow controlled:

```text
editing
commenting
draft replacement
collaboration
```

according to its owner.

---

# 14. Corporate Record

A corporate record may require:

```text
immutability
retention
version preservation
legal hold
audit
integrity evidence
restricted deletion
```

The estate SHALL not treat records as ordinary editable CMS content.

---

# 15. Canonical Document Identity

Long-lived corporate documents SHOULD use stable canonical identity where they cross domain/provider boundaries.

Conceptually:

```text
Document
├── canonical_document_id
├── document_type
├── owning_domain
├── owner_legal_entity
├── classification
├── current_version
└── lifecycle
```

Exact contracts SHALL be governed in Shared.

---

# 16. Provider Identifier Is Not Canonical Identity

The following SHALL NOT automatically become canonical document identity:

```text
Payload ID
ERP attachment ID
object-store key
filename
URL
bucket path
database row ID
```

---

# 17. Filename Is Not Identity

Two documents may legitimately be named:

```text
Board-Pack.pdf
```

Filename equality SHALL not imply document identity.

---

# 18. URL Is Not Identity

A delivery URL may change because of:

```text
CDN changes
storage migration
regional deployment
signed URL rotation
provider replacement
```

Document identity SHALL survive those changes.

---

# 19. Binary Object Versus Document

The architecture SHALL distinguish:

```text
Document
```

from:

```text
DocumentVersion
```

from:

```text
BinaryObject
```

from:

```text
DeliveryURL
```

---

# 20. Conceptual Document Model

A protected document MAY conceptually contain:

```text
ProtectedDocument
├── document_id
├── document_type
├── owning_domain
├── owner_legal_entity
├── tenant_scope
├── governance_matter_ref?
├── title
├── classification
├── lifecycle_state
├── current_version_id
├── retention_policy_ref?
├── legal_hold?
├── created_at
└── provenance
```

---

# 21. Document Version

Conceptually:

```text
DocumentVersion
├── version_id
├── document_id
├── version_number
├── checksum
├── media_type
├── size
├── created_by
├── created_at
├── effective_at?
├── supersedes?
├── binary_reference
├── classification
└── provenance
```

---

# 22. Document Version Is First-Class

A material document version SHALL not be represented merely as:

```text
updated_at
```

on one mutable record.

---

# 23. Decision Evidence Requires Exact Version

Where a document contributed to a corporate decision:

```text
Decision
   │
   ▼
Document Version
```

SHALL be preserved.

Not merely:

```text
Decision
   │
   ▼
Current Document
```

---

# 24. Later Editing Must Not Change Historical Evidence

If:

```text
Capital Proposal v3
```

was approved, later creation of:

```text
Capital Proposal v4
```

SHALL not make the historical decision appear to have considered v4.

---

# 25. Published / Recorded Versions

A document version designated as an official record SHOULD be immutable.

Corrections SHOULD use:

```text
new version
superseding record
correcting record
```

rather than destructive rewriting.

---

# 26. Checksums

Material document versions SHOULD maintain integrity metadata such as a cryptographic checksum.

Checksums MAY support:

```text
integrity verification
duplicate detection
audit
evidence verification
```

A checksum is not document identity.

---

# 27. Classification

Protected corporate documents SHALL carry explicit security classification.

The Baobab classification model MAY include canonical states such as:

```text
PUBLIC
INTERNAL
TENANT_CONFIDENTIAL
RESTRICTED
HIGHLY_RESTRICTED
```

Exact vocabulary SHALL remain governed by Shared/security policy.

---

# 28. Classification Drives Policy

Classification SHOULD influence:

```text
access
encryption
delivery
download
export
sharing
retention
logging
indexing
AI use
residency
backup
cache
```

---

# 29. Classification Is Not Ownership

A document may be:

```text
HIGHLY_RESTRICTED
```

and still belong to:

```text
ZuriBeans
```

rather than Nabhold Group.

Classification and ownership are distinct dimensions.

---

# 30. Classification Is Not Tenant

Likewise:

```text
classification
    !=
tenant
```

Two documents in the same tenant may have materially different access policies.

---

# 31. PUBLIC

`PUBLIC` content MAY be available without authentication according to publication state.

Public classification SHALL not automatically mean every draft/publication version is public.

---

# 32. INTERNAL

`INTERNAL` SHOULD mean intended for authorised internal audiences.

It SHALL NOT mean:

```text
any authenticated employee may read it
```

unless policy explicitly establishes that scope.

---

# 33. TENANT_CONFIDENTIAL

Tenant-confidential information SHOULD remain constrained to authorised actors within the applicable tenant/context.

Same-Group membership SHALL not automatically override this classification.

---

# 34. RESTRICTED

Restricted material SHOULD require narrower:

```text
role/relationship
need-to-know
capability
document scope
```

than general tenant access.

---

# 35. HIGHLY_RESTRICTED

Highly restricted content MAY require:

```text
explicit assignment
stronger assurance
shorter session age
download restrictions
enhanced audit
additional residency controls
```

as governed by policy.

---

# 36. Classification Inheritance

A derived document SHOULD normally inherit classification at least as restrictive as required by its source material.

---

# 37. Summarisation Is Not Declassification

This SHALL remain binding:

```text
Confidential Source
      │
      ▼
Short Summary
      │
      X
      ▼
Automatically Public
```

A summary may still disclose confidential information.

---

# 38. Aggregation Is Not Declassification

Combining confidential records into a dashboard or briefing does not automatically make the result less sensitive.

---

# 39. Inference Risk

Information may remain sensitive even when individual source values are removed.

Example:

```text
"Board considering sale of subsidiary"
```

may itself be highly sensitive.

---

# 40. Reclassification

Document classification changes SHALL require appropriate authority.

The Digital Estate SHALL not permit arbitrary reclassification through client-side state.

---

# 41. Downgrade Governance

Classification downgrade SHOULD receive stronger scrutiny than an upgrade because it expands potential disclosure.

Where required, downgrade SHALL record:

```text
actor
old classification
new classification
reason
authority
timestamp
```

---

# 42. Access Is Multi-Dimensional

Protected-document access MAY depend upon:

```text
principal
tenant
legal entity
Digital Estate
portfolio relationship
document classification
governance matter
committee membership
capability
document-specific grant
authentication assurance
effective time
```

where relevant.

---

# 43. Authentication Is Insufficient

This remains true:

```text
Authenticated
    !=
May Read Document
```

---

# 44. Executive Is Insufficient

Likewise:

```text
Executive
    !=
May Read Every Corporate Document
```

---

# 45. Group Scope Does Not Grant All Documents

An executive authorised to view:

```text
Thamani financial summary
```

is not automatically authorised to read:

```text
Thamani privileged legal advice
employee records
supplier bank instructions
restricted board material
```

---

# 46. Board Membership Is Not Universal Document Access

Board membership MAY establish access to applicable board materials.

It SHALL not automatically establish perpetual access to every board document across every entity.

---

# 47. Committee Membership

Committee documents MAY require:

```text
current committee membership
matter participation
classification entitlement
```

or other governed conditions.

---

# 48. Recusal and Document Access

Where governance policy requires it, recusal from a matter MAY restrict continuing access to certain matter-specific documents.

The exact policy belongs to governance.

---

# 49. Need-to-Know

Highly sensitive documents MAY require document- or matter-specific need-to-know access beyond ordinary role membership.

---

# 50. Document Access Rights

The architecture SHOULD distinguish operations such as:

```text
DISCOVER
VIEW_METADATA
PREVIEW
VIEW
DOWNLOAD
PRINT
SHARE
ANNOTATE
UPLOAD_VERSION
CLASSIFY
RECLASSIFY
PLACE_HOLD
RELEASE_HOLD
DELETE
ADMINISTER
```

Exact canonical operations SHALL be governed through capability/domain contracts.

---

# 51. View Is Not Download

This invariant SHALL hold:

```text
VIEW
    !=
DOWNLOAD
```

A user may be permitted to inspect a document without receiving a durable local copy.

---

# 52. Preview Is Not Download

A secure preview capability MAY permit in-browser inspection while withholding direct binary download.

---

# 53. Download Is Not Share

Likewise:

```text
DOWNLOAD
    !=
SHARE
```

---

# 54. Edit Is Not Reclassify

A person permitted to edit document content SHALL not automatically possess authority to lower its security classification.

---

# 55. Administrative Access

System administrators SHALL NOT automatically receive business permission to read document contents.

Infrastructure access and content access are separate privilege domains.

---

# 56. IAM Administrator

IAM administration SHALL NOT automatically grant:

```text
board-document access
legal-document access
capital-pack access
```

---

# 57. CP Administrator

Control Plane administrators likewise SHALL NOT automatically receive protected business-document contents.

---

# 58. CMS Administrator

A Payload technical administrator SHALL not automatically become authorised to read every highly restricted corporate record merely because the provider is Payload.

Provider-level privileged access SHOULD be minimised and audited.

---

# 59. Service Accounts

Workload access SHALL be scoped narrowly.

A document-indexing workload does not automatically need:

```text
download all documents
```

unless that access is necessary and explicitly granted.

---

# 60. Step-Up Authentication

Access to particularly sensitive documents MAY require IAM-controlled step-up authentication.

Examples may include:

```text
acquisition material
privileged legal advice
board papers
major capital transactions
security incident reports
```

---

# 61. MFA Is Not Document Permission

This remains binding:

```text
MFA success
    !=
document authorisation
```

MFA increases authentication assurance.

The document/domain policy determines access.

---

# 62. Server-Side Enforcement

Protected document operations SHALL be enforced through trusted server/provider boundaries.

Client-side controls are not sufficient.

---

# 63. Browser Context Is Request Intent

This is prohibited:

```text
/document?id=X&classification=INTERNAL
```

therefore:

```text
allow X
```

The server SHALL resolve the actual document, classification and access policy.

---

# 64. Deep-Link Safety

Possessing:

```text
/governance/documents/abc
```

SHALL not prove authority.

Every protected deep link SHALL re-evaluate access.

---

# 65. Notifications

Notifications may contain protected-document links.

Opening the link SHALL perform current authorisation.

A notification does not confer access.

---

# 66. Revocation

If document access is revoked:

```text
future provider access
=
DENIED
```

according to applicable revocation guarantees.

No application redeployment SHALL be required.

---

# 67. Already Downloaded Copies

The architecture SHALL recognise an unavoidable security fact:

> Once an authorised user downloads an unrestricted local copy, server-side revocation cannot reliably recall every copy.

Therefore high-sensitivity classifications MAY restrict downloads.

---

# 68. Controlled Delivery

Private document delivery MAY use:

```text
authenticated proxy
signed URL
signed cookie
restricted CDN
secure viewer
```

according to provider policy.

---

# 69. Signed URL

A signed URL SHALL be:

```text
time-bounded
resource-specific
generated after authorisation
non-canonical
```

---

# 70. Signed URL Is a Delivery Credential

A signed URL SHALL NOT become:

```text
document identity
permanent bookmark
authorization record
```

---

# 71. URL Leakage

The architecture SHALL assume URLs can leak through:

```text
browser history
logs
referrer headers
screen captures
messages
```

Private access SHALL not depend on secrecy of the URL alone.

---

# 72. Direct Object-Store Access

Nabhold feature code SHALL not construct object-storage paths directly.

This is prohibited:

```text
https://bucket/.../{tenant}/{filename}
```

as the normal protected-document integration.

---

# 73. Object Storage

Durable binaries SHALL live in an approved durable storage mechanism.

Application containers SHALL not be the production system of record for document binaries.

---

# 74. Storage Provider Neutrality

Document semantics SHALL not depend upon:

```text
AWS S3
Azure Blob
GCS
MinIO
specific CDN
```

provider identity.

---

# 75. Tenant Isolation

Object storage SHALL preserve required tenant isolation.

A discoverable storage key SHALL not provide cross-tenant access.

---

# 76. Stronger Isolation Profiles

Sensitive tenants/documents MAY require:

```text
dedicated bucket
dedicated encryption key
dedicated region
dedicated storage account
dedicated network controls
```

according to `IsolationProfile`.

---

# 77. Encryption in Transit

All protected-document delivery SHALL use encrypted transport.

---

# 78. Encryption at Rest

Protected corporate documents SHALL be encrypted at rest according to classification and infrastructure policy.

---

# 79. Key Management

Encryption keys SHALL be:

```text
managed
access-controlled
rotatable
audited
```

They SHALL not reside in application source repositories.

---

# 80. Data Residency

Document storage and processing SHALL respect applicable residency policy.

A document about a cross-border matter does not automatically permit unrestricted cross-border storage.

---

# 81. Storage Region Is Not Legal Jurisdiction

This remains true:

```text
storage region
    !=
document legal jurisdiction
```

---

# 82. Binary Upload Pipeline

Protected uploads SHOULD follow a controlled pipeline such as:

```text
Upload Initiated
      │
      ▼
Temporary Quarantine
      │
      ▼
File Validation
      │
      ▼
Malware / Security Scan
      │
      ▼
Metadata Validation
      │
      ▼
Classification / Context Validation
      │
      ▼
Durable Storage
      │
      ▼
Document Version Activated
```

---

# 83. Quarantine

An unscanned or suspicious binary SHALL NOT automatically become accessible as an active document.

---

# 84. Malware Scanning

Production document ingestion SHOULD include appropriate malware/security scanning.

A scan result SHALL not replace document authorisation.

---

# 85. File-Type Validation

Declared MIME type and extension SHOULD NOT be trusted blindly.

Actual content SHOULD be validated sufficiently for the intended security profile.

---

# 86. Dangerous Active Content

Providers SHOULD apply policies to file types capable of active code or embedded scripts.

The exact mitigation belongs to the document provider/security implementation.

---

# 87. Preview Generation

Derived previews MAY include:

```text
PDF rendition
thumbnail
image rendition
text extraction
```

These are derivatives.

They SHALL retain appropriate classification.

---

# 88. Derivative Is Not Automatically Less Sensitive

This is prohibited:

```text
HIGHLY_RESTRICTED PDF
         │
         ▼
thumbnail
         │
         ▼
PUBLIC
```

Derivatives SHALL inherit appropriate access policy.

---

# 89. Extracted Text

OCR or extracted text derived from a protected document SHALL remain protected according to applicable classification.

---

# 90. Search Indexes

Protected-document search MAY create indexing representations.

The index SHALL NOT become a broader-access copy of the underlying documents.

---

# 91. Search Results Can Leak Information

Even:

```text
title
filename
snippet
author
matter name
```

may reveal sensitive information.

Search results SHALL themselves be access-filtered.

---

# 92. Search Authorisation

Search SHALL apply document security before returning results.

The architecture SHALL NOT:

```text
search everything
then hide unauthorised rows in browser
```

as its security model.

---

# 93. Semantic Search

Vector or semantic retrieval SHALL respect the same access controls.

Embedding similarity does not grant access.

---

# 94. Vector Database Is Not Declassification

Copying document embeddings into Qdrant or another vector store SHALL not reduce security requirements.

---

# 95. Embeddings May Be Sensitive

Embeddings and derived representations MAY leak information.

They SHALL be classified and isolated according to source sensitivity and inference risk.

---

# 96. Pulse Access to Protected Documents

Pulse MAY consume protected corporate documents only through approved authorised capabilities and purposes.

Access SHALL be:

```text
scope-limited
classification-aware
purpose-limited
auditable
```

---

# 97. AI Training

Protected corporate documents SHALL NOT automatically become AI training data.

Training use requires separately governed approval.

---

# 98. External AI Providers

Protected document content SHALL NOT be transmitted to arbitrary external AI providers directly from Nabhold.

Any external processing SHALL satisfy applicable:

```text
security
privacy
classification
contractual
residency
```

requirements through governed Pulse/provider infrastructure.

---

# 99. Prompt Minimisation

AI analysis SHOULD receive only the content needed for the authorised task.

---

# 100. AI Generated Summary

An AI-generated summary SHALL be a derived intelligence/content object.

It SHALL retain source-document classification as required by policy.

---

# 101. Redaction

The system SHOULD distinguish:

```text
source document
```

from:

```text
redacted rendition
```

A redacted rendition SHALL not destructively overwrite the source.

---

# 102. Client-Side Redaction Is Not Sufficient

Visually covering text in a browser or PDF overlay SHALL not be considered secure redaction if underlying content remains extractable.

Secure redaction SHALL be performed through an approved document-processing mechanism.

---

# 103. Redaction Provenance

A material redacted version SHOULD identify:

```text
source version
redaction version
authority
created_at
```

where appropriate.

---

# 104. Partial Disclosure

An authorised user MAY receive a redacted version while another authorised user receives the original.

These SHALL be distinct authorised representations.

---

# 105. Annotation

Annotations SHOULD remain separate from the immutable source version unless document semantics explicitly incorporate them.

---

# 106. Annotation Authority

Permission to annotate SHALL not imply permission to:

```text
modify source
reclassify
approve
delete
```

---

# 107. Watermarking

Highly sensitive downloads or previews MAY apply dynamic watermarking.

Possible metadata may include:

```text
recipient
timestamp
classification
document reference
```

subject to privacy/security policy.

Watermarking is deterrence/audit support.

It is not a replacement for access control.

---

# 108. Printing

`PRINT` MAY be restricted independently of `VIEW`.

Technical prevention may be imperfect, but policy and viewer controls SHOULD honour the distinction where appropriate.

---

# 109. Screenshots

The architecture SHALL not claim that web software can reliably prevent all screenshots.

Highly restricted information therefore requires:

```text
access minimisation
user accountability
classification
policy
audit
```

in addition to technical controls.

---

# 110. Download Policy

Download policy MAY depend on:

```text
classification
principal
document type
device/session assurance
matter
legal hold
external sharing policy
```

---

# 111. Export Policy

Exporting:

```text
document
report
board pack
evidence bundle
```

SHALL respect classification and access policy.

---

# 112. Export Does Not Remove Classification

A downloaded PDF remains confidential even after leaving the application.

The exported artefact SHOULD preserve appropriate classification marking.

---

# 113. Bulk Export

Bulk export of protected documents SHOULD require stronger controls than ordinary single-document viewing.

---

# 114. Share

Document sharing SHALL be explicit.

The estate SHALL not create public links to protected corporate documents by default.

---

# 115. Cross-Tenant Sharing

Cross-tenant document sharing SHALL be prohibited by default.

Where required, it SHALL use a governed shared-resource/external-collaboration model.

---

# 116. External Recipients

Sharing protected documents with:

```text
external counsel
auditors
investors
lenders
advisers
counterparties
```

SHALL require explicitly governed external-recipient access.

---

# 117. Email Attachments

Sending a protected document as an ordinary email attachment MAY create uncontrolled durable copies.

For higher classifications, the preferred pattern SHOULD be:

```text
secure access link
+
current authorisation
+
expiry
```

where practical.

---

# 118. Email Is Not Document Authority

An emailed copy SHALL not become the authoritative corporate record merely because it was sent externally.

---

# 119. Chat Applications

The same applies to files copied into:

```text
Teams
Slack
WhatsApp
other messaging systems
```

unless the external system is explicitly part of the governed document architecture.

---

# 120. Public Publication

Moving a protected corporate document to public publication SHALL require an explicit publication/reclassification workflow.

It SHALL never occur merely because a file was uploaded to Payload.

---

# 121. Public CMS Does Not Imply Public File

A Payload-managed document may remain private/restricted.

Storage technology does not determine classification.

---

# 122. Cache Separation

The estate SHALL distinguish:

```text
public content cache
protected metadata cache
protected document cache
signed delivery credential
```

These SHALL not share public-cache semantics.

---

# 123. Public CDN Cache

Highly restricted or private content SHALL not be cached as publicly reusable CDN content.

---

# 124. Browser Cache

Sensitive responses SHOULD use appropriate cache controls to minimise unintended persistence.

Exact headers depend on delivery architecture.

---

# 125. Server Cache

Any protected server-side cache SHALL include all relevant context dimensions.

These may include:

```text
principal
tenant
legal entity
document
classification
capability
version
```

---

# 126. Cross-Principal Cache Leakage

A protected document cached for one executive SHALL never be returned to a second executive solely because the URL matches.

---

# 127. Classification Change and Cache

A classification or access-policy change SHOULD invalidate affected cached representations.

---

# 128. Version Change and Cache

A new document version SHALL not cause historical evidence links to resolve silently to the new version.

---

# 129. Retention

Document retention SHALL be governed by document type, business policy and applicable legal/regulatory requirements.

Nabhold UI SHALL not invent universal retention periods.

---

# 130. Retention Policy

Conceptually:

```text
RetentionPolicy
├── policy_id
├── document_type/scope
├── retention_trigger
├── retention_period
├── disposition_rule
├── legal_hold_override
└── version
```

Exact contract belongs to the records/document authority.

---

# 131. Retention Trigger

Retention MAY begin from events such as:

```text
record creation
contract termination
financial period close
decision date
matter closure
employee departure
```

according to policy.

---

# 132. Deletion Is Not Always Permitted

A user's ordinary delete request SHALL NOT override applicable:

```text
retention
legal hold
audit
regulatory obligations
```

---

# 133. Legal Hold

Document architecture SHOULD support an explicit hold mechanism.

Conceptually:

```text
LegalHold
├── hold_id
├── scope
├── authority
├── placed_at
├── reason/reference
├── status
└── released_at?
```

---

# 134. Legal Hold Overrides Ordinary Disposition

While an applicable hold is active:

```text
ordinary deletion
=
DENIED
```

even if normal retention would otherwise allow deletion.

---

# 135. Legal Hold Is Not UI Flag

A browser-supplied:

```text
legalHold=true
```

SHALL not establish or remove legal hold.

The authoritative provider SHALL control it.

---

# 136. Hold Authority

Placing or releasing a legal hold SHALL require appropriate legal/records authority.

Ordinary document editors SHALL not automatically have that permission.

---

# 137. Disposition

At retention expiry, disposition SHOULD follow governed policy such as:

```text
destroy
archive
review
transfer
```

rather than automatic arbitrary deletion.

---

# 138. Destruction Evidence

Where records are lawfully destroyed, the records system MAY retain non-content evidence that authorised disposition occurred.

The exact retention of destruction metadata SHALL follow policy.

---

# 139. Backup Versus Retention

Backup retention SHALL NOT be treated as the corporate records-retention policy.

The concepts serve different purposes.

---

# 140. Archival

Archived documents remain subject to:

```text
classification
access policy
retention
legal hold
```

unless policy changes them explicitly.

---

# 141. Historical Access

Historical access MAY differ from current access.

For example, a former board member does not necessarily retain access to old board materials merely because they once could read them.

---

# 142. Historical Decision Evidence

The system SHALL preserve the document version linked to a decision even when normal interactive access later changes.

Preservation does not imply ongoing access for all former participants.

---

# 143. Audit

Material document operations SHOULD be auditable.

Depending on classification, audit MAY include:

```text
discovered
viewed
downloaded
printed
shared
uploaded
versioned
classified
reclassified
held
released
deleted
exported
```

---

# 144. High-Sensitivity Access Audit

`RESTRICTED` and `HIGHLY_RESTRICTED` access SHOULD generally produce durable access evidence where policy requires it.

---

# 145. Audit Is Not Operational Logging

This SHALL remain:

```text
Document Audit
    !=
Web Server Log
```

A log entry alone may not provide sufficient governance evidence.

---

# 146. Actor and Workload

Audit SHOULD distinguish:

```text
human principal
```

from:

```text
Nabhold workload
```

where the server accessed the provider on the human's behalf.

---

# 147. Correlation

Document operations SHOULD preserve:

```text
correlation_id
document_id
version_id
context_id
decision_id
```

as appropriate.

---

# 148. Decision Evidence Correlation

A governance decision SHOULD be traceable to:

```text
Decision
   │
   ├── DocumentVersion A
   ├── DocumentVersion B
   ├── ERP facts
   └── Pulse intelligence
```

without copying all source material into the decision record.

---

# 149. Document Audit Privacy

Audit SHALL avoid unnecessary disclosure of document contents.

Audit usually requires metadata about the action, not the entire document body.

---

# 150. Metadata Sensitivity

Document metadata MAY itself be sensitive.

For example:

```text
Project Cedar Acquisition Proposal
```

may reveal material information even without opening the document.

---

# 151. Protected Titles

Search/list APIs SHOULD therefore support restricting:

```text
title
matter
author
counterparty
snippet
```

where metadata sensitivity requires it.

---

# 152. Discovery Versus View

The architecture MAY distinguish:

```text
DISCOVER
```

from:

```text
VIEW
```

A user may not even be permitted to know a highly restricted document exists.

---

# 153. Existence Leakage

An unauthorised response SHOULD not unnecessarily reveal:

```text
document title
classification
owner
matter
```

merely to explain denial.

---

# 154. Document Lists

Executive document lists SHALL be constructed from authorised results.

The estate SHALL not retrieve the entire repository and hide rows client-side.

---

# 155. Public Versus Executive Documents

The architecture SHALL preserve:

```text
Public Corporate Documents
→ cacheable / distributable where published

Protected Corporate Documents
→ authenticated / context-aware / policy-controlled
```

These SHALL not share one simplistic delivery pipeline.

---

# 156. Decision Pack

A governance Decision Pack MAY compose references to:

```text
Proposal
Financial Report
Pulse Analysis
Risk Paper
Legal Advice
Contract Draft
Board Paper
```

Each source document SHALL retain independent ownership/classification.

---

# 157. Pack Classification

A compiled board/committee pack SHOULD receive a classification at least appropriate to the combined content.

Compilation SHALL not reduce sensitivity.

---

# 158. Pack Versioning

A formal decision pack SHOULD be versioned.

Decision evidence SHOULD reference the exact pack version used where material.

---

# 159. Pack Contents

A pack version SHOULD preserve an explicit manifest of included document versions.

Conceptually:

```text
DecisionPack v4
├── Proposal v3
├── FinancialReport v2
├── RiskAssessment v5
└── LegalMemo v1
```

---

# 160. Pack Regeneration

Regenerating a pack after a decision SHALL not silently rewrite the historical pack associated with that decision.

---

# 161. Dynamic Versus Frozen Pack

The system SHOULD distinguish:

```text
live working pack
```

from:

```text
frozen decision pack
```

where governance requirements justify it.

---

# 162. Formal Resolution

A formal resolution SHALL remain a governed record.

A dashboard label:

```text
Approved
```

does not replace the resolution where formal record requirements apply.

---

# 163. Electronic Signature Boundary

An ordinary UI confirmation SHALL NOT be labelled a legally binding electronic signature unless an approved signing architecture establishes that property.

---

# 164. Signature Artefacts

If electronic signing is introduced later, signature evidence SHALL remain associated with the exact document version signed.

---

# 165. Personal Data

Protected documents may contain personal information.

Access, processing and export SHALL follow applicable privacy/security policy.

The Nabhold estate SHOULD minimise unnecessary personal data exposure.

---

# 166. Data Minimisation

Where an executive needs:

```text
contract value
expiry
counterparty
```

the experience SHOULD not necessarily transmit the complete contract body.

---

# 167. Purpose Limitation

Access granted for:

```text
board review
```

SHALL not automatically permit unrelated:

```text
AI training
marketing
analytics
```

processing.

---

# 168. Document Intelligence

Pulse MAY analyse documents for authorised use cases such as:

```text
risk extraction
obligation identification
executive summarisation
cross-document research
```

subject to document classification and purpose.

---

# 169. Intelligence Output Classification

A Pulse insight derived from highly restricted documents SHALL receive appropriate derived classification.

---

# 170. Citation to Protected Evidence

An executive intelligence object MAY reference protected evidence.

The user SHALL only be permitted to open source evidence for which they retain document access.

---

# 171. Intelligence Without Raw Access

Policy MAY permit an executive to receive:

```text
authorised derived intelligence
```

without receiving:

```text
underlying restricted document
```

where information-governance policy supports that separation.

---

# 172. Provider Failure

If the protected-document provider is unavailable:

```text
document access
=
UNAVAILABLE
```

The estate SHALL NOT fall back to:

```text
public object URL
unsecured cached copy
local development file
```

---

# 173. Fail Closed

Where document classification or access authority cannot be established:

```text
DENY
```

shall be the default.

---

# 174. Partial Decision-Pack Failure

A governance pack MAY indicate:

```text
Proposal             AVAILABLE
Financial Report     AVAILABLE
Legal Advice         UNAVAILABLE
Risk Report          AVAILABLE
```

If the unavailable document is required for the decision, the governance workflow SHALL block the decision.

---

# 175. Required Document Inputs

The governance domain MAY identify documents as:

```text
REQUIRED
ADVISORY
OPTIONAL
```

for a matter.

Nabhold SHALL consume that policy rather than infer it.

---

# 176. Document Capability Examples

Nabhold MAY eventually consume canonical capabilities conceptually such as:

```text
documents.metadata.read
documents.content.view
documents.content.download
documents.version.read
documents.history.read
documents.upload
documents.classify
documents.share
documents.audit.read
documents.hold.manage
```

These names are illustrative.

Shared/domain contracts SHALL determine final canonical keys.

---

# 177. Capability Granularity

The platform SHOULD avoid one overly broad:

```text
documents.all
```

capability for protected corporate records.

High-risk operations SHOULD remain independently grantable.

---

# 178. Provider Replacement

Replacing:

```text
Payload
```

or another document provider SHALL not require rewriting executive document features if canonical document contracts remain compatible.

---

# 179. No Provider DTO Leakage

Nabhold feature code SHALL not depend directly upon:

```text
Payload upload record
S3 object key
iDempiere attachment table
future DMS vendor DTO
```

---

# 180. Proposed Internal Boundary

The estate MAY evolve toward:

```text
src/lib/documents/
├── gateway.ts
├── models.ts
├── classification.ts
├── errors.ts
├── provenance.ts
└── access.ts
```

with provider adapters beneath an infrastructure boundary.

This structure is illustrative.

The authority separation is normative.

---

# 181. Error Semantics

Protected-document flows SHOULD distinguish states such as:

```text
NOT_FOUND
NOT_AUTHORISED
EXISTENCE_HIDDEN
CLASSIFICATION_DENIED
ASSURANCE_REQUIRED
VERSION_NOT_FOUND
DOCUMENT_SUPERSEDED
LEGAL_HOLD
DOWNLOAD_DENIED
PROVIDER_UNAVAILABLE
MALWARE_QUARANTINED
RETENTION_RESTRICTED
```

where canonical contracts support them.

---

# 182. Not Found Versus Not Authorised

The application MAY intentionally avoid distinguishing these externally where doing so would leak sensitive document existence.

Internal audit MAY preserve the actual reason.

---

# 183. Readiness

Protected-document capability readiness MAY require:

```text
provider registered
storage available
encryption active
IAM integration active
CP grants/bindings active
classification policy available
malware scanning available
audit operational
retention policy configured
residency compliant
```

depending on capability.

---

# 184. No Go-Live Based on File Rendering Alone

The document experience SHALL not be production-ready merely because PDFs open successfully.

Production readiness SHALL prove:

```text
identity
context
classification
versioning
access
storage
encryption
delivery
audit
retention
revocation
residency
```

end to end.

---

# 185. Authority Matrix

| Concern | Authority | Nabhold Role |
|---|---|---|
| Public/editorial content | CMS | Presents |
| Editorial publication | CMS | Consumes |
| ERP evidence attachment | ERP | Presents |
| Governance document | Governance/document authority | Presents |
| Pulse report | Pulse | Presents |
| Canonical document contract | Shared | Imports |
| Provider resolution | CP | Consumes |
| Authentication | IAM | Consumes |
| Document classification | Owning document/domain authority | Enforces/presents |
| Binary storage | Approved storage provider | Does not own |
| Access policy | Document/domain + CP/IAM context | Enforces |
| Retention | Records/document authority | Consumes |
| Legal hold | Authorised records/legal authority | Enforces |
| Executive presentation | Nabhold | Owns |
| Document truth | Applicable owning domain | **Does not own** |

---

# 186. Explicitly Prohibited Patterns

`baobab-platform/nabhold` SHALL NOT:

1. become the authoritative corporate document repository by accident;
2. treat every document as Payload content;
3. treat every PDF as a governance record;
4. infer document ownership from storage location;
5. use filenames as canonical identifiers;
6. use URLs as canonical identifiers;
7. expose private object-storage paths directly;
8. assume same tenant means all documents are visible;
9. assume executive status means unrestricted document access;
10. assume board status means perpetual access to every board document;
11. equate view and download permissions;
12. equate download and share permissions;
13. permit client-side classification authority;
14. silently downgrade classification through summarisation;
15. silently downgrade classification through aggregation;
16. return unauthorised document titles in search results;
17. perform protected-document filtering only in the browser;
18. use public CDN caching for restricted corporate material;
19. serve stale authorised documents after access revocation contrary to policy;
20. allow signed URLs to become permanent access credentials;
21. allow direct browser access because a bucket key is known;
22. activate unscanned uploaded files by default;
23. treat thumbnails or OCR output as unclassified derivatives;
24. treat vector indexes as declassified copies;
25. use protected documents as AI training data automatically;
26. send protected documents to arbitrary external AI APIs;
27. overwrite historical document versions attached to decisions;
28. perform visual-only insecure redaction;
29. allow ordinary editors to release legal holds;
30. delete records merely because the UI requested deletion;
31. use backup retention as records-retention policy;
32. let document-provider failure fall back to unsecured access;
33. treat a downloaded/exported copy as a new authoritative record automatically;
34. let provider-specific DTOs determine executive feature design.

---

# 187. Required Security Tests

Implementation SHALL test at minimum:

```text
anonymous protected-document access
authenticated but unauthorised access
wrong tenant
wrong legal entity
wrong portfolio company
restricted document with ordinary executive access
HIGHLY_RESTRICTED without step-up
expired access grant
revoked membership
revoked document grant
deep-link access after revocation
signed URL expiry
signed URL replay
cross-principal cache leak
cross-tenant cache leak
public CDN misconfiguration
direct object-store path attempt
document existence leakage
search-title leakage
semantic-search leakage
wrong document version
superseded version
historical decision evidence version
classification upgrade
classification downgrade without authority
download denied while view allowed
share denied while download allowed
unscanned upload
malware detection
invalid file type
legal hold deletion attempt
retention deletion attempt
redacted versus original access
OCR derivative classification
thumbnail classification
AI retrieval without document authority
external AI processing restriction
provider outage
```

---

# 188. Definition of Done

This ADR is correctly implemented when:

```text
[ ] Protected documents are consumed through a provider-neutral gateway.

[ ] Nabhold does not act as canonical document authority.

[ ] Editorial documents remain distinguishable from governance records.

[ ] ERP attachments remain within ERP evidence authority.

[ ] Governance evidence can reference exact document versions.

[ ] Document identity is independent of provider IDs and URLs.

[ ] Document and DocumentVersion are first-class concepts.

[ ] Material record versions are immutable or superseded rather than
    destructively rewritten.

[ ] Checksums/integrity evidence are available where material.

[ ] Classification is explicit.

[ ] Classification affects access and delivery.

[ ] Classification downgrade requires governed authority.

[ ] Derived summaries do not automatically lose source classification.

[ ] Document metadata is access controlled where sensitive.

[ ] DISCOVER can be distinguished from VIEW where necessary.

[ ] VIEW, DOWNLOAD, SHARE and ADMINISTER remain separable permissions.

[ ] Executive access does not imply universal document access.

[ ] Infrastructure administrators do not automatically gain content rights.

[ ] Protected document operations are enforced server-side.

[ ] Current access is evaluated on deep links.

[ ] Private document delivery uses controlled mechanisms.

[ ] Signed URLs are short-lived and resource-specific.

[ ] Direct bucket/object paths are not the application integration model.

[ ] Production binaries use durable storage.

[ ] Storage can support tenant/isolation requirements.

[ ] Protected content is encrypted in transit and at rest.

[ ] Residency policy applies to document storage and processing.

[ ] Uploads can be quarantined and scanned.

[ ] Derived previews/OCR/text retain appropriate classification.

[ ] Search is filtered before protected results are returned.

[ ] Semantic/vector retrieval cannot bypass document authorisation.

[ ] Pulse document access is purpose-limited and classification-aware.

[ ] Protected documents do not automatically become model-training data.

[ ] Secure redaction produces an authorised derivative rather than hiding
    source content visually.

[ ] Download/export policy can vary by classification.

[ ] Cross-tenant sharing is denied by default.

[ ] External sharing is explicit and governed.

[ ] Retention is governed outside frontend code.

[ ] Legal hold blocks ordinary disposition.

[ ] Historical decision evidence remains version-bound.

[ ] Protected document access can be audited.

[ ] Human principal and acting workload remain correlatable.

[ ] Document provider failure fails closed.

[ ] Governance workflow can detect unavailable required documents.

[ ] Document readiness participates in Gate 8–10 production readiness.
```

---

# 189. Gate Impact

This ADR principally governs:

```text
Gate 2
Corporate Content Capability

Gate 4
Public Production Hardening

Gate 5
Identity, Principal & Context Foundation

Gate 6
Executive Capability Gateway

Gate 8
Governance, Decisions & Protected Information

Gate 9
Full-Estate Reconciliation & Hardening

Gate 10
Controlled Activation & Go-Live
```

**Gate 8 is the primary protected-document implementation gate.**

---

# 190. Gate 8 Target Architecture

Gate 8 SHOULD prove:

```text
Governance Matter
      │
      ▼
Decision Package
      │
      ├── Proposal Version
      ├── Financial Evidence
      ├── Pulse Intelligence
      ├── Risk Material
      ├── Legal Material
      └── Other Protected Records
                 │
                 ▼
       ProtectedDocumentGateway
                 │
                 ▼
          CP Resolution
                 │
        ┌────────┼─────────┐
        ▼        ▼         ▼
       CMS      ERP    Governance/DMS
        │        │         │
        └────────┼─────────┘
                 ▼
        Authorised Versions
                 │
                 ▼
          Executive Review
                 │
                 ▼
          Governance Decision
```

with classification, provenance and exact-version evidence preserved.

---

# 191. Relationship to ADR-NAB-0009

ADR-NAB-0009 determines:

```text
who may decide
what may be decided
under which authority
```

This ADR determines:

```text
which protected information
that decision-maker may inspect
and which exact evidence versions
formed part of the decision package.
```

---

# 192. Relationship to ADR-NAB-0008

ADR-NAB-0008 permits Pulse to consume authorised evidence.

This ADR establishes that document classification and access constraints continue to apply when documents feed intelligence.

---

# 193. Relationship to ADR-NAB-0007

Financial reports displayed as protected documents retain the financial authority established by ADR-NAB-0007.

A PDF rendering does not transfer financial truth to the document provider.

---

# 194. Relationship to CMS Architecture

Payload remains the Baobab Content Engine and may validly manage many document/media resources.

This ADR deliberately prevents:

```text
Payload supports documents
        │
        ▼
Payload owns every corporate record
```

from becoming an accidental architectural conclusion.

---

# 195. Relationship to ERP Architecture

ERP remains authoritative for ERP documents and evidence assigned to its domain.

The Digital Estate SHALL access them through governed ERP/document capabilities rather than database or filesystem access.

---

# 196. Follow-On Decision

The next architectural decision SHALL be:

**ADR-NAB-0011 — Auditability, Notifications and Executive Operational Events**

It SHALL establish how Nabhold correlates:

```text
identity events
capability decisions
portfolio/context changes
financial/reporting events
Pulse intelligence
governance decisions
document access
notifications
executive alerts
```

without turning application logs into the canonical audit trail or notifications into authority.

---

# 197. Final Decision

The Nabhold Corporate Digital Estate SHALL present protected corporate information through **explicit document authority, classification, version and access boundaries**.

The enduring architecture is:

```text
                 CORPORATE INFORMATION
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
             CMS         ERP      Governance /
          Editorial    Evidence      DMS
              │           │           │
              └───────────┼───────────┘
                          ▼
                CANONICAL DOCUMENT
                    CONTRACTS
                          │
                          ▼
                   BAOBAB CP
             context + capability
                          │
                          ▼
                  DOCUMENT POLICY
             classification + access
                          │
                          ▼
                NABHOLD SERVER / BFF
                          │
                          ▼
                 AUTHORISED VIEW
                          │
                          ▼
                       HUMAN
```

The enduring rule is:

> **Nabhold may bring the Group's information together without bringing all of its authority into one repository. Every protected document must retain who owns it, which version it is, how sensitive it is, who may receive it, why it must be retained, and which decisions relied upon it.**