function majorAngle(id, fallback) {
  const map = {
    workflow: -Math.PI / 2,
    cbase: -1.05,
    sorting: -0.55,
    complexity: 0,
    recursion: 0.55,
    pointersAdt: 1.05,
    hashing: 1.55,
    trees: 2.1,
    dp: 2.65,
    graphs: -3.12,
    weightedGraphs: -2.55,
    examPatterns: -2.05,
  };
  return map[id] ?? fallback;
}

function orderIndex(order, id) {
  const i = order.indexOf(id);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
}

function orderedChildren(parent) {
  const kids = [...(parent.children || [])];
  const orders = {
    sorting: [
      "counting",
      "sort3",
      "heapSort",
      "quick",
      "merge",
      "insertion",
      "selection",
      "xsort",
      "bubble",
      "stackSort",
      "pairSum",
      "pairSumSorted",
    ],
    complexity: [
      "bigO",
      "bestWorstAvg",
      "loopcount",
      "exactAnalysisWorkflow",
      "topKSelectionAnalysis",
      "logLoops",
      "recurrences",
      "master",
      "substitution",
      "recursionTree",
      "asymmetricRecursionTree",
      "invariant",
      "edgeCases",
    ],
    recursion: [
      "palRec",
      "hilbertRecurrence",
      "binaryPrint",
      "hanoi",
      "pyramid",
      "binarySearch",
      "maxSubarray",
    ],
    pointersAdt: [
      "pointers",
      "linked",
      "reverseLinked",
      "stack",
      "queue",
      "twoStacksOneArray",
      "queueTwoStacks",
      "stackTwoQueues",
      "stackLinkedList",
      "queueLinkedList",
      "linkedInsertDelete",
      "headChangingAdt",
      "reverseEven",
      "adtRules",
      "kthLargestStack",
      "amortized",
    ],
    hashing: [
      "directAddressing",
      "frequencyArray",
      "hashFunction",
      "chaining",
      "chainingOrder",
      "searchChain",
      "loadFactor",
      "openAddress",
      "linearProbe",
      "quadraticProbe",
      "linearClustering",
      "doubleHash",
      "deleteHash",
      "tombstoneRepair",
      "hashApps",
      "printOverlap",
      "targetSumHash",
    ],
    trees: [
      "dictionary",
      "binaryTree",
      "expressionTree",
      "reconstructTree",
      "catalanBstShapes",
      "treeTraversal",
      "bst",
      "bstMinMax",
      "bstInsert",
      "bstDelete",
      "successor",
      "bstVsHeap",
      "lrlp",
      "shortestRootLeaf",
      "printTreeLevels",
      "avl",
      "rotations",
      "avlCases",
      "redBlackHistorical",
      "heap",
      "heapify",
      "buildHeap",
      "daryHeap",
    ],
    graphs: [
      "graphTerminology",
      "adjacency",
      "graphState",
      "bfs",
      "dfs",
      "cycle",
      "allPaths",
      "khop",
      "edgeTypes",
      "topologicalSort",
    ],
    weightedGraphs: [
      "weightedGraph",
      "mst",
      "cutLightEdge",
      "primJarnik",
      "primTrace",
      "kruskal",
      "priorityQueue",
      "sssp",
      "relaxation",
      "bellmanFord",
      "bellmanFordDetails",
      "bellmanFordTrace",
      "dagSSSP",
      "dijkstra",
      "dijkstraAssumptions",
      "dijkstraTrace",
      "negativeCycle",
      "arbitrage",
    ],
    dp: [
      "dpTemplate",
      "memoization",
      "matrixPath",
      "palCuts",
      "bigPlus",
      "editDistance",
      "maxProduct",
      "nearestZero",
      "matrixChain",
      "lcs",
      "coinChange",
      "solutionReconstruction",
    ],
  };
  if (orders[parent.id]) {
    return kids.sort(
      (a, b) =>
        orderIndex(orders[parent.id], a.id) -
        orderIndex(orders[parent.id], b.id),
    );
  }
  return kids;
}

