const svg = document.getElementById("svg");
const viewport = document.getElementById("viewport");
const details = document.getElementById("details");
const searchInput = document.getElementById("search");
const linkModeToggle = document.getElementById("linkModeToggle");
const modeToggle = document.getElementById("modeToggle");
const domainFilter = document.getElementById("domainFilter");
const kindFilter = document.getElementById("kindFilter");
const taskFilter = document.getElementById("taskFilter");
const evidenceFilter = document.getElementById("evidenceFilter");
const facetLensButtons = [...document.querySelectorAll("[data-facet-lens]")];

const semanticGraph = buildSemanticGraph({
  data,
  concepts,
  relations,
  sources,
  drills,
  crossLinks,
  codeCards,
});
const laidOutGraph = computeSemanticLayout(semanticGraph);
const byId = new Map(laidOutGraph.nodes.map((node) => [node.id, node]));
const sourceById = new Map(
  semanticGraph.sources.map((source) => [source.id, source]),
);
const enrichedConceptIds = new Set(concepts.map((concept) => concept.id));
const semanticDegree = new Map(laidOutGraph.nodes.map((node) => [node.id, 0]));
for (const link of laidOutGraph.links) {
  semanticDegree.set(link.source, (semanticDegree.get(link.source) || 0) + 1);
  semanticDegree.set(link.target, (semanticDegree.get(link.target) || 0) + 1);
}
const drillsByConcept = new Map();
for (const drill of semanticGraph.drills) {
  if (!drillsByConcept.has(drill.concept))
    drillsByConcept.set(drill.concept, []);
  drillsByConcept.get(drill.concept).push(drill);
}

let transform = { x: 0, y: 0, k: 0.72 };
let dragging = false;
let last = null;
let selectedId = "root";
let linkMode = "primary";
let layoutMode = "semantic";
const activeFacetLenses = new Set();

const shortLabels = {
  root: "INF II",
  bubble: "Bubble",
  selection: "Select",
  insertion: "Insert",
  heapSort: "HeapSort",
  counting: "CountSort",
  quick: "Quick",
  merge: "Merge",
  xsort: "XSort",
  swap: "Swap",
  nestedloops: "Nested loops",
  directAddressing: "Direct addr.",
  frequencyArray: "Freq array",
  kthLargestStack: "kth Stack",
  selectionLogic: "Selection",
  auxiliaryStack: "Aux stack",
  stack: "Stack",
  queue: "Queue",
  bfs: "BFS",
  dfs: "DFS",
  khop: "k-hop",
  dijkstra: "Dijkstra",
  bellmanFord: "Bellman",
  dagSSSP: "DAG SSSP",
  negativeCycle: "Neg cycle",
  relaxation: "Relax",
  priorityQueue: "PQ",
  dpTemplate: "DP",
  helperTable: "Helper table",
  palCuts: "Pal cuts",
  heapify: "Heapify",
  buildHeap: "BuildHeap",
  heap: "Heap",
  bst: "BST",
  avl: "AVL",
  rotations: "AVL rot.",
  invariant: "Invariant",
  loopcount: "Loop count",
  recursion: "Recursion",
};

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function populateSelect(select, label, values, formatter = (x) => x) {
  if (!select) return;
  select.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = label;
  select.appendChild(all);
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = formatter(value);
    select.appendChild(option);
  }
}

function initFilters() {
  populateSelect(
    domainFilter,
    "All domains",
    unique(laidOutGraph.nodes.flatMap((node) => node.domains || [])).sort(),
  );
  populateSelect(
    kindFilter,
    "All kinds",
    unique(laidOutGraph.nodes.map((node) => node.kind)).sort(),
  );
  populateSelect(
    taskFilter,
    "All task types",
    Object.keys(semanticGraph.taskTypes).sort(),
    (value) => semanticGraph.taskTypes[value] || value,
  );
  populateSelect(
    evidenceFilter,
    "All evidence",
    semanticGraph.sources.map((source) => source.id).sort(),
  );
}

function applyTransform() {
  viewport.setAttribute(
    "transform",
    `translate(${transform.x},${transform.y}) scale(${transform.k})`,
  );
}

function nodeRadiusFor(node) {
  if (node.id === "root") return 92;
  const base =
    node.kind === "mechanism"
      ? 62
      : node.kind === "proofPattern" || node.kind === "dataStructure"
        ? 56
        : node.kind === "examPattern"
          ? 42
          : 50;
  return base + Math.min(26, Math.sqrt(node.priority || 0.1) * 10);
}

