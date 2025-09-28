---
layout: single
title: "Airflow Setup Lab – Pages 1–6 Recap"
excerpt: "Step-by-step setup of an Apache Airflow lab with CeleryExecutor: baseline cluster running, volume mounts, smoke tests, Flower monitoring, and preparation for the first DAG run."
date: 2025-09-26
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories:
  - Lab
  - Data Engineering
  - Airflow
tags:
  - Apache Airflow
  - CeleryExecutor
  - Docker Compose
  - Redis
  - PostgreSQL
  - Flower
  - DAG
  - Data Pipelines
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay.jpg
  caption: "Apache Airflow Setup Lab — Pages 1–6"
---

# <img src="/assets/images/airflow-ico.png" alt="Airflow" width="24" height="24"> Airflow Setup Journey: Pages 1–6

I’ve been working through a multi-step Airflow lab setup. Each session I’ve documented as a “page,” keeping a steady rhythm with **SANE blocks** (Summary, Achievements, Next Steps, Evaluation). Here’s the recap of what’s been accomplished so far and where things stand today.

---

## Page 1 — Baseline Cluster Running
- Brought up a **basic Airflow cluster** (CeleryExecutor) with Redis and Postgres via Docker Compose.  
- Learned the difference between **local development vs. production** configs.  
- Confirmed all baseline services started correctly.  
- Noted that this environment is strictly for lab/dev work — production setups need TLS, SSO, scaling, etc.  

---

## Page 2 — Airflow Baseline Validation
- Verified services were healthy and communicating.  
- Discussed DAGs as **workflow definitions stored as code**.  
- Connected Airflow’s role in orchestrating pipelines: Parquet → PSV → SQL Server.  
- Compared Airflow’s role to traditional SSIS — and kept a one-pager “cheat sheet” for later study.  

---

## Page 3 — Data Folders and Local Storage
- Created required **data directories** under `Airflow-Lab` to house raw, processed, and staging files.  
- Confirmed local file paths were mapped correctly.  
- Rehearsed a test probe script and ensured visibility inside containers.  
- Established local bind mounts as the starting point before layering on cloud storage later.  

---

## Page 4 — Overrides and Volume Mounts
- Introduced `docker-compose.override.yml`.  
- Added consistent volume mounts (`D:\AppDev\Airflow-Lab\data → /opt/airflow/data`) across **webserver, scheduler, worker, and flower**.  
- Confirmed `airflow-triggerer` was included in service definitions.  
- Standardized mount strategy across all long-running services.  

---

## Page 5 — Smoke Test (Step 3 Complete)
- Recreated long-running services with `--force-recreate`.  
- Fixed missing bind on **airflow-triggerer** so all services could see the same mount.  
- Dropped probe file `_mount_probe.txt` into `data/` and verified visibility from **webserver, scheduler, worker, triggerer, and flower**.  
- **SMOKE-TEST: PASS** → probe file was visible/readable everywhere.  
- Scripts:  
  - `Airflow-Setup-MountCheck.ps1` (ad-hoc probe runner).  
  - `New-MountProbeFile.ps1` (parameterized smoke test).  

---

## Page 6 — Flower and DAG Prep (In Progress)
- Brought stack up with Flower enabled:  
  ```powershell
  docker compose --profile flower up -d
  ```

  End
