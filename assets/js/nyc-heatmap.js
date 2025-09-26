// assets/js/nyc-heatmap.js

function domById(id){ return document.getElementById(id); }
function qs(sel, scope){ return (scope||document).querySelector(sel); }
function qsa(sel, scope){ return [...(scope||document).querySelectorAll(sel)]; }

(async function () {
  const container = d3.select("#nyc-heatmap");
  const w = Math.min(960, container.node().getBoundingClientRect().width || 960);
  const h = Math.round(w * 0.9);

  const svg = container.append("svg")
    .attr("viewBox", [0, 0, w, h])
    .attr("role", "img");

  const tooltip = container.append("div").attr("class", "tooltip");

  const geoUrl  = '{{ "/assets/data/taxi_zones_4326.geojson" | relative_url }}';
  const dataUrl = '{{ "/assets/data/pickups_2024.json" | relative_url }}';

  const [geojson, raw] = await Promise.all([
    d3.json(geoUrl),
    d3.json(dataUrl)
  ]);

  let arr = [];
  if (Array.isArray(raw)) arr = raw;
  else if (Array.isArray(raw?.data)) arr = raw.data;
  else if (raw && typeof raw === "object") {
    arr = Object.entries(raw).map(([k, v]) => ({ LocationID: +k, count: +v }));
  }
  const byId = new Map(arr.map(d => [+d.LocationID, +d.count]));

  // Find the property name that represents the taxi zone LocationID
  const sampleProps = geojson.features?.[0]?.properties || {};
  const idProp = ["LocationID", "locationid", "location_id", "OBJECTID", "objectid"]
    .find(k => k in sampleProps) || "LocationID";

  // Projection that fits to container
  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);
  projection.fitSize([w, h], geojson);

  // Handle skew: sqrt scale improves readability when a few zones dominate
  const counts = arr.map(d => d.count).filter(Number.isFinite);
  const max = d3.max(counts) || 0;
  const color = d3.scaleSequential()
    .domain([0, Math.sqrt(max || 1)])
    .interpolator(d3.interpolateYlOrRd);

  // Draw zones
  svg.append("g")
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("class", "zone")
    .attr("d", path)
    .attr("fill", f => {
      const id = +f.properties[idProp];
      const v = byId.get(id) || 0;
      return color(Math.sqrt(v));
    })
    .on("mousemove", (event, f) => {
      const id = +f.properties[idProp];
      const v  = byId.get(id) || 0;
      const zone = f.properties.zone || f.properties.Zone || f.properties.name || `Zone ${id}`;
      const borough = f.properties.borough || f.properties.Borough || "";
      tooltip
        .style("left", event.offsetX + "px")
        .style("top",  event.offsetY + "px")
        .style("opacity", 1)
        .html(`<strong>${zone}</strong>${borough ? ` — ${borough}` : ""}<br>Pickups: ${v.toLocaleString()}`);
    })
    .on("mouseleave", () => tooltip.style("opacity", 0));

  // Legend (continuous)
  const legendWidth = 220, legendHeight = 10, legendMargin = 12;
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${w - legendWidth - legendMargin}, ${legendMargin})`);

  const legendCanvas = document.createElement("canvas");
  legendCanvas.width = legendWidth; legendCanvas.height = 1;
  const ctx = legendCanvas.getContext("2d");
  for (let i = 0; i < legendWidth; ++i) {
    const t = i / (legendWidth - 1);
    ctx.fillStyle = color(t * Math.sqrt(max || 1));
    ctx.fillRect(i, 0, 1, 1);
  }
  legend.append(() => {
    const img = new Image();
    img.src = legendCanvas.toDataURL();
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", img.src);
    image.setAttribute("width", legendWidth);
    image.setAttribute("height", legendHeight);
    return image;
  });

  const legendScale = d3.scaleLinear()
    .domain([0, max])
    .range([0, legendWidth]);

  const axis = d3.axisBottom(legendScale)
    .ticks(4)
    .tickFormat(d3.format(".2s"));

  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(axis)
    .call(g => g.select(".domain").remove());

  legend.append("text")
    .attr("x", 0).attr("y", -4)
    .attr("fill", "currentColor")
    .attr("font-weight", 600)
    .text("Pickups by Taxi Zone");
})();