function nodeLayout(node) {
  const r = nodeRadiusFor(node);
  const priorityBoost = Math.min(42, Math.sqrt(node.priority || 0.1) * 12);
  const hierarchyBoost =
    node.kind === "mechanism"
      ? 28
      : node.kind === "proofPattern" || node.kind === "dataStructure"
        ? 16
        : node.kind === "examPattern"
          ? -18
          : 0;
  const label = displayLabel(node);
  const lines = wrap(label, node.id === "root" ? 12 : 13, 2);
  const longest = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const w =
    node.id === "root"
      ? 210
      : Math.max(118, Math.min(210, longest * 9 + 58 + hierarchyBoost));
  const h =
    node.id === "root"
      ? 110
      : 66 + Math.min(22, priorityBoost / 2) + Math.max(0, hierarchyBoost / 4);
  return { r, w, h, lines, lineHeight: node.id === "root" ? 20 : 16 };
}

function wrap(text, max, maxLines = 3) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const part = word.length > max ? word.slice(0, max - 1) + "." : word;
    const next = `${line} ${part}`.trim();
    if (next.length > max && line) {
      lines.push(line);
      line = part;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = kept[maxLines - 1].replace(/\.*$/, ".");
  return kept;
}

function boundsForNodes(nodes) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const node of nodes) {
    const { w, h } = nodeLayout(node);
    minX = Math.min(minX, node.x - w / 2);
    minY = Math.min(minY, node.y - h / 2);
    maxX = Math.max(maxX, node.x + w / 2);
    maxY = Math.max(maxY, node.y + h / 2);
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function centerView(nodes = null) {
  const rect = svg.getBoundingClientRect();
  const bounds = boundsForNodes(nodes || defaultFitNodes());
  const paddingX = Math.min(190, Math.max(80, rect.width * 0.1));
  const paddingY = Math.min(160, Math.max(86, rect.height * 0.14));
  const fitX = (rect.width - paddingX * 2) / Math.max(1, bounds.width);
  const fitY = (rect.height - paddingY * 2) / Math.max(1, bounds.height);
  transform.k = Math.max(0.24, Math.min(0.86, fitX, fitY));
  transform.x = rect.width / 2 - (bounds.minX + bounds.width / 2) * transform.k;
  transform.y =
    rect.height / 2 - (bounds.minY + bounds.height / 2) * transform.k;
  applyTransform();
}

function selectedSourceFromQuery(query) {
  if (!query) return null;
  const q = query.toLowerCase();
  return semanticGraph.sources.find(
    (source) =>
      source.id.toLowerCase() === q ||
      source.id.toLowerCase().includes(q) ||
      source.title.toLowerCase().includes(q),
  );
}

function nodeSearchText(node) {
  const card = node.card && codeCards[node.card] ? codeCards[node.card] : null;
  return JSON.stringify({
    id: node.id,
    label: node.label,
    kind: node.kind,
    domains: node.domains,
    mechanisms: node.mechanisms,
    representations: node.representations,
    proofPatterns: node.proofPatterns,
    facets: node.facets,
    taskTypes: node.taskTypes,
    evidence: node.evidence,
    summary: node.summary,
    state: node.state,
    runtime: node.runtime,
    invariant: node.invariant,
    card,
  }).toLowerCase();
}

function displayLabel(node) {
  if (node.shortName) return node.shortName;
  if (shortLabels[node.id]) return shortLabels[node.id];
  const label = node.label || node.id;
  if (transform.k >= 1) return label;
  return label
    .replace(/\bSort\b/g, "")
    .replace(/\balgorithm\b/gi, "")
    .replace(/\bdynamic programming\b/gi, "DP")
    .replace(/\bpriority queue\b/gi, "PQ")
    .replace(/\bdirect addressing\b/gi, "Direct addr.")
    .trim();
}

function filterMatch(node) {
  const domain = domainFilter && domainFilter.value;
  const kind = kindFilter && kindFilter.value;
  const task = taskFilter && taskFilter.value;
  const evidence = evidenceFilter && evidenceFilter.value;
  if (domain && !(node.domains || []).includes(domain)) return false;
  if (kind && node.kind !== kind) return false;
  if (task && !(node.taskTypes || []).includes(task)) return false;
  if (evidence && !(node.evidence || []).includes(evidence)) return false;
  return true;
}

function lensFacetKeys(facet) {
  return facet === "cPattern" ? ["cPattern", "pseudocodePattern"] : [facet];
}

function nodeMatchesActiveLens(node) {
  if (!activeFacetLenses.size) return false;
  for (const facet of activeFacetLenses) {
    for (const key of lensFacetKeys(facet)) {
      if ((node.facets?.[key] || []).length) return true;
    }
  }
  return false;
}

function relationMatchesActiveLens(link) {
  if (!activeFacetLenses.size) return false;
  const linkFacets = new Set(link.facets || []);
  for (const facet of activeFacetLenses) {
    for (const key of lensFacetKeys(facet)) {
      if (linkFacets.has(key)) return true;
    }
  }
  return false;
}

function activeDomainFilter() {
  return domainFilter && domainFilter.value ? domainFilter.value : "";
}

function activeContext() {
  const q = searchInput.value.trim().toLowerCase();
  const source = selectedSourceFromQuery(q) || null;
  const directMatches = new Set();
  const highlighted = new Set();
  const hasFilter =
    (domainFilter && domainFilter.value) ||
    (kindFilter && kindFilter.value) ||
    (taskFilter && taskFilter.value) ||
    (evidenceFilter && evidenceFilter.value) ||
    activeFacetLenses.size;

  for (const node of laidOutGraph.nodes) {
    const matchesSource = source && (source.concepts || []).includes(node.id);
    const matchesText = q && nodeSearchText(node).includes(q);
    const matchesFilter = filterMatch(node);
    const matchesLens = nodeMatchesActiveLens(node);
    if (
      matchesSource ||
      matchesText ||
      matchesLens ||
      (!q && hasFilter && matchesFilter)
    ) {
      directMatches.add(node.id);
      highlighted.add(node.id);
    }
  }

  for (const link of laidOutGraph.links) {
    if (directMatches.has(link.source)) highlighted.add(link.target);
    if (directMatches.has(link.target)) highlighted.add(link.source);
    if (relationMatchesActiveLens(link)) {
      highlighted.add(link.source);
      highlighted.add(link.target);
    }
  }

  const hasContext = Boolean(q || hasFilter);
  return { q, source, directMatches, highlighted, hasContext };
}

function shouldDim(node, context) {
  if (!context.hasContext) return false;
  return !context.highlighted.has(node.id);
}

function isLocalToSelected(id) {
  if (selectedId === "root") return false;
  return laidOutGraph.links.some(
    (link) =>
      (link.source === selectedId && link.target === id) ||
      (link.target === selectedId && link.source === id),
  );
}

function shouldShowInSemantic(node, context) {
  if (node.id === "root" || node.id === selectedId) return true;
  if (isLocalToSelected(node.id)) return true;
  if (context.highlighted.has(node.id)) return true;
  if (context.hasContext) return false;
  if (transform.k < 0.46) {
    return (
      node.anchor ||
      (enrichedConceptIds.has(node.id) &&
        ["mechanism", "proofPattern", "dataStructure"].includes(node.kind)) ||
      (node.priority || 0) >= 1.4
    );
  }
  if (enrichedConceptIds.has(node.id)) return true;
  if (
    transform.k >= 1.05 &&
    (node.card || (semanticDegree.get(node.id) || 0) >= 2)
  ) {
    return true;
  }
  if ((node.priority || 0) >= 0.8) return true;
  if ((semanticDegree.get(node.id) || 0) >= 4) return true;
  return false;
}

function defaultFitNodes() {
  if (layoutMode === "syllabus") {
    return laidOutGraph.nodes.filter(
      (node) => node.id === "root" || node.parent,
    );
  }
  const context = {
    directMatches: new Set(),
    highlighted: new Set(),
    hasContext: false,
  };
  return laidOutGraph.nodes.filter((node) =>
    shouldShowInSemantic(node, context),
  );
}

function isPrimaryRelation(link) {
  const structural = [
    "usesMechanism",
    "prerequisite",
    "sameRepresentation",
    "sameStatePattern",
    "sameProofPattern",
  ].includes(link.type);
  return structural && (link.weight || 0) >= 0.68;
}

function relationClass(link) {
  const evidence = (link.evidence || []).some((id) =>
    String(id).startsWith("FS"),
  );
  return `relation relation-${link.type} ${evidence ? "relationEvidence" : ""} ${
    isSelectedRelation(link) ? "selectedRelation" : ""
  } ${relationMatchesActiveLens(link) ? "facetLensRelation" : ""}`;
}

function shouldShowRelation(link, context) {
  if (linkMode === "off") return isSelectedRelation(link);
  if (isSelectedRelation(link)) return true;
  if (linkMode === "primary") {
    return (
      isPrimaryRelation(link) ||
      context.directMatches.has(link.source) ||
      context.directMatches.has(link.target)
    );
  }
  if (linkMode === "selected") {
    return (
      context.directMatches.has(link.source) ||
      context.directMatches.has(link.target)
    );
  }
  return true;
}

function isSelectedRelation(link) {
  return (
    selectedId !== "root" &&
    (link.source === selectedId || link.target === selectedId)
  );
}

function nodeClass(node, context) {
  const classes = ["node", "semanticNode", `kind-${node.kind}`];
  for (const domain of node.domains || []) classes.push(`domain-${domain}`);
  if (node.id === selectedId) classes.push("selected");
  if (node.card && codeCards[node.card]) classes.push("hasCode");
  if (context.directMatches.has(node.id)) classes.push("match");
  if (nodeMatchesActiveLens(node)) classes.push("facetLensMatch");
  if (shouldDim(node, context)) classes.push("dimmed");
  if (node.generated) classes.push("generated");
  if (node.anchor) classes.push("anchored");
  return classes.join(" ");
}

function polyPoints(w, h, cut = 16) {
  return `${-w / 2 + cut},${-h / 2} ${w / 2},${-h / 2} ${w / 2 - cut},${
    h / 2
  } ${-w / 2},${h / 2}`;
}

function render() {
  const context = activeContext();
  viewport.innerHTML = "";

  const clusterG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const linkG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const labelG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  viewport.append(clusterG, linkG, labelG, nodeG);

  const visibleNodes =
    layoutMode === "syllabus"
      ? laidOutGraph.nodes.filter((node) => node.id === "root" || node.parent)
      : laidOutGraph.nodes.filter((node) =>
          shouldShowInSemantic(node, context),
        );
  const visibleIds = new Set(visibleNodes.map((node) => node.id));

  if (layoutMode === "semantic") {
    renderClusters(clusterG, visibleNodes);
  }

  for (const link of laidOutGraph.links) {
    if (!visibleIds.has(link.source) || !visibleIds.has(link.target)) continue;
    if (!shouldShowRelation(link, context)) continue;
    const source = byId.get(link.source);
    const target = byId.get(link.target);
    if (!source || !target) continue;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const mx = (source.x + target.x) / 2;
    const my = (source.y + target.y) / 2;
    const bend = Math.min(50, Math.hypot(dx, dy) * 0.12);
    const cx = mx - (dy / (Math.hypot(dx, dy) || 1)) * bend;
    const cy = my + (dx / (Math.hypot(dx, dy) || 1)) * bend;
    path.setAttribute(
      "d",
      `M ${source.x} ${source.y} Q ${cx} ${cy} ${target.x} ${target.y}`,
    );
    path.setAttribute("class", relationClass(link));
    path.setAttribute("stroke-width", 1.1 + Math.min(4, link.weight * 2.2));
    if (
      isSelectedRelation(link) ||
      (context.directMatches.has(link.source) &&
        context.directMatches.has(link.target))
    ) {
      path.classList.add("activeContext");
    }
    linkG.appendChild(path);

    if (
      (isSelectedRelation(link) || transform.k >= 0.95) &&
      link.label &&
      linkMode !== "off"
    ) {
      if (transform.k >= 0.82) {
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        text.setAttribute("class", "relationLabel");
        text.setAttribute("x", cx);
        text.setAttribute("y", cy);
        text.textContent = link.label;
        labelG.appendChild(text);
      }
    }
  }

  for (const node of visibleNodes) {
    const layout = nodeLayout(node);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", nodeClass(node, context));
    group.setAttribute("transform", `translate(${node.x},${node.y})`);
    group.style.cursor = "pointer";
    group.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedId = node.id;
      showDetails(node);
      render();
    });
    group.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      selectedId = node.id;
      centerOnNode(node.id);
      if (node.card && codeCards[node.card]) openCodePanel(node.id);
    });

    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    shape.setAttribute(
      "points",
      polyPoints(layout.w, layout.h, node.id === "root" ? 30 : 17),
    );
    group.appendChild(shape);

    const labelLines = wrap(
      displayLabel(node),
      node.id === "root" ? 12 : 13,
      2,
    );
    labelLines.forEach((line, index) => {
      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      title.setAttribute("class", "title");
      title.setAttribute(
        "y",
        -6 + (index - (labelLines.length - 1) / 2) * layout.lineHeight,
      );
      title.textContent = line;
      group.appendChild(title);
    });

    if (transform.k >= 0.78) {
      const small = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      small.setAttribute("class", "small");
      small.setAttribute("y", layout.h / 2 - 10);
      const tag =
        node.card && codeCards[node.card] ? "CODE" : node.kind || "concept";
      small.textContent = tag.toUpperCase();
      group.appendChild(small);
    }

    nodeG.appendChild(group);
  }

  applyTransform();
  updateModeButton();
  updateLinkModeButton();
  updateFacetLensButtons();
}

