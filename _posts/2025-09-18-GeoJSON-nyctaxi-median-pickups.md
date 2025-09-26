---
layout: single
title: "NYC Taxi Pick-ups Choropleth in D3.js using GeoJSON MultiPolygon"
excerpt: "Interactive NYC Taxi choropleth built from the official Taxi Zone GeoJSON (MultiPolygon). This post renders one of four quadrants, coloring zones by trip counts with a sequential ramp. Legend uses ˜x (median) with Q1 and Q3 markers; tooltips show zone + value. A 4-up NE/NW/SW/SE grid is coming next."
date: 2025-09-18
classes: 
  - wide
  - -no-padding
sidebar: false
toc: false
author: michael_lockwood
author_profile: true
description: "NYC Taxi choropleth in D3.js using GeoJSON MultiPolygon: one quadrant colored by trip counts with a μ/±2σ legend and per-zone tooltips; full 4-up map coming."
tags: [GeoJSON, D3.js, SVG]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay.jpg
  caption: "NYC Taxi Choropleth in D3.js using GeoJSON MultiPolygon"
---

<div id="map-wrap">
  <svg id="map" width="720" height="520" aria-label="NYC Taxi Zones"></svg>
  <div id="tip" style="position:absolute; pointer-events:none; opacity:0;"></div>
</div>

