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

## Script Index (as of Sept 17, 2025)

### PowerShell – Cluster & Storage
- **audit-drive-letter-conflicts.ps1**  
  Detects conflicting drive letter assignments across nodes.  

- **audit-drive-letters-clusterwide.ps1**  
  Validates consistency of drive letters in WSFC.  

- **check-share-winvm.ps1**  
  Confirms SMB share visibility from Windows VMs.  

- **correlate-cluster-disks-(various versions).ps1**  
  Maps WSFC disks to OS volumes (labels, drive letters, size).  

- **create-checkpoints.ps1**  
  Automates Hyper-V checkpoint creation.  

- **create-cluster.ps1**  
  Builds initial Windows Server Failover Cluster.  

- **create-host-share.ps1**  
  Publishes host folders as SMB shares.  

- **create-sql-setup-shortcuts.ps1**  
  Places shortcuts for SQL setup executables.  

- **create-sentinel-files.ps1**  
  Places marker files on shared storage.  

- **delete-sentinel-files.ps1**  
  Cleans up marker files.  

- **dismount-sql-iso.ps1**  
  Detaches SQL Server ISO.  

- **drain-process-batch.ps1**  
  Utility for draining batch processes (cleanup).  

- **fci-prereqs-fix-nodes.ps1**  
  Applies prereqs for SQL FCI nodes.  

- **get-adfs-install-state.ps1**  
  Checks ADFS installation state.  

- **get-winfeatures.ps1**  
  Lists Windows roles/features.  

- **get-wsmm-memory-state.ps1**  
  Reports memory usage per node.  

- **get-wsmm-resources.ps1**  
  Enumerates cluster resources.  

- **init-shared-disks.ps1**  
  Initializes shared cluster disks.  

- **install-ad-ds-measured.ps1**  
  Installs Active Directory Domain Services with checks.  

- **install-sql2022-fci.ps1**  
  Installs SQL Server 2022 FCI.  

- **join-vm-to-domain.ps1**  
  Domain-joins VMs.  

- **launch-dc-admin.ps1**  
  Opens administrative session for DC tasks.  

- **map-host-drive.ps1**  
  Maps host drives to VMs.  

- **map-shares.ps1**  
  Maps SMB shares to drive letters.  

- **map-vmDrive-to-hostShare.ps1**  
  Maps VM drives back to host shares.  

- **measure-script-time.ps1**  
  Records runtime of scripts.  

- **mount-sql-iso-and-launch-setup.ps1**  
  Mounts SQL Server ISO and launches setup.  

- **move-cluster-disk-group.ps1**  
  Moves ownership of clustered disk groups.  

- **netstat.ps1**  
  Reports Windows network connections.  

- **network-status.ps1**  
  Validates cluster node connectivity.  

- **parse-par.ps1 / parse-par2.ps1**  
  Parses log/parameter output files.  

- **prepare-tempdb-folders.ps1**  
  Creates TempDB folder structure.  

- **promote-dc-manual.ps1**  
  Manually promotes node to Domain Controller.  

- **register-sql-fci.ps1**  
  Registers SQL Server FCI.  

- **restart-graceful.ps1**  
  Performs controlled VM restarts.  

- **set-labWindowsProcessor.ps1**  
  Configures lab Windows VM processor settings.  

- **set-name-n*.ps1**  
  Renames lab VMs to SQLNODE1/2/3, etc.  

- **set-status.ps1**  
  Marks checkpoint or lab state.  

- **system-network-status.ps1**  
  Captures full networking state.  

- **test-cluster.ps1**  
  Runs WSFC validation suite.  

- **test-winvm-status.ps1**  
  Confirms Windows VM readiness.  

- **verify-ag-fci-move-and-sentinels.ps1**  
  Verifies AG/FCI transitions with sentinel files.  

- **verify-ag-fci-connectivity.ps1**  
  Validates connectivity post-AG/FCI.  

- **verify-ag-fci-status.ps1**  
  Confirms AG/FCI health.  

- **windows-updates.ps1**  
  Applies and validates Windows patches.  

- **winvm-assign-to-template.ps1**  
  Assigns VM roles from template.  

### LinuxScripts
- **ensure-smb-mount-linux.sh**  
  Ensures Linux VMs mount SMB shares correctly.  

- **netstat-linux.ps1**  
  Reports Linux network socket states.  

- **network-status-linux.sh**  
  Checks host/VM network connectivity from Linux side.  

- **recreate-scripts-share-linux.ps1**  
  Rebuilds script share mount on Linux systems.  