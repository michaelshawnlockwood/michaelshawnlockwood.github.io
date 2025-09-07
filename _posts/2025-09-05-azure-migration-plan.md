---
layout: single
title: "Azure Migration Plan: SQL Server On-Prem to Azure"
excerpt: "A practical playbook for planning, executing, and validating SQL Server migrations from on-premises to Azure, including HA/DR, rollback, and documentation."
date: 2025-09-05
classes: center-page
author_profile: false
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/azure-migration-roadmap.svg
  caption: "From on-prem SQL Server to Azure"
---

# Azure Migration Plan

This playbook outlines the steps for migrating SQL Server databases from an **on-premises environment** to **Microsoft Azure**.  
It is designed as a practical, execution-ready guide with attention to testing, rollback, and documentation.

---

## 1. Assessment & Planning

- **Inventory current environment**  
  - SQL Server versions, editions, patch levels  
  - Databases, sizes, growth rate  
  - Features in use (Replication, SSRS, SSAS, SSIS, Linked Servers, CLR, Service Broker)  
  - HA/DR setup (FCI, Always On, Log Shipping, Mirroring)  
  - Security dependencies (AD authentication, certificates, TDE, CMK/DMK)

- **Define migration goals**  
  - Target RTO/RPO  
  - Downtime window allowed  
  - Cost constraints (licensing, compute/storage tiers)  
  - Future scalability and performance needs

- **Select target Azure service**  
  - **Azure SQL Managed Instance** – supports near full SQL Server feature set and integrates via MI Link (distributed AG).  
  - **SQL Server on Azure VM (IaaS)** – full control, closest to on-premises environment; supports traditional AG replicas.  

- **Gap analysis**  
  - Feature compatibility using DMA (Data Migration Assistant)  
  - Identify unsupported or partially supported features in Azure SQL Managed Instance  
  - Plan for alternatives (e.g., replace SQL Agent jobs with Elastic Jobs or ADF pipelines)

---

## 2. Environment Setup

- **Provision target environment in Azure**  
  - Resource groups, virtual networks, subnets, NSGs  
  - Configure hybrid connectivity (VPN or ExpressRoute)  
  - Provision SQL VM / MI / DB  
  - Configure storage (Premium SSD, Azure Files, Blob storage for backups)  
  - Configure identity (Azure AD, hybrid AD sync if required)

- **Establish monitoring and logging baseline**  
  - Azure Monitor, Log Analytics, Extended Events  
  - Baseline performance metrics from on-premises for comparison

---

## 3. Migration Execution

- **Choose migration method**  
  - **Backup/Restore to Azure Blob** (IaaS targets)  
  - **Log Shipping / Always On to Azure VM** (minimal downtime option)  
  - **Azure Database Migration Service (DMS)** (online or offline)  

- **Perform schema migration**  
  - Use SQLPackage / DACPAC for schema deployment  
  - Validate users, roles, permissions

- **Data migration**  
  - Run full load  
  - Apply differential/log backups (if applicable)  
  - Validate row counts and checksums

- **Migration cut-over**  
  - Quiesce application connections  
  - Sync final delta changes  
  - Redirect application connection strings  

---

## 4. High Availability & Disaster Recovery

- **Configure HA/DR in Azure**  
  - Availability Zones or Sets (for VMs)  
  - Always On Availability Groups (VMs/MI)  
  - Geo-replication or Distributed AG (Managed Instance or VM-to-VM across regions)  
  - Backup policies (Azure Backup / Blob / Managed Backups)

- **Listener and routing configuration**  
  - AG listener in hybrid or Azure environment  
  - Application connection string updates

- **Test failover/failback**  
  - Planned failover in Azure  
  - Failback to on-premises (if required)  
  - Document timings, outcomes, issues

---

## 5. Post-Migration Activities

- **Validation**  
  - Run application smoke tests  
  - Validate security (logins, roles, AD integration)  
  - Verify performance against baseline  

- **Documentation**  
  - As-built environment document  
  - Rollback plan (backups retained, re-sync process)  
  - Knowledge transfer session with stakeholders  

- **Optimization**  
  - Review DTU/vCore sizing and costs  
  - Implement monitoring and alerts  
  - Identify post-migration performance tuning opportunities  

---

## 6. Risks & Gotchas

- Network throughput limits (especially without ExpressRoute)  
- Latency issues between hybrid AG replicas  
- Incompatibilities (e.g., cross-database queries in Azure SQL DB)  
- SQL Agent jobs, SSIS packages, CLR, and linked servers often require redesign  
- Security differences between Windows Auth on-prem and Azure AD  

---

## 7. Next Steps

- [ ] Build local lab with SQL Server instances for migration testing  
- [ ] Spin up Azure trial account (30 days)  
- [ ] Execute a **Dev → QA migration dry-run**  
- [ ] Capture step-by-step screenshots, commands, and validation queries  
- [ ] Refine this playbook with actual timings, errors, and resolutions  

---

**Status:** Shelved until Azure environment is available.  
This document will be updated once lab and Azure resources are provisioned.  

---

## Lab Checklist: Extending SQL Server AGs to Azure

This lab simulates a hybrid environment with **two on-prem VMs** hosting a SQL Server Always On Availability Group (AG), and an **Azure VM** joined as a remote replica.

### 1. Prerequisites
- [ ] Install **SQL Server Developer Edition** on all VMs (on-prem + Azure).
- [ ] Install latest **Windows Server** (2019 or 2022 recommended).
- [ ] Configure **static IPs** for all lab VMs.
- [ ] Set up an **Active Directory domain** (optional but recommended).
- [ ] Ensure **VPN connectivity** (Site-to-Site preferred; Point-to-Site works for a lab).
- [ ] Open required firewall ports:
  - 1433 (SQL Server default)
  - 5022 (AG endpoint default)
  - 3343 (WSFC cluster comms)
  - File sharing / RPC for cluster heartbeat

### 2. On-Prem Setup
- [ ] Create **VM1 + VM2** (on-prem).
- [ ] Add them to a **Windows Server Failover Cluster (WSFC)**.
- [ ] Configure a **File Share Witness** (or Cloud Witness later).
- [ ] Enable **Always On Availability Groups** in SQL Server Configuration Manager.
- [ ] Create an initial **Availability Group** with one database.

### 3. Azure Setup
- [ ] Provision **Azure SQL VM** (Windows Server + SQL Server Developer).
- [ ] Place in its own **VNet**; configure **subnet + NSG**.
- [ ] Configure **hybrid DNS** (conditional forwarder if not domain-joined).
- [ ] Connect Azure VM to on-prem environment via **VPN Gateway**.

### 4. Extend the AG
- [ ] On Azure VM, restore database WITH NORECOVERY (or use automatic seeding).
- [ ] Add Azure replica to the **AG** in **ASYNC commit** mode.
- [ ] Configure **listener** with multi-subnet IPs (on-prem + Azure).
- [ ] Verify listener DNS resolves from both on-prem and Azure.

### 5. Testing
- [ ] Run **planned failover** to Azure replica.
- [ ] Verify application connections via AG listener.
- [ ] Run **planned failback** to on-prem.
- [ ] Document timings, errors, and behavior.

### 6. Post-Lab Documentation
- [ ] Capture **screenshots** of cluster manager, AG dashboard, and listener setup.
- [ ] Save **PowerShell commands** and **T-SQL scripts** used.
- [ ] Update the **Azure Migration Plan post** with real-world notes:
  - Seed times
  - Failover/failback timings
  - Any firewall/DNS adjustments required

---

⚡ **Tip:** Shut down Azure VM(s) when not in use to minimize trial credits or costs.