function renderClusters(clusterG, visibleNodes) {
  const visibleDomains = new Set(
    visibleNodes.flatMap((node) => node.domains || []),
  );
  const selectedDomain = activeDomainFilter();
  for (const cluster of semanticClusters || []) {
    const clusterDomains = cluster.domains || [cluster.id];
    const hasVisibleNode = clusterDomains.some((domain) =>
      visibleDomains.has(domain),
    );
    if (!hasVisibleNode && selectedDomain) continue;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute(
      "class",
      `clusterGroup ${
        selectedDomain && !clusterDomains.includes(selectedDomain)
          ? "clusterMuted"
          : ""
      }`,
    );
    group.setAttribute(
      "transform",
      `translate(${cluster.x},${cluster.y}) rotate(${cluster.rotate || 0})`,
    );

    const field = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    field.setAttribute("class", "clusterField");
    field.setAttribute("points", clusterPoints(cluster.rx, cluster.ry));
    field.setAttribute("data-cluster", cluster.id);
    group.appendChild(field);

    const rail = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    rail.setAttribute("class", "clusterRail");
    rail.setAttribute(
      "points",
      `${-cluster.rx + 38},${-cluster.ry + 18} ${cluster.rx - 34},${-cluster.ry + 18}`,
    );
    group.appendChild(rail);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("class", "clusterLabel");
    label.setAttribute("x", -cluster.rx + 32);
    label.setAttribute("y", -cluster.ry + 34);
    label.textContent = cluster.label;
    group.appendChild(label);
    clusterG.appendChild(group);
  }
}