const svg = document.getElementById("svg");
const viewport = document.getElementById("viewport");
const details = document.getElementById("details");
const searchInput = document.getElementById("search");
const linkModeToggle = document.getElementById("linkModeToggle");

let transform = { x: 0, y: 0, k: 0.82 };
let dragging = false;
let last = null;
let selectedId = "root";
let linkMode = "all";

const R1 = 500;
const R2_BASE = 790;
const R3_BASE = 1240;
const CHILD_STEP = 76;
const GRAND_STEP = 92;
const DENSE_BRANCH_BOOST = 68;
const CORE_RADIUS = 122;
const majorW = 248;
const majorH = 92;
const childW = 218;
const childH = 76;

function allNodes(n = data, arr = []) {
  arr.push(n);
  (n.children || []).forEach((c) => allNodes(c, arr));
  return arr;
}

const byId = new Map(allNodes().map((n) => [n.id, n]));

function initCollapse(n, depth = 0) {
  n._collapsed = depth >= 1;
  (n.children || []).forEach((c) => initCollapse(c, depth + 1));
}

initCollapse(data);
data._collapsed = false;

function subtreeSize(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((s, c) => s + subtreeSize(c), 0);
}

function childSpread(count, depth = 2) {
  if (count <= 1) return 0;
  const base = depth === 2 ? Math.PI / 3.9 : Math.PI / 5.2;
  const extra = Math.min(
    Math.PI / 4.8,
    (Math.max(0, count - 4) * Math.PI) / 38,
  );
  return base + extra;
}

function adaptiveRadius(base, count, index, subtreeWeight, depth) {
  const density = Math.max(0, count - 4) * DENSE_BRANCH_BOOST;
  const lane = index * (depth === 2 ? CHILD_STEP : GRAND_STEP) * 0.82;
  const subtree = Math.max(0, subtreeWeight - 1) * (depth === 2 ? 12 : 7);
  return base + density + lane + subtree;
}

