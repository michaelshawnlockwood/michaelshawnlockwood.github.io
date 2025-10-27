---
layout: single
title: "Airflow Setup Lab – Pages 1–6 Recap (Draft)"
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

<a id="toc" class="visually-hidden"></a>

# <img src="/assets/images/airflow-ico.png" alt="Airflow" width="24" height="24"> Airflow Setup Journey: Pages 1–6

I’ve been working through a multi-step Airflow lab setup. Each session I’ve documented as a “page,” keeping a steady rhythm with _SANE_ blocks (Summary, Achievements, Next Steps, &amp; Evaluation). Here’s the recap of what’s been accomplished so far and where things stand today.

---

## Page 1 — Baseline Cluster Running
- Bring up a **basic Airflow cluster** (CeleryExecutor) with Redis and Postgres via Docker Compose.  
- Articulate the difference between **local development vs. production** configs.  
  - To-do: List these differneces here.
- Confirm all baseline services started correctly.  
  - To-do: How exactly?
- Note that this environment is strictly for lab/dev work — production setups need TLS, SSO, scaling, etc.  

---

## Page 2 — Airflow Baseline Validation
- Verify services are healthy and communicating.  
- Realize DAGs are **workflow definitions stored as code**.  
- Connect Airflow’s role in orchestrating pipelines: Parquet → PSV → SQL Server.  
- Compare Airflow’s role to traditional SSIS.  

---

## Page 3 — Data Folders and Local Storage
- Create required **data directories** under `Airflow-Lab` to house raw, processed, and staging files.  
- Confirm local file paths were mapped correctly.  
- Rehearsed a test probe script and ensured visibility inside containers.  
- Establish local bind mounts as the starting point before layering on cloud storage later.  

---

## Page 4 — Overrides and Volume Mounts
- Introduce `docker-compose.override.yml`.  
- Add consistent volume mounts (`D:\AppDev\Airflow-Lab\data → /opt/airflow/data`) across **webserver, scheduler, worker, and flower**.  
- Confirm `airflow-triggerer` is included in service definitions.  
- Standardize mount strategy across all long-running services.  

---

## Page 5 — Smoke Test (Step 3 Complete)
- Recreate long-running services with `--force-recreate`.  
- Fix missing bind on **airflow-triggerer** so all services see the same mount.  
- Drop probe file `_mount_probe.txt` into `data/` and verify visibility from **webserver, scheduler, worker, triggerer, and flower**.  
- **SMOKE-TEST: PASS** → probe file is visible/readable everywhere.  
- Scripts:  
  - `Airflow-Setup-MountCheck.ps1` (ad-hoc probe runner).  
  - `New-MountProbeFile.ps1` (parameterized smoke test).  

---

## Page 6 — Flower and DAG Prep (In Progress)
- Bring stack up with Flower enabled:  
  ```powershell
  docker compose --profile flower up -d
  ```

  End
