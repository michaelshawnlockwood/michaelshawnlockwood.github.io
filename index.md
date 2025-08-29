---
layout: home
title: "NYC Taxi Trips — Project Hub"
excerpt: "End-to-end pipeline: dictionary → DDL → BULK INSERT → analytics → blog."
# For Minimal Mistakes: shows latest posts on the home page
paginate: true
author_profile: true
classes: wide
---

## What’s inside

This project builds a reproducible SQL Server pipeline for NYC Yellow Taxi data:

- **Phase 1–2:** profile Parquet/PSV → generate **data dictionaries**
- **Phase 3:** generate **CREATE TABLE** DDL from dictionaries; **BULK INSERT** monthly PSV
- **Analytics:** curated **T-SQL queries** for dashboards (daily trends, zones, payments, tips)
- **Docs:** blog posts that double as your toolbox

---

## Quick links

- **Dashboard queries (blog post):**  
  [/nyc-taxi/sql-server/analytics/2025/08/29/nyc-taxi-dashboard-queries.html](/nyc-taxi/sql-server/analytics/2025/08/29/nyc-taxi-dashboard-queries.html)

- **Runnable SQL (all 8 queries):**  
  `sql/yellow_tripdata_dashboard.sql`

- **Generators & loaders:**  
  - `python/generate_sql_from_dictionary.py` (robust `--help`)  
  - `Generate-SqlFromDictionary.ps1` (comment-based `Get-Help`)  
  - `Import-PsvToSql.ps1` (loop *.psv → BULK INSERT)

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
