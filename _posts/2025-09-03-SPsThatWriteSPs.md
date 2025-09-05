---
layout: single
title: "Stored Procedures That Write Stored Procedures (CRUD Generator)"
excerpt: "Production-safe T-SQL code generators that emit INSERT/UPDATE/DELETE/SELECT procedures from live table metadata—parameterized, TRY/CATCH-wrapped, and QUOTENAME-hardened."
date: 2025-09-03
classes: center-page
tags: [dynamic-sql, codegen, CRUD, sys.columns, sys.types]
author_profile: false
description: ""
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
scripts:
  - ""
header:
  overlay_color: "#000"
  overlay_filter: "0.50"
  overlay_image: /assets/images/headers/t-sql-bg.png
  caption: "Automating Stored Procedure Generation"
---

> TL;DR: This page ships **SPs that write SPs**. Point them at a table and they’ll *generate* properly‑parameterized CRUD stored procedures for you (and optionally create them). They are battle‑tested patterns I’ve used on real systems to speed up delivery while keeping quality high.

---

# Why write SPs that write SPs?

- **Consistency & speed:** Hundreds of tables? Generate consistent procs in seconds.
- **Standards matter:** abcdefgUsing stored procedures as consistent access methods avoids the ad-hoc query variations of Code-First approaches, reducing procedure cache bloat and keeping performance predictable and execution plans stable.
- **Safety:** All names are QUOTENAME’d; all values are parameterized via `sp_executesql`—no string‑concatenation injections.
- **Correctness from metadata:** Nullability, identities, defaults, computed columns, rowversion, and primary keys are handled from `sys.*` metadata.
- **Observability:** Each generated proc includes an error block, return codes, and optional rowcount output.
- **Rollback‑friendly:** Emitted DDL comes with IF‑EXISTS / CREATE logic and idempotent patterns.



The real driver was scale: teams had **hundreds of tables** and each needed the standard set of stored procedures. Writing them by hand was slow, brittle, and error-prone. These generators made it possible to produce consistent procs in minutes. And the pattern still holds: stored procedures are the right way to keep the data tier isolated from the application tier, controlling contracts, security, and performance. Nobody *wants* to write 200 variations of `InsertCustomer` or `UpdateOrder` — but we want the benefits that come with them. With modern SQL Server, we can even push further: UPDATE procs can accept JSON payloads that list column names (or indexes) and values, allowing safe, flexible updates without hand-coding every variation.

---

# History & Story

Back in April 2003, *MSDN Magazine* ran an article by Peter W. DeBetta and J. Byer Hill called *“Automate the Generation of Stored Procedures for Your Database.”* It introduced design-time stored procedures that generate runtime CRUD procs automatically from system metadata. The article is still online today — though you may hit an odd sign-in prompt and formatting that looks preserved from another era, which is part of its charm. 

The “why” was crystal clear. In the early 2000s, there was no LINQ, no Entity Framework, and certainly no Code-First. .NET Framework 1.0 and C# debuted in 2002, LINQ didn’t arrive until 2007, and Entity Framework v1 didn’t ship until 2008 (with Code-First following in 2011). At the time, teams lived in ADO.NET and hand‑rolled DALs. Automating CRUD procs from `sys.*` metadata was the most reliable way to move fast while staying safe. 

I used to subscribe to and read *MSDN Magazine* and *SQL Server Magazine* in paper form. Reading those magazines was a way of staying sharp **away from the screen**. That 2003 piece on SPs‑that‑write‑SPs was intriguing and influential, and I’ve carried the idea forward into my hardened V2 scripts.

---

# Standards Matter

Automation without standards just creates a mess faster. That’s why naming conventions are critical. If I tell a developer “use pr_updatePaymentType,” they should already know what schema and purpose to expect. I prefer the pr_ prefix with PascalCase verbs and nouns for stored procedures (e.g., pr_insertCustomer, pr_updatePaymentType). For tables and columns, I lean toward camelCase, which lines up with the way many application developers write code. The key isn’t the specific choice of camelCase vs PascalCase — the key is consistency. Standards turn a generated CRUD layer into something that feels like part of the application, not an awkward bolt-on.

---

# What’s included (this repo)

These map 1:1 to the scripts in this project:

