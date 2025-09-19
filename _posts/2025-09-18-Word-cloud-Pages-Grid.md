---
layout: single
title: "Wordclouds Grid - randomized"
date: 2025-09-18
classes: wide
sidebar: false
toc: false
author_profile: false
description: ""
tags: [wordcloud, svg, scss, javascript]
---

<style>
  :root{
    --bg:#0b1220; --card:#0f172a; --ink:#e5e7eb; --muted:#94a3b8; --ring:rgba(255,255,255,.08);
    --min-fs: 12;  /* px, used by JS */
    --max-fs: 28;  /* px, used by JS */
  }

  /* Escape the theme’s centered column */
  .full-bleed { width:100%; margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); }

  /* Stage: 80% viewport, 3:2 aspect to match 3×2 grid */
  .stretch-card-stage{
    width:min(80vw, calc(80vh * 1.5)); /* 3/2 = 1.5 */
    aspect-ratio:3/2;
    display:grid; place-items:center;
    background:var(--bg);
    margin-inline:auto;
  }

  /* Grid fills stage */
  .stretch-card-grid{
    --gap:1rem;
    width:100%; height:100%;
    display:grid; gap:var(--gap);
    grid-template-columns:repeat(3,1fr);
    grid-template-rows:repeat(2,1fr);
  }

  /* Card flip scaffold */
  .stretch-card{ position:relative; perspective:1000px; border-radius:1rem; }
  .stretch-card-inner{
    position:absolute; inset:0; border-radius:1rem; background:var(--card);
    box-shadow:0 0 0 1px var(--ring), 0 10px 30px rgba(0,0,0,.25);
    transition:transform .6s ease; transform-style:preserve-3d; overflow:hidden;
    display:flex; flex-direction:column;
  }
  .stretch-card.is-flipped .stretch-card-inner{ transform:rotateY(180deg); }

  .stretch-card-face{ position:absolute; inset:0; padding:1rem 1rem 1.25rem; backface-visibility:hidden; display:flex; flex-direction:column; }
  .stretch-card-face.back{ transform:rotateY(180deg); color:var(--ink); } /* ensures D3 bars (currentColor) are visible */

  .stretch-card-header{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:.5rem; }
  .title{ color:var(--ink); font-weight:600; }
  .meta{ color:var(--muted); font-size:.85rem; }

  .stretch-card-cloud{ display:flex; flex-wrap:wrap; align-content:flex-start; gap:.25rem .5rem; line-height:1; }
  .stretch-card-word{ color:var(--ink); text-shadow:0 1px 0 rgba(0,0,0,.35), 0 0 2px rgba(0,0,0,.2); transition:transform .12s ease; will-change:transform; }
  .stretch-card-word:hover{ transform:translateY(-2px); }

  /* D3 mini-chart */
  .mini-chart{ width:100%; height:100%; display:block; }
</style>

<div class="full-bleed">
  <section class="stretch-card-stage" id="stage" aria-label="Stretch-card Demo Stage">
    <main class="stretch-card-grid" id="grid" aria-live="polite"></main>
  </section>
</div>

<!-- D3 (load once) -->
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // --- Data pool for the front face
  const topics = [
    "SQL Server","PostgreSQL","Always On AG","FCI","SSIS","DMVs","Indexing","Query Store","HL7","Automation","Power BI","DACPAC","Replication","Azure SQL","Linux","Python","Performance","Backups","Log Shipping","FileGroups","TempDB","Availability","Mirroring","Cluster","WSFC","Kerberos","Networking","Security","XEvents","TPC","Partitioning","Compression","RowMode","BatchMode"
  ];

  // Seeded RNG (Mulberry32)
  function mulberry32(a){ return function(){ let t=a+=0x6d2b79f5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }

  // Pick N distinct words
  function pick(words, n, rng){
    const pool=[...words], out=[];
    for(let i=0;i<n && pool.length;i++){ const j=Math.floor(rng()*pool.length); out.push(pool.splice(j,1)[0]); }
    return out;
  }

  // Map weight in [0,1] to px using CSS vars
  function sizeForWeight(w){
    const cs = getComputedStyle(document.documentElement);
    const minPx = parseFloat(cs.getPropertyValue('--min-fs')) || 12;
    const maxPx = parseFloat(cs.getPropertyValue('--max-fs')) || 28;
    return Math.round((minPx + (maxPx - minPx) * w) * 100)/100;
  }

  // D3 tiny bar chart on the BACK face
  function renderMiniBarChart(container, data){
    const w = container.clientWidth || 240, h = container.clientHeight || 140;
    const svg = d3.select(container).append("svg")
      .attr("class", "mini-chart")
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scaleBand().domain(d3.range(data.length)).range([8, w-8]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data)||1]).nice().range([h-12, 12]);

    svg.selectAll("rect").data(data).enter().append("rect")
      .attr("x", (_, i) => x(i))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => (h-12) - y(d))
      .attr("rx", 3)
      .attr("fill", "currentColor");
  }

  // Build a card with front cloud + back D3
  function makeCard(idx, rng){
    const card = document.createElement('section');
    card.className = 'stretch-card';

    const inner = document.createElement('div');
    inner.className = 'stretch-card-inner';

    // FRONT
    const front = document.createElement('div');
    front.className = 'stretch-card-face front';
    const head = document.createElement('div');
    head.className = 'stretch-card-header';
    head.innerHTML = `<div class="title">Card ${idx+1}</div><div class="meta">reads across → then wraps ↓</div>`;
    const cloud = document.createElement('div');
    cloud.className = 'stretch-card-cloud';

    const words = pick(topics, Math.floor(14 + rng()*10), rng); // 14..23 words
    for(const word of words){
      const span = document.createElement('span');
      span.className = 'stretch-card-word';
      const weight = Math.pow(rng(), 1.7); // skew small, occasional big
      span.style.fontSize = sizeForWeight(weight) + 'px';
      span.style.letterSpacing = (rng() * 0.02).toFixed(3) + 'em';
      span.style.fontWeight = 400 + Math.floor(rng()*600);
      span.textContent = word;
      cloud.appendChild(span);
    }
    front.appendChild(head); front.appendChild(cloud);

    // BACK
    const back = document.createElement('div');
    back.className = 'stretch-card-face back';
    const chartWrap = document.createElement('div');
    chartWrap.style.flex = "1";
    chartWrap.style.display = "grid";
    chartWrap.style.placeItems = "center";
    back.appendChild(chartWrap);

    inner.appendChild(front); inner.appendChild(back); card.appendChild(inner);

    // Flip on click
    card.addEventListener('click', ()=> card.classList.toggle('is-flipped'));

    // Render D3 once in DOM
    requestAnimationFrame(() => {
      const data = Array.from({length: 8}, () => Math.round(rng()*100));
      renderMiniBarChart(chartWrap, data);
    });

    return card;
  }

  // Render grid
  const grid = document.getElementById('grid');
  const stage = document.getElementById('stage');

  function render(seed = Date.now()){
    grid.innerHTML = '';
    const rng = mulberry32(seed >>> 0);
    for(let i=0;i<6;i++) grid.appendChild(makeCard(i, rng));
  }

  // Initial seed + render
  window.__seed = (Math.random()*1e9)|0;
  render(window.__seed);

  // Re-render when stage resizes
  const ro = new ResizeObserver(() => render(window.__seed));
  ro.observe(stage);

  // Press 'r' to reshuffle with a new seed
  window.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase()==='r'){
      window.__seed = (Math.random()*1e9)|0;
      render(window.__seed);
    }
  });
});
</script>
