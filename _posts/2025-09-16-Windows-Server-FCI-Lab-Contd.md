---
layout: single
title: "Windows Server FCI Lab – WSFC Achieved"
excerpt: "Documenting the pivotal step of bringing Windows Server Failover Clustering (WSFC) online: from domain health, SMB shares, and virtual disks to cluster validation and creation. This post stops just before installing SQL Server, highlighting that WSFC is the real heavy lift."
date: 2025-09-16
classes: center-page
author_profile: false
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories:
  - Lab
  - Windows Server
  - SQL Server
tags:
  - FCI
  - Failover Cluster
  - SQL Server 2022
  - PowerShell 7
  - Hyper-V
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/default-overlay.svg
  caption: "From T-SQL OUT params to API endpoints"
---

## Key Milestones Achieved
- Promoted **NODE1** to Domain Controller and confirmed DNS/AD DS health (`lab.local` zone).  
- Joined **NODE2** and **NODE3** to the domain with secure channel verification.  
- Established consistent **SMB shares** from the host:  
  - `\\MSL-Laptop\PowerShellScripts` → T:  
  - `\\MSL-Laptop\nyctaxi` → N:  
  - `\\MSL-Laptop\ISOs` → I:  
- Created and presented **cluster-capable virtual drives** (SQLData, SQLLog, SQLBackup).  
- Validated **disk visibility** and ownership across nodes.  
- Ran and passed **WSFC validation tests**.  
- Built the **Windows Server Failover Cluster** with NODE2 and NODE3 as initial members.  

## Notes
- **Nodes must remain online during cluster operations.** Even if another node owns the resources, paused nodes cannot participate in SQL FCI setup.  
- **Always rerun Test-Cluster after changes.** Adding nodes or disks without revalidating can surface issues later during SQL installation.  
- **Consistent drive letters and labels are critical.** SQL setup depends on predictable disk mapping; mismatches complicate placement of data, log, and backup files.  
- **Validate SMB share access via UNC paths.** Shares may appear mapped but silently break under DNS or domain hiccups; confirm visibility from every node.

## Objectives
- Confirm domain/DNS health across all nodes.  
- Ensure cluster disks are online and visible.  
- Run WSFC validation.  
- Create a healthy Failover Cluster as the foundation for SQL Server.

## Scripts Referenced
- **20250914021500 – ensure-share-winvm.ps1**  
  Ensures the host exposes a named share and reports UNC path. Used for confirming `PowerShellScripts`, `nyctaxi`, and `ISOs` shares.  

- **20250915160000 – check-disk-eligibility.ps1**  
  Validates candidate disks for WSFC clustering (online state, reserved status).  

- **20250916182000 – list-cluster-disks.ps1**  
  Enumerates all cluster disks with status and eligibility.  

- **20250916194500 – correlate-cluster-disks.ps1**  
  Correlates WSFC Physical Disk resources with OS volumes (labels, drive letters, size).  

- **20250916212000 – validate-wsfc.ps1**  
  Wrapper to run `Test-Cluster` with logging, ensuring no steps skipped before FCI setup. 

- **test-cluster.ps1**  
Wrapper to run `Test-Cluster` with logging, ensuring readiness validation before SQL Server FCI installation.   

*(Script IDs follow the `YYYYMMDDHHMMSS` pattern for traceability across posts.)*  

## Achievements
- Domain and DNS confirmed healthy.  
- SMB shares accessible and mapped.  
- Cluster disks created and validated across NODE2 and NODE3.  
- WSFC successfully created and stable.  

## Next Steps
- Install **SQL Server 2022 FCI binaries** on NODE2.  
- Verify SQL services come online in cluster.  
- Apply latest **SQL Server Cumulative Updates**.  
- Add **NODE3** into the SQL FCI.  
- Document and test failover scenarios across nodes.  
