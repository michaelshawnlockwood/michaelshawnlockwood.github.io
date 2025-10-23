---
layout: single
title: "Medallion Architecture: Bronze → Silver → Gold in Practice"
excerpt: "A practical, code-backed guide to implementing the Medallion Architecture—how Bronze staging, Silver refinement, and Gold analytics fit together in a real lakehouse with governance and time travel baked in."
date: 2025-10-22
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories: [Lakehouse, Architecture]
tags: [Medallion, Delta Lake, Data Engineering, Lakehouse, Governance, Time Travel, NYC Taxi]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay-wide.jpg
  caption: "Bronze → Silver → Gold: durable pipelines, governed surfaces."
---

<a id="toc" class="visually-hidden"></a>

## 🏗️ Medallion Architecture — Three Domains Simplified
{: .fly-in .fly-in-delay-3}

🥉 Bronze — Raw & Ingested  
{: .md-h3 .fly-in .fly-in-delay-3}

- **Purpose:** Capture data *exactly as received* from source systems — the immutable foundation for all downstream processing.  
- **Format:** Often unstructured or semi-structured (CSV, JSON, logs, EHR extracts, HL7 messages, Parquet dumps).  
- **Characteristics:**  
{: .indent-md .fly-in .fly-in-delay-3}

  - No transformations, no filtering — fidelity to source is paramount.  
  - **PII and PHI are often present in full form**, making this layer highly sensitive.  
  - Access should be **restricted, audited, and short-lived** where possible.  
  - Schema may be inferred or missing; quality checks begin *after* landing.  
{: .indent-lg .fly-in .fly-in-delay-3}

- **Example:** Raw HL7 or FHIR data feeds containing patient identifiers, medication details, or encounter notes stored as Delta for traceability.  
{: .indent-md .fly-in .fly-in-delay-3}

---

⚠️ **Compliance Caution:**  
The **Bronze layer is never safe for broad access**.  
Organizations typically enforce isolation at this stage — dedicated storage accounts, ACLs, encryption at rest (TDE or SSE), and network-level restrictions — ensuring only controlled ETL processes can read or transform data into the **Silver** layer where de-identification begins.  
{: .indent-md1 .fly-in .fly-in-delay-3}

---

## 🔒 What “De-Identification” Means (PII/PHI)
{: .fly-in .fly-in-delay-3}

**Goal:** Reduce the chance a person can be identified from the data while preserving utility for analytics.
{: .fly-in .fly-in-delay-3}

Two regulatory paths (HIPAA)  
{: .md-h3 .fly-in .fly-in-delay-3}

- **Safe Harbor:** Remove the prescribed set of direct identifiers (the “18 identifiers,” e.g., name, full address, phone, email, SSN, MRN, full-precision dates, etc.).
- **Expert Determination:** A qualified expert certifies that re-identification risk is very small given context and controls.
{: .indent-md .fly-in .fly-in-delay-3}

Common techniques (choose per use case)  
{: .md-h3 .fly-in .fly-in-delay-3}

| Technique | What it does | Reversible? | Notes |
|:--|:--|:--|:--|
| **Masking**         | Obscure parts (e.g., `555-***-****`)          | No          | Quick, lightweight; still sensitive if many fields remain. |
| **Tokenization**    | Replace with random tokens (`PAT_9F3A…`)      | Yes*        | Requires secure vault/map; analytics on joins via tokens. |
| **Hashing (+salt)** | Deterministic pseudonyms from identifiers     | Yes*        | Use strong hash + per-env salt; vulnerable without salt. |
| **Generalization**  | Reduce precision (e.g., age → 10-year bins)   | No          | Key for k-anonymity; helps aggregate reporting. |
| **Suppression**     | Drop high-risk fields/rows entirely           | No          | Use for outliers/small groups. |
| **Date shifting**   | Shift dates consistently per subject          | Yes*        | Preserve intervals; keep shift secret and consistent. |
| **Aggregation**     | Summarize (counts, rates)                     | No          | Use for Gold KPIs to avoid small-cell disclosure. |
{: .fly-in .fly-in-delay-3}

\*__Reversible by a holder of keys/salts/mappings → **pseudonymization**, not full anonymization.__
{: .fly-in .fly-in-delay-3}

Where it fits in Medallion
{: .md-h3 .fly-in .fly-in-delay-3}

- **Bronze → Silver:** De-identification begins here. Identify sensitive columns, apply masking/tokenization/generalization, remove free-text PHI, and enforce schema + access controls. Keep an **auditable mapping** of transformations.
- **Silver → Gold:** Prefer aggregated, minimal datasets. Apply small-cell suppression (e.g., do not show counts < 10) and expose only what reports need.  
{: .indent-md .fly-in .fly-in-delay-3}

Gotchas (easy to miss)  
{: .md-h3 .fly-in .fly-in-delay-3}

- **Free-text notes** often contain PHI—redact or drop.  
- **Dates & locations** can re-identify (e.g., rare events); generalize (month/quarter, 3-digit ZIP).  
- **Linkage attacks**: Even de-identified data can be re-identified when joined with external datasets; mitigate with governance, access limits, and aggregation.  
{: .indent-md .fly-in .fly-in-delay-3}

**Bottom line:** In my pipeline, *de-identification is a controlled, documented step at the Silver layer* that turns raw PHI/PII into safer, analysis-ready data—while preserving lineage back to Bronze if regulated audits require it.
{: .fly-in .fly-in-delay-3}

---

🥈 Silver — Cleaned & Structured  
{: .md-h3 .fly-in .fly-in-delay-3}

