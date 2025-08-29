---
layout: single
title: "Eight Essential Queries for NYC Yellow Taxi Data"
excerpt: ""
date: 2025-08-29
classes: center-page
categories: nyc-taxi sql-server analytics
tags: [nyc taxi, sql server, t-sql, dashboard, queries]
author_profile: false
description: ""
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/nyctaxi-hero.jpg
  caption: "Eight Essential Queries for NYC Yellow Taxi Data"
---

Working with the NYC Taxi dataset isn’t just about storing rows — it’s about asking the right questions.

Once the raw PSV files are bulk-inserted into SQL Server, you can unlock a lot of insight with just a handful of well-chosen queries.

Here are **eight essentials** I use when exploring the `dbo.yellow_tripdata` table. Together, they’re dashboard-ready: trips, revenue, zones, payments, and rider behavior.

---

## 1) Daily Revenue & Trips (+ integrity hash)
```sql
SELECT CAST([tpep_pickup_datetime] AS DATE) AS [trip_date],
       COUNT(*) AS [total_trips],
       SUM([total_amount]) AS [total_revenue],
       AVG([trip_distance]) AS [average_trip_distance],
       HASHBYTES('SHA2_256', 
           CAST(CAST([tpep_pickup_datetime] AS DATE) AS VARCHAR(10)) + '|' +
           CAST(COUNT(*) AS VARCHAR(20)) + '|' +
           CAST(SUM([total_amount]) AS VARCHAR(20)) + '|' +
           CAST(AVG([trip_distance]) AS VARCHAR(20))
       ) AS [data_integrity_hash]
FROM [dbo].[yellow_tripdata]
GROUP BY CAST([tpep_pickup_datetime] AS DATE)
ORDER BY [trip_date];
GO
```
## 2) Top 10 Pickup Locations (by revenue)
```sql
SELECT TOP 10
       [PULocationID],
       COUNT(*) AS [trip_count],
       SUM([total_amount]) AS [total_revenue]
FROM [dbo].[yellow_tripdata]
GROUP BY [PULocationID]
ORDER BY [total_revenue] DESC;
GO
```
## 3) Top 10 Drop-off Locations (by trip count)
```sql
SELECT TOP 10
       [DOLocationID],
       COUNT(*) AS [trip_count],
       SUM([total_amount]) AS [total_revenue]
FROM [dbo].[yellow_tripdata]
GROUP BY [DOLocationID]
ORDER BY [trip_count] DESC;
GO
```
## 4) Revenue & Tips by Payment Type
```sql
SELECT [payment_type],
       COUNT(*) AS [trips],
       SUM([total_amount]) AS [total_revenue],
       ROUND(AVG([tip_amount]), 2) AS [avg_tip]
FROM [dbo].[yellow_tripdata]
GROUP BY [payment_type]
ORDER BY [total_revenue] DESC;
GO
```
## 5) Peak Hour Analysis
```sql
SELECT DATEPART(HOUR, [tpep_pickup_datetime]) AS [pickup_hour],
       COUNT(*) AS [trip_count],
       SUM([total_amount]) AS [revenue]
FROM [dbo].[yellow_tripdata]
GROUP BY DATEPART(HOUR, [tpep_pickup_datetime])
ORDER BY [pickup_hour];
GO
```
## 6) Trip Distance Distribution
```sql
SELECT
    CASE
        WHEN [trip_distance] < 1 THEN '<1 mile'
        WHEN [trip_distance] BETWEEN 1 AND 3 THEN '1–3 miles'
        WHEN [trip_distance] BETWEEN 3 AND 5 THEN '3–5 miles'
        WHEN [trip_distance] BETWEEN 5 AND 10 THEN '5–10 miles'
        ELSE '>10 miles'
    END AS [distance_bucket],
    COUNT(*) AS [trip_count],
    ROUND(AVG([total_amount]), 2) AS [avg_revenue]
FROM [dbo].[yellow_tripdata]
GROUP BY CASE
        WHEN [trip_distance] < 1 THEN '<1 mile'
        WHEN [trip_distance] BETWEEN 1 AND 3 THEN '1–3 miles'
        WHEN [trip_distance] BETWEEN 3 AND 5 THEN '3–5 miles'
        WHEN [trip_distance] BETWEEN 5 AND 10 THEN '5–10 miles'
        ELSE '>10 miles'
    END
ORDER BY MIN([trip_distance]);
GO
```
## 7) Average Fare per Mile (daily)
```sql
SELECT CAST([tpep_pickup_datetime] AS DATE) AS [trip_date],
       ROUND(SUM([fare_amount]) / NULLIF(SUM([trip_distance]), 0), 2) AS [avg_fare_per_mile]
FROM [dbo].[yellow_tripdata]
GROUP BY CAST([tpep_pickup_datetime] AS DATE)
ORDER BY [trip_date];
GO
```
## 8) Overall Tip Percentage
```sql
SELECT ROUND(100.0 * SUM([tip_amount]) / NULLIF(SUM([fare_amount]), 0), 2) AS [tip_percent],
       COUNT(*) AS [trip_count]
FROM [dbo].[yellow_tripdata];
GO
```