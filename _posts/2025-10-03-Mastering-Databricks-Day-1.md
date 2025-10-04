---
layout: single
title: "Mastering Databricks — Day 1 (Parquet, SQL Warehouse, Volumes, and Delta)"
excerpt: "A fast, DBA-rigorous walk from first login to a real Delta table on Databricks Free Edition. Validate the SQL Warehouse, inspect sample data, upload and ingest Parquet files&mdash;two NYC Taxi files from July and August 2025&mdash;stage them into a managed Volume, ingest into a Delta table using CTAS, append a second file with COPY INTO, and prove it with simple profiling queries. (Δ)"
date: 2025-10-03
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories: [Lab, Databricks, Data Engineering, Parquet]
tags: [Databricks, Databricks SQL, Delta Lake, Volumes, COPY INTO, read_files, Parquet, NYC Taxi]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay-wide.jpg 
  caption: "NYC Taxi → Volumes → Delta Lake on Databricks SQL"
---

<a id="toc" class="visually-hidden"></a>

### Step 1 — Open SQL Editor &amp; verify connection to the SQL Warehouse “Serverless Starter Warehouse 2XS”
```sql
-- Context + engine check
SELECT current_user(), current_catalog(), current_schema();
SELECT 1 AS ok;

SHOW VOLUMES IN workspace.default;
LIST '/Volumes/workspace/default/NYCTaxiTrips';
```

![YellowTrips table validation](/assets/images/screenshots/databricks-volumes.JPG)
{: .screenshot-lg }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 2 — Browse the Samples Catalog
```sql
SHOW CATALOGS;
SHOW SCHEMAS IN samples;
SHOW TABLES  IN samples.nyctaxi;
```
![YellowTrips table validation](/assets/images/screenshots/databricks-samples.JPG)
{: .screenshot-sm }
```sql
SELECT * FROM samples.nyctaxi.trips LIMIT 50;
```

![YellowTrips table validation](/assets/images/screenshots/databricks-sampledata.JPG)
{: .screenshot-lg }

---

### Step 3 — Create a Managed Volume for raw files
1. Path: Catalog Explorer ➜ workspace ➜ Create ➜ Volume / Table / Model
2. Pick Schema: default ➜ Type: Managed ➜ Name: NYCTaxiTrips 
3. Files land under: /Volumes/workspace/default/NYCTaxiTrips/...

![YellowTrips table validation](/assets/images/screenshots/databricks-createvolume.JPG)
{: .screenshot-sm }
```sql
SHOW VOLUMES IN workspace.default;
```
![YellowTrips table validation](/assets/images/screenshots/databricks-volume.JPG)
{: .screenshot-sm }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 4 — Upload Parquet files into the Volume (UI)
Catalog ➜ Volume (nyctaxitrip) ➜ Upload to volume

![YellowTrips table validation](/assets/images/screenshots/databricks-uploadtovolume.JPG)
{: .screenshot-lg }

Confirm files landed
```sql
LIST '/Volumes/workspace/default/NYCTaxiTrips';
```

![YellowTrips table validation](/assets/images/screenshots/databricks-files.JPG)
{: .screenshot-lg }

---

### Step 5 — CTAS from Parquet → Delta (August 2025)
```sql
USE CATALOG workspace;
USE SCHEMA default;

CREATE OR REPLACE TABLE yellowtrips
USING DELTA AS
SELECT *
FROM read_files(
  '/Volumes/workspace/default/NYCTaxiTrips/yellow_tripdata_2025-08.parquet',
  format => 'parquet'
);
```

This is Databricks SQL (ANSI SQL with Databricks extensions).
read_files() is a table-valued function that reads files from a Unity Catalog Volume or external location, and format => 'parquet' uses Databricks’ named-argument syntax (=>).
{: .nuance}