- **Purpose:** Provide **trusted, queryable data** for analytics and integration.  
- **Format:** Fully structured with enforced schema and data types.  
- **Characteristics:**  
{: .indent-md .fly-in .fly-in-delay-3}

  - Deduped, validated, normalized, and enriched.  
  - **PII and PHI protections are applied here** — identifiers masked, tokenized, or removed during transition from Bronze.  
  - Data quality, referential integrity, and business rules established.  
  - Serves as the **first broadly accessible layer** under governance controls. 
{: .indent-lg .fly-in .fly-in-delay-3}

- **Example:** Patient encounter data joined with provider and medication reference tables, exposing only de-identified or coded fields such as encounter date, diagnosis group, and billing category.  
{: .indent-md .fly-in .fly-in-delay-3}

---

🔒 **Governance Continuity:**  
Bronze captures everything for lineage; Silver enforces what’s *appropriate* for consumption.  
This is the **compliance bridge** where raw sensitivity becomes managed data — ensuring every downstream Gold dataset remains HIPAA-aligned and enterprise-safe.
{: .fly-in .fly-in-delay-3}

---

🥇 Gold — Aggregated & Business-Ready  
{: .md-h3 .fly-in .fly-in-delay-3}

- **Purpose:** Deliver **insight-ready** datasets for consumption (BI, ML, APIs).  
- **Format:** Star/Snowflake models, curated views, or feature tables.  
- **Characteristics:**  
{: .indent-md .fly-in .fly-in-delay-3}

  - Aggregated, summarized, and optimized for performance.  
  - Tailored to specific use cases (finance, marketing, operations).  
  - Supports dashboards, KPIs, and machine learning pipelines.  
{: .indent-lg .fly-in .fly-in-delay-3}

- **Example:** Monthly revenue summaries, per-vendor performance metrics, or pre-joined datasets driving Power BI visuals.  
{: .indent-md .fly-in .fly-in-delay-3}

💡 *In short:*  
**Bronze → Silver → Gold** represents the journey from **raw chaos to refined intelligence**, where structure, trust, and usability increase at every stage.
{: .fly-in .fly-in-delay-3}

🔒 **Compliance Note:**  
In healthcare and other regulated domains, *data classification and privacy enforcement* typically begin at the **Silver** layer.  
That’s where organizations enforce de-identification, apply data-access controls, and maintain audit logs before promoting data to **Gold**, ensuring all consumption layers remain compliant and safe.
{: .fly-in .fly-in-delay-3}

---

Terminology — Layer vs. Zone vs. Domain
{: .md-h2 .fly-in .fly-in-delay-3}

| Term | Connotation | Common Usage |
|------|--------------|---------------|
| **Layer** | Logical stage of data refinement (Bronze → Silver → Gold). | ✅ *Standard in Databricks and Delta Lake documentation.* |
| **Zone** | Often used in cloud storage contexts (e.g., raw zone, curated zone). | 🟡 *Valid but more storage-oriented than logical.* |
| **Domain** | Refers to a *business domain* (Finance, HR, Patient Care). | ⚙️ *Common in data mesh or microservice architectures.* |
| **Space** | Informal; sometimes used internally to describe work areas. | 🔹 *Avoid in formal architecture language.* |
{: .fly-in .fly-in-delay-3}

**In short:**  
> *Use “layer” when referring to Bronze, Silver, and Gold.  
> Use “domain” when referring to business subject areas.*
{: .fly-in .fly-in-delay-3}

---

🕓 Time Travel Across the Medallion Layers
{: .md-h2 .fly-in .fly-in-delay-3}

Delta’s **Time Travel** feature is layer-agnostic — it functions anywhere Delta tables exist —  
but its *intent and value* vary by stage of refinement:
{: .fly-in .fly-in-delay-3}

🥉 Bronze Layer — **Forensics & Recovery**  
{: .md-h3 .fly-in .fly-in-delay-3}

- Use TT to **replay or re-ingest** raw data exactly as it arrived.  
- Valuable for **incident response** or verifying source integrity.  
- Example: Compare raw HL7 messages from version 0 to version 5 after ETL code changes.  
{: .indent-md .fly-in .fly-in-delay-3}

🥈 Silver Layer — **Audit & Validation**  
{: .md-h3 .fly-in .fly-in-delay-3}

- TT becomes a **data-quality checkpoint**: confirm that cleansing, joins, and de-identification behaved as expected.  
- Enables **before/after comparisons** across schema-enforced snapshots.  
- Example: Inspect patient records prior to masking or deduplication.  
{: .indent-md .fly-in .fly-in-delay-3}

🥇 Gold Layer — **Reproducibility & Traceability**  
{: .md-h3 .fly-in .fly-in-delay-3}

- TT supports **historical reporting** and reproducible analytics.  
- Analysts can regenerate a dashboard *as it appeared on a given date*.  
- Example: Query `gold.monthly_revenue VERSION AS OF 57` to match a published KPI report.  
{: .indent-md .fly-in .fly-in-delay-3}

---

💡 **Summary**  
Time Travel is the connective tissue between Medallion layers —  
it preserves **lineage, reproducibility, and trust**, ensuring that every refinement step from Bronze → Silver → Gold can be explained, audited, and, if necessary, *rolled back in time.*
{: .fly-in .fly-in-delay-3}

---
[⬆ Back to Top](#toc){:.back-to-top}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // only trigger once
      }
    });
  }, { threshold: 0.2 }); // fire when 20% visible

  document.querySelectorAll(".fly-in").forEach(el => observer.observe(el));
});
</script>