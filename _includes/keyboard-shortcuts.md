---
layout: single
---

### 🧠 Databricks SQL Editor — Keyboard Shortcuts  

| Action | Shortcut | Notes |
|:--|:--|:--|
| **Run current query / cell** | `Ctrl + Enter` | Executes current cell without advancing |
| **Run and move to next cell** | `Shift + Enter` | Common in Notebooks |
| **Toggle comment / uncomment** | `Ctrl + /` | Works in SQL, Python, and Markdown cells |
| **Comment lines (VS Code style)** | `Alt + K + C` | Multi-line comment |
| **Uncomment lines (VS Code style)** | `Alt + K + U` | Multi-line uncomment |
| **Move line up / down** | `Alt + ↑ / Alt + ↓` | Re-order statements quickly |
| **Duplicate line** | `Shift + Alt + ↓` | Clone current line below |
| **Select all occurrences** | `Ctrl + Shift + L` | Edit identical terms simultaneously |
| **Open command palette** | `Ctrl + Shift + P` | Same as VS Code palette |
| **Find / Replace** | `Ctrl + F` / `Ctrl + H` | In-editor search and replace |
| **Format SQL** | `Ctrl + Shift + F` | Auto-formats your SQL query |
| **Fold / Unfold blocks** | `Ctrl + Shift + [` / `Ctrl + Shift + ]` | Collapse or expand regions |
| **Quick save checkpoint (Notebook)** | `Ctrl + S` | Saves cell state |
| **Insert cell above / below (Notebook)** | `A` / `B` (in command mode) | Matches Jupyter style |

🗒️ *Tip:* Databricks SQL and Notebooks share the same Monaco-based editor as VS Code, so many VS Code shortcuts “just work.”  

---

### ⚙️ Databricks SQL Editor vs VS Code — Shortcut Parity  

| Category | Databricks SQL Editor | VS Code Equivalent | Notes |
|:--|:--|:--|:--|
| **Run cell / statement** | `Ctrl + Enter` | `Ctrl + Enter` | Executes current block |
| **Run & move to next** | `Shift + Enter` | `Shift + Enter` | Same behavior in Notebooks and Jupyter |
| **Toggle comment** | `Ctrl + /` | `Ctrl + /` | Works for SQL, Python, Markdown |
| **Multi-line comment** | `Alt + K + C` | `Alt + K + C` | VS Code keybinding preserved |
| **Multi-line uncomment** | `Alt + K + U` | `Alt + K + U` | VS Code keybinding preserved |
| **Format document / query** | `Ctrl + Shift + F` | `Ctrl + Shift + F` | Auto-indents SQL |
| **Move line up / down** | `Alt + ↑ / Alt + ↓` | `Alt + ↑ / Alt + ↓` | Works identically |
| **Duplicate line** | `Shift + Alt + ↓` | `Shift + Alt + ↓` | Quick clone of line or block |
| **Select all occurrences** | `Ctrl + Shift + L` | `Ctrl + Shift + L` | Multi-cursor editing |
| **Open command palette** | `Ctrl + Shift + P` | `Ctrl + Shift + P` | Access editor-level commands |
| **Find / Replace** | `Ctrl + F / Ctrl + H` | `Ctrl + F / Ctrl + H` | Same dialogs |
| **Fold / Unfold blocks** | `Ctrl + Shift +[ / ]` | `Ctrl + Shift +[ / ]` | Code folding |
| **Insert cell above / below** | `A / B` (command mode) | `A / B` (Jupyter / VS Code Notebook) | Command-mode shortcuts |
| **Save notebook / file** | `Ctrl + S` | `Ctrl + S` | Standard |
| **Open file switcher** | `Ctrl + P` | `Ctrl + P` | Search and open files |

💡 *Takeaway:* Databricks’ Monaco-based editor keeps nearly all VS Code behaviors intact — so if you’re fluent in VS Code, you’re already fluent here.

> ### 💡 Pro Tips — Working Efficiently in the Databricks SQL Editor
>
> - **Quick toggle comments:** Highlight any block and hit `Ctrl + /` — no need to select full lines.  
> - **Instant reformat:** Press `Ctrl + Shift + F`; Databricks reformats SQL beautifully.  
> - **Fold sections:** Collapse long CTEs or multi-join queries with `Ctrl + Shift + [` to keep focus tight.  
> - **Run partial selection:** Highlight only the statement you want, then `Ctrl + Enter` — avoids running the entire cell.  
> - **Multi-edit magic:** Use `Ctrl + D` or `Ctrl + Shift + L` to edit repeated column names, aliases, or table references at once.  
> - **JSON peek:** Right-click inside any JSON literal or Delta schema and choose **Format JSON** for readable structure.  
> - **Schema lookup shortcut:** Type `DESCRIBE` + space and hit **Tab** — the autocomplete dropdown often reveals catalog and schema names.  
> - **Command palette power:** `Ctrl + Shift + P` opens dozens of hidden actions — from switching themes to changing line endings.
>
> 🧭 *Remember:* Databricks uses the same **Monaco engine** as VS Code, so 90% of your coding muscle memory carries right over.

