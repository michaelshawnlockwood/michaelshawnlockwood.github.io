---
layout: single
title: "Time Travel with Delta-RS: Local Experiments with MinIO, Azurite, and Databricks"
excerpt: "Exploring Delta Lake’s Time Travel feature across environments — MinIO over HTTPS, Azurite over HTTPS, and Databricks SQL — using Python’s delta-rs library for local reproducibility."
date: 2025-10-19
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories: [Data Engineering, Delta Lake, MinIO, Azurite, Databricks]
tags: [Delta-RS, MinIO, Azurite, Databricks, Time Travel, Parquet, Delta Lake]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay-wide.jpg 
  caption: "Local Time Travel experiments using Delta-RS with MinIO, Azurite, and Databricks SQL."
---


<a id="toc" class="visually-hidden"></a>

# Time Travel with Delta-RS: Local Experiments with MinIO, Azurite, and Databricks

## Introduction
- Brief context on Delta Lake and why “Time Travel” matters.  
- Mention my focus on local experimentation using **MinIO (HTTPS)** and **Azurite (HTTPS)** — avoiding reliance on cloud-hosted services.  
- Note that this work complements my earlier projects on Parquet ingestion, Delta-RS integration, and Azure emulation.

## 🕓 The Concept of Time Travel
In Delta Lake, Time Travel means you can read a table as it existed at any earlier point, without restoring backups or duplicating datasets. It’s enabled by Delta’s ACID transaction log (the _delta_log folder next to my Parquet files), which records every commit as an immutable, ordered sequence.  

__Versioned Parquet snapshots__  
Each commit produces a new table version (v0, v1, v2, …). A version is just a logical snapshot composed of the Parquet files that were added or removed in that commit. Delta uses small JSON (and periodic checkpoint) files to describe which data files are active for each version.  

__ACID guarantees__  
The transaction log enforces atomicity, consistency, isolation, and durability. Readers see a consistent snapshot (no partial writes), writers don’t corrupt the table if they fail midway, and concurrent operations serialize into clean versions.  

__Schema enforcement & evolution__  
The log also captures schema information. Delta can enforce the expected schema and, when configured, evolve it (e.g., add a column) in a controlled, versioned way. Time Travel lets you query before or after such changes.  

__Reproducibility__  
Because every version is addressable (by version number or timestamp), you can rerun analyses exactly as they were, audit historical states, compare results across points in time, and debug upstream changes without rolling back data.  

__Retention-aware__  
Time Travel relies on the presence of historical log entries and data files. If you VACUUM aggressively or shorten log retention, very old versions may no longer be queryable. In other words: retention policies define how far back you can travel.  

__Net effect__  
Delta’s Time Travel turns my Parquet dataset into a transactional, versioned table where historical reads are first-class—fast, reliable, and independent of backup/restore workflows.  
{: .fancy}

Contrast with traditional database recovery or restore scenarios in SQL Server.  
{: .md-h2i}


👀 Highlight its practical uses: debugging, auditability, reproducible analytics, and schema evolution.

## Setting the Stage
- Describe my lab environment:  
  - MinIO bucket (`nyctaxi-pipeline`) over HTTPS  
  - Azurite over HTTP for Azure Blob emulation  
  - Databricks SQL (DBX) for validation of versioned reads  
- Mention the dataset (NYC Taxi, reduced Parquet samples) and Delta folder structure (`data_in`, `data_out`, `delta`, `snapshots`).

> ![For Blog: MinIO Object Browser](/assets/images/minio-nyctaxi-pipeline.png)
> *MinIO Object Browser showing the `nyctaxi-pipeline` bucket structure.*

## Delta-RS and Local Connectivity
- Overview of Delta-RS (Rust implementation of Delta Lake) and why it’s ideal for lightweight, cross-platform experimentation.  
- Discuss connection differences:
  - `https://127.0.0.1:10000/...` for Azurite  
  - `https://127.0.0.1:9000/...` for MinIO  
