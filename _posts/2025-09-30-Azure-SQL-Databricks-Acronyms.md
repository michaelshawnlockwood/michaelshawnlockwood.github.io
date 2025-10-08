---
layout: single
title: "Azure Migration & Databricks Acronyms Reference"
excerpt: "A concise glossary of essential Azure, SQL, and Databricks acronyms."
date: 2025-09-30
classes:
  - center-page
author: michael_lockwood
author_profile: true
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
categories: [Azure, Databricks]
tags: [Acronyms, Reference, CloudMigration, AzureSQL, Databricks]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay-wide.jpg
  caption: "Core terminology for Azure migration and modern data engineering."
---

<a id="toc" class="visually-hidden"></a>

# Azure Migration & Databricks Acronyms Reference

A quick-reference guide to key Azure and data-engineering acronyms that recur throughout migration and modernization projects.

---

### **ADLS – Azure Data Lake Storage**
Microsoft’s cloud-based object storage optimized for analytics.  
Similar in concept to AWS S3 but supports a *hierarchical namespace* for directory-style organization and fine-grained ACLs.  
🔗 https://learn.microsoft.com/azure/storage/blobs/data-lake-storage-introduction  

---

### **Azurite**
Microsoft’s official **Azure Storage emulator** for local development and testing.  
It mimics Blob, Queue, and Table services so you can develop against Azure Storage APIs without an Azure account.  
🔗 https://learn.microsoft.com/azure/storage/common/storage-use-azurite  

---

### **MI – Azure SQL Managed Instance**
A fully managed deployment of SQL Server in Azure offering near-100% feature parity with on-prem SQL Server.  
It automates patching, backups, and HA/DR while allowing instance-level control.  
🔗 https://learn.microsoft.com/azure/azure-sql/managed-instance/  

---

### **MI Link – Managed Instance Link**
A **distributed Availability Group (AG)** feature that provides near real-time replication from on-prem SQL Server to **Azure SQL Managed Instance**, enabling minimal-downtime migration or hybrid setups.  
🔗 https://learn.microsoft.com/azure/azure-sql/managed-instance/managed-instance-link-overview  

---

[⬆ Back to Top](#toc){:.back-to-top}
### **DMS – Azure Database Migration Service**
Microsoft’s managed tool for migrating databases (SQL Server, Oracle, MySQL, PostgreSQL, DB2, etc.) to Azure.  
Supports both **offline** and **online (minimal downtime)** migrations with schema and data validation.  
🔗 https://learn.microsoft.com/azure/dms/dms-overview  

---

### **CAF – Cloud Adoption Framework**
Microsoft’s **end-to-end guidance** for cloud adoption: strategy, planning, landing zones, governance, security, and operations.  
Provides reusable blueprints and policies for consistent cloud architecture.  
🔗 https://learn.microsoft.com/azure/cloud-adoption-framework/  

---

### **AHB – Azure Hybrid Benefit**
A licensing program that lets organizations apply existing **Windows Server** or **SQL Server** licenses (with Software Assurance) to Azure resources.  
Reduces compute costs for **SQL Managed Instance**, **SQL Server on VMs**, and **Windows VMs**.  
🔗 https://learn.microsoft.com/azure/azure-hybrid-benefit/  

---

### **DBU – Databricks Unit**
A unit of processing capability billed per second in **Azure Databricks**.  
Represents the compute cost for running workloads; total cost = DBUs × instance hours × pricing tier.  
🔗 https://learn.microsoft.com/azure/databricks/resources/faq/azure-pricing  

---

### **ADF – Azure Data Factory**
Azure’s **ETL/ELT and orchestration service** for moving and transforming data between on-prem and cloud systems.  
Includes built-in connectors for DB2, SQL Server, and ADLS.  
🔗 https://learn.microsoft.com/azure/data-factory/introduction  

---

[⬆ Back to Top](#toc){:.back-to-top}
### **AG – Availability Group**
A SQL Server **high-availability and disaster-recovery** feature that replicates databases across primary and secondary replicas for automatic failover and read-scale.  
Foundation for **Managed Instance Link** and hybrid HA/DR designs.  
🔗 https://learn.microsoft.com/sql/database-engine/availability-groups/windows/overview  

---

### **RBAC – Role-Based Access Control**
Azure’s authorization system for granting users, groups, or managed identities **least-privilege access** to resources through roles and scopes.  
🔗 https://learn.microsoft.com/azure/role-based-access-control/overview  

---

### **VNET – Virtual Network**
Azure’s **private, isolated network environment** for securely hosting resources like VMs, databases, and gateways.  
It allows you to control IP addressing, subnets, routing, and connectivity between Azure and on-prem environments.  
🔗 https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview  

---

### **NSG – Network Security Group**
A **firewall-like rule set** that controls inbound and outbound traffic to Azure resources within a Virtual Network.  
Rules are defined by source, destination, port, and protocol to enforce least-privilege access.  
🔗 https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview  

---

### **P2S / S2S VPN – Point-to-Site / Site-to-Site Virtual Private Network**
- **P2S (Point-to-Site):** Connects a single client machine (like your laptop or lab VM) securely to an Azure VNET.  
- **S2S (Site-to-Site):** Connects entire on-prem networks to Azure VNETs over IPsec tunnels for hybrid connectivity.  
🔗 https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways  

---

[⬆ Back to Top](#toc){:.back-to-top}
### **ADLS Gen2 – Azure Data Lake Storage Generation 2**
The enhanced version of **ADLS**, combining **Azure Blob Storage** scalability with a **hierarchical namespace** for folders, ACLs, and optimized big-data analytics.  
It’s the standard storage layer for **Databricks**, **Synapse**, and **Fabric Lakehouses**.  
🔗 https://learn.microsoft.com/azure/storage/blobs/data-lake-storage-introduction  

---

### **AAD / Entra ID – Azure Active Directory / Microsoft Entra ID**
Microsoft’s **cloud-based identity and access management (IAM)** service.  
Renamed to **Microsoft Entra ID**, it provides authentication, single sign-on, and role-based access for Azure and connected apps.  
🔗 https://learn.microsoft.com/entra/identity/  

---

[⬆ Back to Top](#toc){:.back-to-top}