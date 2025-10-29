HIPAA & SOC 2 Compliance for Data Engineers  
{: .md-h1}

Series headlines (working outline)  
{: .md-h2}  

 - Medallion, PHI & PII: Where sensitive data lives; de-identification vs. pseudonymization; safe Bronze patterns  
 - Unity Catalog, Groups & RBAC: Role design, inheritance, service principals, table/row/column controls, masking  
 - Delta Lake Controls: Time Travel for forensics, VACUUM/retention policy, lineage, change data capture notes  
{: .indent-md}

---
 
 Encryption Everywhere  
 {: .md-h2}

 - SQL Server: TDE, EKM (HSM/Vault), cell-level encryption, key rotation playbook  
 - PostgreSQL: pgcrypto, TLS at rest/in transit options, KMS patterns, key rotation  
 - Secrets & Keys: Centralized key management, rotation cadences, break-glass access  
 - Network & Perimeter: Private endpoints, firewall allow-lists, workspace/cluster policies  
 - Data Classification & Tagging: Column tagging, propagation to dashboards and exports  
 - Row/Column Security & Masking: Patterns that actually scale in lakehouse + SQL engines  
 - Audit, Logging & Lineage: Unity Catalog events, Delta logs, who-did-what-when; evidence capture  
 - Monitoring & SIEM: What to forward, useful alerts, anomaly patterns (privilege changes, exfil signals)  
 - Backups, DR & BCP: RPO/RTO by layer, restore drills, proof artifacts for auditors  
 - Sharing & Egress Controls: Delta Sharing/UC shares, export gateways, watermarking strategy  
 - CI/CD & Change Control: Promotion paths, approvals, drift detection, reproducible deployments  
 - Evidence Packages for Audits: Runbooks, screenshots, configs, and attestation templates mapped to HIPAA §164 and SOC 2 TSC (Security, Availability, Confidentiality)
{: .indent-md}
