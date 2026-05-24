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

const structuralRelationTypes = new Set([
  "usesMechanism",
  "prerequisite",
  "sameRepresentation",
  "sameStatePattern",
  "sameProofPattern",
  "implementationSimilarity",
]);

const evidenceRelationTypes = new Set([
  "examCooccurrence",
  "evidenceCooccurrence",
  "taskPattern",
  "contrast",
]);

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
  const tier = visualTier(node);
  if (tier === "core") return node.id === "root" ? 108 : 84;
  if (tier === "hub") return 72;
  if (tier === "concept") return 58;
  return 18;
}

function nodeLayout(node, context = null) {
  const form = context
    ? effectiveVisualForm(node, context)
    : defaultVisualForm(node);
  const tier = visualTier(node);
  const label = displayLabel(node);
  const maxChars =
    form === "detailChip"
      ? 10
      : tier === "core"
        ? 15
        : form === "hubCard"
          ? 14
          : form === "conceptCard"
            ? 13
            : 11;
  const lines =
    form === "detailChip" ? wrap(label, maxChars, 1) : wrap(label, maxChars, 2);
  const longest = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const minWidth =
    form === "detailChip"
      ? Math.max(18, Math.min(48, longest * 4.8 + 14))
      : tier === "core"
        ? node.id === "root"
          ? 230
          : 182
        : form === "hubCard"
          ? 150
          : form === "conceptCard"
            ? 126
            : 96;
  const maxWidth =
    form === "detailChip"
      ? 48
      : tier === "core"
        ? 245
        : form === "hubCard"
          ? 200
          : form === "conceptCard"
            ? 170
            : 132;
  const w =
    form === "detailChip"
      ? minWidth
      : Math.max(minWidth, Math.min(maxWidth, longest * 9.2 + 52));
  const h =
    form === "detailChip"
      ? 24
      : tier === "core"
        ? node.id === "root"
          ? 118
          : 92
        : form === "hubCard"
          ? 80
          : form === "conceptCard"
            ? 68
            : 54;
  return {
    r: nodeRadiusFor(node),
    w,
    h,
    lines,
    form,
    lineHeight: tier === "core" ? 20 : form === "hubCard" ? 17 : 15,
  };
}

function nodeRank(node) {
  if (node.id === "root" || node.kind === "core") return "core";
  if (node.visualTier === "hub") return "major";
  if (node.visualTier === "concept") return "secondary";
  return "detail";
}

function visualTier(node) {
  if (node.id === "root" || node.kind === "core") return "core";
  return node.visualTier || "detail";
}

function defaultVisualForm(node) {
  const tier = visualTier(node);
  if (tier === "core" || tier === "hub") return "hubCard";
  if (tier === "concept") return "conceptCard";
  return "detailChip";
}

function effectiveVisualForm(node, context) {
  const tier = visualTier(node);
  if (tier === "core" || tier === "hub") return "hubCard";
  if (tier === "concept") return "conceptCard";
  const expanded =
    node.id === selectedId ||
    context.directMatches.has(node.id) ||
    context.circuit?.nodes.has(node.id) ||
    (context.hasContext && context.highlighted.has(node.id)) ||
    transform.k >= 1.85;
  return expanded ? "conceptCard" : "detailChip";
}

function shouldShowChipLabel(node, context) {
  return (
    transform.k >= 0.58 ||
    node.id === selectedId ||
    context.directMatches.has(node.id) ||
    context.circuit?.nodes.has(node.id)
  );
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
  return label
    .replace(/\bSort\b/g, "")
    .replace(/\balgorithm\b/gi, "")
    .replace(/\bdynamic programming\b/gi, "DP")
    .replace(/\bpriority queue\b/gi, "PQ")
    .replace(/\bdirect addressing\b/gi, "Direct addr.")
    .replace(/\bimplementation\b/gi, "impl.")
    .replace(/\brecurrence\b/gi, "rec.")
    .replace(/\bmaximum\b/gi, "max")
    .replace(/\bminimum\b/gi, "min")
    .replace(/\bdynamic\b/gi, "dyn.")
    .replace(/\boperation\b/gi, "op.")
    .replace(/\boperations\b/gi, "ops")
    .split(/\s+/)
    .slice(0, visualTier(node) === "detail" ? 3 : 4)
    .join(" ")
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
  const evidenceId = evidenceFilter && evidenceFilter.value;
  const source =
    (evidenceId && sourceById.get(evidenceId)) ||
    selectedSourceFromQuery(q) ||
    null;
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

  const circuit = localCircuitForSelected();
  const hasContext = Boolean(q || hasFilter);
  return {
    q,
    source,
    directMatches,
    highlighted,
    hasContext,
    circuit,
    hasCircuit: circuit.active,
  };
}

function shouldDim(node, context) {
  if (
    context.hasCircuit &&
    !context.circuit.nodes.has(node.id) &&
    !context.highlighted.has(node.id)
  ) {
    return true;
  }
  if (!context.hasContext) return false;
  return (
    !context.highlighted.has(node.id) && !context.circuit.nodes.has(node.id)
  );
}

