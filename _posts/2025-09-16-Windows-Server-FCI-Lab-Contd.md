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

# Milestones 
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

# Objectives
- Confirm domain/DNS health across all nodes.  
- Ensure cluster disks are online and visible.  
- Run WSFC validation.  
- Create a healthy Failover Cluster as the foundation for SQL Server.

# Notes
- **Nodes must remain online during cluster operations.** Even if another node owns the resources, paused nodes cannot participate in SQL FCI setup.

Nuance: A paused node is still a cluster member but won’t host roles; pausing is commonly used for maintenance with “drain roles.” For an Add Node FCI step, the target node should be online and able to access required resources; pausing can interfere with owning/bringing resources online during parts of setup. Safer wording: “Keep nodes online and not paused during FCI add/maintenance unless you’re deliberately draining roles for maintenance.” 🟨 

- **Always rerun Test-Cluster after changes.** Adding nodes or disks without revalidating can surface issues later during SQL installation.  
- **Consistent drive letters and labels are critical.** SQL setup depends on predictable disk mapping; mismatches complicate placement of data, log, and backup files.  
- **Validate SMB share access via UNC paths.** Shares may appear mapped but silently break under DNS or domain hiccups; confirm visibility from every node.

---

# Steps
1. **Promote NODE1 to Domain Controller**  
   Installed AD DS + DNS, established `lab.local`, and confirmed zone health.  

2. **Validate DNS resolution**  
   Ensured `lab.local`, `SQLNODE1.lab.local`, and hostnames resolved cleanly across nodes.  

3. **Join NODE2 and NODE3 to domain**  
   Verified secure channel trust; corrected any DNS/GW issues blocking domain membership.  

4. **Map SMB shares from host**  
   Consistent drive letters across all nodes:  
   - T: → `\\MSL-Laptop\PowerShellScripts`  
   - N: → `\\MSL-Laptop\nyctaxi`  
   - I: → `\\MSL-Laptop\ISOs`  

5. **Prepare cluster-capable storage**  
   Created virtual drives outside Hyper-V for SQLData, SQLLog, and SQLBackup.  

6. **Initialize and label shared disks**  
   Brought disks online, formatted, and assigned consistent letters (E:, F:, G:).  

7. **Audit and correlate disk mapping**  
   Ran scripts to validate ownership, drive letters, size, and eligibility across nodes.  

8. **Create WSFC cluster**  
   Established Windows Server Failover Cluster with NODE2 and NODE3 as members.  

9. **Run Test-Cluster validation**  
   Confirmed readiness of nodes, network, and storage prior to SQL installation.  

10. **Confirm disk/resource failover**  
    Moved clustered disks between NODE2 and NODE3 to validate online/offline behavior.  

11. **Checkpoint the environment**  
    Captured stable state (`LKGC-PreSQLServer`) as baseline before SQL install.  

12. **Prepare for SQL Server 2022 FCI**  
    Verified service accounts, privileges (e.g., Perform Volume Maintenance Tasks), and feature selection in readiness for installation.  

---

## Step Sources

- [Failover clustering hardware requirements and storage options – Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/failover-clustering/clustering-requirements)  
  Confirms WSFC native disk support expects **basic disks** (not dynamic) and recommends **NTFS**; a disk witness can be NTFS or ReFS.

- [Cluster Shared Volumes overview – Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-cluster-csvs)  
  Explains that **CSV lets multiple nodes read/write the same LUN** and exposes a **consistent path under `C:\ClusterStorage`**; also notes **SQL Server FCI support begins with SQL Server 2014 (not 2012)**.

