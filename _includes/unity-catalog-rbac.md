# Unity Catalog + RBAC (_Work In Progress_)

---

## 1. What UC Governs (Object Model)

**Hierarchy:**  
`metastore → catalog → schema → table/view/function/volume`  
(Privileges inherit downward.)  

---

**Securable Objects:**  
Metastores, catalogs, schemas, tables, views, functions, volumes, external locations, storage credentials, models, etc.  
*(See Databricks documentation for full per-object privilege lists.)*  

 - [Unity Catalog privileges and securable objects](https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges)  
 - [Unity Catalog best practices](https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/best-practices)
{: .sources}  

---

## 2. Who Can Grant / The RBAC Core

**Principals:**  
Users, service principals, and groups.  
Owners have all privileges and can delegate; `MANAGE` lets others administer permissions on that object.  

Grants can be issued by a **metastore admin**, the **object owner**, or the **owner of the parent catalog/schema**.  

[Databricks SDK for Python: w.grants: Grants](https://databricks-sdk-py.readthedocs.io/en/stable/workspace/catalog/grants.html)
{: .sources}

**Tiny Example (safe, minimal):**
```sql
GRANT USE CATALOG ON CATALOG finance TO GROUP bi_readers;
GRANT USE SCHEMA ON SCHEMA finance.core TO GROUP bi_readers;
GRANT SELECT ON TABLE finance.core.claims TO GROUP bi_readers;
```

 - [Privileges and securable objects in Unity Catalog](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-privileges)  
{: .sources}  

---

## 3. Storage governance (cloud paths)
 - Govern access to buckets/containers via Storage Credentials (cloud IAM role/key) + External Locations (the governed path). You grant use of those objects, then build external tables/volumes on top.  

---

## 4. Fine-grained controls (PHI/PII ready)  
Example: mask ssn unless in phi_access → a column mask bound to ssn, and a row filter like department_id = current_user_department(). (See docs for CREATE/ALTER syntax & binding.)  

 - [Microsoft:Learn - Row filters and column masks](https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/filters-and-masks)  
{: .sources}

---

## 5. Lineage + audit (evidence for compliance)
System tables in the system catalog expose account-wide lineage and audit data you can query (enable system tables first). Key tables: system.access.audit, plus lineage tables.  

---

## 6. Practical privilege flow to remember  
 - Grant USE CATALOG at the catalog.  
 - Grant USE SCHEMA at the schema.  
 - Grant object perms (e.g., SELECT/MODIFY) at the table/view/etc.  
 - If data lives outside managed storage: grant READ FILES/WRITE FILES/CREATE EXTERNAL TABLE on external locations (and control storage credentials usage).

Minimal “Do-Now” Checklist  
[] Map principals → groups. Create/verify account groups for roles like bi_readers, data_engineers, phi_access. (Microsoft Learn)
[] Baseline grants: at each catalog/schema, apply USE CATALOG/USE SCHEMA to reader/engineer groups; owners keep MANAGE. (Databricks Documentation)
[] External data: define storage credential + external location; mark read-only where appropriate; grant READ FILES only to readers. (Databricks Documentation)  
[] Sensitive tables: attach column masks for PHI fields; add row filters for least-privilege visibility. (Microsoft Learn)  
[] Evidence: enable system tables; draft 2–3 audit queries (who read what, when; who changed grants). (Microsoft Learn)  
[] Lineage: enable lineage system tables and capture a screenshot + query output for your evidence package.  

---

### Attribute-Based Access Control (ABAC) in Unity Catalog

Unity Catalog supports **Attribute-Based Access Control (ABAC)** through governed tags and policy definitions.  
Governed tags capture metadata attributes (e.g., `sensitivity=phi`, `department=pharmacy`), and policies evaluate those tags at query time to determine access.  
This extends traditional RBAC by allowing **context-aware**, attribute-driven rules—ideal for healthcare, finance, and multi-tenant scenarios.

- [Databricks SDK for Python — Catalog Policies (ABAC)](https://databricks-sdk-py.readthedocs.io/en/stable/workspace/catalog/policies.html)
- [Databricks Docs — Governed Tags and Attribute-Based Access Control](https://docs.databricks.com/en/data-governance/unity-catalog/governed-tags.html)
{: .sources}

---

[⬆ Back to Top](#toc){:.back-to-top}
### RBAC vs. ABAC in Unity Catalog

| Aspect | RBAC (Role-Based Access Control) | ABAC (Attribute-Based Access Control) |
|--------|----------------------------------|--------------------------------------|
| **Core Idea** | Access is granted based on membership in a **role** or **group**. | Access is granted dynamically based on **attributes** (tags, metadata, or contextual values). |
| **Example Rule** | “Members of `phi_access` can `SELECT` from `healthcare.phi.claims`.” | “Users with `department=pharmacy` and `sensitivity=phi` may access tagged columns.” |
| **Object Scope** | Roles apply to Unity Catalog objects — catalogs, schemas, tables, views, volumes, external locations. | Policies evaluate governed **tags** and attributes attached to data objects, columns, or external assets. |
| **Policy Management** | Explicit `GRANT` statements define permissions. | Policies are JSON-based and can reference user, group, or tag attributes at runtime. |
| **Flexibility** | Simple and predictable; ideal for static role hierarchies. | Highly granular and contextual; ideal for multi-tenant or compliance-driven environments. |
| **Performance Impact** | Minimal — evaluated once at query planning. | Slight overhead — evaluated dynamically at access time, but optimized within the Unity Catalog policy engine. |
| **Best Use Case** | General-purpose data governance, shared analytics environments. | Fine-grained, compliance-critical governance (e.g., PHI/PII masking, regional or departmental access). |

- [Databricks Docs — Governed Tags and Attribute-Based Access Control](https://docs.databricks.com/en/data-governance/unity-catalog/governed-tags.html)
- [Databricks SDK for Python — Catalog Policies (ABAC)](https://databricks-sdk-py.readthedocs.io/en/stable/workspace/catalog/policies.html)
- [Databricks Docs — Manage Privileges and Ownership with Unity Catalog](https://docs.databricks.com/en/data-governance/unity-catalog/manage-privileges.html)
{: .sources }

---

### ADLS Gen2

Azure Data Lake Storage Gen2 supports **POSIX-style Access Control Lists (ACLs)** that apply at both the **directory (folder)** and **file** level.  
Each entry in an ACL defines a **scope** (user, group, or other) and **permissions** (read, write, execute).  
Default ACLs assigned to a directory are **inherited** automatically by newly created child items, and administrators can also **apply or update ACLs recursively** across an entire folder tree.

These folder- and file-level ACLs provide granular control but operate strictly at the **storage path** layer.  
They don’t understand higher-level data objects (like tables, views, or schemas), which is why **Databricks Unity Catalog** introduces an object-centric RBAC model—governing **catalogs, schemas, and tables**—and delegates raw storage enforcement to ADLS.

- [Microsoft Docs – Access control lists on ADLS Gen2](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control)
- [Microsoft Docs – Manage ACLs recursively in ADLS Gen2](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control-lists-recursive)
- [Databricks Docs – Secure access to cloud storage with Unity Catalog](https://docs.databricks.com/en/data-governance/unity-catalog/manage-external-locations.html)
{: .sources}
