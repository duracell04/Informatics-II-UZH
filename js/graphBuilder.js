const relationTypes = [
  "prerequisite",
  "usesMechanism",
  "sameRepresentation",
  "sameStatePattern",
  "sameProofPattern",
  "implementationSimilarity",
  "examCooccurrence",
  "contrast",
  "upgradePath",
  "taskPattern",
  "related",
];

const taskTypeLabels = {
  writeC: "Write C",
  traceArray: "Trace array",
  traceOutput: "Trace output",
  manualTrace: "Manual trace",
  countComparisons: "Count comparisons",
  runtime: "Runtime",
  invariant: "Invariant",
  recurrence: "Recurrence",
  fillHelperTable: "Fill helper table",
  adtOnly: "ADT-only",
  drawDataStructure: "Draw state",
  edgeCase: "Edge cases",
  pseudocode: "Pseudocode",
};

const skippedLegacyIds = new Set([
  "examPatterns",
  "traceOutput",
  "writeC",
  "writePseudo",
  "adtRestriction",
  "drawState",
  "fillHelperTable",
  "proveRuntime",
  "proveCorrectness",
]);

const domainByTopLevel = {
  workflow: ["workflow"],
  cbase: ["arrays"],
  sorting: ["sorting", "arrays"],
  complexity: ["proof"],
  recursion: ["recursion", "proof"],
  pointersAdt: ["pointers", "stackQueue"],
  hashing: ["hashing", "arrays"],
  trees: ["trees"],
  dp: ["dp", "arrays"],
  graphs: ["graphs"],
  weightedGraphs: ["weightedGraphs", "graphs"],
};

const kindByLegacyType = {
  root: "core",
  cnode: "mechanism",
  dsnode: "dataStructure",
  proof: "proofPattern",
  recnode: "algorithm",
  graphnode: "algorithm",
  examnode: "examPattern",
};

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function mergeList(a, b) {
  return unique([...(a || []), ...(b || [])]);
}

function flattenLegacyTree(node, parentId = null, topLevel = null, out = []) {
  if (!node || skippedLegacyIds.has(node.id)) return out;
  const nextTop = parentId === "root" ? node.id : topLevel;
  const domains = domainByTopLevel[nextTop] || domainByTopLevel[node.id] || [];
  out.push({
    id: node.id,
    label: node.name,
    kind: kindByLegacyType[node.type] || "concept",
    legacyType: node.type || "topic",
    domains,
    badge: node.badge,
    summary: node.why,
    builds: node.builds || [],
    used: node.used || [],
    exam: node.exam || [],
    parent: parentId,
    legacyTop: nextTop || node.id,
    card: codeCards && codeCards[node.id] ? node.id : undefined,
  });
  for (const child of node.children || []) {
    flattenLegacyTree(child, node.id, nextTop || node.id, out);
  }
  return out;
}

function normalizeRelation(edge, sourceName = "relations") {
  if (Array.isArray(edge)) {
    const [source, target, label] = edge;
    return {
      source,
      target,
      type: "related",
      weight: 0.45,
      label,
      evidence: [],
      sourceName,
    };
  }
  return {
    type: "related",
    weight: 0.5,
    evidence: [],
    ...edge,
    sourceName,
  };
}

function sourceRelation(source, item) {
  const [a, b, type, strength] = item;
  return {
    source: a,
    target: b,
    type,
    weight: Math.max(0.1, Math.min(1, strength || 0.5)) * (source.weight || 1),
    label: source.id,
    evidence: [source.id],
    sourceName: "sources",
  };
}

function mergeDuplicateRelations(items) {
  const merged = new Map();
  for (const raw of items) {
    const edge = normalizeRelation(raw);
    if (!edge.source || !edge.target || edge.source === edge.target) continue;
    const a = edge.source < edge.target ? edge.source : edge.target;
    const b = edge.source < edge.target ? edge.target : edge.source;
    const key = `${a}::${b}::${edge.type}`;
    const current = merged.get(key);
    if (!current) {
      merged.set(key, {
        ...edge,
        weight: Math.max(0.1, Math.min(1.5, edge.weight || 0.5)),
        evidence: unique(edge.evidence || []),
      });
      continue;
    }
    current.weight = Math.max(
      current.weight,
      Math.min(1.5, current.weight + (edge.weight || 0.4) * 0.35),
    );
    current.evidence = mergeList(current.evidence, edge.evidence);
    current.label = current.label || edge.label;
  }
  return [...merged.values()];
}

function inferTaskTypes(concept) {
  const text = JSON.stringify({
    label: concept.label,
    summary: concept.summary,
    exam: concept.exam,
    used: concept.used,
    builds: concept.builds,
  }).toLowerCase();
  const taskTypes = [];
  if (
    text.includes(" c ") ||
    text.includes("malloc") ||
    text.includes("printf")
  ) {
    taskTypes.push("writeC");
  }
  if (text.includes("trace") || text.includes("draw"))
    taskTypes.push("manualTrace");
  if (
    text.includes("runtime") ||
    text.includes("theta") ||
    text.includes("o(")
  ) {
    taskTypes.push("runtime");
  }
  if (text.includes("invariant") || text.includes("correct")) {
    taskTypes.push("invariant");
  }
  if (text.includes("helper table") || text.includes("dp")) {
    taskTypes.push("fillHelperTable");
  }
  if (text.includes("adt") || text.includes("only operations")) {
    taskTypes.push("adtOnly");
  }
  return taskTypes;
}