function clusterPoints(rx, ry) {
  const cutX = Math.min(86, rx * 0.22);
  const cutY = Math.min(58, ry * 0.22);
  return [
    `${-rx + cutX},${-ry}`,
    `${rx},${-ry}`,
    `${rx - cutX},${ry}`,
    `${-rx},${ry}`,
    `${-rx + cutX * 0.35},${-ry + cutY}`,
  ].join(" ");
}

function htmlList(title, items, mapper = (item) => item) {
  const clean = unique(items || []);
  if (!clean.length) return "";
  return `<div class="section-title">${title}</div><ul>${clean
    .map((item) => `<li>${mapper(item)}</li>`)
    .join("")}</ul>`;
}

function facetList(title, items) {
  const clean = unique(items || []);
  if (!clean.length) return "";
  return `<div class="facet-section"><div class="section-title">${title}</div><ul>${clean
    .map((item) => `<li>${escapeHTML(item)}</li>`)
    .join("")}</ul></div>`;
}

function pillList(items, mapper = (item) => item) {
  return unique(items || [])
    .map((item) => `<span class="pill">${mapper(item)}</span>`)
    .join("");
}

function relationGroupsFor(id) {
  const groups = new Map();
  for (const link of laidOutGraph.links) {
    if (link.source !== id && link.target !== id) continue;
    const otherId = link.source === id ? link.target : link.source;
    const other = byId.get(otherId);
    if (!other) continue;
    if (!groups.has(link.type)) groups.set(link.type, []);
    groups.get(link.type).push({ other, link });
  }
  return [...groups.entries()];
}

