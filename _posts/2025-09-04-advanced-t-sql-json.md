---
layout: single
title: "NYC Taxi: Advanced SQL — Analytics to JSON for APIs"
excerpt: "Turn dashboard metrics into clean, nested JSON payloads using FOR JSON PATH, without leaving SQL Server."
date: 2025-09-04
classes: center-page
author_profile: false
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/time-analysis-area-chart.svg
  caption: "From T-SQL to API payloads"
---

<a id="top-of-page" class="visually-hidden"></a>

# ⚡ Advanced SQL Queries (copy-ready T-SQL)

This section goes beyond simple SELECT statements. Each script is designed to produce API-ready JSON payloads directly from SQL Server using FOR JSON PATH. The queries cover daily trends, nested payment mixes, zone performance, and outlier detection—structured so they can be copied, run, and reused without modification. Together, they show how SQL Server can act as both the data engine and the JSON provider for analytics, dashboards, and service integration.

# 1. Daily summary → one JSON array

Turns raw trip data into a compact, API-friendly JSON array with totals per day. The payload includes trips, revenue, distance, and ride duration, giving consumers a ready-to-use daily metrics feed.

```sql
/* 1. Daily summary → one JSON array */

SELECT [date]        = CAST([tpep_pickup_datetime] AS date) ,
       [trips]       = COUNT(*) ,
       [revenue]     = ROUND(SUM([total_amount]), 2) ,
       [avgDistance] = ROUND(AVG([trip_distance]), 2) ,
       [avgMinutes]  = ROUND(AVG(DATEDIFF(second, [tpep_pickup_datetime], [tpep_dropoff_datetime]))/60.0, 1)
FROM   [dbo].[yellow_tripdata]
GROUP BY CAST([tpep_pickup_datetime] AS date)
ORDER BY [date]
FOR JSON PATH, ROOT('daily'), INCLUDE_NULL_VALUES;
GO
```
# 2. Payment mix daily → nested JSON

Provides a nested JSON object for each date, breaking down trips by payment method (credit, cash, dispute, etc.). This structure supports dashboards or APIs that need to visualize or track payment mix trends over time.

```sql
/* 2. Payment mix daily → nested JSON */

WITH [days] AS (
    SELECT [date] = CAST([tpep_pickup_datetime] AS date)
    FROM [dbo].[yellow_tripdata]
    GROUP BY CAST([tpep_pickup_datetime] AS date)
),
[methods] AS (
    SELECT
        [date]      = CAST([tpep_pickup_datetime] AS date),
        [payMethod] = CASE [payment_type]
                        WHEN 1 THEN 'credit'
                        WHEN 2 THEN 'cash'
                        WHEN 3 THEN 'no_charge'
                        WHEN 4 THEN 'dispute'
                        WHEN 5 THEN 'unknown'
                        WHEN 6 THEN 'voided'
                        ELSE 'other'
                      END,
        [trips]     = COUNT(*)
    FROM [dbo].[yellow_tripdata]
    GROUP BY CAST([tpep_pickup_datetime] AS date), [payment_type]
)
SELECT
    [date]       = [d].[date],
    [paymentMix] = JSON_QUERY(
                      (
                        SELECT
                            [method] = [m].[payMethod],
                            [trips]  = [m].[trips]
                        FROM [methods] AS [m]
                        WHERE [m].[date] = [d].[date]
                        FOR JSON PATH
                      )
                   )
FROM [days] AS [d]
ORDER BY [d].[date]
FOR JSON PATH, ROOT('paymentByDay');
```

# 3. Zone performance → nested JSON (zone KPIs)

Summarizes activity per pickup zone, including trips, average distance, average fare, and average tip. This JSON payload is ideal for map overlays or zone-level performance dashboards.

```sql
/* 3. Zone performance → nested JSON (zone KPIs) */

SELECT
    [zoneId]      = [PULocationID],
    [trips]       = COUNT(*),
    [avgDistance] = ROUND(AVG([trip_distance]), 2),
    [avgFare]     = ROUND(AVG([total_amount]), 2),
    [avgTip]      = ROUND(AVG([tip_amount]), 2)
FROM [dbo].[yellow_tripdata]
GROUP BY [PULocationID]
ORDER BY [trips] DESC
FOR JSON PATH, ROOT('zones');
```

# 4. Top N pickup→dropoff flows (origin–destination matrix) → JSON

Identifies the busiest origin–destination pairs, ranked by trip count. Useful for heatmaps, network diagrams, or traffic analysis that show how riders move across the city.
```sql
/* Top N pickup→dropoff flows (origin–destination matrix) → JSON */

WITH flows AS (
  SELECT TOP (50)
    PULocationID AS [from_zone],
    DOLocationID AS [to_zone],
    COUNT(*)     AS [trips],
    ROUND(AVG(total_amount),2) AS [avg_fare]
  FROM dbo.yellow_tripdata
  GROUP BY PULocationID, DOLocationID
  ORDER BY COUNT(*) DESC
)
SELECT *
FROM flows
FOR JSON PATH, ROOT('top_flows');
```

# 5. Tip percentiles per day → JSON (P50/P90)

