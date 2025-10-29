---
layout: single
---

🧩 Spark SQL in Context

Think of Spark SQL as the SQL interface and optimizer layer that sits on top of the Spark execution engine — the part that actually distributes work across nodes.
When you use Databricks SQL, a Notebook cell with SELECT …, or a Delta table query, you’re actually running through Spark SQL.

|Concept|What It Means Practically in Databricks|
|:--|:--|
|DataFrame API | Everything you run via SQL has an equivalent DataFrame representation. When you call spark.read.table('healthcare.phi.patient'), it returns a distributed DataFrame.|
|Catalyst Optimizer | Spark’s “brain.” It rewrites and optimizes query plans before execution — combining filters, pushing down predicates, and generating efficient JVM or C++ code. Photon (the vectorized engine) sits just below this.|
|Schema on Read | Why Databricks can query your CSV, Parquet, or Delta files directly from ADLS or S3 without “importing” them. Schema is inferred or declared, then applied at runtime.|
|Integration | You can mix SQL with Python, R, or Scala logic inside the same job — for example, a SQL step to join datasets followed by a PySpark ML model training step.|
|Performance | In Databricks, Spark SQL benefits from Catalyst + Photon (C++ vectorized engine), so your SQL behaves more like a high-performance database query than a typical script.|

---