- Mention challenges with Azurite HTTPS (URL rewriting, emulator redirection) and why MinIO proved stable.

## 🔬 Performing Time Travel
- Step-by-step summary of what the Time Travel operation does:
  1. Read a Delta table at its latest version.  
  2. Retrieve table history to list all commits.  
  3. Query a prior version using `version=n` or a timestamp.  
- Example outputs or command patterns (placeholder text for when you import screenshots/code).  
- Highlight that Delta-RS enforces version consistency even without Spark or JVM dependencies.

## Comparing Environments
- Observations comparing behavior between:
  - Delta-RS over Azurite (HTTP)  
  - Delta-RS over MinIO (HTTPS)  
  - Databricks SQL dashboard  
- Discuss any performance or compatibility nuances.  
- Mention how Databricks confirms Delta-RS read consistency.

## Lessons Learned
- Reflection on local-first development and emulation of cloud features.  
- Key takeaways about:
  - TLS configuration complexity (Azurite vs MinIO)  
  - Importance of clean version management  
  - Delta-RS maturity and limitations  

## Closing Thoughts
- How this exploration connects to my larger **NYC Taxi Data Engineering Lab** and data reliability theme.  
- Invitation to readers to try local Delta-RS with emulated object stores.  
- Optional LinkedIn-style closing line (encouraging dialogue or sharing experiences).

## Appendix (Optional)
- Sample directory structure
- Delta log JSON snippet
- Reference commands for MinIO and Azurite launches

---

## 🕓 Delta Lake Time Travel — Direct from MinIO over HTTPS

**Fully encrypted, direct Delta Lake Time Travel operation**

---

### 🔐 Environment Setup

Verified MinIO’s HTTPS trust chain using the mkcert-generated CA:

```powershell
$env:CAROOT = (mkcert -CAROOT)
$env:AWS_ENDPOINT_URL      = "https://127.0.0.1:9010"
$env:AWS_CA_BUNDLE         = "$env:CAROOT\rootCA.pem"
$env:AWS_S3_FORCE_PATH_STYLE = "1"
$env:AWS_REGION            = "us-east-1"
$env:AWS_ACCESS_KEY_ID     = "minioadmin"
$env:AWS_SECRET_ACCESS_KEY = "minioadmin"
```

---

## 💼 The Business Ask — Presenting Revenue from a Specific Period

> “I have a presentation to make showing **Taxi Trip revenues from March 12 through May 15**.  
> I need to see metrics A, B, C, D, and E.”

This is the kind of real-world request that comes in from Finance, Operations, or Marketing.  
The timeline is narrow, but the expectation is absolute clarity:

| Metric | Description | Power BI Visualization |
|:--|:--|:--|
| **A** | Total Trip Revenue | KPI Card showing total fare + tips |
| **B** | Daily Revenue Trend | Line chart of daily totals |
| **C** | Revenue by Payment Type | Donut chart or stacked bar |
| **D** | Top 10 Pickup Zones by Revenue | Bar chart |
| **E** | Vendor Share | 100% Stacked Column comparing vendors |

Rather than running new ETL jobs or risking stale copies, the **Delta Time Travel** feature let me retrieve a precise historical snapshot of the dataset as it existed during that period.

---

### 🧱 Data Foundation

- Source: `s3://nyctaxi-pipeline/delta/yellowtrips` (Delta version 4)  
- Time window: **2025-03-12 → 2025-05-15**  
- Output: a single Parquet export written directly to MinIO via HTTPS  
- Result: **53,524 rows**, cleanly scoped to the requested window  

This Parquet file is the one-click data source for Power BI:

---


From here, I can connect Power BI Desktop to MinIO using an S3-compatible endpoint or stage it temporarily in Databricks for shared analytics.

---

### 🧭 What Comes Next

Power BI will surface the visuals the business needs:

- **A** and **B** from quick DAX measures on `fare_amount`, `tip_amount`, and `total_amount`  
- **C** from a simple group-by on `payment_type`  
- **D** using the `PUlocationID` dimension lookup  
- **E** by counting distinct `VendorID` values

