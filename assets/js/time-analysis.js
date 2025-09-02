// ---- SETTINGS (edit these to match exact years) ----
const YEAR_START = 1997, YEAR_END = 2025;
const Y_BOTTOM = 340;     // baseline in your SVG
const Y_DEV_TOP = 110;    // Dev max (your green top)
const Y_DBA_TOP = 162;    // DBA top used in your path
const Y_ETL_TOP = 154;    // ETL top used in your path
// Helper: maps [0..1] intensity to y-pixel
const Y = (intensity, top) => intensity === 0 ? Y_BOTTOM : Math.round(top + (1-intensity)*(Y_BOTTOM-top));

// ---- ROLE INTENSITIES (fill these once; 0..1) ----
// Keep this short and readable. Ranges are inclusive of start, exclusive of end (like [start, end)).
const roles = [
  // yearStart, yearEnd, dev, dba, etl
  // Choice Hotels — Dev + DBA only, no ETL
  [2006, 2008, 0.9, 0.9, 0.0],
  // GCU rescue (short spike) — Dev + DBA
  [2008, 2008.1, 0.8, 1.0, 0.0],
  // OnePoint — sustained Dev + DBA (HL7 pipelines optional: if you want ETL, set to 0.3–0.5)
  [2009, 2014, 0.9, 0.9, 0.5],
  // Best IT — ETL + Dev, no DBA
  [2014, 2016, 0.7, 0.0, 0.8],
  // Charles Schwab — Dev only (no DBA, no ETL)
  [2016, 2018, 0.9, 0.0, 0.0],
  // Cornerstone — Dev rises again
  [2018, 2021, 1.0, 0.2, 0.2],
  // 2021–present — Dev + Analysis maintained; DBA ends 2021; ETL off
  [2021, 2025, 0.9, 0.0, 0.0]
];

// ---- BUILD YEARLY SERIES ----
const years = [];
for (let y = YEAR_START; y <= YEAR_END; y++) years.push(y);

const dev = years.map(()=>0), dba = years.map(()=>0), etl = years.map(()=>0);
for (const [a,b,dv,db,et] of roles) {
  for (let y=Math.max(YEAR_START, Math.floor(a)); y < Math.min(YEAR_END, Math.ceil(b)); y++) {
    const i = y - YEAR_START;
    dev[i] = Math.max(dev[i], dv);
    dba[i] = Math.max(dba[i], db);
    etl[i] = Math.max(etl[i], et);
  }
}

// ---- MAP YEARS → X COORDS MATCHING YOUR SVG (70..980) ----
const X0 = 70, X1 = 980, span = (X1 - X0) / (YEAR_END - YEAR_START);
const X = y => Math.round(X0 + (y - YEAR_START) * span);

// ---- MAKE PATH/POINT STRINGS (match your structure) ----
function toPolyline(series, topY) {
  return years.map((yr, idx) => `${X(yr)},${Y(series[idx], topY)}`).join(' ');
}
function toArea(series, topY, endX) {
  const up = years.map((yr, idx) => `${X(yr)} ${Y(series[idx], topY)}`).join(' ');
  return `M${X0} ${Y_BOTTOM} L${up} L${endX} ${Y_BOTTOM} Z`;
}

// ---- OUTPUT (copy these into your SVG) ----
const devLine   = toPolyline(dev, Y_DEV_TOP);
const dbaLine   = toPolyline(dba, Y_DBA_TOP);
const etlLine   = toPolyline(etl, Y_ETL_TOP);
const devFill   = toArea(dev, Y_DEV_TOP, X1);
const dbaFill   = toArea(dba, Y_DBA_TOP, X(2021));  // DBA ends 2021
const etlFill   = toArea(etl, Y_ETL_TOP, X(2021));  // ETL ends 2021

console.log('DEV FILL:\n', devFill);
console.log('DEV LINE:\n', devLine);
console.log('DBA FILL:\n', dbaFill);
console.log('DBA LINE:\n', dbaLine);
console.log('ETL FILL:\n', etlFill);
console.log('ETL LINE:\n', etlLine);

window.__timeAnalysis = { devFill, devLine, dbaFill, dbaLine, etlFill, etlLine };

