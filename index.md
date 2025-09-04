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

## What’s inside

This project builds a reproducible SQL Server pipeline for NYC Yellow Taxi data:

- **Phase 1–2:** profile Parquet/PSV → generate **data dictionaries**
- **Phase 3:** generate **CREATE TABLE** DDL from dictionaries; **BULK INSERT** monthly PSV
- **Analytics:** curated **T-SQL queries** for dashboards (daily trends, zones, payments, tips)
- **Docs:** blog posts that double as your toolbox

---

## Quick links

- **Blog / Analysis**  
  - [Dashboard queries (article with screenshots & commentary)](/2025/08/29/nyc-taxi-dashboard-queries.html)

- **Runnable SQL**  
  - [All 8 queries (copy-ready T-SQL)](/2025/08/29/nyc-taxi-dashboard-queries.html)  
  - [`create_all.sql`](https://github.com/michaelshawnlockwood/nyctaxi-pipeline/blob/main/sql/create_all.sql) — schema from dictionary

- **Python & PowerShell utilities**  
  - `python/generate_sql_from_dictionary.py` — robust `--help`  
  - `Generate-SqlFromDictionary.ps1` — comment-based `Get-Help`  
  - `Import-PsvToSql.ps1` — loop *.psv → BULK INSERT

---

## Repo structure

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
