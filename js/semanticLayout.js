const relationDistance = {
  usesMechanism: 80,
  examCooccurrence: 90,
  sameStatePattern: 110,
  implementationSimilarity: 110,
  sameProofPattern: 120,
  prerequisite: 130,
  sameRepresentation: 130,
  upgradePath: 150,
  related: 160,
  taskPattern: 115,
  contrast: 180,
};

const domainAnchors = {
  workflow: { x: 0, y: 0 },
  arrays: { x: -470, y: -220 },
  sorting: { x: -230, y: -420 },
  pointers: { x: -520, y: 190 },
  stackQueue: { x: -180, y: 330 },
  hashing: { x: 270, y: -360 },
  trees: { x: 520, y: -80 },
  dp: { x: 300, y: 330 },
  graphs: { x: -30, y: 520 },
  weightedGraphs: { x: 430, y: 500 },
  recursion: { x: -650, y: -20 },
  proof: { x: 0, y: -40 },
};

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

function desiredDistance(link) {
  const base = relationDistance[link.type] || 160;
  return base / Math.sqrt(Math.max(link.weight || 0.1, 0.1));
}

function anchorFor(node) {
  if (
    node.anchor &&
    Number.isFinite(node.anchor.x) &&
    Number.isFinite(node.anchor.y)
  ) {
    return { x: node.anchor.x, y: node.anchor.y, manual: true };
  }
  const domains =
    node.domains && node.domains.length ? node.domains : ["workflow"];
  let x = 0;
  let y = 0;
  let count = 0;
  for (const domain of domains) {
    const anchor = domainAnchors[domain];
    if (!anchor) continue;
    x += anchor.x;
    y += anchor.y;
    count++;
  }
  if (!count) return domainAnchors.workflow;
  return { x: x / count, y: y / count };
}

function computeSemanticLayout(graph) {
  const nodes = graph.nodes.map((node) => {
    const anchor = anchorFor(node);
    const angle = seededUnit(node.id, "angle") * Math.PI * 2;
    const radius = 90 + seededUnit(node.id, "radius") * 170;
    const central =
      node.kind === "mechanism" ||
      node.kind === "proofPattern" ||
      node.id === "root";
    return {
      ...node,
      x: anchor.x + Math.cos(angle) * radius * (central ? 0.45 : 1),
      y: anchor.y + Math.sin(angle) * radius * (central ? 0.45 : 1),
      vx: 0,
      vy: 0,
      anchorX: anchor.manual ? anchor.x : anchor.x * (central ? 0.55 : 1),
      anchorY: anchor.manual ? anchor.y : anchor.y * (central ? 0.55 : 1),
      manualAnchor: Boolean(anchor.manual),
    };
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const links = graph.links
    .map((link) => ({
      ...link,
      sourceNode: byId.get(link.source),
      targetNode: byId.get(link.target),
      distance: desiredDistance(link),
    }))
    .filter((link) => link.sourceNode && link.targetNode);

  for (let iter = 0; iter < 260; iter++) {
    const heat = 1 - iter / 260;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 0.01) {
          dx = seededUnit(a.id + b.id, "dx") - 0.5;
          dy = seededUnit(a.id + b.id, "dy") - 0.5;
          d2 = dx * dx + dy * dy + 0.01;
        }
        const d = Math.sqrt(d2);
        const force = Math.min(5.8, 12500 / d2) * heat;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    for (const link of links) {
      const a = link.sourceNode;
      const b = link.targetNode;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const delta = d - link.distance;
      const strength = Math.min(0.035, 0.009 + (link.weight || 0.5) * 0.012);
      const fx = (dx / d) * delta * strength;
      const fy = (dy / d) * delta * strength;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    for (const node of nodes) {
      const anchorStrength =
        node.id === "root"
          ? 0.08
          : node.manualAnchor
            ? 0.03
            : node.kind === "mechanism"
              ? 0.018
              : 0.012;
      node.vx += (node.anchorX - node.x) * anchorStrength;
      node.vy += (node.anchorY - node.y) * anchorStrength;
      node.vx *= 0.68;
      node.vy *= 0.68;
      node.x += Math.max(-18, Math.min(18, node.vx));
      node.y += Math.max(-18, Math.min(18, node.vy));
    }
  }

  for (let iter = 0; iter < 80; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const min = nodeRadius(a) + nodeRadius(b) + 24;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d >= min) continue;
        const push = (min - d) / 2;
        const fx = (dx / d) * push;
        const fy = (dy / d) * push;
        a.x -= fx;
        a.y -= fy;
        b.x += fx;
        b.y += fy;
      }
    }
  }

  return {
    nodes,
    links: links.map(({ sourceNode, targetNode, ...link }) => link),
  };
}

function nodeRadius(node) {
  if (node.id === "root") return 84;
  return 48 + Math.min(26, Math.sqrt(node.priority || 0.1) * 12);
}