Calculates median (P50) and high-end (P90) tip percentages by day. Percentiles provide a clearer view of rider behavior than averages, which can be skewed by outliers.
```sql
/* Tip percentiles per day → JSON (P50, P90) */

WITH [x] AS (
    SELECT [date]   = CAST([tpep_pickup_datetime] AS date),
           [tipPct] = IIF([total_amount] > 0,
                          [tip_amount] / NULLIF([total_amount], 0),
                          NULL)
    FROM   [dbo].[yellow_tripdata]
    WHERE  [total_amount] > 0
),
[p] AS (
    SELECT [date],
           [p50] = PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY [tipPct]) 
                   OVER (PARTITION BY [date]),
           [p90] = PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY [tipPct]) 
                   OVER (PARTITION BY [date])
    FROM   [x]
)
SELECT [date],
       [tipP50Pct] = ROUND(AVG([p50]) * 100, 1),
       [tipP90Pct] = ROUND(AVG([p90]) * 100, 1)
FROM   [p]
GROUP BY [date]
ORDER BY [date]
FOR JSON PATH, ROOT('tipPercentiles');
```

# 6. Outlier scan (distance vs minutes) → JSON (flag candidates)

Flags trips with suspicious values (e.g., zero-minute rides, negative fares, or extreme totals). This JSON feed can be used for data quality checks or anomaly detection pipelines.
```sql
/* Outlier scan (distance vs minutes) → JSON (flag candidates) */

WITH [base] AS (
    SELECT [date]         = CAST([tpep_pickup_datetime] AS date),
           [tripDistance] = [trip_distance],
           [minutes]      = DATEDIFF(minute, [tpep_pickup_datetime], [tpep_dropoff_datetime]),
           [totalAmount]  = [total_amount],
           [puLocationId] = [PULocationID],
           [doLocationId] = [DOLocationID]
    FROM   [dbo].[yellow_tripdata]
),
[scored] AS (
    SELECT *,
           [badTimeOrDist] = IIF([minutes] <= 0 OR [tripDistance] < 0.1, 1, 0),
           [fareOutlier]   = IIF([totalAmount] < 0 OR [totalAmount] > 500, 1, 0)
    FROM   [base]
)
SELECT TOP (200)
       [date],
       [puLocationId],
       [doLocationId],
       [tripDistance],
       [minutes],
       [totalAmount],
       [outlier] = IIF([badTimeOrDist] = 1 OR [fareOutlier] = 1, 1, 0)
FROM   [scored]
WHERE  [badTimeOrDist] = 1
    OR [fareOutlier] = 1
ORDER BY [date] DESC
FOR JSON PATH, ROOT('outliers');
```

# 7. One “full payload” example → nested sections in a single JSON document

Assembles multiple query outputs (daily metrics + zone performance) into a single nested JSON document. This demonstrates how SQL Server can deliver an API-ready response without additional transformation layers.
```sql
/* One “full payload” example → nested sections in a single JSON document */

DECLARE @daily nvarchar(max);
DECLARE @zones nvarchar(max);

SET @daily = (
    SELECT [date]    = CAST([tpep_pickup_datetime] AS date),
           [trips]   = COUNT(*),
           [revenue] = ROUND(SUM([total_amount]), 2)
    FROM   [dbo].[yellow_tripdata]
    GROUP BY CAST([tpep_pickup_datetime] AS date)
    ORDER BY [date]
    FOR JSON PATH
);

SET @zones = (
    SELECT [zoneId]      = [PULocationID],
           [trips]       = COUNT(*),
           [avgFare]     = ROUND(AVG([total_amount]), 2),
           [avgDistance] = ROUND(AVG([trip_distance]), 2)
    FROM   [dbo].[yellow_tripdata]
    GROUP BY [PULocationID]
    ORDER BY [trips] DESC
    FOR JSON PATH
);

SELECT [generatedAtUtc] = SYSUTCDATETIME(),
       [daily]          = JSON_QUERY(@daily),
       [zones]          = JSON_QUERY(@zones)
FOR JSON PATH, ROOT('nycTaxiPayload');
```

---

# Notes & Best Practices for API-Ready JSON

- Use `FOR JSON PATH` with `ROOT('name')` for clean top-level arrays; use `WITHOUT_ARRAY_WRAPPER` for single objects.  
- Wrap nested subqueries with `JSON_QUERY(...)` so SQL Server doesn’t double-escape JSON.  
- Standardize types: `CAST(... AS date)` for keys, `ROUND(...)` for stable numeric precision.  
- If you must include nulls explicitly, add `INCLUDE_NULL_VALUES`.  
- Keep payloads bounded (`TOP N`, date ranges) for predictable response sizes.  
- Helpful indexes:  
  - `(CAST([tpep_pickup_datetime] AS date))` via computed persisted column + index  
  - `[PULocationID], [DOLocationID]`  
  - `[payment_type]`  
  - `[tpep_pickup_datetime]`  

---

# Blog Post Sections (match the “Simple Queries” article)

1. **Overview** — what the JSON payloads are for (APIs, dashboards, downstream services).  
2. **Daily summary JSON** — code + sample output block.  
3. **Nested payment mix** — show shape (`day → methods[]`).  
4. **Zone KPIs** — flat array for mapping.  
5. **Top flows** — origin → destination heatmap input.  
6. **Percentiles & outliers** — why percentiles beat averages; outlier JSON for QA.  
7. **Full payload assembly** — how to compose multiple JSON blocks in one response.  
8. **Download/run** — link to repo scripts + instructions.  

[⬆ Back to Top](#top-of-page){:.back-to-top}
