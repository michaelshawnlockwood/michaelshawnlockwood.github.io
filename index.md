---
layout: single
title: "🏠 Welcome to the NYC Taxi Project Hub"
excerpt: "Central hub for my NYC Yellow Taxi Data Engineering Project — pipelines, analytics, and documentation."
date: 2025-08-29
classes: center-page
categories: nyc-taxi sql-server analytics
tags: [nyc taxi, sql server, t-sql, pipelines, analytics, projects]
author_profile: false
description: "Explore the NYC Yellow Taxi Data Engineering Project — ingestion, validation, pipelines, dashboards, and analytics."
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/nyctaxi-hero.jpg
  caption: "NYC Taxi Data Engineering Project Hub"
---

<a id="toc" class="visually-hidden"></a>


This is the central hub for my **NYC Yellow Taxi Data Engineering Project** — part of my broader professional portfolio.
 
From here you can explore pipelines, analytics, and visualizations that demonstrate how I approach real-world data problems.

## 📖 What’s inside

This project builds a reproducible SQL Server pipeline for NYC Yellow Taxi data:

- **Phase 1 — Sampling & profiling:** scan Parquet files to summarize data types, aggregates, and null counts
- **Phase 2 — Conversion:** transform validated Parquet datasets into PSV (pipe-separated values) for easier parsing and bulk load
- **Phase 3 — Data dictionaries:** use Python and PowerShell[^1] to generate column definitions, null statistics, and value samples
- **Phase 4 — Schema generation & load:** create T-SQL `CREATE TABLE` scripts from dictionaries and bulk insert monthly PSV
- **Phase 5 — Analytics:** run curated T-SQL queries for dashboards (daily trends, zones, payments, tips)
- **Docs:** blog posts that double as a working toolbox and reference

🔗 For the first step in this journey, see the blog post: [NYC Taxi Data: First Steps in Validation](/2025/08/25/nyctaxi-pipeline.html)

[^1]: We created two versions of the data-dictionary generator — one in Python (`make_data_dictionary.py`) and one in PowerShell (`make_data_dictionary.ps1`) — to demonstrate how the same task can be accomplished in both languages.

---

## ⚡ Quick links

- **Blog / Analysis**  
  - [NYC Taxi Data: Dashboard Queries](/2025/08/29/nyc-taxi-dashboard-queries.html) — article with screenshots, commentary, and all 8 copy-ready T-SQL queries

- **Python utilities**  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/make_data_dictionary.py" target="_blank" rel="noopener">make_data_dictionary.py</a> — build column/field dictionary  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/generate_sql_from_dictionary.py" target="_blank" rel="noopener">generate_sql_from_dictionary.py</a> — generate CREATE scripts from dictionary (--help)  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/parquet_to_psv.py" target="_blank" rel="noopener">parquet_to_psv.py</a> — convert Parquet → PSV  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/validate_parquet.py" target="_blank" rel="noopener">validate_parquet.py</a> — schema validation for a single Parquet  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/validate_parquet_batch.py" target="_blank" rel="noopener">validate_parquet_batch.py</a> — batch validate Parquet files  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/validate_psv.py" target="_blank" rel="noopener">validate_psv.py</a> — schema validation for a single PSV  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/validate_psv_batch.py" target="_blank" rel="noopener">validate_psv_batch.py</a> — batch validate PSV files  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/render-structure.py" target="_blank" rel="noopener">render-structure.py</a> — generate structure reports/diagrams

- **PowerShell utilities**  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/powershell/Generate-SqlFromDictionary.ps1" target="_blank" rel="noopener">Generate-SqlFromDictionary.ps1</a> — generate CREATE scripts from dictionary (comment-based Get-Help)  
  - <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/powershell/Import-PsvToSql.ps1" target="_blank" rel="noopener">Import-PsvToSql.ps1</a> — loop *.psv → BULK INSERT

  - **Runnable SQL**  
  - <a href="https://github.com/michaelshawnlockwood/nyctaxi-pipeline/blob/main/sql/create_all.sql" target="_blank" rel="noopener">_create_all.sql</a> (<a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/sql/create_all.sql" target="_blank" rel="noopener">raw</a>) — schema auto-generated by <a href="https://raw.githubusercontent.com/michaelshawnlockwood/nyctaxi-pipeline/main/python/generate_sql_from_dictionary.py" target="_blank" rel="noopener">_generate_sql_from_dictionary.py</a>

---

## 🧩 Repo structure

```text
nyctaxi-pipeline/
├── data_in/                # raw parquet/psv (ignored)
├── data_out/               # transformed (ignored)
├── python/
│   ├── generate_sql_from_dictionary.py
│   └── sql_out/            # GENERATED DDL (ignored)
├── sql/
│   ├── yellow_tripdata_dashboard.sql
│   ├── tables/             # hand-curated DDL
│   ├── utilities/          # SPs that write SPs (coming soon)
│   └── legacy_scripts/     # rescued/modernized gems
└── docs/
    └── yellow_tripdata_dashboard_queries.md
```
