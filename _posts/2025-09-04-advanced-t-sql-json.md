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

<a id="toc" class="visually-hidden"></a>

## Advanced SQL Queries (copy-ready T-SQL)

# 1. Daily summary → one JSON array

Trips per day totals; compact, API-friendly JSON.

```sql
SELECT [date] = CAST([tpep_pickup_datetime] AS date) ,
	[trips] = COUNT(*) ,
	[revenue] = ROUND(SUM([total_amount]), 2) ,
	[avg_distance] = ROUND(AVG([trip_distance]), 2) ,
	[avg_minutes] = ROUND(AVG(DATEDIFF(second, [tpep_pickup_datetime], [tpep_dropoff_datetime]))/60.0, 1)
FROM [dbo].[yellow_tripdata]
GROUP BY CAST([tpep_pickup_datetime] AS date)
ORDER BY [date]
FOR JSON PATH, ROOT('daily'), INCLUDE_NULL_VALUES;
GO
```

<script defer src="{{ '/assets/js/copy-code.js' | relative_url }}"></script>