function localCircuitForSelected() {
  const circuit = {
    active: selectedId !== "root",
    near: new Set(),
    far: new Set(),
    nodes: new Set(),
    links: new Set(),
  };
  if (!circuit.active) return circuit;

  circuit.nodes.add(selectedId);
  const directLinks = laidOutGraph.links
    .filter((link) => link.source === selectedId || link.target === selectedId)
    .filter(isImportantCircuitRelation)
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 16);

  for (const link of directLinks) {
    const other = link.source === selectedId ? link.target : link.source;
    circuit.near.add(other);
    circuit.nodes.add(other);
    circuit.links.add(linkKey(link));
  }

  for (const link of laidOutGraph.links) {
    if (!isImportantCircuitRelation(link)) continue;
    const sourceNear = circuit.near.has(link.source);
    const targetNear = circuit.near.has(link.target);
    if (!sourceNear && !targetNear) continue;
    const other = sourceNear ? link.target : link.source;
    if (other === selectedId || circuit.near.has(other)) continue;
    circuit.far.add(other);
    circuit.nodes.add(other);
    circuit.links.add(linkKey(link));
  }

  return circuit;
}

function linkKey(link) {
  return `${link.source}->${link.target}:${link.type}`;
}

function shouldShowInSemantic(node, context) {
  return !node.hidden && node.id !== "root";
}

function defaultFitNodes() {
  if (layoutMode === "syllabus") {
    return laidOutGraph.nodes.filter(
      (node) => node.id === "root" || node.parent,
    );
  }
  return laidOutGraph.nodes.filter(
    (node) => !node.hidden && node.id !== "root",
  );
}

function isPrimaryRelation(link) {
  const structural = structuralRelationTypes.has(link.type);
  return structural && (link.weight || 0) >= 0.62;
}

function isMacroPrimaryRelation(link) {
  const source = byId.get(link.source);
  const target = byId.get(link.target);
  if (!source || !target) return false;
  if (source.id === "root" || target.id === "root") return false;
  if (source.primaryDomain && source.primaryDomain === target.primaryDomain) {
    return true;
  }
  if (source.bridgeGroup || target.bridgeGroup) {
    return (
      source.bridgeGroup === target.bridgeGroup ||
      source.primaryDomain === target.primaryDomain ||
      (link.weight || 0) >= 0.74
    );
  }
  return false;
}

function isEvidenceRelation(link) {
  return (
    evidenceRelationTypes.has(link.type) ||
    (link.evidence || []).some((id) => String(id).startsWith("FS"))
  );
}

function isImportantCircuitRelation(link) {
  return (
    isPrimaryRelation(link) ||
    (isEvidenceRelation(link) && (link.weight || 0) >= 0.7) ||
    (link.weight || 0) >= 0.82
  );
}

function activeSourceId(context) {
  const evidenceId = evidenceFilter && evidenceFilter.value;
  return evidenceId || context.source?.id || "";
}

function relationClass(link) {
  const evidence = isEvidenceRelation(link);
  return `relation relation-${link.type} ${evidence ? "relationEvidence" : ""} ${
    isSelectedRelation(link) ? "selectedRelation" : ""
  } ${relationMatchesActiveLens(link) ? "facetLensRelation" : ""}`;
}