function evidenceItems(node) {
  return unique(node.evidence || [])
    .map((id) => sourceById.get(id))
    .filter(Boolean);
}

function showDetails(node) {
  const cardId = node.card || node.id;
  const hasCode = Boolean(codeCards[cardId]);
  const evidence = evidenceItems(node);
  const nodeDrills = drillsByConcept.get(node.id) || [];
  const facets = node.facets || {};
  const relationsHtml = relationGroupsFor(node.id)
    .map(([type, items]) => {
      const links = items
        .slice(0, 12)
        .map(
          ({ other, link }) =>
            `<li><button class="text-link" data-jump="${other.id}">${other.label}</button> <span class="muted">(${link.label || type}, ${Number(link.weight).toFixed(2)})</span></li>`,
        )
        .join("");
      return `<div class="section-title">${type}</div><ul>${links}</ul>`;
    })
    .join("");

  details.innerHTML = `
    <h2>${escapeHTML(node.label || node.id)}</h2>
    <p>${escapeHTML(node.summary || "Semantic concept awaiting enrichment.")}</p>
    <div class="meta">
      ${pillList([node.kind || "concept"])}
      ${pillList(node.domains)}
      ${hasCode ? '<span class="pill">C / PSEUDOCODE</span>' : ""}
      <span class="pill">priority ${Number(node.priority || 0).toFixed(1)}</span>
    </div>
    ${htmlList("State", node.state)}
    ${facetList("Representation", facets.representation)}
    ${facetList("C / Pseudocode Pattern", [
      ...(facets.cPattern || []),
      ...(facets.pseudocodePattern || []),
    ])}
    ${facetList("Mechanism", facets.mechanism)}
    ${facetList("Invariant / Runtime", facets.proofRuntime)}
    ${facetList("Exam Forms", facets.examForm)}
    ${htmlList("Edge cases", node.edgeCases)}
    ${
      evidence.length
        ? `<div class="section-title">Evidence</div><ul>${evidence
            .map(
              (source) =>
                `<li><button class="text-link" data-source="${source.id}">${source.id}</button> ${escapeHTML(source.title)}</li>`,
            )
            .join("")}</ul>`
        : ""
    }
    ${
      nodeDrills.length
        ? `<div class="section-title">Drills</div><ul>${nodeDrills
            .map((drill) => `<li>${escapeHTML(drill.prompt)}</li>`)
            .join("")}</ul>`
        : ""
    }
    ${relationsHtml}
    ${
      hasCode
        ? `<div class="section-title">C Lab</div><button onclick="openCodePanel('${node.id}')">Open C / pseudocode</button>`
        : ""
    }
  `;
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureCodeModal() {
  let el = document.getElementById("codeModalBackdrop");
  if (el) return el;
  el = document.createElement("div");
  el.id = "codeModalBackdrop";
  el.className = "code-modal-backdrop";
  el.innerHTML = `<div class="code-modal"><div class="modal-head"><div><h2 id="codeTitle"></h2><div class="code-sub" id="codeKind"></div></div><button class="close-code" onclick="closeCodePanel()">Close</button></div><div class="code-note" id="codeNote"></div><div class="code-actions" id="codeActions"></div><pre><code id="codeBody"></code></pre></div>`;
  el.addEventListener("click", (event) => {
    if (event.target === el) closeCodePanel();
  });
  document.body.appendChild(el);
  return el;
}

function openCodePanel(id) {
  const node = byId.get(id);
  const cardId = (node && node.card) || id;
  const card = codeCards[cardId];
  if (!card) return;
  const el = ensureCodeModal();
  document.getElementById("codeTitle").textContent = card.title;
  document.getElementById("codeKind").textContent = card.kind;
  document.getElementById("codeNote").textContent = card.note;
  document.getElementById("codeBody").innerHTML = escapeHTML(card.code);
  const actions = document.getElementById("codeActions");
  actions.innerHTML = "";
  for (const dep of card.deps || []) {
    const target = byId.get(dep);
    if (!target) continue;
    const button = document.createElement("button");
    button.className = "code-link-btn";
    button.textContent = `Jump to ${target.label}`;
    button.onclick = () => jumpToNode(dep, true);
    actions.appendChild(button);
  }
  el.classList.add("open");
}

function closeCodePanel() {
  const el = document.getElementById("codeModalBackdrop");
  if (el) el.classList.remove("open");
}

function centerOnNode(id) {
  const node = byId.get(id);
  if (!node) return;
  const rect = svg.getBoundingClientRect();
  transform.x = rect.width / 2 - node.x * transform.k;
  transform.y = rect.height / 2 - node.y * transform.k;
  applyTransform();
}

function jumpToNode(id, openCode = false) {
  const node = byId.get(id);
  if (!node) return;
  selectedId = id;
  showDetails(node);
  render();
  centerOnNode(id);
  if (openCode) openCodePanel(id);
}

function updateLinkModeButton() {
  if (!linkModeToggle) return;
  const labels = {
    primary: "Primary lines",
    off: "Links off",
    selected: "Local lines",
    all: "All links",
  };
  linkModeToggle.textContent = labels[linkMode];
}

function cycleLinkMode() {
  linkMode =
    linkMode === "primary"
      ? "selected"
      : linkMode === "selected"
        ? "all"
        : linkMode === "all"
          ? "off"
          : "primary";
  render();
}

function updateModeButton() {
  if (!modeToggle) return;
  modeToggle.textContent =
    layoutMode === "semantic" ? "Semantic mode" : "Syllabus mode";
}

function updateFacetLensButtons() {
  for (const button of facetLensButtons) {
    const lens = button.getAttribute("data-facet-lens");
    button.classList.toggle("active", activeFacetLenses.has(lens));
  }
}

function toggleMode() {
  layoutMode = layoutMode === "semantic" ? "syllabus" : "semantic";
  render();
}

function resetFilters() {
  if (domainFilter) domainFilter.value = "";
  if (kindFilter) kindFilter.value = "";
  if (taskFilter) taskFilter.value = "";
  if (evidenceFilter) evidenceFilter.value = "";
  activeFacetLenses.clear();
  updateFacetLensButtons();
  searchInput.value = "";
  selectedId = "root";
  showDetails(byId.get("root"));
  render();
  centerView();
}

details.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const jump = event.target.closest("[data-jump]");
  if (jump) {
    jumpToNode(jump.getAttribute("data-jump"));
    return;
  }
  const source = event.target.closest("[data-source]");
  if (source) {
    searchInput.value = source.getAttribute("data-source");
    render();
    return;
  }
});

