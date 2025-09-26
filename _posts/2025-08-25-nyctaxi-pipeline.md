---
layout: single
title: "NYC Taxi Data: First Steps in Validation"
excerpt: "Every data pipeline starts with trust in the data. In this first step with the NYC Taxi dataset, We step through schema checks, column profiling, and early validation techniques that catch errors before they ripple downstream. A foundation in clean data means smoother imports, accurate analytics, and fewer surprises later."
date: 2025-08-25
classes: center-page
author_profile: false
sidebar: false
tags: [nyc taxi, parquet, psv, data pipelines, validation, duckdb]
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/nyctaxi-hero.jpg
  caption: "NYC Taxi Trip Data Pipeline"
---

<a id="toc" class="visually-hidden"></a>

One of the most useful public datasets for testing large-scale data pipelines is the **NYC Taxi & Limousine Commission (TLC) Trip Record Data**. It’s massive, well-structured, and full of quirks that make it ideal for exercising ETL workflows.

This post covers the very first step we’re taking: **validation.** Before pushing terabytes of trip records downstream into SQL Server or PostgreSQL, we want to *know what’s in the files*.

---

## Why Validate First?
Government-sourced data can be messy:
- **Unexpected nulls** in required fields like `passenger_count`
- **Type mismatches** (e.g., fees as strings instead of decimals)
- **Schema drift** between months or years

Validating up front gives us:
- Confidence in schema consistency  
- Quick detection of anomalies  
- Preview snapshots for exploration  
[⬆ Back to Top](#toc){:.back-to-top}

---

## Tools We’re Using
We’re leaning on **DuckDB** and **Pandas** inside a Python script. DuckDB’s SQL engine can query Parquet directly without full ingestion. That means we can:
- Load and check schema on the fly  
- Profile row counts and basic stats  
- Output previews to CSV/Markdown for inspection  

Our script produces: 
1. **Schema report**  
2. **Profile summary** (row counts, averages, null counts)  
3. **Sample preview rows**  

All of this happens before we move on to conversion. [⬆ Back to Top](#toc){:.back-to-top}

---

## From Parquet to PSV 
Why are we converting to PSV (pipe-separated values) instead of CSV?

- **Cleaner parsing**: Taxi data includes free-text fields; commas inside those fields can break CSV parsing. Pipes are far less common.  
- **Bulk insert friendly**: SQL Server and PostgreSQL handle PSV easily with bulk import tools.  
- **Human readable**: We can still open PSV files in editors like LibreOffice Calc by specifying the delimiter.  

This gives us a balance: keep Parquet for analytics, but use PSV as the durable format for database bulk load. [⬆ Back to Top](#toc){:.back-to-top}

---

## What’s Next 
Validation is the **gatekeeper step**. Once each Parquet passes checks, we convert it to PSV and bulk insert into SQL Server. From there, we can normalize, clean, and eventually push into PostgreSQL and Airflow for downstream orchestration.

This blog series will follow each step. The next entry will cover the conversion process and the first successful bulk load. [⬆ Back to Top](#toc){:.back-to-top}


---

*Michael Shawn Lockwood*  
Senior DBA • MCDBA • Performance Optimization and Scalability Specialist • SSIS & T-SQL Expert
