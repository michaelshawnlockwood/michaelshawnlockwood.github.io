<!--
SCSS SOURCE (compile to CSS if you prefer)

$bg: #0b1220;
$card-bg: #0f172a;
$ink: #e5e7eb;
$muted: #94a3b8;
$ring: rgba(255,255,255,.08);

.stretch-card-grid {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background: $bg;
}

.stretch-card {
  background: $card-bg;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px $ring, 0 10px 30px rgba(0,0,0,.25);
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.8s ease, scale 0.8s ease;
}

.stretch-card.flip {
  transform: rotateY(180deg) scale(1.05);
}

.stretch-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: .5rem;
  .title { color: $ink; font-weight: 600; }
  .meta  { color: $muted; font-size: .8rem; }
}

.stretch-card-cloud {
  display: flex; flex-wrap: wrap; align-content: flex-start;
  gap: .25rem .5rem;
  line-height: 1;
}

.stretch-card-word {
  color: $ink;
  text-shadow: 0 1px 0 rgba(0,0,0,.35), 0 0 2px rgba(0,0,0,.2);
  transition: transform .12s ease;
  will-change: transform;
}

.stretch-card-word:hover { transform: translateY(-2px); }

:root {
  --min-fs: clamp(10px, 1.0vw, 14px);
  --max-fs: clamp(18px, 2.6vw, 32px);
}
-->

<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Stretch Card Word-Cloud Grid</title>
<style>
  :root {
    --bg:#0b1220; --card:#0f172a; --ink:#e5e7eb; --muted:#94a3b8; --ring:rgba(255,255,255,.08);
    --min-fs: clamp(10px, 1.0vw, 14px); --max-fs: clamp(18px, 2.6vw, 32px);
  }
  * { box-sizing: border-box; }
  html, body { height:100%; }
  body { margin:0; display:grid; place-items:center; background: var(--bg); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial; }

  /* Stage: 80% of viewport in both dimensions, preserves 3:2 for a 3x2 grid */
  .stretch-card-stage {
    width: min(80vw, calc(80vh * 1.5));   /* 3/2 = 1.5 */
    aspect-ratio: 3 / 2;                  /* keeps 3x2 proportion */
    display: grid; place-items: center;
  }

  /* Optional: global scale knob if you want to dial layout up/down quickly */
  .stretch-card-stage[data-scale] { transform: scale(var(--stage-scale, 1)); transform-origin: center; }

  .stretch-card-grid{
    --gap:1rem; width:100%; height:100%; display:grid;
    grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,1fr);
    gap:var(--gap);
  }

  /* 3D flip scaffolding */
  .stretch-card {
    position: relative; perspective: 1000px; border-radius:1rem;
  }
  .stretch-card-inner{
    position:absolute; inset:0; border-radius:1rem; background:var(--card);
    box-shadow:0 0 0 1px var(--ring), 0 10px 30px rgba(0,0,0,.25);
    transition: transform .6s ease; transform-style: preserve-3d; overflow:hidden;
    display:flex; flex-direction:column; justify-content:flex-start;
  }
  .stretch-card.is-flipped .stretch-card-inner{ transform: rotateY(180deg); }

  .stretch-card-face{ position:absolute; inset:0; padding:1rem 1rem 1.25rem; backface-visibility:hidden; display:flex; flex-direction:column; }
  .stretch-card-face.back{ transform: rotateY(180deg); }

  .stretch-card-header{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:.5rem; }
  .title{ color:var(--ink); font-weight:600; }
  .meta{ color:var(--muted); font-size:.8rem; }

  .stretch-card-cloud{ display:flex; flex-wrap:wrap; align-content:flex-start; gap:.25rem .5rem; line-height:1; }
  .stretch-card-word{ color:var(--ink); text-shadow:0 1px 0 rgba(0,0,0,.35), 0 0 2px rgba(0,0,0,.2); transition:transform .12s ease; will-change:transform; }
  .stretch-card-word:hover{ transform:translateY(-2px); }
