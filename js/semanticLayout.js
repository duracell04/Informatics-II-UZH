const domainOrder = [
  "sorting",
  "hashing",
  "trees",
  "weightedGraphs",
  "dp",
  "graphs",
  "stackQueue",
  "pointers",
  "recursion",
  "arrays",
  "proof",
];

const macroClusters = [
  { id: "arrays", domains: ["arrays"], x: 0, y: -760, rx: 395, ry: 275 },
  { id: "sorting", domains: ["sorting"], x: -1080, y: -760, rx: 405, ry: 275 },
  {
    id: "recursion",
    domains: ["recursion"],
    x: -1520,
    y: -700,
    rx: 340,
    ry: 245,
  },
  { id: "pointers", domains: ["pointers"], x: -1080, y: 0, rx: 390, ry: 275 },
  {
    id: "stackQueue",
    domains: ["stackQueue"],
    x: -1200,
    y: 760,
    rx: 360,
    ry: 265,
  },
  { id: "hashing", domains: ["hashing"], x: 1080, y: -760, rx: 395, ry: 275 },
  { id: "trees", domains: ["trees"], x: 1080, y: 0, rx: 410, ry: 285 },
  { id: "dp", domains: ["dp"], x: -400, y: 760, rx: 360, ry: 265 },
  { id: "graphs", domains: ["graphs"], x: 400, y: 760, rx: 360, ry: 265 },
  {
    id: "weightedGraphs",
    domains: ["weightedGraphs"],
    x: 1200,
    y: 760,
    rx: 380,
    ry: 270,
  },
  { id: "proof", domains: ["proof"], x: 0, y: 0, rx: 405, ry: 285 },
];

const availableSemanticClusters =
  typeof semanticClusters === "undefined" ? macroClusters : semanticClusters;

const clusterByDomain = new Map(
  availableSemanticClusters.flatMap((cluster) =>
    (cluster.domains || [cluster.id]).map((domain) => [domain, cluster]),
  ),
);

const bridgeAnchors = {
  sortingTrees: {
    x: 0,
    y: -430,
    domains: ["sorting", "trees"],
    ids: [
      "heapSort",
      "heapify",
      "buildHeap",
      "heapTraceTable",
      "buildHeapExchangeCount",
      "daryHeapIndexing",
    ],
  },
  sortingHashing: {
    x: 360,
    y: -760,
    domains: ["sorting", "arrays", "hashing"],
    ids: [
      "counting",
      "frequencyArray",
      "directAddressing",
      "arrayInitialization",
    ],
  },
  queueGraphs: {
    x: -800,
    y: 520,
    domains: ["stackQueue", "graphs"],
    ids: ["bfs", "queue", "khop", "kHopExact", "shortestRootLeaf"],
  },
  weightedRelaxation: {
    x: 1200,
    y: 600,
    domains: ["weightedGraphs", "graphs", "trees"],
    ids: [
      "dijkstra",
      "relaxation",
      "bellmanFord",
      "dagSSSP",
      "negativeCycle",
      "priorityQueue",
    ],
  },
  dpRecursion: {
    x: -620,
    y: 560,
    domains: ["dp", "recursion", "arrays"],
    ids: ["palCuts", "helperTable", "dpTemplate"],
  },
};

const bridgeByNodeId = new Map(
  Object.entries(bridgeAnchors).flatMap(([group, bridge]) =>
    bridge.ids.map((id) => [id, { group, ...bridge }]),
  ),
);

function hashId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededUnit(id, salt) {
  const h = hashId(`${id}:${salt}`);
  return (h % 10000) / 10000;
}

function computeSemanticLayout(graph) {
  const rawNodes = graph.nodes.map((node) => ({
    ...node,
    primaryDomain: primaryDomainFor(node),
    bridgeGroup: bridgeByNodeId.get(node.id)?.group || null,
  }));
  const groups = groupNodes(rawNodes);
  const placedNodes = [];

  for (const [groupId, nodes] of groups.entries()) {
    const placed = placeGroup(groupId, nodes);
    relaxGroupCollisions(groupId, placed);
    placedNodes.push(...placed);
  }

  return {
    nodes: placedNodes,
    links: graph.links.map((link) => ({ ...link })),
  };
}

function groupNodes(nodes) {
  const groups = new Map();
  for (const node of nodes) {
    const groupId =
      node.id === "root"
        ? "root"
        : node.bridgeGroup || `domain:${node.primaryDomain}`;
    if (!groups.has(groupId)) groups.set(groupId, []);
    groups.get(groupId).push(node);
  }
  for (const nodesInGroup of groups.values()) {
    nodesInGroup.sort((a, b) => {
      const rankDelta = rankWeight(b) - rankWeight(a);
      if (rankDelta) return rankDelta;
      return String(a.id).localeCompare(String(b.id));
    });
  }
  return groups;
}

