---
layout: single
title: Phase 3 — First Data Landed in PostgreSQL
exerpt: "Phase 3 of the project reached a milestone: I’ve loaded a large public dataset into PostgreSQL through a clean, repeatable workflow. The process included acquiring the raw data in Parquet format, converting it to PSV with Python, generating a data dictionary for validation, configuring cross-platform file sharing between host and Debian VM, and bulk-loading into a newly built PostgreSQL table. Each step was designed for reproducibility and scalability — not a one-off test, but a full pipeline that establishes a solid foundation for future phases."
description: Parquet → PSV → PostgreSQL with DuckDB DDL, VirtualBox share permissions, and COPY/\copy paths.
categories: [PostgreSQL, NYC Taxi]
tags: [DuckDB, Parquet, PSV, DBeaver, COPY, VirtualBox]
date: 2025-09-04
classes: center-page
author_profile: false
sidebar: false
toc: true
toc_label: "SECTIONS"
toc_icon: "list"
header:
  overlay_color: "#000"
  overlay_filter: "0.85"
  overlay_image: /assets/images/time-analysis-area-chart.svg
  caption: "From T-SQL to API payloads"
---

**Phase 3: First Data Landed in PostgreSQL**
{: .md-h1}

## Converting Parquet to PSV
This story begins with a dataset of **North Carolina municipal population and density** (`municipal-population-counts-certified-population-estimates-population-density.parquet` → now `mpccpepd.parquet`).  

Using the conversion script I already built for the NYC Taxi project, I ran:

```bash
python parquet_to_psv.py ../data_in/mpccpepd.parquet --out-dir ../data_out --overwrite
```

**Output** 
{: .md-h3} 
OK rows=49574 out=D:\AppDev\nyctaxi\data_out\mpccpepd.psv
{: .code-frame}
Result: a clean, pipe-delimited PSV file with 49,574 rows.

## Previewing Data with DuckDB
{: .md-h2} 
***DuckDB is invaluable for quick checks.***
I used a small PowerShell wrapper (preview-datafile.ps1) to display schema and sample rows without opening the file in LibreOffice:

```bash
./tools/preview-datafile.ps1 ./data_out/mpccpepd.psv -rows 100
```

**Output confirmed the schema:**
- area_name (varchar)
- area_type (varchar)
- variable (varchar)
- year (date)
- value (bigint)
- data_type (varchar)
- vintage (bigint)

**DuckDB’s schema inference**
```sql
DESCRIBE SELECT * FROM read_csv(...)
```
DuckDB reports types like VARCHAR, STRING, BLOB.
- In PostgreSQL, the most flexible equivalent is text.
- text is essentially an unbounded varchar, with no performance penalty compared to varchar(n).

## Generating a Data Dictionary
The make_data_dictionary.py script provides both a .csv and .md profile of the dataset.
Default (outputs beside the PSV as mpccpepd_dictionary.csv and .md):
```bash
python ../python/make_data_dictionary.py ../data_out/mpccpepd.psv
```

**Output** 
{: .md-h3}
<ol>
mpccpepd_dictionary.csv &amp;
mpccpepd_dictionary.md
</ol>
{: .code-frame}

Custom directory (`make_data_dictionary.py`):
```bash
python make_data_dictionary.py ../data_out/mpccpepd.psv --out ../data_out
```
→ writes ../data_out/mpccpepd_dictionary.csv|.md
```bash
python make_data_dictionary.py ../data_out/mpccpepd.psv --out ../data_out/nc_muni_dict
```

Next, instead of using the data dictionary, I'm using DuckDB to turn any PSV into a PostgreSQL CREATE TABLE statement using DuckDB’s inferred types (`psv_to_pg_ddl.py`).
```bash
python psv_to_pg_ddl.py ./data_out/mpccpepd.psv nc_population
```

**Output** 
{: .md-h3} 
```sql
CREATE TABLE nc_population (
  area_name text,
  area_type text,
  variable text,
  year date,
  value bigint,
  data_type text,
  vintage bigint
);
```

***I'm hitting two separate gates for COPY from DBeaver:***
<ol>
  <li>OS file permissions (the Postgres server process must be able to read /media/sf_nyctaxi/...)</li>
  <li>Postgres privilege to read server-side files</li>
</ol>

**A) Let the postgres service read the VirtualBox share.**
```bash
# in the VM
sudo usermod -aG vboxsf postgres
sudo systemctl restart postgresql
# verify:
sudo -u postgres id
```

**B) Give your DB user permission to read server files.**

Postgres protects COPY FROM by default. Grant the built-in role:
```bash
# run as superuser (postgres)
# Grant: lets a non-superuser run COPY ... FROM 'server/path/file'
sudo -u postgres psql -X -v ON_ERROR_STOP=1 -c "GRANT pg_read_server_files TO sqlagent007;"

# ...run your COPY...
# (absolute path; file readable by the postgres OS user)
psql -X -v ON_ERROR_STOP=1 -U sqlagent007 -d mydb \
  -c "COPY public.nc_population FROM '/srv/imports/data.psv'
      WITH (FORMAT csv, DELIMITER '|', HEADER true);"

# Revoke immediately after the load
sudo -u postgres psql -X -v ON_ERROR_STOP=1 -c "REVOKE pg_read_server_files FROM sqlagent007;"
```

Optional (no server role needed): client-side copy instead of server-side:
```bash
psql -X -v ON_ERROR_STOP=1 -U sqlagent007 -d mydb \
  -c "\copy public.my_table FROM '/path/on/your/client/data.psv' WITH (FORMAT csv, DELIMITER '|', HEADER true)"
```

Confirm the postgres process can read the file directly:
```bash
sudo -u postgres head -n 2 /media/sf_nyctaxi/data_out/mpccpepd.psv
```
Re-check your user has the role:
```sql
SELECT rolname FROM pg_roles WHERE rolname='pg_read_server_files';
SELECT pg_has_role('sqlagent007','pg_read_server_files','MEMBER');
```

**C) Run COPY from DBeaver**
```sql
COPY public.nc_population
FROM '/media/sf_nyctaxi/data_out/mpccpepd.psv'
WITH (FORMAT csv, HEADER true, DELIMITER '|', QUOTE '"', ESCAPE '"');
```

Then inside psql:
```sql
\copy nc_population
  FROM '/media/sf_nyctaxi/data_out/mpccpepd.psv'
  WITH (FORMAT csv, HEADER true, DELIMITER '|', QUOTE '"', ESCAPE '"');
```


🔥 Perfect! That was the missing piece — now the Postgres service account (postgres) itself is a member of the vboxsf group, so it can read my VirtualBox shared folder directly.

That’s why COPY from inside DBeaver now works — no more permission denied.
**Quick recap:**
- DBeaver GUI path (COPY) → server-side read (via postgres user).
- psql client path (\copy) → client-side read (via my shell user).
Now I can use either, depending on where I'm working.

✅ At this point, I've got:

- Parquet → PSV conversion pipeline on Windows
- Shared folder into Debian (/media/sf_nyctaxi)
- PostgreSQL CREATE TABLE generated via DuckDB
- Bulk ingest working from both psql and DBeaver

🔥 So far, I've:

- Ingested my first large public dataset into Postgres (nc_population)
- Solved the shared folder + permissions puzzle
- Proven both \copy and COPY paths work
- End-to-end pipeline from Parquet → PSV → PostgreSQL
- A repeatable method for any other public Parquet dataset