---

### ✍️ VS Code — Markdown Editing Shortcuts

| Action | Shortcut | Result / Notes |
|--------|-----------|----------------|
| **Bold** | `Ctrl + B` | Wraps selection with `**` or `__` |
| **Italic** | `Ctrl + I` | Wraps selection with `_` or `*` |
| **Strikethrough** | `Alt + Shift + 5` | Wraps in `~~` |
| **Inline code** | `` Ctrl + ` `` *(customizable)* | Wraps in backticks `` `code` `` |
| **Code block** | `` ``` `` + `Enter` | Starts fenced block |
| **Link** | `Ctrl + K` then `Ctrl + V` | Inserts `[text](pasted-url)` |
| **Image** | `Ctrl + Shift + I` | Inserts `![alt text](url)` |
| **List (bulleted)** | `-` + `Space` | Auto-starts bullet list |
| **List (numbered)** | `1.` + `Space` | Auto-starts numbered list |
| **Header levels** | `#` + `Space` | Creates `# Heading` |
| **Blockquote** | `>` + `Space` | Creates `> quoted text` |
| **Table alignment** | `Ctrl + Shift + P` → “Format Table” *(extension)* | Requires *Markdown All in One* |
| **Toggle preview** | `Ctrl + Shift + V` | Opens side-by-side preview |
| **Preview to the side** | `Ctrl + K V` | Splits editor with preview |
| **Open command palette** | `Ctrl + Shift + P` | Search all Markdown commands |
| **Toggle word wrap** | `Alt + Z` | Keeps long lines readable |
| **Toggle preview scroll sync** | `Ctrl + Shift + P` → “Sync Preview” | Keeps editor & preview aligned |

🧩 *Recommended extension:*  
Install **Markdown All in One** — it enables most of the above shortcuts, table formatting, and TOC generation.  

🗒️ *Tip:* You can also remap or create your own Markdown shortcuts in `File → Preferences → Keyboard Shortcuts` and filter by `markdown.`.

---

### 🧾 Markdown Quick Reference