- [Always On failover cluster instances (SQL Server) – Microsoft Learn](https://learn.microsoft.com/en-us/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)  
  States an **FCI uses shared storage** (WSFC-managed) and that **only one node owns the resource group at a time**; FCIs **support CSV** and require **uniquely assigned disk drive letters**.

- [Create a failover cluster – Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/failover-clustering/create-failover-cluster)  
  **Run validation before creating a cluster**; Microsoft support requires the complete configuration to pass validation.

- [Validate hardware for a failover cluster – Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/high-availability/validate-hardware-failover-cluster)  
  Use **Validate a Configuration** or **Test-Cluster**; **rerun validation after changes** (adding nodes/storage). A **validation report is required** for Microsoft support; **two nodes** are needed to run all storage tests.

- [Test-Cluster (FailoverClusters) – Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/failoverclusters/test-cluster?view=windowsserver2025-ps)  
  Runs hardware/network/storage validation; **storage tests won’t run on disks in use**—stop the clustered role or take disks offline first.

- [Move-ClusterGroup (FailoverClusters) – Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/failoverclusters/move-clustergroup?view=windowsserver2025-ps)  
  **Moves a clustered role to another node** (common way to **simulate failover** and for maintenance preparation).

- [Suspend-ClusterNode (FailoverClusters) – Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/failoverclusters/suspend-clusternode?view=windowsserver2025-ps)  
  **Pauses a node**; with **-Drain** it **gracefully moves workloads off** the node before maintenance (optionally to a specific **-TargetNode**).

- **Storage: Performance best practices for SQL Server on Azure VMs – Microsoft Learn**  
  [https://learn.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-storage?view=azuresql](https://learn.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-storage?view=azuresql)  
  Recommends **formatting data disks with 64-KB allocation unit size**; marketplace SQL Server VMs default to 64-KB AU for data disks.

- **Database instant file initialization – Microsoft Learn**  
  [https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-instant-file-initialization?view=sql-server-ver17](https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-instant-file-initialization?view=sql-server-ver17)  
  Enable IFI by granting **Perform volume maintenance tasks**; historically for **data files**, and **from SQL Server 2022** transaction **log autogrowth up to 64 MB** can benefit from IFI (TDE blocks data-file IFI but **not** the log-autogrowth behavior).

- [Manage Cluster Shared Volumes – Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-cluster-manage-cluster-shared-volumes)  
  Management guidance for CSVs, including that you can **rename CSV volumes in `%SystemDrive%\ClusterStorage`** for clarity across nodes.

---

# Scripts
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

---

# Achievements
- Domain and DNS confirmed healthy.  
- SMB shares accessible and mapped.  
- Cluster disks created and validated across NODE2 and NODE3.  
- WSFC successfully created and stable.

---

## Sources
- [Failover Clustering Hardware Requirements and Storage Options – Microsoft Docs](https://learn.microsoft.com/en-us/windows-server/failover-clustering/clustering-requirements?utm_source=chatgpt.com)  
  Notes that WSFC requires **basic disks** (not dynamic), and outlines supported storage configurations.  

- [Cluster Shared Volumes Overview – Microsoft Docs](https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-cluster-csvs?utm_source=chatgpt.com)  
  Describes CSV architecture, GPT/NTFS requirements, and how multiple nodes use the same storage.  

- [Using a Shared Disk as Drives on Two VMs – Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/1606499/using-a-shared-disk-as-drives-on-two-vms?utm_source=chatgpt.com)  
  Confirms shared disks are typically required for cluster workloads like SQL Server FCI, with WSFC managing disk ownership.  

- [Windows Hyper-V Storage Architectures – Microsoft Docs](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/storage-architecture?utm_source=chatgpt.com)  
  Explains Hyper-V storage architectures (local, shared, SAN/NAS) and how they apply in clustering scenarios.  

- [Create Hyper-V Guest Clusters with Shared VHDX and VHD Sets – BDRShield](https://www.bdrshield.com/blog/create-hyper-v-guest-clusters-with-shared-vhdx-and-vhd-sets/?utm_source=chatgpt.com)  
  Overview of Shared VHDX and VHDS (VHD Set) in Hyper-V, including limitations and newer alternatives.  

- [Hyper-V Shared VHDX Explained – Vinchin Tech Tips](https://www.vinchin.com/tech-tips/hyper-v-shared-vhdx.html?utm_source=chatgpt.com)  
  Explains how Shared VHDX works, performance considerations, and when it is appropriate to use.  

- [Configuring a Shared VHD in Hyper-V – Redmond Magazine](https://redmondmag.com/articles/2019/10/30/configuring-a-shared-vhd-in-hyperv.aspx?utm_source=chatgpt.com)  
  Walkthrough of setting up shared VHDX, including dependencies on CSV and SMB storage.  

- [Shared VHDX in Hyper-V CSV not keeping data synced between VMs – Stack Overflow](https://stackoverflow.com/questions/66157935/shared-vhdx-in-hyper-v-csv-not-keeping-data-synced-between-vms?utm_source=chatgpt.com)  
  Community thread describing data synchronization issues when using Shared VHDX.

---

# Next Steps
- Install **SQL Server 2022 FCI binaries** on NODE2.  
- Verify SQL services come online in cluster.  
- Apply latest **SQL Server Cumulative Updates**.  
- Add **NODE3** into the SQL FCI.  
- Document and test failover scenarios across nodes.

---

# Script Index

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

**LinuxScripts**
- **ensure-smb-mount-linux.sh**  
  Ensures Linux VMs mount SMB shares correctly.  

- **netstat-linux.ps1**  
  Reports Linux network socket states.  

- **network-status-linux.sh**  
  Checks host/VM network connectivity from Linux side.  

- **recreate-scripts-share-linux.ps1**  
  Rebuilds script share mount on Linux systems.  

