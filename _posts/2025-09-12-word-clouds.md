---
layout: single
title: "Word-clouds - randomized"
date: 2025-09-12
classes: center-page
sidebar: false
toc: false
author_profile: true
description: ""
tags: [wordcloud, svg, scss, javascript]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay.jpg
---

<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Grid Word‑Cloud Cards</title>
<style>
  :root { --bg:#0b1220; --card:#0f172a; --ink:#e5e7eb; --muted:#94a3b8; --ring:rgba(255,255,255,.08); --min-fs: clamp(10px, 1.0vw, 14px); --max-fs: clamp(18px, 2.6vw, 32px); }
  * { box-sizing: border-box; }
  body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial; background: var(--bg); }
  .grid-clouds{ --gap:1rem; display:grid; grid-template-columns:repeat(3,1fr); gap:var(--gap); padding:1rem; min-height:100vh; }
  @media (max-width:1100px){ .grid-clouds{ grid-template-columns:repeat(2,1fr);} }
  @media (max-width:700px){ .grid-clouds{ grid-template-columns:1fr;} }
  .card{ background:var(--card); border-radius:1rem; box-shadow:0 0 0 1px var(--ring), 0 10px 30px rgba(0,0,0,.25); padding:1rem 1rem 1.25rem; display:flex; flex-direction:column; }
  .card-header{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:.5rem; }
  .title{ color:var(--ink); font-weight:600; }
  .meta{ color:var(--muted); font-size:.8rem; }
  .cloud{ display:flex; flex-wrap:wrap; align-content:flex-start; gap:.25rem .5rem; line-height:1; }
  .word{ color:var(--ink); text-shadow:0 1px 0 rgba(0,0,0,.35), 0 0 2px rgba(0,0,0,.2); transition:transform .12s ease; will-change:transform; }
  .word:hover{ transform:translateY(-2px); }
</style>
</head>
<body>
  <main class="grid-clouds" id="grid">
    <!-- Cards will be injected by JS -->
  </main>

<script>
  // --- Data -----------------------------------------------------------------
  const topics = [
    "SQL Server","PostgreSQL","Always On AG","FCI","SSIS","DMVs","Indexing","Query Store","HL7","Automation","Power BI","DACPAC","Replication","Azure SQL","Linux","Python","Performance","Backups","Log Shipping","FileGroups","TempDB","Availability","Mirroring","Cluster","WSFC","Kerberos","Networking","Security","XEvents","TPC","Partitioning","Compression","RowMode","BatchMode"
  ];

  // pick N distinct words for a card
  function pick(words, n, rng){
    const pool = [...words];
    const out = [];
    for(let i=0;i<n && pool.length;i++){
      const j = Math.floor(rng()*pool.length);
      out.push(pool.splice(j,1)[0]);
    }
    return out;
  }

  // Simple seeded RNG so reseeding yields new but deterministic layouts if desired
  function mulberry32(a){
    return function(){
      let t = a += 0x6d2b79f5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Map a weight in [0,1] to a font-size between CSS variables --min-fs and --max-fs
  function sizeForWeight(w, el){
    // Extract computed pixel values of the clamps
    const cs = getComputedStyle(document.documentElement);
    const minPx = parseFloat(cs.getPropertyValue('--min-fs')) || 12;
    const maxPx = parseFloat(cs.getPropertyValue('--max-fs')) || 28;
    const px = minPx + (maxPx - minPx) * w;
    return Math.round(px * 100)/100;
  }

  // Create one card with a cloud that reads across (LTR) and wraps down
  function makeCard(idx, rng){
    const card = document.createElement('section');
    card.className = 'card';

    const head = document.createElement('div');
    head.className = 'card-header';
    head.innerHTML = `<div class="title">Card ${idx+1}</div><div class="meta">reads across → then wraps ↓</div>`;

    const cloud = document.createElement('div');
    cloud.className = 'cloud';

    // choose between 14 and 24 words per card
    const words = pick(topics, Math.floor(14 + rng()*10), rng);

    for(const word of words){
      const span = document.createElement('span');
      span.className = 'word';
      // weight skew: square the random to bias toward smaller words with occasional big ones
      const weight = Math.pow(rng(), 1.7);
      const fs = sizeForWeight(weight, cloud);
      span.style.fontSize = fs + 'px';
      // random slight letter spacing + weight for texture
      span.style.letterSpacing = (rng() * 0.02).toFixed(3) + 'em';
      span.style.fontWeight = 400 + Math.floor(rng()*600);
      span.textContent = word;
      cloud.appendChild(span);
    }

    card.appendChild(head);
    card.appendChild(cloud);
    return card;
  }

  // Layout 6 cards in reading order (across then down)
  function render(seed=Date.now()){
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const rng = mulberry32(seed >>> 0);
    for(let i=0;i<6;i++) grid.appendChild(makeCard(i, rng));
  }

  // Recompute font-sizes on resize so they track viewport nicely
  const ro = new ResizeObserver(() => render(window.__seed || Date.now()));
  ro.observe(document.documentElement);

  // Initial paint
  window.__seed = (Math.random()*1e9)|0;
  render(window.__seed);

  // Press 'r' to reseed quickly
  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='r'){ window.__seed = (Math.random()*1e9)|0; render(window.__seed); }});
</script>
</body>
</html>
