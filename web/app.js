/* ============================================================
   Rendering + hand-rolled SVG charts. No dependencies.
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const SVGNS = "http://www.w3.org/2000/svg";
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

const el = (tag, attrs = {}, text) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
};

const fmtHour = ts => {
  const [d, t] = ts.split(" ");
  const [, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[+m - 1]} · ${t}`;
};

/* ---------------- icon set ---------------- */
const ICONS = {
  clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2v5l3.2 1.9"/>',
  window:   '<path d="M3.5 16.5 8 11l3.5 3.2L20.5 6"/><path d="M3.5 20.5h17"/><path d="M16.5 6h4v4"/>',
  wave:     '<path d="M3 9.5c2.6-3.4 5.1-3.4 7.6 0s5 3.4 7.6 0"/><path d="M3 15.5c2.6-3.4 5.1-3.4 7.6 0s5 3.4 7.6 0"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>',
  bolt:     '<path d="M13.5 2.5 4.8 13.4h6.1l-1.4 8.1 8.7-10.9h-6.1z"/>'
};
const icon = k => `<svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ""}</svg>`;

/* ---------------- repo links ---------------- */
["repoLinkNav", "repoLinkHero", "repoLinkFoot"].forEach(id => {
  const a = document.getElementById(id);
  if (a) a.href = DATA.repo;
});

/* ---------------- hero stats ---------------- */
(function heroStats() {
  const h = DATA.headline, d = DATA.dataset;
  const stats = [
    { v: h.accuracy.toFixed(2), u: "%",  l: "Test accuracy" },
    { v: h.r2.toFixed(5),       u: "",   l: "R² score" },
    { v: h.mae.toFixed(4),      u: "kW", l: "Mean abs. error" },
    { v: d.features,            u: "",   l: "Engineered features" }
  ];
  $("#heroStats").innerHTML = stats.map(s => `
    <div class="stat">
      <div class="stat-val">${s.v}${s.u ? `<span class="u">${s.u}</span>` : ""}</div>
      <div class="stat-lbl">${s.l}</div>
    </div>`).join("");
})();