function polar(r, a) {
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

function visible() {
  const majors = data.children;
  const nodes = [{ ...data, x: 0, y: 0, depth: 0, angle: 0 }];
  const links = [];
  const count = majors.length;

  majors.forEach((m, i) => {
    const angle = majorAngle(m.id, -Math.PI / 2 + (i * 2 * Math.PI) / count);
    const p = polar(R1, angle);
    nodes.push({ ...m, x: p.x, y: p.y, depth: 1, angle });
    links.push({ source: "root", target: m.id });
    if (m._collapsed) return;

    const kids = orderedChildren(m);
    const spread = childSpread(kids.length, 2);
    const majorWeight = subtreeSize(m);
    const r2Base = R2_BASE + Math.max(0, majorWeight - 8) * 9;

    kids.forEach((c, j) => {
      const local =
        kids.length === 1 ? 0 : (j / (kids.length - 1) - 0.5) * spread;
      const a = angle + local;
      const r = adaptiveRadius(r2Base, kids.length, j, subtreeSize(c), 2);
      const cp = polar(r, a);
      nodes.push({
        ...c,
        x: cp.x,
        y: cp.y,
        depth: 2,
        angle: a,
        parentId: m.id,
      });
      links.push({ source: m.id, target: c.id });
      if (c._collapsed || !c.children) return;

      const gkids = orderedChildren(c);
      const gSpread = childSpread(gkids.length, 3);
      const r3Base =
        R3_BASE +
        Math.max(0, majorWeight - 8) * 13 +
        Math.max(0, kids.length - 6) * 30;
      gkids.forEach((g, k) => {
        const glocal =
          gkids.length === 1 ? 0 : (k / (gkids.length - 1) - 0.5) * gSpread;
        const ga = a + glocal;
        const gr = adaptiveRadius(r3Base, gkids.length, k, subtreeSize(g), 3);
        const gp = polar(gr, ga);
        nodes.push({
          ...g,
          x: gp.x,
          y: gp.y,
          depth: 3,
          angle: ga,
          parentId: c.id,
        });
        links.push({ source: c.id, target: g.id });
      });
    });
  });

  prepareLayout(nodes);
  resolveOverlaps(nodes);
  return { nodes, links };
}

function applyTransform() {
  viewport.setAttribute(
    "transform",
    `translate(${transform.x},${transform.y}) scale(${transform.k})`,
  );
}

function boundsForNodes(nodes) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const n of nodes) {
    const { w, h } = nodeLayout(n);
    minX = Math.min(minX, n.x - w / 2);
    minY = Math.min(minY, n.y - h / 2);
    maxX = Math.max(maxX, n.x + w / 2);
    maxY = Math.max(maxY, n.y + h / 2);
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function centerView() {
  const rect = svg.getBoundingClientRect();
  transform.k = 0.82;
  const { nodes } = visible();
  const bounds = boundsForNodes(nodes);
  const paddingX = Math.min(170, Math.max(72, rect.width * 0.09));
  const paddingY = Math.min(150, Math.max(82, rect.height * 0.12));
  const fitX = (rect.width - paddingX * 2) / Math.max(1, bounds.width);
  const fitY = (rect.height - paddingY * 2) / Math.max(1, bounds.height);
  transform.k = Math.max(0.32, Math.min(0.82, fitX, fitY));
  transform.x = rect.width / 2 - (bounds.minX + bounds.width / 2) * transform.k;
  transform.y =
    rect.height / 2 - (bounds.minY + bounds.height / 2) * transform.k;
  applyTransform();
}

function nodeLayout(n) {
  if (n._layout) return n._layout;
  const isMajor = n.depth === 1;
  const baseW = isMajor ? majorW : childW;
  const baseH = isMajor ? majorH : childH;
  const charWidth = isMajor ? 8.5 : 7.6;
  const maxChars = isMajor ? 19 : 21;
  const lines = wrap(n.name, maxChars, 4);
  const longest = lines.reduce((m, line) => Math.max(m, line.length), 0);
  const w = Math.max(
    baseW,
    Math.min(isMajor ? 310 : 280, Math.ceil(longest * charWidth + 54)),
  );
  const lineHeight = isMajor ? 18 : 17;
  const badgeSpace = transform.k >= 0.55 ? 22 : 8;
  const h = Math.max(baseH, 22 + lines.length * lineHeight + badgeSpace);
  n._layout = { w, h, lines, lineHeight };
  return n._layout;
}

function prepareLayout(nodes) {
  nodes.forEach((n) => {
    n._layout = null;
    nodeLayout(n);
  });
}

function nodeSize(n) {
  const layout = nodeLayout(n);
  return [layout.w, layout.h];
}

function polyPoints(w, h, cut = 18) {
  return `${-w / 2 + cut},${-h / 2} ${w / 2},${-h / 2} ${w / 2 - cut},${h / 2} ${-w / 2},${h / 2}`;
}

function wrap(s, max, maxLines = 3) {
  const words = s.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const word = w.length > max ? w.slice(0, max - 1) + "." : w;
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  const clean = lines.filter(Boolean);
  if (clean.length <= maxLines) return clean;
  const kept = clean.slice(0, maxLines);
  kept[maxLines - 1] = kept[maxLines - 1].replace(/\.*$/, ".");
  return kept;
}

function resolveOverlaps(nodes) {
  const movable = nodes.filter((n) => n.id !== "root");
  movable.forEach((n) => {
    n.anchorX = n.x;
    n.anchorY = n.y;
  });

  for (const n of movable) {
    const { w, h } = nodeLayout(n);
    const minDistance =
      CORE_RADIUS + Math.max(w, h) / 2 + (n.depth === 1 ? 58 : 34);
    const d = Math.hypot(n.x, n.y) || 1;
    if (d < minDistance) {
      const scale = minDistance / d;
      n.x *= scale;
      n.y *= scale;
    }
  }

  for (let iter = 0; iter < 90; iter++) {
    let changed = false;
    for (let i = 0; i < movable.length; i++) {
      for (let j = i + 1; j < movable.length; j++) {
        const a = movable[i];
        const b = movable[j];
        const la = nodeLayout(a);
        const lb = nodeLayout(b);
        const pad = a.depth === 1 || b.depth === 1 ? 34 : 26;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX = (la.w + lb.w) / 2 + pad - Math.abs(dx);
        const overlapY = (la.h + lb.h) / 2 + pad - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;

        changed = true;
        if (overlapX < overlapY) {
          const push = overlapX / 2 + 1;
          const dir = dx >= 0 ? 1 : -1;
          a.x -= push * dir;
          b.x += push * dir;
        } else {
          const push = overlapY / 2 + 1;
          const dir = dy >= 0 ? 1 : -1;
          a.y -= push * dir;
          b.y += push * dir;
        }
      }
    }

    if (!changed) break;
    for (const n of movable) {
      const pull = n.depth === 1 ? 0.012 : 0.02;
      n.x += (n.anchorX - n.x) * pull;
      n.y += (n.anchorY - n.y) * pull;
    }
  }
}

function classFor(n) {
  if (n.depth === 1) return "major";
  if (n.type === "proof") return "proof";
  if (n.type === "cnode") return "cnode";
  if (n.type === "dsnode") return "dsnode";
  if (n.type === "recnode") return "recnode";
  if (n.type === "graphnode") return "graphnode";
  if (n.type === "examnode") return "examnode";
  return "minor";
}

function shouldShowCrossLink(a, b) {
  const touchesSelected =
    selectedId !== "root" && (a === selectedId || b === selectedId);
  if (touchesSelected) return true;
  if (linkMode === "all") return true;
  if (linkMode === "selected") return touchesSelected;
  return false;
}

function isSelectedCrossLink(a, b) {
  return selectedId !== "root" && (a === selectedId || b === selectedId);
}

function cycleLinkMode() {
  linkMode =
    linkMode === "all" ? "selected" : linkMode === "selected" ? "off" : "all";
  updateLinkModeButton();
  render();
}

function updateLinkModeButton() {
  if (!linkModeToggle) return;
  const labels = {
    off: "Links off",
    selected: "Links for selected",
    all: "All links",
  };
  linkModeToggle.textContent = labels[linkMode];
}

function shouldShowCrossLabel(a, b) {
  if (isSelectedCrossLink(a, b)) return true;
  return linkMode === "all" && transform.k >= 1.1;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const { nodes, links } = visible();
  const visibleById = new Map(nodes.map((n) => [n.id, n]));

  viewport.innerHTML = "";
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const linkG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const crossG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const crossLabelG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  viewport.append(bg, linkG, crossG, nodeG, crossLabelG);

  for (const l of links) {
    const s = visibleById.get(l.source);
    const t = visibleById.get(l.target);
    if (!s || !t) continue;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("class", t.depth === 1 ? "ray red" : "ray");
    p.setAttribute("d", `M${s.x},${s.y} L${t.x},${t.y}`);
    linkG.appendChild(p);
  }

  for (const [a, b, label] of crossLinks) {
    if (!shouldShowCrossLink(a, b)) continue;
    const s = visibleById.get(a);
    const t = visibleById.get(b);
    if (!s || !t) continue;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2;
    p.setAttribute(
      "class",
      isSelectedCrossLink(a, b) ? "cross selectedCross" : "cross",
    );
    p.setAttribute(
      "d",
      `M${s.x},${s.y} Q${mx * 1.07},${my * 1.07} ${t.x},${t.y}`,
    );
    crossG.appendChild(p);

    if (shouldShowCrossLabel(a, b)) {
      const labelText = label.toUpperCase();
      const d = Math.hypot(mx, my) || 1;
      const lx = mx * 1.03 + (mx / d) * 28;
      const ly = my * 1.03 + (my / d) * 28;
      const labelW = Math.max(48, labelText.length * 7.4 + 18);
      const labelH = 18;
      const labelGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      labelGroup.setAttribute(
        "class",
        isSelectedCrossLink(a, b)
          ? "crossLabelGroup selectedCrossLabel"
          : "crossLabelGroup",
      );

      const box = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      box.setAttribute("class", "crossLabelBox");
      box.setAttribute("x", lx - labelW / 2);
      box.setAttribute("y", ly - labelH / 2);
      box.setAttribute("width", labelW);
      box.setAttribute("height", labelH);
      labelGroup.appendChild(box);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("class", "crossLabel");
      text.setAttribute("x", lx);
      text.setAttribute("y", ly);
      text.textContent = labelText;
      labelGroup.appendChild(text);
      crossLabelG.appendChild(labelGroup);
    }
  }

  const core = document.createElementNS("http://www.w3.org/2000/svg", "g");
  core.setAttribute("class", "node selected");
  core.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedId = "root";
    showDetails(data);
    render();
  });
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("class", "core-ring");
  circle.setAttribute("r", 108);
  core.appendChild(circle);
  ["INF II", "EXAM", "MACHINE"].forEach((t, i) => {
    const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tx.setAttribute("class", "core-text");
    tx.setAttribute("y", -28 + i * 34);
    tx.textContent = t;
    core.appendChild(tx);
  });
  nodeG.appendChild(core);

  for (const n of nodes.filter((n) => n.id !== "root")) {
    const orig = byId.get(n.id) || n;
    const card = codeCards[n.id];
    const hay = JSON.stringify({
      node: orig,
      code: card || null,
    }).toLowerCase();
    const isMatch = q && hay.includes(q);
    const layout = nodeLayout(n);
    const [w, h] = [layout.w, layout.h];

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute(
      "class",
      `node ${classFor(n)} ${n.id === selectedId ? "selected" : ""} ${isMatch ? "match" : ""} ${card ? "hasCode" : ""}`,
    );
    g.setAttribute("transform", `translate(${n.x},${n.y})`);
    g.style.cursor = "pointer";
    g.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedId = n.id;
      if (linkMode === "off") {
        linkMode = "selected";
        updateLinkModeButton();
      }
      showDetails(orig);
      render();
    });
    g.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (orig.children) {
        orig._collapsed = !orig._collapsed;
        render();
      }
    });

    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    shape.setAttribute("points", polyPoints(w, h, n.depth === 1 ? 28 : 18));
    g.appendChild(shape);

    layout.lines.forEach((line, i) => {
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("class", "title");
      text.setAttribute(
        "y",
        -8 + (i - (layout.lines.length - 1) / 2) * layout.lineHeight,
      );
      text.textContent = line;
      g.appendChild(text);
    });

    if (transform.k >= 0.55) {
      const small = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      small.setAttribute("class", "small");
      small.setAttribute("y", h / 2 - 10);
      small.textContent = (
        (card ? "CODE - " : "") + (n.badge || n.type || "")
      ).toUpperCase();
      g.appendChild(small);
    }

    if (orig.children) {
      const plus = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      plus.setAttribute("class", "small");
      plus.setAttribute("x", w / 2 - 22);
      plus.setAttribute("y", -h / 2 + 18);
      plus.textContent = orig._collapsed ? "+" : "-";
      g.appendChild(plus);
    }

    nodeG.appendChild(g);
  }

  applyTransform();
}

