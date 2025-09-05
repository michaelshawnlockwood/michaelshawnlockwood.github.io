---
layout: single
title: "SQL Server JSON SPs → Minimal .NET API → Postman"
excerpt: "Stored procedures emit JSON via OUT params; a tiny .NET 8 Minimal API exposes them as endpoints you can validate with curl and Postman."
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
  caption: "From T-SQL OUT params to API endpoints"
---

![SP → API → Validation](/assets/images/sp-api-validation.svg)

My approach aligns with common practice: **generate JSON inside SQL** (deterministic, testable) and let a **minimal API** simply return it. This keeps the logic close to the data, reduces app complexity, and makes validation trivial.

### 1) Stored procedure pattern (JSON OUT)
```sql
CREATE OR ALTER PROC dbo.GetDailySummaryJson
  @dailySummary nvarchar(max) OUTPUT
AS
BEGIN
  SET NOCOUNT ON;
  SELECT @dailySummary = (
    SELECT [date]        = CAST([tpep_pickup_datetime] AS date),
           [trips]       = COUNT(*),
           [revenue]     = ROUND(SUM([total_amount]), 2),
           [avgDistance] = ROUND(AVG([trip_distance]), 2),
           [avgMinutes]  = ROUND(AVG(DATEDIFF(second, [tpep_pickup_datetime], [tpep_dropoff_datetime]))/60.0, 1)
    FROM   [dbo].[yellow_tripdata]
    GROUP BY CAST([tpep_pickup_datetime] AS date)
    ORDER BY [date]
    FOR JSON PATH, ROOT('daily')
  );
END;
GO
```
