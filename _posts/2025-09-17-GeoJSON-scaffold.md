---
layout: single
title: "Using GeoJSON MultiPolygon and D3.js"
excerpt: "GeoJSON scaffolding"
date: 2025-09-18
classes: center-page
sidebar: false
toc: false
author_profile: false
description: "GeoJSON scaffolding"
tags: [GeoJSON, D3.js]
header:
  overlay_color: "#000"
  overlay_filter: "0.75"
  overlay_image: /assets/images/default-overlay.jpg
---

<div id="map-wrap">
  <svg id="map" width="720" height="520" aria-label="NYC Taxi Zones"></svg>
  <div id="tip" style="position:absolute; pointer-events:none; opacity:0;"></div>
</div>

<style>
  #map-wrap { position: relative; margin: 2rem auto; max-width: 720px; }
  #map { display:block; width:100%; height:auto; background: transparent; }
  .zone { fill: #efefef; stroke: #2b6cb0; stroke-width: 1.25; vector-effect: non-scaling-stroke; }
  path.zone:hover { fill: #2b6cb0; }
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

  const url = "/assets/data/taxi_zones_4326.geojson"; // <-- your file
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

  // --- Render ------------------------------------------------------
  g.selectAll("path.zone")
    .data(raw.features)
    .join("path")
    .attr("class", "zone")
    .attr("d", path)
    .on("mousemove", (event, f) => {
      const p = f.properties || {};
      const zone = nameKeys.map(k => p[k]).find(v => v) || `Zone ${p.LocationID ?? ""}`;
      const boro = boroKeys.map(k => p[k]).find(v => v) || "";
      d3.select("#tip")
        .style("left", (event.offsetX) + "px")
        .style("top",  (event.offsetY) + "px")
        .style("opacity", 1)
        .html(`${boro ? `<strong>${boro}</strong><br>` : ""}${zone}`);
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
