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
---

## Origin
This lab was built to explore **Windows Server Failover Cluster Instances (FCI)** in a safe, reproducible environment. The goal was to document every step and script for repeatability and later use in migration scenarios, both on-prem and Azure.

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
- [ ] Confirm Domain Controller functionality on **NODE1** (AD DS + DNS running, lab.local zone healthy).  
- [ ] Validate **DNS resolution** across nodes (`lab.local`, `SQLNODE1.lab.local`).  
- [ ] Confirm **NODE2 domain membership** in `lab.local`.  
- [ ] Ensure **SMB shares** (PowerShellScripts, ISOs, nyctaxi data) are consistently accessible to both nodes.  
- [ ] Proceed with **SQL Server 2022 installation** on NODE1 and NODE2 using the mounted ISO.  
- [ ] Prepare for **Failover Cluster configuration** after SQL installation.  


## Closing Thoughts
- The lab revealed real-world pitfalls: networking quirks, misleading update statuses, DNS oversights.
- By building from bare metal upward, nothing is left as a black box.
- Every script and checkpoint adds to a reproducible On-prem to Azure Migration Playbook.
