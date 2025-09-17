---
layout: single
title: "Windows Server FCI Lab"
excerpt: "Building a step-by-step Windows Server 2022 Failover Cluster Instance (FCI) lab: from VM setup, patching, networking, and PowerShell automation, edits and verification, to creating a reusable playbook for future on-prem and Azure migrations."
date: 2025-09-13
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

## Origin
This lab was built to explore **Windows Server Failover Cluster Instances (FCI)** in a safe, reproducible environment. The goal was to document every step and script for repeatability and later use in migration scenarios, both on-prem and Azure.

---

## Lab Host Environment

| Component        | Microsoft Recommended (Hyper-V Lab)                  | My Setup (Dell Inspiron 7791 2n1)               |
|------------------|------------------------------------------------------|------------------------------------------------|
| **CPU**          | Modern multi-core, SLAT support, 4–8+ cores          | Intel i7-10510U (4 cores / 8 threads, SLAT OK) |
| **RAM**          | 16 GB minimum, 32 GB+ preferred for SQL clustering   | 32 GB (≈17 GB free during lab use)             |
| **Storage**      | SSD strongly recommended (NVMe best)                 | 2x physical drives: C: SSD (OS), D: SSD (data/VMs) |
| **OS**           | Windows 10/11 Pro, Enterprise, or Education          | Windows 10 Pro (Build 19045)                   |
| **Networking**   | Virtual switches (External, NAT, Host-only)          | Configured: External + Host-only               |
| **Workload Size**| 3–4 VMs typical (1 DC + 2 SQL nodes + optional quorum)| Running 3 planned (DC + SQLNODE1 + SQLNODE2)   |

> With 32 GB RAM and SSD storage across two drives, this system comfortably supports a SQL Server FCI + AG test lab.

---

## Base VM Environment
- **Hyper-V host setup** on a Windows laptop.
- Created multiple VMs:  
  - SQLNODE1  
  - SQLNODE2  
  - Domain Controller (planned later).  
- Checkpoints at every milestone (`LastKnownGoodConfig`, `prepatch`, `postshare`, etc.) to ensure safe rollback.

---

## Windows Server Installation & Updates
- Installed Windows Server 2022 Datacenter Evaluation.  
- Established scripts to:  
  - Set hostname and static IPs (`name_n_ip.ps1`).  
  - Manage checkpoints (create, revert, replace).  
- Wrestled with **Windows Update**:  
  - Manual cumulative installs (`wusa.exe`) vs. native updates.  
  - Confirmed that “100% installing” only means staged, not finished.  
  - Solved **pending reboot detection** with registry checks.  
  - Built a **Restart / Patch Status script** (boxed, reusable in PS7).  

---

## PowerShell Tooling
Standardized on **PowerShell 7 (pwsh)** for all scripting.  

Script library developed for lab admin:
- `Get-RestartPatchStatus.ps1` → OS info, reboot pending, last KBs.  
- `Test-NetworkStatus.ps1` → Adapter, DNS, gateway, external IPs (8.8.8.8 & 1.1.1.1), DNS resolution, HTTPS connectivity.  

Each script uses consistent boxing and output, ready for inclusion in a Dashboard **“Script Library”** box.

---

## Networking Challenges
- Configured VM adapters: NAT + Host-only networking.  
- Diagnosed `ping github.com` failures → discovered **no IPv4 DNS servers set**.  
- Fixed with:  
```powershell
  Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8","1.1.1.1")
```

- Validated connectivity with the new Network Status script.
- Lessons learned: IP looked fine, but DNS broke Windows Update until fixed.

## File Sharing & Integration
- Created SMB share on the host:
```text
\\<host internal network IP address>\PowerShellScripts
```

- Allowed VMs to access and run scripts from the shared folder.

## Automation & Checklists
- Emphasis on repeatability:
- Scripts organized by purpose (VM admin, health checks, network, patch).
- Clear step ordering: install → patch → PowerShell → networking → checkpoints.
- Checklists inspired by The Checklist Manifesto.
- Took revert checkpoints when needed to recover from failed updates or misconfigurations.

## Key Milestones Achieved
- [x] Reliable patch status and reboot detection.
- [x] Working network connectivity (with fixed DNS).
- [x] Scripted health checks (patch & network).
- [x] Established SMB share for PowerShell scripts across nodes.
- [x] Stable SQLNODE1 and SQLNODE2 baselines for cluster work.
- [x] Script library now reusable across all nodes and future labs.

## Next Steps
- [ ] Validate **DNS resolution** across all nodes (`lab.local`, `SQLNODE1.lab.local`, etc.) after NODE1 promotion to DC.  
- [ ] Confirm **Active Directory & DNS health** (AD DS service, lab.local zone replication).  
- [ ] Join **NODE2** (and later NODE3) to the `lab.local` domain, verifying secure channel trust.  
- [ ] Establish consistent **SMB share mappings** from the host:
  - `\\MSL-Laptop\PowerShellScripts` → T:
  - `\\MSL-Laptop\nyctaxi` → N:
  - `\\MSL-Laptop\ISOs` → I:
- [ ] Create and present **cluster-capable virtual drives** outside Hyper-V for SQL:
  - SQLData (E:)  
  - SQLLog (F:)  
  - SQLBackup (G:)  
- [ ] Validate **cluster disk visibility** across nodes (online/offline state, ownership, drive letters).  
- [ ] Run **WSFC validation tests** to confirm readiness for clustering.  
- [ ] Prepare for **SQL Server 2022 Failover Cluster Instance (FCI) installation**:
  - Mount SQL Server ISO.  
  - Confirm service accounts.  
  - Grant **Perform Volume Maintenance Tasks** (instant file init).  

## Closing Thoughts
- The lab revealed real-world pitfalls: networking quirks, misleading update statuses, DNS oversights.
- By building from bare metal upward, nothing is left as a black box.
- Every script and checkpoint adds to a reproducible On-prem to Azure Migration Playbook.
