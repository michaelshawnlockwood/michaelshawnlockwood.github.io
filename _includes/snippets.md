
Pattern rename using `git`
```bash
# bash
for f in assets/images/carousel/*.PNG; do
  git mv -f "$f" "$(dirname "$f")/$(basename "$f" .PNG).png"
done
git commit -m "Normalize image extensions to lowercase"
git push
```

Launch MinIO
```powershell
# PowerShell
cd D:\AppDev\MinIO
.\minio.exe server D:\AppDev\MinIO\data --console-address ":9011" --address ":9010"
```

Create ico file from png
```powershell
# PowerShell
powershell -NoProfile -Command '$png="favicon-48x48.png"; Add-Type -AssemblyName System.Drawing; $bmp=[System.Drawing.Bitmap]::new($png); $ico=[System.Drawing.Icon]::FromHandle($bmp.GetHicon()); $fs=[IO.File]::Create("favicon.ico"); $ico.Save($fs); $fs.Close(); $bmp.Dispose()'
```

Run Jupyter 
```powershell
# PowerShell 
docker run -it --rm -p 8888:8888 -v "${PWD}\Notebooks:/home/jovyan/work" jupyter/minimal-notebook:latest
```

---

### GitHub Pages 
```bash
# Build
bundle exec jekyll build --safe --trace
```

```bash
# Build and serve
bundler exec jekyll clean && bundler exec jekyll serve --livereload
```

---

### PostgreSQL

pgSQL
```sql
# pgSQL
SELECT datname, datdba::regrole AS owner
FROM pg_database
ORDER BY datname;
```

Quick tips:
 - Invalidate/Reconnect: Right-click the connection → Invalidate/Reconnect (shortcut Ctrl+F5).  
 - Disconnect/Connect: Click the plug icon (or right-click → Disconnect, then Connect).  
 - After reconnect, you’ll see propagent (remember: unquoted names are stored lowercase, so PropAgent becomes propagent).  

## PropAgent
```sql
CREATE TABLE tenants (
  id text PRIMARY KEY,
  identifier text UNIQUE NOT NULL,
  name text NOT NULL,
  connection_string text NOT NULL
);
```
### Make a Dev Cert using mkcert 
```powershell
# PowerShell
cd "$(mkcert -CAROOT)"
mkcert -cert-file "pgsql.debian.local.crt" -key-file "pgsql.debian.local.key" pgsql.debian.local
```

---

## Airflow vs ADF  

---

| **Feature / Aspect** | **Apache Airflow** | **Azure Data Factory (ADF)** | **Reality Check** |
|:--|:--|:--|:--|
| **Type of Tool** | *Open-source workflow orchestrator* | *Cloud-managed ETL/orchestration service* | Fundamentally different architectures. |
| **Control Plane** | You manage the scheduler, webserver, and workers (via Docker, Kubernetes, VM, etc.) | Microsoft manages everything in Azure (PaaS model) | Airflow = you’re in control; ADF = black box. |
| **Execution Model** | Python-based DAGs define dependencies between tasks; very flexible | GUI-driven pipelines and activities; logic abstracted from code | Airflow is *code-first*, ADF is *click-first*. |
| **Extensibility** | You can code anything in Python; integrate with any system via operators or custom hooks | Limited to Azure connectors + generic ones (HTTP, REST, etc.) | Airflow is much more customizable. |
| **Versioning & CI/CD** | Natively Git-friendly (DAGs = code) | Possible but clunky; requires ARM templates or YAML | Airflow fits DevOps culture better. |
| **Cost & Ownership** | Free but requires infra & monitoring | Pay-as-you-go managed service | Trade-off: cost vs. control. |
| **Typical Users** | Data engineers comfortable with Python and automation | Data integrators or analysts who prefer GUI and low-code | Airflow = engineering + integration focus; ADF = integration focus. |


## Artificial Datasets 

```bash
CREATE TABLE IF NOT EXISTS healthcare.bronze.patient (
  patient_id INT,
  first_name STRING,
  last_name STRING,
  dob DATE,
  address STRING,
  city STRING,
  state STRING,
  zip STRING
);
```

---

***To get all 100×50 = 5,000 combos, I need to explode both arrays (first names × last names) so I produce the Cartesian product.***  

**Use a safe CTE name and explode both arrays:**  