function placeGroup(groupId, nodes) {
  if (groupId === "root") {
    return nodes.map((node) => ({
      ...node,
      x: 0,
      y: 0,
      layoutGroup: groupId,
    }));
  }

  const field = fieldForGroup(groupId);
  const groupedByRing = new Map();
  for (const node of nodes) {
    const ring = ringFor(node);
    if (!groupedByRing.has(ring)) groupedByRing.set(ring, []);
    groupedByRing.get(ring).push(node);
  }

  const placed = [];
  for (const [ring, ringNodes] of groupedByRing.entries()) {
    const radius = ringRadius(field, ring);
    const count = ringNodes.length;
    ringNodes.forEach((node, index) => {
      const phase = seededUnit(node.id, "ring-phase") * Math.PI * 0.35;
      const angle =
        -Math.PI / 2 + phase + (Math.PI * 2 * index) / Math.max(1, count);
      const lane = 0.84 + seededUnit(node.id, "ring-lane") * 0.24;
      const manual = localManualBias(node, field);
      placed.push({
        ...node,
        x: field.x + Math.cos(angle) * radius.x * lane + manual.x,
        y: field.y + Math.sin(angle) * radius.y * lane + manual.y,
        layoutGroup: groupId,
      });
    });
  }

  return placed;
}

function fieldForGroup(groupId) {
  if (bridgeAnchors[groupId]) {
    const bridge = bridgeAnchors[groupId];
    return {
      id: groupId,
      x: bridge.x,
      y: bridge.y,
      rx: 260,
      ry: 185,
      bridge: true,
    };
  }

  const domain = groupId.replace(/^domain:/, "");
  const cluster =
    clusterByDomain.get(domain) || clusterByDomain.get("workflow");
  return {
    id: domain,
    x: cluster?.x || 0,
    y: cluster?.y || 0,
    rx: Math.max(250, (cluster?.rx || 330) - 72),
    ry: Math.max(180, (cluster?.ry || 230) - 62),
    bridge: false,
  };
}

function primaryDomainFor(node) {
  const bridge = bridgeByNodeId.get(node.id);
  if (bridge) return bridge.domains[0];

  const domains = node.domains || [];
  for (const domain of domainOrder) {
    if (domains.includes(domain)) return domain;
  }
  return domains.includes("workflow") ? "proof" : domains[0] || "proof";
}

function ringFor(node) {
  const rank = layoutRank(node);
  if (rank === "core" || rank === "hub") return "center";
  if (rank === "concept") return "middle";
  return "edge";
}

function ringRadius(field, ring) {
  if (ring === "center") return { x: field.rx * 0.24, y: field.ry * 0.22 };
  if (ring === "middle") return { x: field.rx * 0.55, y: field.ry * 0.5 };
  return { x: field.rx * 0.82, y: field.ry * 0.76 };
}

function localManualBias(node, field) {
  if (!node.anchor || field.bridge) return { x: 0, y: 0 };
  const scale = 0.08;
  return {
    x: Math.max(-42, Math.min(42, node.anchor.x * scale)),
    y: Math.max(-34, Math.min(34, node.anchor.y * scale)),
  };
}

function relaxGroupCollisions(groupId, nodes) {
  const field = fieldForGroup(groupId);
  for (let iter = 0; iter < 120; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const min = nodeRadius(a) + nodeRadius(b) + collisionGap(a, b);
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d < 0.01) {
          dx = seededUnit(a.id + b.id, "dx") - 0.5;
          dy = seededUnit(a.id + b.id, "dy") - 0.5;
          d = Math.hypot(dx, dy) || 1;
        }
        if (d >= min) continue;
        const push = ((min - d) / 2) * 0.76;
        const fx = (dx / d) * push;
        const fy = (dy / d) * push;
        a.x -= fx;
        a.y -= fy;
        b.x += fx;
        b.y += fy;
      }
    }

    for (const node of nodes) {
      clampToField(node, field);
    }
  }
}

function clampToField(node, field) {
  const margin = nodeRadius(node) * 0.58;
  const dx = node.x - field.x;
  const dy = node.y - field.y;
  const rx = Math.max(80, field.rx - margin);
  const ry = Math.max(70, field.ry - margin);
  const normalized = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  if (normalized <= 1) return;
  const scale = 1 / Math.sqrt(normalized);
  node.x = field.x + dx * scale;
  node.y = field.y + dy * scale;
}

function nodeRadius(node) {
  const rank = layoutRank(node);
  if (rank === "core") return node.id === "root" ? 110 : 84;
  if (rank === "hub") return 78;
  if (rank === "concept") return 58;
  return 18;
}

function layoutRank(node) {
  if (node.id === "root" || node.kind === "core") return "core";
  if (node.visualTier === "hub") return "hub";
  if (node.visualTier === "concept") return "concept";
  return "detail";
}

function rankWeight(node) {
  const weights = { core: 4, hub: 3, concept: 2, detail: 1 };
  return weights[layoutRank(node)] || 0;
}

function collisionGap(a, b) {
  const ranks = new Set([layoutRank(a), layoutRank(b)]);
  if (ranks.has("core")) return 72;
  if (ranks.has("hub")) return 52;
  if (ranks.has("concept")) return 34;
  return 16;
}