| Purpose | Syntax Example | Rendered Output |
|----------|----------------|----------------|
| **Bold** | `**text**` | **text** |
| **Italic** | `_text_` | _text_ |
| **Bold + Italic** | `***text***` | ***text*** |
| **Strikethrough** | `~~text~~` | ~~text~~ |
| **Inline Code** | `` `code` `` | `code` |
| **Code Block** | <pre>```sql<br>SELECT * FROM table;<br>```</pre> | ```sql<br>SELECT * FROM table;<br>``` |
| **Blockquote** | `> quoted text` | > quoted text |
| **Heading 1** | `# Heading 1` | # Heading 1 |
| **Heading 2** | `## Heading 2` | ## Heading 2 |
| **Heading 3** | `### Heading 3` | ### Heading 3 |
| **Unordered List** | `- item`<br>`- item` | - item<br>- item |
| **Ordered List** | `1. item`<br>`2. item` | 1. item<br>2. item |
| **Nested List** | `- item`<br>&nbsp;&nbsp;`- subitem` | - item<br> - subitem |
| **Link** | `[title](https://example.com)` | [title](https://example.com) |
| **Image** | `![alt](image.png)` | ![alt](image.png) |
| **Horizontal Rule** | `---` | --- |
| **Table** | <pre>\| Col A \| Col B \|<br>\|-------\|-------\|<br>\| 1 \| 2 \|</pre> | \| Col A \| Col B \|<br>\|-------\|-------\|<br>\| 1 \| 2 \| |
| **Inline HTML** | `<u>underlined</u>` | <u>underlined</u> |

🪄 *Tip:* Combine this with `Ctrl + Shift + V` in VS Code to preview your Markdown instantly.

---

> ### ⚡ Markdown Power Extensions — Supercharge VS Code
>
> 🧩 **Markdown All in One**  
> The gold standard for Markdown editing.  
> - Enables `Ctrl + B`, `Ctrl + I`, `Alt + Shift + 5` shortcuts  
> - Auto-formats tables and lists  
> - Generates tables of contents via `Ctrl + Shift + P → Create Table of Contents`  
> - Supports auto-renumbering of lists and live preview sync  
>
> 🖼️ **Paste Image**  
> Quickly embed screenshots or diagrams with `Ctrl + Alt + V`.  
> - Automatically saves the image to your chosen folder  
> - Inserts Markdown image syntax: `![alt](path)`  
>
> 🧾 **Markdown Preview Enhanced**  
> Adds diagram and math support: Mermaid, PlantUML, LaTeX.  
> - Export to HTML / PDF with styling  
> - Perfect for technical blogs and docs  
>
> 🧱 **Markdown Table Prettifier**  
> Formats tables for perfect column alignment.  
> - Trigger manually or on save  
> - Works well with *All in One*  
>
> 🔗 **Markdown Link Check**  
> Validates internal and external links automatically.  
> - Great for GitHub Pages or documentation repos  
>
> 🧠 **Markdownlint**  
> Provides linting and style consistency.  
> - Helps enforce clean, standardized docs  
> - Can be customized via `.markdownlint.json`
>
> ---
> 💡 *Pro Tip:*  
> Combine these with the **"Auto Save"** and **"Format on Save"** options in VS Code for a smooth, always-clean Markdown workflow.

---

### ⚙️ Recommended VS Code Settings for Markdown Editing

Add these to your **`settings.json`** for a clean, efficient Markdown workflow:

```json
{
  // --- Markdown Essentials ---
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": true,
    "editor.renderWhitespace": "none",
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint"
  },

  // --- Paste Image Integration ---
  "pasteImage.path": "${projectRoot}/assets/images",
  "pasteImage.prefix": "/assets/images/",
  "pasteImage.basePath": "${projectRoot}",

  // --- Markdown All in One ---
  "markdown.extension.toc.levels": "1..4",
  "markdown.extension.toc.updateOnSave": true,
  "markdown.extension.list.indentationSize": "adaptive",
  "markdown.extension.print.onFileSave": false,

  // --- Linting and Formatting ---
  "markdownlint.config": {
    "default": true,
    "MD013": false,  // Disable line length rule
    "MD033": false,  // Allow inline HTML
    "MD041": false   // Allow headings to appear anywhere
  },

  // --- Auto Save & Preview Sync ---
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 2000,
  "markdown-preview-enhanced.scrollSync": true,
  "markdown-preview-enhanced.liveUpdate": true
}
```

---

🧩 Spark SQL in Context

Think of Spark SQL as the SQL interface and optimizer layer that sits on top of the Spark execution engine — the part that actually distributes work across nodes.  
When you use Databricks SQL, a Notebook cell with SELECT …, or a Delta table query, you’re actually running through Spark SQL.

| Concept | What It Means Practically in Databricks | 
|:--|:--| 
| DataFrame API | Everything you run via SQL has an equivalent DataFrame representation. When you call spark.read.table('healthcare.phi.patient'), it returns a distributed DataFrame. | 
| Catalyst Optimizer | Spark’s “brain.” It rewrites and optimizes query plans before execution — combining filters, pushing down predicates, and generating efficient JVM or C++ code. Photon (the vectorized engine) sits just below this. | 
| Schema on Read | Why Databricks can query your CSV, Parquet, or Delta files directly from ADLS or S3 without “importing” them. Schema is inferred or declared, then applied at runtime. | 
| Integration | You can mix SQL with Python, R, or Scala logic inside the same job — for example, a SQL step to join datasets followed by a PySpark ML model training step. | 
| Performance | In Databricks, Spark SQL benefits from Catalyst + Photon (C++ vectorized engine), so your SQL behaves more like a high-performance database query than a typical script. |  

---

```bash
INSERT OVERWRITE TABLE healthcare.phi.patient
SELECT ...
```

 - This is Spark SQL DML, running through Catalyst for optimization and Photon for execution.  
 - Databricks simply adds Delta Lake semantics on top (ACID, time travel, schema evolution).  

--- 

### Spark SQL in the Databricks Ecosystem

Databricks builds on **Apache Spark SQL**, combining its distributed query engine with Delta Lake, Photon, and Unity Catalog to create a unified analytics layer.  
Spark SQL provides the foundation for all SQL operations in Databricks — powering Databricks SQL, Notebooks, and DataFrame APIs alike.

At its core, Spark SQL introduces a **DataFrame API** that treats datasets as distributed tables with named columns.  
Every query you run — whether written in SQL, Python, or Scala — is optimized by the **Catalyst Optimizer**, Spark’s extensible rules engine that rewrites and plans your query for efficient execution.  
The result: the flexibility of traditional SQL with the scalability of cluster computing.

#### Key Advantages
- **Unified access:** The same query engine serves SQL, Python, R, and Scala users.  
- **Schema on read:** Query data directly in object storage (Parquet, CSV/TSV/PSV, Delta) without prior ingestion.  
- **Catalyst Optimization:** Logical and physical plan optimizations ensure efficient distributed execution.  
- **Photon Acceleration:** Databricks’ native C++ engine further boosts query performance.  
- **Delta Lake integration:** Adds ACID transactions, schema evolution, and time travel — all through SQL.  
- **Seamless scaling:** Automatically distributes queries across nodes in the Databricks cluster.  

SQL external table
```bash
CREATE TABLE ext_psv
USING csv
OPTIONS (path 'abfss://bucket/path/*.psv', header 'true', delimiter '|');
```

Python
```bash
df = spark.read.option("header", True).option("delimiter", "|").csv("abfss://bucket/path/*.psv")
```

In short, Spark SQL bridges **traditional SQL analysis** and **distributed big-data computation**, serving as the backbone of Databricks’ modern lakehouse architecture.

- [Databricks Docs — Spark SQL Overview](https://docs.databricks.com/en/sql/language-manual/sql-ref.html)
- [Databricks Docs — Photon Engine](https://docs.databricks.com/en/photon/index.html)
- [Apache Spark Docs — Spark SQL, DataFrames, and Datasets Guide](https://spark.apache.org/docs/latest/sql-programming-guide.html)
{: .sources }

---