Databricks will join later in the workflow — it’s still a “thin” layer now, but will soon host the same Delta tables for shared compute and reproducible dashboards.

> ### 🔑 Key Takeaways
> A key takeaway: one Delta Time Travel query, one Parquet file, and the entire presentation dataset is reproducible, auditable, and securely sourced from MinIO over HTTPS.
> Secure HTTPS connection across all platforms
> Delta-RS Time Travel enabling historical accuracy
> Zero local dependencies — all cloud-style operations

> 🔑 **Key Insight:** The same mkcert CA unified MinIO, SQL Server, and Python.

---

## 🧠 Pseudocode — Delta Lake Time Travel (Databricks Community Edition)

1. **Create a small Delta table** in my user catalog (DBFS-backed) and note its path.  
2. **Make 2–3 writes** (insert, update, delete) to generate multiple versions.  
3. **Inspect history** with `DESCRIBE HISTORY` to confirm version numbers.  
4. **Query past snapshots** using `VERSION AS OF <n>` and `TIMESTAMP AS OF '<ts>'`.  
5. *(Optional)* Demonstrate the **`@` syntax** (`table@v123` or `table@yyyyMMddHHmmssSSS`) as an alternative.  
6. **Avoid running `VACUUM`** for now — old Parquet files are required for Time Travel to function.

---

## ⚙️ What Works in Databricks Community Edition (DBX CE)

- ✅ **Delta Time Travel** by **version** and **timestamp** works natively in CE using both SQL and Spark APIs.  
- ✅ **`DESCRIBE HISTORY`** lists operations, timestamps, and version numbers for any Delta table.  
- ✅ **`@version` / `@timestamp` syntax** is supported as a shortcut alternative to `VERSION AS OF` and `TIMESTAMP AS OF`.  
- ⚠️ **Use DBFS-backed managed tables.** External object stores (S3, ADLS, MinIO, Azurite) and Unity Catalog features aren’t available in CE.  
- 💡 **Everything happens locally** inside the user workspace; still perfect for demonstrating Delta’s ACID log and snapshot isolation behavior.

---

## 🏗️ Medallion Architecture — Three Domains Simplified

### 🥉 Bronze — Raw & Ingested
- **Purpose:** Capture data *exactly as received* from source systems — the immutable foundation for all downstream processing.  
- **Format:** Often unstructured or semi-structured (CSV, JSON, logs, EHR extracts, HL7 messages, Parquet dumps).  
- **Characteristics:**  
  - No transformations, no filtering — fidelity to source is paramount.  
  - **PII and PHI are often present in full form**, making this layer highly sensitive.  
  - Access should be **restricted, audited, and short-lived** where possible.  
  - Schema may be inferred or missing; quality checks begin *after* landing.  
- **Example:** Raw HL7 or FHIR data feeds containing patient identifiers, medication details, or encounter notes stored as Delta for traceability.

---

⚠️ **Compliance Caution:**  
The **Bronze layer is never safe for broad access**.  
Organizations typically enforce isolation at this stage — dedicated storage accounts, ACLs, encryption at rest (TDE or SSE), and network-level restrictions — ensuring only controlled ETL processes can read or transform data into the **Silver** layer where de-identification begins.

---

## 🔒 What “De-Identification” Means (PII/PHI)

**Goal:** Reduce the chance a person can be identified from the data while preserving utility for analytics.

### Two regulatory paths (HIPAA)
- **Safe Harbor:** Remove the prescribed set of direct identifiers (the “18 identifiers,” e.g., name, full address, phone, email, SSN, MRN, full-precision dates, etc.).
- **Expert Determination:** A qualified expert certifies that re-identification risk is very small given context and controls.

