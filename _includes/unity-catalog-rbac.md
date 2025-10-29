

---

### Attribute-Based Access Control (ABAC) in Unity Catalog

Unity Catalog supports **Attribute-Based Access Control (ABAC)** through governed tags and policy definitions.  
Governed tags capture metadata attributes (e.g., `sensitivity=phi`, `department=pharmacy`), and policies evaluate those tags at query time to determine access.  
This extends traditional RBAC by allowing **context-aware**, attribute-driven rules—ideal for healthcare, finance, and multi-tenant scenarios.

- [Databricks SDK for Python — Catalog Policies (ABAC)](https://databricks-sdk-py.readthedocs.io/en/stable/workspace/catalog/policies.html)
- [Databricks Docs — Governed Tags and Attribute-Based Access Control](https://docs.databricks.com/en/data-governance/unity-catalog/governed-tags.html)
{: .sources}

---

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