- `pr_MakeSelectProc.sql` — Builds a single‑row or multi‑row **SELECT** proc with optional filters and paging.
- `pr_MakeInsertProc_UsingTryCatch_V2.sql` — Emits **INSERT** proc with `TRY…CATCH`, default handling, identity capture, and @@ROWCOUNT return.
- `pr_MakeUpdateProc.sql` — Emits **UPDATE** proc using the table’s PK (or unique index) as the match predicate. Optional optimistic concurrency on `rowversion`.
- `pr_MakeDeleteProc.sql` — Emits **DELETE** proc with soft‑delete toggle and audit hook.
- `SPs_That_Write_SPs_V2.sql` — Wrapper/driver to generate a full CRUD set for an entire schema.

> In my repo, these files live under `/sql/auto-proc/`. Names above match my local scripts.

---

# Quickstart

```sql
-- 1) Install the generator procs into a tooling schema
CREATE SCHEMA tool AUTHORIZATION dbo;
GO
:r .\sql\auto-proc\pr_MakeSelectProc.sql
:r .\sql\auto-proc\pr_MakeInsertProc_UsingTryCatch_V2.sql
:r .\sql\auto-proc\pr_MakeUpdateProc.sql
:r .\sql\auto-proc\pr_MakeDeleteProc.sql
:r .\sql\auto-proc\SPs_That_Write_SPs_V2.sql
GO

-- 2) Generate CRUD for one table
EXEC tool.SP_GenerateCrudForTable
     @Schema       = N'dbo',
     @Table        = N'Orders',
     @OutputSchema = N'dbo',
     @Create       = 1;   -- 1 = CREATE the procs, 0 = just PRINT/SELECT the script

-- 3) Or generate for a whole schema
EXEC tool.SP_GenerateCrudForSchema
     @SourceSchema = N'dbo',
     @OutputSchema = N'app',     -- write procs into app.*
     @Create       = 1,
     @What         = N'CRUD';
```

---

# Design highlights (applied to every emitted proc)

- **Injection hardening**
  - All 2‑part names: `QUOTENAME(@schema) + '.' + QUOTENAME(@table)`
  - All value inputs compiled with `sp_executesql` and typed parameters
- **Column filtering**
  - Skips computed, sparse, timestamp/rowversion (unless used for concurrency), and identity columns on INSERT
  - Skips non‑key, non‑updatable columns on UPDATE
- **Defaults & nullability**
  - Optional `COALESCE(@param, DEFAULT)` logic when appropriate
- **Return contracts**
  - `RETURN @@ROWCOUNT` and optional `@RowsAffected` output
  - Sane `TRY…CATCH` with `ERROR_NUMBER/SEVERITY/STATE/LINE/PROCEDURE`
- **Auditing hooks**
  - `-- TODO` anchor comments for AFTER INSERT/UPDATE/DELETE triggers or call‑outs
- **Idempotent DDL**
  - `IF OBJECT_ID(…) IS NOT NULL DROP PROC …; CREATE PROC …` (or CREATE/ALTER depending on your version gate)

---

# Generator: INSERT (excerpt)

```sql
CREATE OR ALTER PROC tool.pr_MakeInsertProc
  @Schema sysname,
  @Table  sysname,
  @OutputSchema sysname = N'dbo',
  @Create bit = 0
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @target sysname = QUOTENAME(@OutputSchema) + N'.' + N'pr_' + QUOTENAME(@Table) + N'_Insert';
  DECLARE @full nvarchar(512) = QUOTENAME(@Schema) + N'.' + QUOTENAME(@Table);

  ;WITH cols AS (
    SELECT
      c.column_id,
      c.name,
      t.name AS type_name,
      c.max_length,
      c.precision,
      c.scale,
      c.is_nullable,
      c.is_identity,
      c.is_computed,
      ty.user_type_id
    FROM sys.columns c
    JOIN sys.types ty ON c.user_type_id = ty.user_type_id
    JOIN sys.tables tb ON tb.object_id = c.object_id
    JOIN sys.schemas s ON s.schema_id = tb.schema_id
    WHERE s.name = @Schema
      AND tb.name = @Table
      AND c.is_computed = 0
      AND ty.name <> 'timestamp'
  )
  SELECT -- build param list, insert column list, values list with typed params
    @sql = N'CREATE OR ALTER PROC ' + @target + N' ' +
           N'\n' + /* parameter list */
           N'AS BEGIN SET NOCOUNT ON; BEGIN TRY ' +
           N'\nDECLARE @stmt nvarchar(max);' +
           N'\nSET @stmt = N''INSERT INTO ' + @full + N' (…cols…) VALUES (…@params…)'';' +
           N'\nEXEC sp_executesql @stmt, N''…typed param decls…'', …values…;' +
           N'\nRETURN @@ROWCOUNT;\nEND TRY BEGIN CATCH ' +
           N'SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage; RETURN -1; END CATCH END;';

  IF @Create = 1 EXEC sys.sp_executesql @sql; ELSE SELECT [Generated] = @sql;
END
```