/* ---------------- error profile ---------------- */
(function errorProfile() {
  const e = DATA.errorStats;
  const rows = [
    ["Mean absolute error", `${e.mae.toFixed(4)} kW`],
    ["Std. dev of error",   `${e.std.toFixed(4)} kW`],
    ["Largest single miss", `${e.max.toFixed(4)} kW`],
    ["Smallest miss",       `${e.min.toFixed(4)} kW`],
    ["Mean error",          `${e.meanPct.toFixed(2)} %`]
  ];
  $("#errList").innerHTML = rows
    .map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`).join("");
  $("#maxErr").textContent = `${e.max.toFixed(4)} kW`;
})();

/* ---------------- combined prediction series ---------------- */
const SERIES = [...DATA.predictions.windowA.rows, ...DATA.predictions.windowB.rows]
  .map(([ts, actual, pred]) => ({ ts, actual, pred, err: actual - pred }));
const BREAK = DATA.predictions.windowA.rows.length; // index where the two windows join

/* ---------------- line chart ---------------- */
function lineChart(host) {
  host.innerHTML = "";
  const W = Math.max(360, host.clientWidth), H = host.clientHeight || 320;
  const P = { t: 18, r: 16, b: 34, l: 46 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;

  const vals = SERIES.flatMap(d => [d.actual, d.pred]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.12;
  const yMin = Math.max(0, lo - pad), yMax = hi + pad;

  const x = i => P.l + (i / (SERIES.length - 1)) * iw;
  const y = v => P.t + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const C_ACT = cssVar("--c-actual"), C_PRED = cssVar("--c-pred"), C_BG = cssVar("--bg");

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet", role: "img" });
  svg.appendChild(el("title", {}, "Actual versus predicted hourly global active power"));

  // defs — area gradient
  const defs = el("defs");
  const grad = el("linearGradient", { id: "areaFade", x1: "0", y1: "0", x2: "0", y2: "1" });
  grad.appendChild(el("stop", { offset: "0%",   "stop-color": C_ACT, "stop-opacity": ".17" }));
  grad.appendChild(el("stop", { offset: "100%", "stop-color": C_ACT, "stop-opacity": "0" }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  // y gridlines
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const v = yMin + (i / ticks) * (yMax - yMin);
    const yy = y(v);
    svg.appendChild(el("line", { class: "ax-line", x1: P.l, x2: W - P.r, y1: yy, y2: yy }));
    svg.appendChild(el("text", { class: "ax-txt", x: P.l - 10, y: yy + 3.5, "text-anchor": "end" }, v.toFixed(1)));
  }
  svg.appendChild(el("text", {
    class: "ax-txt", x: 12, y: P.t + ih / 2, "text-anchor": "middle",
    transform: `rotate(-90 12 ${P.t + ih / 2})`
  }, "kW"));

  // window divider + labels
  const bx = (x(BREAK - 1) + x(BREAK)) / 2;
  svg.appendChild(el("line", { class: "divider", x1: bx, x2: bx, y1: P.t, y2: P.t + ih }));
  svg.appendChild(el("text", { class: "win-lbl", x: P.l + 2, y: H - 12 }, DATA.predictions.windowA.range.toUpperCase()));
  svg.appendChild(el("text", { class: "win-lbl", x: W - P.r - 2, y: H - 12, "text-anchor": "end" }, DATA.predictions.windowB.range.toUpperCase()));

  // paths, drawn per window so the time gap is never bridged by a line
  const seg = (from, to) => {
    const slice = SERIES.slice(from, to);
    const line = k => slice.map((d, i) => `${i ? "L" : "M"}${x(from + i).toFixed(2)},${y(d[k]).toFixed(2)}`).join(" ");
    const area = `${line("actual")} L${x(to - 1).toFixed(2)},${y(yMin)} L${x(from).toFixed(2)},${y(yMin)} Z`;
    svg.appendChild(el("path", { d: area, fill: "url(#areaFade)" }));
    // Actual sits underneath as a broad band; predicted rides on top as a thin dash.
    // The two series agree to ~0.004 kW, so without this they would occupy the same pixels.
    svg.appendChild(el("path", {
      d: line("actual"), fill: "none", stroke: C_ACT, "stroke-width": "5",
      "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".55"
    }));
    svg.appendChild(el("path", {
      d: line("pred"), fill: "none", stroke: C_PRED, "stroke-width": "1.7",
      "stroke-dasharray": "6 4", "stroke-linecap": "round", "stroke-linejoin": "round"
    }));
  };
  seg(0, BREAK);
  seg(BREAK, SERIES.length);

  // hover layer
  const hoverLine = el("line", { class: "hover-line", y1: P.t, y2: P.t + ih, opacity: "0" });
  const dotA = el("circle", { r: "4.5", fill: C_ACT,  stroke: C_BG, "stroke-width": "2", opacity: "0" });
  const dotP = el("circle", { r: "4.5", fill: C_PRED, stroke: C_BG, "stroke-width": "2", opacity: "0" });
  svg.append(hoverLine, dotA, dotP);

  const hit = el("rect", { class: "hit", x: P.l, y: P.t, width: iw, height: ih });
  svg.appendChild(hit);

  const tip = document.createElement("div");
  tip.className = "tip";
  host.append(svg, tip);

  const show = ev => {
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * W;
    let i = Math.round(((px - P.l) / iw) * (SERIES.length - 1));
    i = Math.max(0, Math.min(SERIES.length - 1, i));
    const d = SERIES[i], xi = x(i);

    hoverLine.setAttribute("x1", xi); hoverLine.setAttribute("x2", xi); hoverLine.setAttribute("opacity", "1");
    dotA.setAttribute("cx", xi); dotA.setAttribute("cy", y(d.actual)); dotA.setAttribute("opacity", "1");
    dotP.setAttribute("cx", xi); dotP.setAttribute("cy", y(d.pred));   dotP.setAttribute("opacity", "1");

    tip.innerHTML = `
      <div class="t-time">${fmtHour(d.ts)}</div>
      <div class="t-row"><span class="t-dot" style="background:${C_ACT}"></span>Actual&nbsp;&nbsp;<strong>${d.actual.toFixed(3)} kW</strong></div>
      <div class="t-row"><span class="t-dot" style="background:${C_PRED}"></span>Predicted&nbsp;&nbsp;<strong>${d.pred.toFixed(3)} kW</strong></div>
      <div class="t-row"><span class="t-dot" style="background:${cssVar("--accent-3")}"></span>Error&nbsp;&nbsp;<strong>${(d.err >= 0 ? "+" : "")}${d.err.toFixed(4)} kW</strong></div>`;
    tip.style.opacity = "1";
    tip.style.left = `${xi}px`;
    tip.style.top  = `${y(Math.max(d.actual, d.pred))}px`;
  };
  const hide = () => {
    tip.style.opacity = "0";
    [hoverLine, dotA, dotP].forEach(n => n.setAttribute("opacity", "0"));
  };
  hit.addEventListener("mousemove", show);
  hit.addEventListener("mouseleave", hide);
  hit.addEventListener("touchmove", e => { show(e.touches[0]); e.preventDefault(); }, { passive: false });
  hit.addEventListener("touchend", hide);

  // foot summary
  const errs = SERIES.map(d => Math.abs(d.err));
  $("#lineFoot").innerHTML = `
    <span>n = ${SERIES.length} hours</span>
    <span>load range ${Math.min(...SERIES.map(d => d.actual)).toFixed(2)} – ${Math.max(...SERIES.map(d => d.actual)).toFixed(2)} kW</span>
    <span>max |error| ${Math.max(...errs).toFixed(4)} kW</span>`;
}

/* ---------------- residual chart ---------------- */
function residualChart(host) {
  host.innerHTML = "";
  const W = Math.max(360, host.clientWidth), H = host.clientHeight || 210;
  const P = { t: 16, r: 16, b: 26, l: 46 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;

  const m = Math.max(...SERIES.map(d => Math.abs(d.err))) * 1.25;
  const x = i => P.l + (i / (SERIES.length - 1)) * iw;
  const y = v => P.t + ih / 2 - (v / m) * (ih / 2);

  const C_POS = cssVar("--c-resid-pos"), C_NEG = cssVar("--c-resid-neg"), C_AXIS = cssVar("--chart-axis");

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet", role: "img" });
  svg.appendChild(el("title", {}, "Prediction residuals per hour"));

  [m, m / 2, 0, -m / 2, -m].forEach(v => {
    const yy = y(v);
    svg.appendChild(el("line", {
      class: "ax-line", x1: P.l, x2: W - P.r, y1: yy, y2: yy,
      ...(v === 0 ? { stroke: C_AXIS } : {})
    }));
    svg.appendChild(el("text", { class: "ax-txt", x: P.l - 10, y: yy + 3.5, "text-anchor": "end" },
      (v >= 0 ? "+" : "") + v.toFixed(3)));
  });

  const bw = Math.max(3, (iw / SERIES.length) * 0.45);
  SERIES.forEach((d, i) => {
    const y0 = y(0), y1 = y(d.err);
    svg.appendChild(el("rect", {
      x: x(i) - bw / 2, y: Math.min(y0, y1), width: bw, height: Math.max(1.5, Math.abs(y1 - y0)),
      rx: 1.5, fill: d.err >= 0 ? C_POS : C_NEG, opacity: ".82"
    }));
  });

  const bx = (x(BREAK - 1) + x(BREAK)) / 2;
  svg.appendChild(el("line", { class: "divider", x1: bx, x2: bx, y1: P.t, y2: P.t + ih }));
  svg.appendChild(el("text", { class: "ax-txt", x: P.l, y: H - 8 }, "under-predicted ▲   over-predicted ▼   ·   kW"));

  host.appendChild(svg);
}

/* ---------------- pipeline ---------------- */
$("#pipelineList").innerHTML = DATA.pipeline.map(p => `
  <li class="pipe-item reveal">
    <span class="pipe-num">${p.step}</span>
    <div class="pipe-body">
      <h3>${p.title}</h3>
      <p>${p.detail}</p>
    </div>
    <span class="pipe-stat">${p.stat}</span>
  </li>`).join("");

/* ---------------- features ---------------- */
$("#featGrid").innerHTML = DATA.featureGroups.map(g => `
  <article class="feat reveal">
    ${icon(g.icon)}
    <h3>${g.title}</h3>
    <ul>${g.items.map(i => `<li>${i}</li>`).join("")}</ul>
  </article>`).join("");

/* ---------------- leaderboard + table ---------------- */
(function models() {
  const FLOOR = 82;                    // axis origin; announced in the chart note
  const CEIL  = 100;
  const width = acc => ((acc - FLOOR) / (CEIL - FLOOR)) * 100;

  $("#barChart").innerHTML = DATA.models.map((m, i) => `
    <div class="bar-row ${m.best ? "win" : ""}" style="--bc:var(--r${i + 1})">
      <span class="bar-rank">${String(i + 1).padStart(2, "0")}</span>
      <span class="bar-name">${m.name}${m.best ? '<span class="bar-chip">best</span>' : ""}</span>
      <span class="bar-track"><span class="bar-fill" data-w="${width(m.acc)}"></span></span>
      <span class="bar-val">${m.acc.toFixed(2)}<span class="pct">%</span></span>
    </div>`).join("")
    + `<div class="bar-axis"><span class="bar-axis-scale">
         <span>${FLOOR}%</span><span>88%</span><span>94%</span><span>${CEIL}%</span>
       </span></div>`;

  $("#modelTable tbody").innerHTML = DATA.models.map(m => `
    <tr class="${m.best ? "win" : ""}">
      <td>${m.name}${m.best ? '<span class="tag-best">best</span>' : ""}</td>
      <td>${m.mae.toFixed(4)}</td>
      <td>${m.rmse.toFixed(4)}</td>
      <td>${m.r2.toFixed(5)}</td>
      <td>${m.mape.toFixed(2)}%</td>
      <td>${m.acc.toFixed(2)}%</td>
    </tr>`).join("");
})();

/* ---------------- gallery ---------------- */
$("#galGrid").innerHTML = DATA.figures.map(f => `
  <button class="gal-item reveal" data-src="assets/figures/${f.file}" data-cap="${f.caption}">
    <img class="gal-img" src="assets/figures/${f.file}" alt="${f.title}" loading="lazy">
    <span class="gal-cap">
      <span class="gal-title">${f.title}</span>
      <span class="gal-desc">${f.caption}</span>
    </span>
  </button>`).join("");

/* ---------------- stack ---------------- */
$("#stackGrid").innerHTML = Object.entries(DATA.stack).map(([k, v]) => `
  <div class="stack-col reveal">
    <h3>${k}</h3>
    <div class="chips">${v.map(t => `<span class="chip">${t}</span>`).join("")}</div>
  </div>`).join("");

/* ---------------- lightbox ---------------- */
(function lightbox() {
  const box = $("#lightbox"), img = $("#lbImg"), cap = $("#lbCap");
  const close = () => { box.hidden = true; document.body.style.overflow = ""; };
  $$(".gal-item").forEach(b => b.addEventListener("click", () => {
    img.src = b.dataset.src;
    img.alt = b.querySelector("img").alt;
    cap.textContent = b.dataset.cap;
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }));
  $("#lbClose").addEventListener("click", close);
  box.addEventListener("click", e => { if (e.target === box) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) close(); });
})();

/* ---------------- scroll behaviour ---------------- */
addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", scrollY > 12), { passive: true });

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.14 });

/* stagger reveals within a group */
$$(".reveal").forEach((n, i) => { n.style.transitionDelay = `${(i % 6) * 55}ms`; io.observe(n); });

/* animate bars once the leaderboard scrolls in */
const fillBars = stagger => {
  $$("#barChart .bar-fill").forEach((b, i) => {
    if (b.style.width) return;                       // already filled
    setTimeout(() => { b.style.width = `${b.dataset.w}%`; }, stagger ? i * 90 : 0);
  });
};
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    fillBars(true);
    obs.unobserve(e.target);
  });
}, { threshold: 0.3 }).observe($("#barChart"));
/* Safety net: if the observer never fires (no scroll, print, headless capture),
   the bars still end up at their true width. */
setTimeout(() => fillBars(false), 1600);

/* ---------------- draw charts (and redraw on resize) ---------------- */
const drawCharts = () => {
  lineChart($("#lineChart"));
  residualChart($("#residChart"));
};
drawCharts();

let rt;
addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawCharts, 160); });

/* ---------------- theme ---------------- */
(function theme() {
  const KEY = "ef-theme";
  const root = document.documentElement;
  const btn = $("#themeBtn");

  const apply = t => {
    root.setAttribute("data-theme", t);
    btn.setAttribute("aria-label", `Switch to ${t === "dark" ? "light" : "dark"} theme`);
    btn.title = `Switch to ${t === "dark" ? "light" : "dark"} theme`;
    drawCharts();                       // SVG colours are baked in at draw time
  };

  apply(root.getAttribute("data-theme") || "dark");

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode — session only */ }
    apply(next);
  });

  /* Follow the OS only while the visitor has not chosen for themselves. */
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => {
    let chosen = null;
    try { chosen = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
    if (!chosen) apply(e.matches ? "light" : "dark");
  });
})();