### Common techniques (choose per use case)
| Technique           | What it does                                  | Reversible? | Notes |
|---------------------|-----------------------------------------------|-------------|------|
| **Masking**         | Obscure parts (e.g., `555-***-****`)          | No          | Quick, lightweight; still sensitive if many fields remain. |
| **Tokenization**    | Replace with random tokens (`PAT_9F3A…`)      | Yes*        | Requires secure vault/map; analytics on joins via tokens. |
| **Hashing (+salt)** | Deterministic pseudonyms from identifiers     | Yes*        | Use strong hash + per-env salt; vulnerable without salt. |
| **Generalization**  | Reduce precision (e.g., age → 10-year bins)   | No          | Key for k-anonymity; helps aggregate reporting. |
| **Suppression**     | Drop high-risk fields/rows entirely           | No          | Use for outliers/small groups. |
| **Date shifting**   | Shift dates consistently per subject          | Yes*        | Preserve intervals; keep shift secret and consistent. |
| **Aggregation**     | Summarize (counts, rates)                     | No          | Use for Gold KPIs to avoid small-cell disclosure. |

\*Reversible by a holder of keys/salts/mappings → **pseudonymization**, not full anonymization.

### Where it fits in Medallion
- **Bronze → Silver:** De-identification begins here. Identify sensitive columns, apply masking/tokenization/generalization, remove free-text PHI, and enforce schema + access controls. Keep an **auditable mapping** of transformations.
- **Silver → Gold:** Prefer aggregated, minimal datasets. Apply small-cell suppression (e.g., do not show counts < 10) and expose only what reports need.

### Gotchas (easy to miss)
- **Free-text notes** often contain PHI—redact or drop.  
- **Dates & locations** can re-identify (e.g., rare events); generalize (month/quarter, 3-digit ZIP).  
- **Linkage attacks**: Even de-identified data can be re-identified when joined with external datasets; mitigate with governance, access limits, and aggregation.

**Bottom line:** In my pipeline, *de-identification is a controlled, documented step at the Silver layer* that turns raw PHI/PII into safer, analysis-ready data—while preserving lineage back to Bronze if regulated audits require it.

---

### 🥈 Silver — Cleaned & Structured
- **Purpose:** Provide **trusted, queryable data** for analytics and integration.  
- **Format:** Fully structured with enforced schema and data types.  
- **Characteristics:**  
  - Deduped, validated, normalized, and enriched.  
  - **PII and PHI protections are applied here** — identifiers masked, tokenized, or removed during transition from Bronze.  
  - Data quality, referential integrity, and business rules established.  
  - Serves as the **first broadly accessible layer** under governance controls.  
- **Example:** Patient encounter data joined with provider and medication reference tables, exposing only de-identified or coded fields such as encounter date, diagnosis group, and billing category.

---

🔒 **Governance Continuity:**  
Bronze captures everything for lineage; Silver enforces what’s *appropriate* for consumption.  
This is the **compliance bridge** where raw sensitivity becomes managed data — ensuring every downstream Gold dataset remains HIPAA-aligned and enterprise-safe.

---

### 🥇 Gold — Aggregated & Business-Ready
- **Purpose:** Deliver **insight-ready** datasets for consumption (BI, ML, APIs).  
- **Format:** Star/Snowflake models, curated views, or feature tables.  
- **Characteristics:**  
  - Aggregated, summarized, and optimized for performance.  
  - Tailored to specific use cases (finance, marketing, operations).  
  - Supports dashboards, KPIs, and machine learning pipelines.  
- **Example:** Monthly revenue summaries, per-vendor performance metrics, or pre-joined datasets driving Power BI visuals.

💡 *In short:*  
**Bronze → Silver → Gold** represents the journey from **raw chaos to refined intelligence**, where structure, trust, and usability increase at every stage.

🔒 **Compliance Note:**  
In healthcare and other regulated domains, *data classification and privacy enforcement* typically begin at the **Silver** layer.  
That’s where organizations enforce de-identification, apply data-access controls, and maintain audit logs before promoting data to **Gold**, ensuring all consumption layers remain compliant and safe.

---

## 🧭 Terminology — Layer vs. Zone vs. Domain