</style>
</head>
<body>
  <section class="stretch-card-stage" id="stage">
    <main class="stretch-card-grid" id="grid">
    <!-- Cards will be injected by JS -->
  </main>
  </section>

<script>
  const topics = [
    "SQL Server","PostgreSQL","Always On AG","FCI","SSIS","DMVs","Indexing","Query Store","HL7","Automation","Power BI","DACPAC","Replication","Azure SQL","Linux","Python","Performance","Backups","Log Shipping","FileGroups","TempDB","Availability","Mirroring","Cluster","WSFC","Kerberos","Networking","Security","XEvents","TPC","Partitioning","Compression","RowMode","BatchMode"
  ];

  function pick(words, n, rng){
    const pool = [...words];
    const out = [];
    for(let i=0;i<n && pool.length;i++){
      const j = Math.floor(rng()*pool.length);
      out.push(pool.splice(j,1)[0]);
    }
    return out;
  }

  function mulberry32(a){
    return function(){
      let t = a += 0x6d2b79f5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function sizeForWeight(w){
    const cs = getComputedStyle(document.documentElement);
    const minPx = parseFloat(cs.getPropertyValue('--min-fs')) || 12;
    const maxPx = parseFloat(cs.getPropertyValue('--max-fs')) || 28;
    const px = minPx + (maxPx - minPx) * w;
    return Math.round(px * 100)/100;
  }

  function makeCard(idx, rng){
    const card = document.createElement('section');
    card.className = 'stretch-card';

    const inner = document.createElement('div');
    inner.className = 'stretch-card-inner';

    const front = document.createElement('div');
    front.className = 'stretch-card-face front';
    const head = document.createElement('div');
    head.className = 'stretch-card-header';
    head.innerHTML = `<div class="title">Card ${idx+1}</div><div class="meta">reads across → then wraps ↓</div>`;

    const cloud = document.createElement('div');
    cloud.className = 'stretch-card-cloud';

    const words = pick(topics, Math.floor(14 + rng()*10), rng);
    for(const word of words){
      const span = document.createElement('span');
      span.className = 'stretch-card-word';
      const weight = Math.pow(rng(), 1.7);
      const fs = sizeForWeight(weight);
      span.style.fontSize = fs + 'px';
      span.style.letterSpacing = (rng() * 0.02).toFixed(3) + 'em';
      span.style.fontWeight = 400 + Math.floor(rng()*600);
      span.textContent = word;
      cloud.appendChild(span);
    }

    front.appendChild(head);
    front.appendChild(cloud);

    const back = document.createElement('div');
    back.className = 'stretch-card-face back';
    back.innerHTML = `<div class="title">Details</div><p class="meta">Back face — put notes, links, or metrics here.</p>`;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // click to flip
    card.addEventListener('click', ()=> card.classList.toggle('is-flipped'));

    return card;
  }

  function render(seed=Date.now()){
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const rng = mulberry32(seed >>> 0);
    for(let i=0;i<6;i++) grid.appendChild(makeCard(i, rng));
  }

  // Optional: expose a scaling API that keeps within 80% viewport but lets you dial density
  function setStageScale(s){
    const stage = document.getElementById('stage');
    stage.style.setProperty('--stage-scale', s);
    if(s) stage.setAttribute('data-scale',''); else stage.removeAttribute('data-scale');
  }

  const ro = new ResizeObserver(() => render(window.__seed || Date.now()));
  ro.observe(document.documentElement);

  window.__seed = (Math.random()*1e9)|0;
  render(window.__seed);

  window.addEventListener('keydown', (e)=>{
    const k = e.key.toLowerCase();
    if(k==='r'){ window.__seed = (Math.random()*1e9)|0; render(window.__seed); }
    if(k==='['){ setStageScale(0.9); }
    if(k===']'){ setStageScale(1.1); }
    if(k==='='){ setStageScale(1.0); }
  });
</script>
</body>
</html>