```bash
WITH presidents AS (
  SELECT
    sequence(1,100) AS ids,
    array(
      'George','John','Thomas','James','James','John','Andrew','Martin','William','John',
      'James','Zachary','Millard','Franklin','Abraham','Andrew','Ulysses','Rutherford','James','Chester',
      'Grover','Benjamin','Grover','William','Theodore','William','Woodrow','Warren','Calvin','Herbert',
      'Franklin','Harry','Dwight','John','Lyndon','Richard','Gerald','Jimmy','Ronald','George',
      'Bill','George','Barack','Donald','Joe','George','John','Andrew','Lyndon','Franklin',
      'Thomas','James','William','Calvin','Herbert','Harry','Dwight','Lyndon','Ronald','Joe',
      'Richard','Gerald','Jimmy','Ronald','George','Bill','George','Barack','Donald','Joe',
      'Abraham','Andrew','James','Chester','Grover','Benjamin','William','Theodore','Woodrow','Warren',
      'Calvin','Herbert','Franklin','Harry','Dwight','John','Lyndon','Richard','Gerald','Jimmy',
      'Ronald','George','Bill','George','Barack','Donald','Joe','James','Andrew','Thomas','John'
    ) AS first_names,
    array(
      'Washington','Adams','Jefferson','Madison','Monroe','Adams','Jackson','VanBuren','Harrison','Tyler',
      'Polk','Taylor','Fillmore','Pierce','Lincoln','Johnson','Grant','Hayes','Garfield','Arthur',
      'Cleveland','Harrison','Cleveland','McKinley','Roosevelt','Taft','Wilson','Harding','Coolidge','Hoover',
      'Roosevelt','Truman','Eisenhower','Kennedy','Johnson','Nixon','Ford','Carter','Reagan','Bush',
      'Clinton','Bush','Obama','Trump','Biden','Washington','Adams','Jackson','Johnson','Roosevelt'
    ) AS last_names,
    array('Montgomery','Juneau','Phoenix','Little Rock','Sacramento','Denver','Hartford','Dover','Tallahassee','Atlanta','Honolulu','Boise','Springfield','Indianapolis','Des Moines','Topeka','Frankfort','Baton Rouge','Augusta','Annapolis','Boston','Lansing','Saint Paul','Jackson','Jefferson City','Helena','Lincoln','Carson City','Concord','Trenton','Santa Fe','Albany','Raleigh','Bismarck','Columbus','Oklahoma City','Salem','Harrisburg','Providence','Columbia','Pierre','Nashville','Austin','Salt Lake City','Montpelier','Richmond','Olympia','Charleston','Madison','Cheyenne') AS cities,
    array('AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY') AS states,
    array('Ave','Blvd','Dr','Ln','Ct','St') AS suffixes
)
INSERT OVERWRITE TABLE healthcare.bronze.patient
SELECT
  row_number() OVER (ORDER BY rand()) AS patient_id,
  fname AS first_name,
  lname AS last_name,
  date_add(date'1950-01-01', CAST(rand()*datediff(date'2000-12-31', date'1950-01-01') AS INT)) AS dob,
  CONCAT(CAST(floor(rand()*900)+100 AS STRING),' ',lname,' ',
         element_at(suffixes, CAST(floor(rand()*5)+1 AS INT))) AS address,
  element_at(cities, CAST(floor(rand()*5)+1 AS INT)) AS city,
  element_at(states, CAST(floor(rand()*5)+1 AS INT)) AS state,
  LPAD(CAST(60000 + CAST(floor(rand()*9999) AS INT) AS STRING),5,'0') AS zip
FROM presidents
LATERAL VIEW explode(first_names) a AS fname
LATERAL VIEW explode(last_names)  b AS lname;
```

***Now I have 5,050 artificial patient records with randomized first names, last names and addresses stemming from the first fifty U.S. Presidents and their wives' names.***

***Attach NYC Taxi clusters (Bronze/Silver/Gold), and tie these synthetic people to pickup zones, care regions, or clinical service areas for rich demo scenarios — all compliance-safe.***

---

I've just defined a reusable data-fabric pattern:

Build a synthetic identity pool with plausible names and addresses.
Randomize across known safe lists (Presidents + spouses).
Use the same generator logic to scale up whenever you need a larger demo population (5K, 50K, etc.).

That gives me:
Realism: names and addresses that “look” authentic.
Control: no risk of real PHI.
Repeatability: one deterministic or randomized seed.

Layer on the NYC Taxi zones or other geo-linked data, these 5,000 patients can be distributed by pickup_zone, borough, or ZIP, letting me visualize population clusters, claims density, or data masking impacts in my Medallion tables.



**Show grants stuck with the table:**  

Change ownership
```
ALTER TABLE healthcare.phi.patient OWNER TO `group_or_user`;
```

Show `VIEWS`
```sql
SHOW VIEWS IN healthcare;  -- then grep/search definitions for 'bronze.patient'
```

**Provenance (Delta):**
```sql
DESCRIBE HISTORY healthcare.phi.patient;
```


```bash
# Spark SQL
-- Basic column list, types, and comments
DESCRIBE healthcare.bronze.patient;

-- Include partition columns and metadata at the bottom
DESCRIBE EXTENDED healthcare.bronze.patient;

-- Deep metadata (provider, file count, size, schema JSON, etc.)
DESCRIBE DETAIL healthcare.bronze.patient;

-- List all columns and their types from a view
DESCRIBE VIEW healthcare.silver.patient_summary;
```