if (linkModeToggle) linkModeToggle.onclick = cycleLinkMode;
if (modeToggle) modeToggle.onclick = toggleMode;
for (const button of facetLensButtons) {
  button.onclick = () => {
    const lens = button.getAttribute("data-facet-lens");
    if (activeFacetLenses.has(lens)) activeFacetLenses.delete(lens);
    else activeFacetLenses.add(lens);
    updateFacetLensButtons();
    render();
  };
}
document.getElementById("expandAll").onclick = resetFilters;
document.getElementById("collapseAll").onclick = () => {
  layoutMode = "semantic";
  linkMode = "primary";
  selectedId = "root";
  render();
  centerView();
};
document.getElementById("resetView").onclick = () => {
  centerView();
  render();
};

for (const select of [domainFilter, kindFilter, taskFilter, evidenceFilter]) {
  if (select) select.addEventListener("change", render);
}

searchInput.addEventListener("input", render);

svg.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const scale = event.deltaY < 0 ? 1.08 : 0.92;
    const rect = svg.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    const old = transform.k;
    const next = Math.max(0.18, Math.min(2.4, old * scale));
    transform.x = mx - (mx - transform.x) * (next / old);
    transform.y = my - (my - transform.y) * (next / old);
    transform.k = next;
    render();
  },
  { passive: false },
);

svg.addEventListener("mousedown", (event) => {
  dragging = true;
  last = { x: event.clientX, y: event.clientY };
  svg.classList.add("dragging");
});

window.addEventListener("mousemove", (event) => {
  if (!dragging) return;
  transform.x += event.clientX - last.x;
  transform.y += event.clientY - last.y;
  last = { x: event.clientX, y: event.clientY };
  applyTransform();
});

window.addEventListener("mouseup", () => {
  dragging = false;
  svg.classList.remove("dragging");
});

svg.addEventListener("click", () => {
  selectedId = "root";
  showDetails(byId.get("root"));
  render();
});

window.addEventListener("resize", () => {
  centerView();
  render();
});

initFilters();
updateLinkModeButton();
updateModeButton();
showDetails(byId.get("root"));
centerView();
render();