<style>
  #map-wrap { position: relative; margin: 2rem auto; max-width: 720px; }
  #map { display:block; width:100%; height:auto; background: transparent; }
  .zone { fill: #efefef; stroke: #2b6cb0; stroke-width: 1.25; vector-effect: non-scaling-stroke; }
  path.zone:hover { fill: #2b6cb0 !important; }
  #tip {
    background: rgba(0,0,0,0.8); color: #fff; font: 12px/1.4 system-ui, sans-serif;
    padding: 6px 8px; border-radius: 6px; transform: translate(8px, -28px); white-space: nowrap;
  }
  .bounds { fill:none; stroke:#444; stroke-dasharray:4 3; stroke-width:1; vector-effect:non-scaling-stroke; }
</style>

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script>
(async function () {
  const svg  = d3.select("#map");
  const g    = svg.append("g");
  const tip  = d3.select("#tip");
  const w = svg.node().clientWidth;
  const h = +svg.attr("height");

  const url = "/assets/data/taxi_zones_4326_v2.geojson"; // <-- your file
  const raw = await fetch(url).then(r => r.json());

  // --- Helpers ----------------------------------------------------
  function sampleCoords(geom, out) {
    if (!geom) return;
    if (geom.type === "Point") out.push(geom.coordinates);
    if (geom.type === "MultiPoint") out.push(...geom.coordinates);
    if (geom.type === "LineString") out.push(...geom.coordinates);
    if (geom.type === "MultiLineString") geom.coordinates.forEach(a => out.push(...a));
    if (geom.type === "Polygon") geom.coordinates.forEach(r => out.push(...r));
    if (geom.type === "MultiPolygon") geom.coordinates.forEach(p => p.forEach(r => out.push(...r)));
    if (geom.type === "GeometryCollection") geom.geometries?.forEach(g => sampleCoords(g, out));
  }

  function looksLikeLatLonSwapped(coords) {
    // Heuristic: NYC-ish values: lat ≈ 40.x, lon ≈ -74.x
    // If first component ~ 40 and second ~ -74 for most points, they’re swapped.
    const n = Math.min(coords.length, 500);
    let swapped = 0;
    for (let i = 0; i < n; i++) {
      const [a,b] = coords[i];
      if (a > 24 && a < 50 && b < -60 && b > -90) swapped++; // a~lat, b~lon
    }
    return swapped / n > 0.6;
  }

  function deepSwap(geom) {
    if (!geom) return geom;
    const swapRings = rings => rings.map(r => r.map(([x,y]) => [y,x]));
    switch (geom.type) {
      case "Point":            geom.coordinates = [geom.coordinates[1], geom.coordinates[0]]; break;
      case "MultiPoint":
      case "LineString":       geom.coordinates = geom.coordinates.map(([x,y]) => [y,x]); break;
      case "MultiLineString":  geom.coordinates = geom.coordinates.map(r => r.map(([x,y]) => [y,x])); break;
      case "Polygon":          geom.coordinates = swapRings(geom.coordinates); break;
      case "MultiPolygon":     geom.coordinates = geom.coordinates.map(p => swapRings(p)); break;
      case "GeometryCollection": geom.geometries?.forEach(deepSwap); break;
    }
    return geom;
  }

  // --- Inspect & normalize ---------------------------------------
  const coords = [];
  raw.features?.forEach(f => sampleCoords(f.geometry, coords));

  let mode = "geo"; // "geo" (lon/lat) or "identity" (already projected)
  if (coords.length) {
    // If values are absurd for lon/lat (e.g., thousands), assume projected
    const absMax = Math.max(...coords.flat().map(Math.abs));
    if (absMax > 400) mode = "identity";
  }

  // If mode is geo but appears swapped, swap to lon/lat
  if (mode === "geo" && looksLikeLatLonSwapped(coords)) {
    raw.features.forEach(f => deepSwap(f.geometry));
    console.info("⚠️ Detected lat/lon swapped → corrected to [lon, lat].");
  }

  // --- Projection setup -------------------------------------------
  const nameKeys = ["zone","Zone","name","NAME","LocationName"];
  const boroKeys = ["borough","Borough","boro","Boro"];
  let path;

  if (mode === "geo") {
    const projection = d3.geoMercator().fitSize([w, h], raw);
    path = d3.geoPath(projection);
    console.info("🗺️ Using geoMercator().");
  } else {
    const projection = d3.geoIdentity().reflectY(true).fitSize([w, h], raw);
    path = d3.geoPath(projection);
    console.info("📐 Using geoIdentity() (data appears already projected).");
  }

  // Debug: draw fitted bounds rectangle
  const b = path.bounds(raw); // [[x0,y0],[x1,y1]]
  g.append("rect")
    .attr("class", "bounds")
    .attr("x", b[0][0]).attr("y", b[0][1])
    .attr("width",  b[1][0]-b[0][0])
    .attr("height", b[1][1]-b[0][1]);

// Derive color scale from TripCount
const tripsOf  = f => Number((f.properties || {}).TripCount ?? 0);
const maxTrips = d3.max(raw.features, tripsOf) || 1;

// sqrt to tame skew; map low→high trips to light→dark
const color = d3.scaleLinear()
  .domain([0, Math.sqrt(maxTrips)])
  .range(["#e6f2ff", "#08306b"]);

// --- Legend ------------------------------------------------
addTripsLegend(svg, color, maxTrips, raw.features);

function addTripsLegend(svg, color, maxTrips, features) {
  // Clear any existing legend (helps with live-reload)
  svg.select("#legendTrips").remove();

  const w = 200, h = 15, pad = 20;
  const fmt = d3.format(",");

  // --- 1) Gather & sort counts
  const trips = features.map(f => Number((f.properties || {}).TripCount ?? 0));
  const sorted = trips.slice().sort(d3.ascending);

  // Robust guards for empty/NaN
  const minT = sorted[0] ?? 0;
  const maxT = Number.isFinite(maxTrips) && maxTrips > 0 ? maxTrips : (sorted.at(-1) ?? 1);

  // --- 2) Quantiles (use sorted version for d3@7)
  const q1     = d3.quantileSorted(sorted, 0.25) ?? 0;
  const median = d3.quantileSorted(sorted, 0.50) ?? 0;
  const q3     = d3.quantileSorted(sorted, 0.75) ?? 0;

  // --- 3) Position scale (√ to match your color mapping)
  const x = d3.scaleSqrt().domain([0, maxT]).range([0, w]);

  // --- 4) Gradient matching your color scale
  const defs = svg.select("defs").empty() ? svg.append("defs") : svg.select("defs");
  const gradId = "legendGradTrips";
  defs.select(`#${gradId}`).remove();

  const grad = defs.append("linearGradient")
    .attr("id", gradId).attr("x1", "0%").attr("x2", "100%")
    .attr("y1", "0%").attr("y2", "0%");
  const N = 8;
  for (let i = 0; i <= N; i++) {
    const t = i / N; // 0..1
    grad.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(t * Math.sqrt(maxT)));
  }

  // --- 5) Container
  const g = svg.append("g")
    .attr("id", "legendTrips")
    .attr("transform", `translate(${pad},${pad})`);

  // Color bar
  g.append("rect")
    .attr("width", w)
    .attr("height", h)
    .attr("rx", 2)
    .attr("fill", `url(#${gradId})`);

  // End labels: MIN and MAX
  g.append("text")
    .attr("x", 0).attr("y", h + 12)
    .attr("font-size", 10).attr("fill", "#fff")
    .text(fmt(minT));

  g.append("text")
    .attr("x", w).attr("y", h + 12)
    .attr("font-size", 10).attr("text-anchor", "end").attr("fill", "#fff")
    .text(fmt(Math.round(maxT)));

  // --- 6) Ticks: Q1, Median, Q3 (clamped for safety)
  const clamp = v => Math.max(0, Math.min(maxT, v));
  const ticks = [
    { v: q1,     label: `Q1 ${fmt(Math.round(q1))}` },
    { v: median, label: `Median ${fmt(Math.round(median))}` },
    { v: q3,     label: `Q3 ${fmt(Math.round(q3))}` }
  ];

  ticks.forEach(t => {
    const xx = x(clamp(t.v));
    g.append("line")
      .attr("x1", xx).attr("x2", xx)
      .attr("y1", -6).attr("y2", h)
      .attr("stroke", "#fff").attr("stroke-width", 1).attr("opacity", 0.9);

    g.append("text")
      .attr("x", xx).attr("y", -8)
      .attr("font-size", 9).attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text(t.label);
  });
}

// --- Render Map --------------------------------------------------
g.selectAll("path.zone")
  .data(raw.features)
  .join("path")
  .attr("class", "zone")
  .attr("d", path)
  .style("fill", f => color(Math.sqrt(tripsOf(f))))
  .on("mousemove", (event, f) => {
    const p    = f.properties || {};
    const zone = nameKeys.map(k => p[k]).find(v => v) || `Zone ${p.LocationID ?? ""}`;
    const boro = boroKeys.map(k => p[k]).find(v => v) || "";

    // NEW: pull TripCount (coerce to number; tolerate tripCount lowercase)
    const trips = Number(p.TripCount ?? p.tripCount ?? 0);
    const tripsText = Number.isFinite(trips) ? trips.toLocaleString("en-US") : "0";

    d3.select("#tip")
      .style("left", (event.offsetX) + "px")
      .style("top",  (event.offsetY) + "px")
      .style("opacity", 1)
      .html(`${boro ? `<strong>${boro}</strong><br>` : ""}${zone}<br>Trips: ${tripsText}`);
    })
    .on("mouseleave", () => d3.select("#tip").style("opacity", 0));

  // Resize behavior
  window.addEventListener("resize", () => {
    const w2 = svg.node().clientWidth;
    if (mode === "geo") {
      const projection = d3.geoMercator().fitSize([w2, h], raw);
      path = d3.geoPath(projection);
    } else {
      const projection = d3.geoIdentity().reflectY(true).fitSize([w2, h], raw);
      path = d3.geoPath(projection);
    }
    g.selectAll("path.zone").attr("d", path);
    const b = path.bounds(raw);
    g.select("rect.bounds")
      .attr("x", b[0][0]).attr("y", b[0][1])
      .attr("width",  b[1][0]-b[0][0])
      .attr("height", b[1][1]-b[0][1]);
  }, { passive: true });

  // Console diagnostics
  console.log("Features:", raw.features?.length ?? 0);
  console.log("Bounds:", b, "Size:", [b[1][0]-b[0][0], b[1][1]-b[0][1]]);
})();
</script>