function conceptWeightBonus(concept) {
  let score = 0;
  if (concept.card) score += 0.35;
  if ((concept.taskTypes || []).includes("writeC")) score += 0.25;
  if ((concept.taskTypes || []).includes("manualTrace")) score += 0.2;
  if ((concept.taskTypes || []).includes("fillHelperTable")) score += 0.2;
  return score;
}

function ensureConcept(nodes, id) {
  if (!id || nodes.has(id)) return;
  nodes.set(id, {
    id,
    label: id.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    kind: "concept",
    domains: ["workflow"],
    taskTypes: [],
    summary: "Referenced semantic concept awaiting full enrichment.",
    generated: true,
    priority: 0.15,
  });
}

function buildSemanticGraph({
  data,
  concepts,
  relations,
  sources,
  drills,
  crossLinks,
  codeCards,
}) {
  const nodes = new Map();
  const legacy = flattenLegacyTree(data);

  for (const base of legacy) {
    nodes.set(base.id, {
      ...base,
      taskTypes: inferTaskTypes(base),
      sourceRefs: [],
      evidence: [],
      priority: base.id === "root" ? 3 : 0.25,
    });
  }

  for (const override of concepts || []) {
    const current = nodes.get(override.id) || {};
    nodes.set(override.id, {
      ...current,
      ...override,
      label: override.label || current.label || override.id,
      domains: mergeList(current.domains, override.domains),
      mechanisms: mergeList(current.mechanisms, override.mechanisms),
      representations: mergeList(
        current.representations,
        override.representations,
      ),
      proofPatterns: mergeList(current.proofPatterns, override.proofPatterns),
      taskTypes: mergeList(current.taskTypes, override.taskTypes),
      sourceRefs: mergeList(current.sourceRefs, override.sourceRefs),
      evidence: mergeList(current.evidence, override.sourceRefs),
      priority: Math.max(current.priority || 0, override.priority || 0),
    });
  }

  const allRelations = [
    ...(relations || []).map((edge) => normalizeRelation(edge, "relations")),
    ...(crossLinks || []).map((edge) => normalizeRelation(edge, "crossLinks")),
  ];

  for (const source of sources || []) {
    for (const id of source.concepts || []) ensureConcept(nodes, id);
    for (const edge of source.strengthens || []) {
      ensureConcept(nodes, edge[0]);
      ensureConcept(nodes, edge[1]);
      allRelations.push(sourceRelation(source, edge));
    }
  }

  for (const edge of allRelations) {
    ensureConcept(nodes, edge.source);
    ensureConcept(nodes, edge.target);
  }

  for (const node of nodes.values()) {
    if (
      node.parent &&
      !skippedLegacyIds.has(node.parent) &&
      nodes.has(node.parent)
    ) {
      allRelations.push({
        source: node.parent,
        target: node.id,
        type: "related",
        weight: node.parent === "root" ? 0.38 : 0.28,
        label: "syllabus",
        evidence: [],
        sourceName: "legacyTree",
      });
    }
    if (node.card && codeCards && !codeCards[node.card]) {
      console.warn(
        `Missing code card '${node.card}' for concept '${node.id}'.`,
      );
    }
  }

  const sourceById = new Map(
    (sources || []).map((source) => [source.id, source]),
  );
  const sourceConcepts = new Map();
  for (const source of sources || []) {
    for (const id of source.concepts || []) {
      const node = nodes.get(id);
      if (!node) continue;
      node.evidence = mergeList(node.evidence, [source.id]);
      node.taskTypes = mergeList(node.taskTypes, source.taskTypes);
      node.priority = (node.priority || 0) + (source.weight || 0.5);
      sourceConcepts.set(source.id, source.concepts || []);
    }
  }

  for (const drill of drills || []) {
    const node = nodes.get(drill.concept);
    if (!node) {
      console.warn(
        `Drill '${drill.id}' references missing concept '${drill.concept}'.`,
      );
      continue;
    }
    node.taskTypes = mergeList(node.taskTypes, drill.taskTypes);
  }

  const links = mergeDuplicateRelations(allRelations).filter((edge) => {
    if (!relationTypes.includes(edge.type)) {
      console.warn(
        `Invalid relation type '${edge.type}' on ${edge.source} -> ${edge.target}.`,
      );
      edge.type = "related";
    }
    if (!nodes.has(edge.source) || !nodes.has(edge.target)) {
      console.warn(
        `Missing relation endpoint on ${edge.source} -> ${edge.target}.`,
      );
      return false;
    }
    const a = nodes.get(edge.source);
    const b = nodes.get(edge.target);
    a.evidence = mergeList(a.evidence, edge.evidence);
    b.evidence = mergeList(b.evidence, edge.evidence);
    return true;
  });

  const graphNodes = [...nodes.values()].map((node) => ({
    ...node,
    taskTypes: mergeList(node.taskTypes, []),
    evidence: mergeList(node.evidence, []),
    priority: Math.max(0.1, (node.priority || 0) + conceptWeightBonus(node)),
  }));

  return {
    nodes: graphNodes,
    links,
    sources: sources || [],
    drills: drills || [],
    relationTypes,
    taskTypes: taskTypeLabels,
    sourceById,
    sourceConcepts,
  };
}