![YellowTrips table validation](/assets/images/screenshots/databricks-tables.JPG)
{: .screenshot-lg }

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 6 — Baseline validation of the new table
```sql
DESCRIBE TABLE  YellowTrips;
```
![YellowTrips table validation](/assets/images/screenshots/databricks-describetable.JPG)
{: .screenshot-lg }
```sql
ANALYZE TABLE YellowTrips COMPUTE STATISTICS;
DESCRIBE EXTENDED YellowTrips;
```
![YellowTrips table validation](/assets/images/screenshots/databricks-describeextended.JPG)
{: .screenshot-sm }

You can query DESCRIBE HISTORY like a table, then extract operationMetrics fields (they’re strings in a MAP) and cast them. Here are the patterns:
```sql
SELECT
  version,
  timestamp,
  operation,
  CAST(operationMetrics['numOutputRows'] AS BIGINT) AS num_output_rows
FROM (DESCRIBE HISTORY YellowTrips)
WHERE operation IN (
  'COPY INTO',
  'WRITE',
  'CREATE TABLE AS SELECT',
  'REPLACE TABLE AS SELECT'
)
ORDER BY version DESC
LIMIT 10;
```
![YellowTrips table validation](/assets/images/screenshots/databricks-operationmetrics.JPG)
{: .screenshot-med }

---

### Step 7 — File vs. Table cross-check (row counts)
```sql
-- File (Parquet) count
SELECT COUNT(*) AS file_rows
FROM read_files(
  '/Volumes/workspace/default/NYCTaxiTrips/yellow_tripdata_2025-08.parquet',
  format => 'parquet'
);

-- Delta table count
SELECT COUNT(*) AS table_rows FROM YellowTrips;
```

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 8 — Append the July 2025 file (COPY INTO)
```sql
COPY INTO YellowTrips
  FROM '/Volumes/workspace/default/NYCTaxiTrips/yellow_tripdata_2025-07.parquet'
  FILEFORMAT = PARQUET;

-- Audit trail of the load
DESCRIBE HISTORY YellowTrips;
```

---

### Step 9 — Profile (by month)
```sql
SELECT date_trunc('month', tpep_pickup_datetime) AS month,
       COUNT(*) AS trips
FROM YellowTrips
GROUP BY 1
ORDER BY 1;
```

### Step 10 - Persist an audit table
```sql
CREATE SCHEMA IF NOT EXISTS etl_metrics;
CREATE TABLE IF NOT EXISTS etl_metrics.yellowtrips_loads (
  version BIGINT, ts TIMESTAMP, op STRING,
  rows BIGINT, bytes BIGINT
);

INSERT INTO etl_metrics.yellowtrips_loads
SELECT
  version,
  timestamp AS ts,
  operation AS op,
  TRY_CAST(element_at(operationMetrics,'numOutputRows')  AS BIGINT) AS num_output_rows,
  TRY_CAST(element_at(operationMetrics,'numOutputBytes') AS BIGINT) AS num_output_bytes
FROM (DESCRIBE HISTORY YellowTrips) h
WHERE h.operation IN ('COPY INTO','WRITE','CREATE TABLE AS SELECT','REPLACE TABLE AS SELECT')
  AND h.version > COALESCE((SELECT MAX(version) FROM etl_metrics.yellowtrips_loads), -1);

SELECT * FROM etl_metrics.yellowtrips_loads;
```

---

[⬆ Back to Top](#toc){:.back-to-top}
### Step 11 — Day-1 Wrap-Up &amp; Next
_What is proven: warehouse online, catalog browsing, Volume staging, CTAS to Delta, append via COPY INTO, and validation queries._

#### Next session (Phase 3/4):
1. Build an explicit-schema twin (YellowTrips_Strict) and compare types.
2. Start tuning: OPTIMIZE YellowTrips ZORDER BY (tpep_pickup_datetime); then measure before/after.
3. Test Time Travel and DESCRIBE HISTORY to illustrate ACID versioning.