| **Requirement / Qualification** | **Your Experience** | **Rating (1–10)** |
|:--|:--|:--|
| **SQL Server administration (2012–2022)** | 20+ years of SQL Server experience from 7.0 through 2022, including installation, configuration, and lifecycle management | 10 |
| **Database performance tuning & query optimization** | Deep expertise optimizing T-SQL, indexing, and execution plans; known for resolving issues in hours that others scoped for weeks | 10 |
| **Backup, restore, and recovery strategies** | Designed, automated, and tested backup/restore and DR across production and non-production systems | 10 |
| **High Availability / AlwaysOn Availability Groups** | Built and administered multi-node AGs and WSFC lab environments; automated failover and rebuild routines | 10 |
| **SQL Server clustering (FCI, WSFC)** | Designed and rebuilt lab clusters via PowerShell scripts for reproducible testing and demos | 10 |
| **Replication (transactional, bidirectional)** | Deep understanding of transactional replication, schema drift, loopback detection, and NOT FOR REPLICATION | 9 |
| **Index design and maintenance** | Creator of SQLAgent007 index-maintenance automation; adaptive index tuning across workloads | 10 |
| **SQL Server Integration Services (SSIS)** | 15+ years building ETL solutions; transformed and loaded data for healthcare and enterprise pipelines | 10 |
| **SQL Server Agent automation** | Developed intelligent, self-healing job orchestration utilities; extensive automation of maintenance tasks | 10 |
| **Database projects / DACPAC deployments** | Used DACPACs for deployment and versioning in Azure hybrid environments (ProKarma) | 8 |
| **Scripting and automation (T-SQL, Python, PowerShell)** | Primary scripting expertise in T-SQL; Python for one-off automation; PowerShell for WSFC rebuilds | 9 |
| **Monitoring and alerting** | Built custom monitoring utilities; tuned queries to minimize alert noise; responsive to production anomalies | 10 |
| **Patch management & version upgrades** | Planned and executed SQL patching schedules and in-place upgrades across enterprise fleets | 9 |
| **Capacity planning & storage forecasting** | Created data-growth forecasting solution still archived in OneDrive; proactive capacity modeling | 10 |
| **Security configuration (logins, roles, permissions)** | Implemented granular RBAC and auditing; maintained compliance in healthcare and finance environments | 10 |
| **Encryption & key management** | Experience with TDE, EKM, HashiCorp Vault integration, and SQL Server Vault-EKM provider | 9 |
| **Database auditing & compliance (HIPAA / SOC 2)** | Built audit frameworks for PHI data; documented evidence packages for compliance | 10 |
| **Incident response and troubleshooting** | Proven under pressure; repeatedly solved major incidents rapidly in production | 10 |
| **Disaster Recovery (DR) & business continuity** | Designed DR strategies with offsite replication and automated verification routines | 10 |
| **SQL Server on Azure VMs** | Supported hybrid workloads (SQL on Azure VMs) with full control over configuration | 10 |
| **Azure SQL Database (PaaS)** | Hands-on with Azure SQL during ProKarma engagement; evaluated limitations vs. on-prem | 8 |
| **Azure Data Factory / Synapse familiarity** | Conceptual knowledge; understands integration points and Direct Lake | 6 |
| **Power BI** | Completed Power BI course; understands data modeling, DAX basics, and report publication |  |
| **PostgreSQL** | Currently implementing PostgreSQL in PropAgent and lab environments; appreciates transparency vs. black-box systems | 7 |
| **Linux administration basics** | Configured PostgreSQL on Debian VM; manages Linux hosts for MinIO and Azurite | 7 |
| **Cloud storage (Azure Blob, S3, MinIO, Azurite)** | Built emulated object storage environments for cost-controlled labs | 9 |
| **Automation frameworks (Ansible, SCORCH)** | Familiar with enterprise automation concepts; direct PowerShell and T-SQL automation preferred | 7 |
| **CI/CD pipelines & DevOps alignment** | Collaborated with DevOps to align DB changes with CI/CD pipelines | 9 |
| **Source control integration (GitHub, VS Code)** | Uses GitHub for full portfolio, versioned SQL projects, and automation scripts | 10 |
| **Data engineering pipelines** | Engineered automated file ingestion pipeline reducing turnaround from 2 days to 90 minutes | 10 |
| **ETL / ELT design** | Built numerous SSIS-based ETL workflows and SQL-based transformations | 10 |
| **Python data processing** | Used Python for parsing, decryption, and file transformation in ingestion pipelines | 8 |
| **Delta Lake / Databricks familiarity** | Developed lab PoCs using Delta-RS and Databricks Community Edition | 7 |
| **Airflow orchestration** | Deployed Airflow via Docker Compose; explored DAG-based orchestration and task dependencies | 6 |
| **Data compliance & PHI pipelines** | Built secure healthcare data pipelines (HL7 ingestion at OnePoint Patient Care) | 10 |
| **Mentorship & developer training** | Mentored developers on SQL best practices, indexing, and performance tuning | 10 |
| **Collaboration with application developers** | Worked alongside .NET and React teams to optimize data-access layers | 10 |
| **Cross-platform support (SQL Server, Azure, PostgreSQL)** | Demonstrated expertise across on-prem, cloud, and open-source databases | 9 |
| **Change management & documentation** | Strong documentation habit (Context.md, SANE blocks, lab baselines) | 10 |
| **Project leadership / Director-level experience** | Former Director of Database Operations at OnePoint Patient Care; led DB initiatives and team mentoring | 10 |
| **Independent / self-starter** | Operated as sole or senior DBA for 15+ years; minimal supervision required | 10 |
| **Communication & professionalism** | Praised for professionalism and calm under pressure; strong written communication (LinkedIn, GitHub) | 10 |
| **Team collaboration in DevOps or Agile environments** | Comfortable in cross-functional teams using agile practices | 9 |
| **Analytical thinking & troubleshooting** | Systematic, methodical problem solver with proven diagnostic skills | 10 |
| **Documentation & knowledge sharing** | Publishes GitHub Pages articles, manifestos, and educational blogs | 10 |
| **Innovation / continuous improvement** | Invented automation utilities (SQLAgent007, AIMS) and process optimizations | 10 |
| **Leadership under compliance pressure** | Recognized by Tim Rankel’s LinkedIn recommendation for reliability in healthcare/finance compliance | 10 |
| **Adaptability to new technologies** | Actively upskilling on Azure, Databricks, PostgreSQL, Airflow | 9 |
| **Version control and Git proficiency** | Daily use of Git and GitHub for portfolio and code versioning | 10 |
| **Attention to detail** | Demonstrated precision in documentation, lab setup, and automation scripts | 10 |
| **On-call and production support** | Extensive experience responding to after-hours incidents and production outages | 10 |
| **Application development (C#, .NET)** | Taking refresher courses in .NET and VS Code; prior exposure via SQL-backed apps | 7 |
| **Front-end familiarity (React)** | Currently reviewing React/Next.js for PropAgent project | 6 |
| **Python or scripting in mixed stack environments** | Used selectively within data-engineering tasks; comfortable integrating scripts | 8 |
| **Redis / MongoDB exposure** | Familiar with concepts; not used in production | 5 |
| **AWS ecosystem** | Knowledge of S3 and EC2 concepts; MinIO labs emulate S3 API behavior | 7 |
| **Data modeling (fact/dimension, KPIs)** | Strong understanding from supporting SSAS sources and data marts | 9 |
| **Materialized / indexed views** | Designed indexed views for performance in OLTP/OLAP workloads | 10 |
| **Database versioning and migration** | Experience with DbUp, DACPAC, and manual SQL scripts across environments | 9 |
| **Professionalism and integrity** | Reputation for accountability, thoroughness, and composure | 10 |
| **Mentor and coach in technical growth** | Regularly coaches others through articles and practical examples | 10 |