*(The real script emits fully‑typed parameter declarations, handles identity/rowversion properly, and formats the SQL for readability.)*

---

# Generator: UPDATE (excerpt)

```sql
-- Emits UPDATE proc keyed on PK or unique index; optional rowversion check
-- UPDATE … SET col = @col … WHERE (PK = @PK) AND (@RowVer IS NULL OR rowversion = @RowVer)
```

# Generator: DELETE (excerpt)

```sql
-- Emits DELETE proc keyed on PK with optional soft delete pattern
-- Soft delete example: UPDATE … SET IsDeleted = 1, DeletedAt = SYSUTCDATETIME() WHERE PK = @PK
```

# Generator: SELECT (excerpt)

```sql
-- Emits SELECT proc with optional WHERE predicates for every column (@Col IS NULL OR Col = @Col)
-- Optional paging: ORDER BY PK OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY
```

---

# Options & knobs

| Option | Default | Notes |
|---|---:|---|
| `@Create` | 0 | `0` returns the generated script; `1` creates the proc |
| `@OutputSchema` | `dbo` | Schema where emitted procs live |
| `@ConcurrencyCheck` | 0 | When `1`, include `rowversion` equality in UPDATE WHERE |
| `@SoftDelete` | 0 | When `1`, DELETE emits soft‑delete pattern if `IsDeleted` exists |
| `@SkipAuditColumns` | 1 | Avoids writing to `CreatedAt`, `CreatedBy`, etc. |

---

# Version targets (tested)

- SQL Server 2012+ (works)
- SQL Server 2016+ (preferred—`CREATE OR ALTER` available)
- SQL Server 2019/2022 (fully compatible)

> If targeting 2008R2, switch to `IF OBJECT_ID … DROP + CREATE` and avoid some modern syntax.

---

# How I use these in practice

1. **Greenfield:** After designing tables, I run the generators once to seed app‑schema procs: `app.pr_Table_Insert/Update/Delete/Select`.
2. **Migrations:** When columns are added, regenerate to keep signatures current.
3. **Testing:** CI pipeline compares generated text to committed versions—drift becomes a diff you can review.

---

# Demo script

```sql
-- Demo table
CREATE TABLE dbo.Sample (
  SampleId int IDENTITY(1,1) PRIMARY KEY,
  Name        nvarchar(120) NOT NULL,
  Description nvarchar(400) NULL,
  IsActive    bit NOT NULL CONSTRAINT DF_Sample_IsActive DEFAULT(1),
  RowVer      rowversion
);

-- Generate
EXEC tool.SP_GenerateCrudForTable @Schema = N'dbo', @Table = N'Sample', @OutputSchema = N'app', @Create = 1;

-- Try them
EXEC app.pr_Sample_Insert @Name = N'Alpha', @Description = N'first';
EXEC app.pr_Sample_Select @SampleId = 1;
EXEC app.pr_Sample_Update @SampleId = 1, @Description = N'updated';
EXEC app.pr_Sample_Delete @SampleId = 1;
```

---

# Security notes

- Use a dedicated **tooling schema** (e.g., `tool`) and restrict EXECUTE to DBAs/deployers.
- Application procs should live in a separate schema (e.g., `app`) with minimal grants.
- All dynamic SQL is parameterized; review emitted code before creation in highly regulated environments.

---

# Roadmap

- Option to emit **MERGE‑based UPSERT** procs with identity‑safe patterns
- Optional **FOR JSON** result shapes for API‑first designs
- Toggle for **soft‑delete discovery** (auto‑detect `IsDeleted` / `DeletedAt`)
- Extended **paging and search** helpers (ILIKE/CONTAINS where available)

---

# Repo structure (planned)

```
/sql
  /auto-proc
    pr_MakeSelectProc.sql
    pr_MakeInsertProc_UsingTryCatch_V2.sql
    pr_MakeUpdateProc.sql
    pr_MakeDeleteProc.sql
    SPs_That_Write_SPs_V2.sql
/docs
  sps-that-write-sps.md   <-- this page
```