| Term | Connotation | Common Usage |
|------|--------------|---------------|
| **Layer** | Logical stage of data refinement (Bronze → Silver → Gold). | ✅ *Standard in Databricks and Delta Lake documentation.* |
| **Zone** | Often used in cloud storage contexts (e.g., raw zone, curated zone). | 🟡 *Valid but more storage-oriented than logical.* |
| **Domain** | Refers to a *business domain* (Finance, HR, Patient Care). | ⚙️ *Common in data mesh or microservice architectures.* |
| **Space** | Informal; sometimes used internally to describe work areas. | 🔹 *Avoid in formal architecture language.* |

**In short:**  
> *Use “layer” when referring to Bronze, Silver, and Gold.  
> Use “domain” when referring to business subject areas.*

---

## 🕰️ Time Travel Across the Medallion Layers

Delta’s **Time Travel** feature is layer-agnostic — it functions anywhere Delta tables exist —  
but its *intent and value* vary by stage of refinement:

### 🥉 Bronze Layer — **Forensics & Recovery**
- Use TT to **replay or re-ingest** raw data exactly as it arrived.  
- Valuable for **incident response** or verifying source integrity.  
- Example: Compare raw HL7 messages from version 0 to version 5 after ETL code changes.

### 🥈 Silver Layer — **Audit & Validation**
- TT becomes a **data-quality checkpoint**: confirm that cleansing, joins, and de-identification behaved as expected.  
- Enables **before/after comparisons** across schema-enforced snapshots.  
- Example: Inspect patient records prior to masking or deduplication.

### 🥇 Gold Layer — **Reproducibility & Traceability**
- TT supports **historical reporting** and reproducible analytics.  
- Analysts can regenerate a dashboard *as it appeared on a given date*.  
- Example: Query `gold.monthly_revenue VERSION AS OF 57` to match a published KPI report.

---

💡 **Summary:**  
Time Travel is the connective tissue between Medallion layers —  
it preserves **lineage, reproducibility, and trust**, ensuring that every refinement step from Bronze → Silver → Gold can be explained, audited, and, if necessary, *rolled back in time.*

---

<!--
### Step 1 — TextGoesHere
```bash
CodeHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-volumes.JPG)
{: .screenshot-lg }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 2 — TextGoesHere
```bash
CodeGoesHere
```
![YellowTrips table validation](/assets/images/screenshots/databricks-samples.JPG)
{: .screenshot-sm }
```bash
CodeGoesHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-sampledata.JPG)
{: .screenshot-lg }

---

### Step 3 — TextGoesHere
1. StepA
2. StepB  
3. StepC  

![YellowTrips table validation](/assets/images/screenshots/databricks-createvolume.JPG)
{: .screenshot-sm }

```bash
CodeGoesHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-volume.JPG)
{: .screenshot-sm }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 4 — TextGoesHere
Catalog ➜ Volume (nyctaxitrip) ➜ Upload to volume

![YellowTrips table validation](/assets/images/screenshots/databricks-uploadtovolume.JPG)
{: .screenshot-lg }

Confirm files landed
```bash
CodeGoesHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-files.JPG)
{: .screenshot-lg }

---

### Step 5 — TextGoesHere
```bash
CodeGoesHere
```

NuanceTextHere
{: .nuance}

![YellowTrips table validation](/assets/images/screenshots/databricks-tables.JPG)
{: .screenshot-lg }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 6 — TextGoesHere
```bash
CodeGoesHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-describeextended.JPG)
{: .screenshot-sm }

---

### Step 7 — TextGoesHere
```bash
CodeGoesHere
```

![YellowTrips table validation](/assets/images/screenshots/databricks-describeextended.JPG)
{: .screenshot-med }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 8 — TextGoesHere  
```bash
CodeGoesHere
```

---

### Step 9 — TextGoesHere  
```bash
CodeGoesHere
```

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 10 — TextGoesHere  
```bash
CodeGoesHere
```

---

### Step 11 — TextGoesHere  
```bash
CodeGoesHere
```

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 12 - TextGoesHere  
```bash
CodeGoesHere
```

---
-->

[⬆ Back to Top](#toc){:.back-to-top}