function list(title, arr) {
  return arr && arr.length
    ? `<div class="section-title">${title}</div><ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`
    : "";
}

function showDetails(n) {
  const code = codeCards[n.id];
  details.innerHTML = `<h2>${n.name}</h2><p>${n.why || ""}</p><div class="meta"><span class="pill">${n.type || "topic"}</span><span class="pill">${n.badge || "node"}</span>${n.children ? `<span class="pill">${n.children.length} parts</span>` : ""}${code ? `<span class="pill">C CODE</span>` : ""}</div>${list("Builds on", n.builds)}${list("Used in", n.used)}${list("Exam signal", n.exam)}${list("Subnodes", n.children && n.children.map((c) => c.name))}<div class="section-title">Action</div><ul><li>Click a node to inspect it here.</li><li>Double-click the corresponding node to expand or collapse.</li><li>Use the link button to show selected transfer links or all cross-links.</li><li>Use C Lab below to open C / pseudocode.</li></ul>${code ? `<div class="section-title">C Lab</div><button onclick="openCodePanel('${n.id}')">Open C code</button>` : ""}`;
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ensureCodeModal() {
  let el = document.getElementById("codeModalBackdrop");
  if (el) return el;
  el = document.createElement("div");
  el.id = "codeModalBackdrop";
  el.className = "code-modal-backdrop";
  el.innerHTML = `<div class="code-modal"><div class="modal-head"><div><h2 id="codeTitle"></h2><div class="code-sub" id="codeKind"></div></div><button class="close-code" onclick="closeCodePanel()">Close</button></div><div class="code-note" id="codeNote"></div><div class="code-actions" id="codeActions"></div><pre><code id="codeBody"></code></pre></div>`;
  el.addEventListener("click", (e) => {
    if (e.target === el) closeCodePanel();
  });
  document.body.appendChild(el);
  return el;
}

function openCodePanel(id) {
  const card = codeCards[id];
  if (!card) return;
  const el = ensureCodeModal();
  document.getElementById("codeTitle").textContent = card.title;
  document.getElementById("codeKind").textContent = card.kind;
  document.getElementById("codeNote").textContent = card.note;
  document.getElementById("codeBody").innerHTML = escapeHTML(card.code);
  const actions = document.getElementById("codeActions");
  actions.innerHTML = "";
  (card.deps || []).forEach((dep) => {
    const target = byId.get(dep);
    if (!target) return;
    const b = document.createElement("button");
    b.className = "code-link-btn";
    b.textContent = "Jump to " + target.name;
    b.onclick = () => jumpToNode(dep, true);
    actions.appendChild(b);
  });
  el.classList.add("open");
}

function closeCodePanel() {
  const el = document.getElementById("codeModalBackdrop");
  if (el) el.classList.remove("open");
}

function expandPath(node, id) {
  if (node.id === id) {
    node._collapsed = false;
    return true;
  }
  for (const c of node.children || []) {
    if (expandPath(c, id)) {
      node._collapsed = false;
      return true;
    }
  }
  return false;
}

function centerOnNode(id) {
  const item = visible().nodes.find((n) => n.id === id);
  if (!item) return;
  const rect = svg.getBoundingClientRect();
  transform.x = rect.width / 2 - item.x * transform.k;
  transform.y = rect.height / 2 - item.y * transform.k;
  applyTransform();
}

function jumpToNode(id, openCode = false) {
  const target = byId.get(id);
  if (!target) return;
  expandPath(data, id);
  selectedId = id;
  showDetails(target);
  render();
  centerOnNode(id);
  if (openCode && codeCards[id]) openCodePanel(id);
}

function expandAll() {
  allNodes().forEach((n) => {
    n._collapsed = false;
  });
  render();
}

function coreView() {
  allNodes().forEach((n) => {
    n._collapsed = true;
  });
  data._collapsed = false;
  selectedId = "root";
  showDetails(data);
  centerView();
  render();
}

document.getElementById("expandAll").onclick = expandAll;
document.getElementById("collapseAll").onclick = coreView;
document.getElementById("resetView").onclick = () => {
  centerView();
  render();
};
if (linkModeToggle) linkModeToggle.onclick = cycleLinkMode;

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim()) expandAll();
  else render();
});

svg.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const scale = e.deltaY < 0 ? 1.08 : 0.92;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const old = transform.k;
    const nk = Math.max(0.18, Math.min(2.5, old * scale));
    transform.x = mx - (mx - transform.x) * (nk / old);
    transform.y = my - (my - transform.y) * (nk / old);
    transform.k = nk;
    render();
  },
  { passive: false },
);

svg.addEventListener("mousedown", (e) => {
  dragging = true;
  last = { x: e.clientX, y: e.clientY };
  svg.classList.add("dragging");
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  transform.x += e.clientX - last.x;
  transform.y += e.clientY - last.y;
  last = { x: e.clientX, y: e.clientY };
  applyTransform();
});

window.addEventListener("mouseup", () => {
  dragging = false;
  svg.classList.remove("dragging");
});

svg.addEventListener("click", () => {
  selectedId = "root";
  showDetails(data);
  render();
});

window.addEventListener("resize", () => {
  centerView();
  render();
});

updateLinkModeButton();
centerView();
render();