function shouldShowRelation(link, context) {
  if (linkMode === "off") return isSelectedRelation(link);
  if (isSelectedRelation(link)) return true;
  if (context.circuit?.links.has(linkKey(link))) return true;
  const sourceId = activeSourceId(context);
  if (sourceId) {
    return (
      (link.evidence || []).includes(sourceId) ||
      (context.directMatches.has(link.source) &&
        context.directMatches.has(link.target))
    );
  }
  if (linkMode === "primary") {
    return (
      (isPrimaryRelation(link) &&
        isMacroPrimaryRelation(link) &&
        (link.weight || 0) >= 0.74) ||
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
  const form = effectiveVisualForm(node, context);
  const classes = [
    "node",
    "semanticNode",
    `kind-${node.kind}`,
    `rank-${nodeRank(node)}`,
    `tier-${visualTier(node)}`,
    `form-${form}`,
  ];
  for (const domain of node.domains || []) classes.push(`domain-${domain}`);
  if (node.id === selectedId) classes.push("selected");
  if (context.circuit?.near.has(node.id)) classes.push("circuitNear");
  if (context.circuit?.far.has(node.id)) classes.push("circuitFar");
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
    if (context.circuit?.links.has(linkKey(link))) {
      path.classList.add("circuitRelation");
    }
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
    const layout = nodeLayout(node, context);
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
      layout.form === "detailChip" ? "rect" : "polygon",
    );
    if (layout.form === "detailChip") {
      shape.setAttribute("x", -layout.w / 2);
      shape.setAttribute("y", -layout.h / 2);
      shape.setAttribute("width", layout.w);
      shape.setAttribute("height", layout.h);
      shape.setAttribute("rx", 5);
    } else {
      shape.setAttribute(
        "points",
        polyPoints(layout.w, layout.h, node.id === "root" ? 30 : 17),
      );
    }
    group.appendChild(shape);

    const labelLines = layout.lines;
    if (layout.form !== "detailChip" || shouldShowChipLabel(node, context)) {
      labelLines.forEach((line, index) => {
        const title = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        title.setAttribute("class", "title");
        if (layout.form === "detailChip") {
          title.setAttribute("y", 1);
          title.setAttribute("dominant-baseline", "middle");
        } else {
          title.setAttribute(
            "y",
            -6 + (index - (labelLines.length - 1) / 2) * layout.lineHeight,
          );
        }
        title.textContent = line;
        group.appendChild(title);
      });
    }

    const showSmallTag =
      layout.form !== "detailChip" &&
      (transform.k >= 1.05 ||
        node.id === selectedId ||
        context.directMatches.has(node.id) ||
        ["core", "major"].includes(nodeRank(node)));
    if (showSmallTag) {
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
  const showClusterTitles =
    transform.k <= 0.62 &&
    selectedId === "root" &&
    !searchInput.value.trim() &&
    !(evidenceFilter && evidenceFilter.value) &&
    !activeFacetLenses.size;
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
    group.style.setProperty("--cluster-color", cluster.color || "#d51f1f");

    const field = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    field.setAttribute("class", "clusterField");
    field.setAttribute("points", clusterPoints(cluster.rx, cluster.ry));
    field.setAttribute("data-cluster", cluster.id);
    group.appendChild(field);

    if (showClusterTitles) {
      const titleBand = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      titleBand.setAttribute("class", "clusterTitleBand");
      titleBand.setAttribute("x", -cluster.rx + 48);
      titleBand.setAttribute("y", -cluster.ry - 110);
      titleBand.setAttribute("width", cluster.rx * 2 - 96);
      titleBand.setAttribute("height", 30);
      group.appendChild(titleBand);
    }

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

    if (showClusterTitles) {
      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      label.setAttribute("class", "clusterLabel");
      label.setAttribute("x", 0);
      label.setAttribute("y", -cluster.ry - 95);
      label.textContent = cluster.label;
      group.appendChild(label);
    }
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

function showSourceDetails(source) {
  if (!source) return;
  const connected = unique(source.concepts || [])
    .map((id) => byId.get(id))
    .filter(Boolean);
  const strengthens = (source.strengthens || [])
    .map(([a, b, type, weight]) => {
      const left = byId.get(a);
      const right = byId.get(b);
      if (!left || !right) return "";
      return `<li><button class="text-link" data-jump="${left.id}">${escapeHTML(left.label)}</button> -> <button class="text-link" data-jump="${right.id}">${escapeHTML(right.label)}</button> <span class="muted">(${escapeHTML(type)}, ${Number(weight || 0).toFixed(2)})</span></li>`;
    })
    .filter(Boolean)
    .join("");
  const bundles = (source.requiredBundles || [])
    .slice(0, 10)
    .map((bundle) => {
      const node = byId.get(bundle.concept);
      if (!node) return "";
      const facets = Object.keys(bundle)
        .filter((key) => key !== "concept")
        .join(", ");
      return `<li><button class="text-link" data-jump="${node.id}">${escapeHTML(node.label)}</button> <span class="muted">${escapeHTML(facets)}</span></li>`;
    })
    .filter(Boolean)
    .join("");

  details.innerHTML = `
    <h2>${escapeHTML(source.id)} - ${escapeHTML(source.title)}</h2>
    <p>This ${escapeHTML(source.type)} is evidence. It highlights connected concepts and strengthens their semantic relations without becoming a map node.</p>
    <div class="meta">
      ${pillList([source.type])}
      ${pillList(source.taskTypes, (task) => semanticGraph.taskTypes[task] || task)}
      <span class="pill">weight ${Number(source.weight || 0).toFixed(2)}</span>
    </div>
    ${
      connected.length
        ? `<div class="section-title">Connected concepts</div><ul>${connected
            .map(
              (node) =>
                `<li><button class="text-link" data-jump="${node.id}">${escapeHTML(node.label)}</button></li>`,
            )
            .join("")}</ul>`
        : ""
    }
    ${
      bundles
        ? `<div class="section-title">Evidence bundles</div><ul>${bundles}</ul>`
        : ""
    }
    ${
      strengthens
        ? `<div class="section-title">Strengthened relations</div><ul>${strengthens}</ul>`
        : ""
    }
  `;
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
    const id = source.getAttribute("data-source");
    searchInput.value = id;
    if (evidenceFilter) evidenceFilter.value = id;
    showSourceDetails(sourceById.get(id));
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

for (const select of [domainFilter, kindFilter, taskFilter]) {
  if (select) select.addEventListener("change", render);
}

if (evidenceFilter) {
  evidenceFilter.addEventListener("change", () => {
    const source = sourceById.get(evidenceFilter.value);
    if (source) showSourceDetails(source);
    render();
  });
}

searchInput.addEventListener("input", () => {
  const source = selectedSourceFromQuery(searchInput.value.trim());
  if (source) showSourceDetails(source);
  render();
});

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
