---
layout: splash
permalink: /
title: "***Michael Shawn Lockwood — Data Engineering & DBA Portfolio***"
excerpt: "Every quarter I rebuild my environments&mdash;Hyper-V and Oracle VirtualBox VMs&mdash;Windows Server and openSuSE-Leap&mdash;and retest the boundaries I reached in the prior quarter&mdash;full technology stacks, data lineage, and development cycles&mdash;ensuring that my skills and knowledge evolve, solutions stay explainable, reproducible, and fully prepared to meet the challenges of today's business needs. _GitHub Pages is where I document everything._"
classes:
  - center-page
  - no-padding
header:
  overlay_color: "#000"
  overlay_filter: "0.55"
  overlay_image: /assets/images/default-overlay.jpg
  actions:
    - label: "Project Roadmap"
      url: /about/#project-roadmap/
      class: "btn"
    - label: "NYC Taxi Project"
      url: /nyc-taxi/
      class: "btn btn--primary"
    - label: "About me"
      url: /about/#about
      class: "btn"
    - label: "Résumé"
      url: /about/#resume
      class: "btn"
    - label: "Blog"
      url: /blog/
      class: "btn"
    - label: "Contact me"
      url: /about/#contact
      class: "btn"
author: michael_lockwood
sidebar: false
# css: "/assets/css/splash.css"
---

<div class="manifesto-card" markdown="1">
# Professional Manifesto  
&mdash; _inspired by the book, "The Checklist Manifesto"_  
🎯 Thesis: Through continuous repetition, my core strengths, skills and knowdledge evolve, turning multiple platforms, cloud technologies, and programming languages into lasting elements of my Professional Répertoire.  
✅ On a recurring quarterly cycle, I push boundaries and stress-test across the full data stack.  
✅ Rebuild my environments using Hyper-V and Oracle VirtualBox (WSFC/SQL Server FCI and Linux/PostgreSQL), scripting for repeatability and documenting every step.  
✅ Move and transform data with SSIS, Python, and PowerShell—leveraging SSIS for deep ETL and workflow control in the Microsoft stack, while Python and PowerShell provide flexible scripting, integration, and automation.  
⏳ Orchestrate end-to-end pipelines with Apache Airflow.  
🔍 Deliver analysis and visuals through Power BI and D3.js.  
✅ Expose data as JSON through APIs (.NET/C#) and deliver it to modern front-ends (Angular, React).  
☁️ Migrate workloads to cloud targets—Azure and AWS S3—staying aligned with evolving technology shifts.  
⚡ Prioritize performance, transparency, and reproducibility, and always ensure outcomes are explainable and verifiable—almost never quick-and-dirty.[^1]  
📚 Publish lessons learned to accelerate future builds and strengthen organizational knowledge.

[^1]: In DevOps and production work, urgent business needs sometimes require quick fixes. The key is to recognize these as exceptions, document them, and follow up with proper regression and stress testing so long-term quality isn’t compromised.  
</div>

---

<section id="section-cards" class="section-cards">
  <div class="section-body row text-align-center">
    <div class="col-1of1">
      <div class="manifesto-card card">
        <div class="card__side card__side--front card__side--front-0">
          <h4 class="card__header">
            <span class="card__header-span card__header-span--0">
              Card Header
            </span>
          </h4>
          <div class="card__body card__body--front">
            <div class="col-1of2">
              <ul>
                <li>Column 1 of 2</li>
                <li>Fact two</li>
                <li>Fact three</li>
                <li>Fact four</li>
                <li>Fact five</li>
              </ul>
            </div>
            <div class="col-1of2">
              <ul>
                <li>Column 2 of 2</li>
                <li>Fact two</li>
                <li>Fact three</li>
                <li>Fact four</li>
                <li>Fact five</li>
              </ul>
            </div>
          </div>
        </div>
      <div class="card__side card__side--back card__side--back-0">
    <div class="card__header">
      <span class="card__header-span card__header-span--0">
        Card Header
      </span>
    </div>
    <div class="card__body card__body--back">
      <div class="col-1of2">
        <a href="#" class="btn btn--blue btn--animation">Nowhere</a>
      </div>
      <div class="col-1of2">
        <div class="composition">
          <img src="/assets/images/nat-5.jpg" alt="alt 1" class="composition__photo composition__photo--ph1">
          <img src="/assets/images/nat-6.jpg" alt="alt 2" class="composition__photo composition__photo--ph2">
          <img src="/assets/images/nat-7.jpg" alt="alt 3" class="composition__photo composition__photo--ph3">
        </div>
      </div>
    </div>
  </div>
</section>

<!-- {% assign feature_row = site.data.splash.feature_row | default: page.feature_row %} -->

<!-- {% if page.feature_row %}
  {% include feature_row id="feature_row" type="center" %}
{% endif %} -->

<!-- {% include feature_row id="feature_row_2" type="center" %} -->

<!-- <section class="page__content">
  <h2 class="archive__subtitle">Latest Writing</h2>
  {% include posts-paginator.html posts=site.posts limit=6 cols=3 %}
</section> -->
