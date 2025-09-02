# michaelshawnlockwood.github.io

![Jekyll](https://img.shields.io/badge/Built_with-Jekyll-blue?logo=jekyll&logoColor=white)
![Minimal Mistakes](https://img.shields.io/badge/Theme-Minimal%20Mistakes-darkgreen)
![VS Code](https://img.shields.io/badge/Editor-VS%20Code-007ACC?logo=visualstudiocode&logoColor=white)
![Sass](https://img.shields.io/badge/Styles-Sass-CC6699?logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/Logic-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Markdown](https://img.shields.io/badge/Content-Markdown-000000?logo=markdown)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

This repository powers [Michael Shawn Lockwood’s GitHub Pages site](https://michaelshawnlockwood.github.io) — a living portfolio of SQL Server engineering, modern data engineering projects, code examples, and technical writing.

---

## 🌐 About the Site
The site is powered by Jekyll and Minimal Mistakes, with custom SCSS/SASS, JavaScript, Liquid, and YAML configuration, plus inline HTML/SVG for data visualizations.

This site is not a static resume. It’s a **working portfolio** that demonstrates:
- Hands-on database administration and development experience.
- Data engineering workflows (ETL pipelines, orchestration, analytics).
- A philosophy of treating a career like **data**: modeling roles, measuring intensities, and visualizing trends.

Content includes:
- Resume highlights and a career timeline.
- Blog posts on SQL Server, PostgreSQL, Airflow, Databricks, Azure, AWS.
- Custom SVG visualizations like the **Roles Over Time area chart**.
- Open-source automation frameworks and DBA utilities.

---

- ## 🛠️ Built With
- [Visual Studio Code](https://code.visualstudio.com/) for development
- [Jekyll](https://jekyllrb.com/) static site generator
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme (dark skin, customized SCSS)
- Custom **SVG diagrams** with layered `<path>` and `<polyline>`
- Custom **SASS/SCSS** overrides for styles
- Custom **JavaScript** for chart logic and interactivity
- **YAML** for configuration and data files
- **Liquid** templating for layouts and includes
- [GitHub Actions](https://github.com/features/actions) for continuous deployment
- Markdown + HTML5 for content and structure

---

## 📊 Featured Work
- **Roles Over Time Chart**  
  An SVG visualization that translates 25+ years of resume history into measurable signals for Dev, DBA, ETL, and Analysis. Bands rise and fall as responsibilities shift — a data model of a career.

- **NYC Taxi Pipeline Project**  
  A real-world data engineering flow: Parquet validation → PSV conversion → schema generation → SQL Server/PostgreSQL bulk insert. Downstream: orchestration with Airflow and Databricks, visualization with Power BI.

- **SQLAgent007**  
  A cross-platform automation framework for intelligent index tuning, performance surveillance, and DBA task orchestration.

---

## 📂 Repository Structure
- `_data/` → Site data (navigation, metadata, JSON/YAML inputs)
- `_includes/` → Shared HTML snippets (charts, components, steps)
- `_layouts/` → Page and post layout templates
- `_posts/` → Blog entries and technical deep dives
- `_sass/` → Custom SCSS overrides for styling
- `about/` → Content for About page
- `assets/` → Images, SVGs, CSS, and other static resources
- `blog/` → Blog index and related pages
- `_config.yml` → Site configuration (theme, plugins, metadata)
- `index.html` / `index.md` → Homepage entries
- `README.md` → Project overview (this file)

---

## 💡 Philosophy
This project is about more than publishing a resume. It demonstrates:
- Turning narrative into **data** and visualizations  
- Showcasing **real artifacts**: code, diagrams, utilities  
- Valuing **clarity over buzzwords** in how experience is represented  
- Bridging **DBA, Dev, and Data Engineering** in practice  

---

## 📬 Contact
**Michael Shawn Lockwood**  
- [LinkedIn](https://www.linkedin.com/in/michaelshawnlockwood/)  
- [GitHub](https://github.com/michaelshawnlockwood)  


## 🚀 Getting Started
Clone the repo and run locally with Jekyll:

```bash
git clone https://github.com/michaelshawnlockwood/michaelshawnlockwood.github.io
cd michaelshawnlockwood.github.io
bundle install
bundle exec jekyll serve


---

## 🤝 Contributing
This repository represents a personal portfolio and knowledge base.  
While contributions are not expected, constructive feedback or issues are welcome via [GitHub Issues](https://github.com/michaelshawnlockwood/michaelshawnlockwood.github.io/issues).

If you’d like to fork this repo to learn from the setup (Jekyll, Minimal Mistakes, SVG visualizations), feel free — just keep attribution intact.

---

## 📜 License
Content in this repository (posts, diagrams, and writing) is © Michael Shawn Lockwood.  
You are free to reference and share with attribution, but not to copy for commercial use.  

The site theme (Minimal Mistakes) and its components are licensed under the [MIT License](https://opensource.org/licenses/MIT).
