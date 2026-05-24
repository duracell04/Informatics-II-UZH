import { loadGraphContext } from "./graphLoader.mjs";

const {
  codeCards,
  concepts,
  relations,
  sources,
  drills,
  relationTypes,
  taskTypeLabels,
  graph,
} = loadGraphContext();

const errors = [];
const warnings = [];
const validFacetNames = new Set(graph.facetNames || []);
const conceptIds = new Set(graph.nodes.map((node) => node.id));
const sourceIds = new Set(sources.map((source) => source.id));
const validTaskTypes = new Set(Object.keys(taskTypeLabels));
const validRelationTypes = new Set(relationTypes);
const graphNodeById = new Map(graph.nodes.map((node) => [node.id, node]));
const drillsByConcept = new Map();
const drillsBySource = new Map();
const drillById = new Map();
const highPriorityDrillThreshold = 3.5;
const strictSourceTypes = new Set(["lecture", "exercise", "pastExam"]);

for (const drill of drills) {
  drillById.set(drill.id, drill);
  if (!drillsByConcept.has(drill.concept)) {
    drillsByConcept.set(drill.concept, []);
  }
  drillsByConcept.get(drill.concept).push(drill);
  if (drill.source) {
    if (!drillsBySource.has(drill.source)) drillsBySource.set(drill.source, []);
    drillsBySource.get(drill.source).push(drill);
  }
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function checkDuplicateIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) fail(`Duplicate ${label} id: ${item.id}`);
    seen.add(item.id);
  }
}

function hasCodeCard(node) {
  return Boolean(
    node && ((node.card && codeCards[node.card]) || codeCards[node.id]),
  );
}

function hasJustifiedCardExemption(source) {
  return Boolean(
    source.cardExempt === true &&
    typeof source.cardExemptReason === "string" &&
    source.cardExemptReason.trim(),
  );
}

function hasJustifiedContextOnly(source) {
  return Boolean(
    source.contextOnly === true &&
    typeof source.contextOnlyReason === "string" &&
    source.contextOnlyReason.trim(),
  );
}

function failMissingFacet(source, node, facetName) {
  if (
    !(node.facets && node.facets[facetName] && node.facets[facetName].length)
  ) {
    fail(
      `Lecture source '${source.id}' requires concept '${node.id}' without ${facetName} facet.`,
    );
  }
}

function isCHeavy(node) {
  return (node.taskTypes || []).some((task) =>
    ["writeC", "traceArray", "traceOutput"].includes(task),
  );
}

checkDuplicateIds(concepts, "concept");
checkDuplicateIds(sources, "source");
checkDuplicateIds(drills, "drill");

for (const node of graph.nodes) {
  if (node.generated) {
    fail(`Generated placeholder concept remains in graph: ${node.id}`);
  }
}

for (const cardId of Object.keys(codeCards)) {
  if (!conceptIds.has(cardId)) {
    fail(`Code card '${cardId}' has no visible concept.`);
  }
}

for (const node of graph.nodes) {
  if (node.card && !codeCards[node.card]) {
    fail(`Concept '${node.id}' references missing code card '${node.card}'.`);
  }
  if (!node.summary) {
    warn(`Concept '${node.id}' is missing a summary.`);
  }
  if (
    node.id !== "root" &&
    !node.generated &&
    (node.priority || 0) >= 1 &&
    (!node.evidence || node.evidence.length === 0)
  ) {
    warn(`Concept '${node.id}' has no source evidence.`);
  }
  if (
    node.id !== "root" &&
    (node.priority || 0) >= highPriorityDrillThreshold &&
    !drillsByConcept.has(node.id)
  ) {
    fail(
      `High-priority concept '${node.id}' has no drill (priority ${node.priority.toFixed(
        2,
      )}).`,
    );
  }
  for (const task of node.taskTypes || []) {
    if (!validTaskTypes.has(task)) {
      fail(`Concept '${node.id}' uses invalid task type '${task}'.`);
    }
  }
  for (const sourceId of node.sourceRefs || []) {
    if (!sourceIds.has(sourceId)) {
      warn(
        `Concept '${node.id}' sourceRef '${sourceId}' has no source object.`,
      );
    }
  }
}

for (const relation of graph.links) {
  if (!conceptIds.has(relation.source)) {
    fail(`Relation source '${relation.source}' does not exist.`);
  }
  if (!conceptIds.has(relation.target)) {
    fail(`Relation target '${relation.target}' does not exist.`);
  }
  if (!validRelationTypes.has(relation.type)) {
    fail(
      `Relation '${relation.source} -> ${relation.target}' has invalid type '${relation.type}'.`,
    );
  }
  if (graphNodeById.get(relation.source)?.generated) {
    fail(`Relation source '${relation.source}' is generated.`);
  }
  if (graphNodeById.get(relation.target)?.generated) {
    fail(`Relation target '${relation.target}' is generated.`);
  }
  for (const sourceId of relation.evidence || []) {
    if (!sourceIds.has(sourceId)) {
      warn(
        `Relation '${relation.source} -> ${relation.target}' references unknown evidence '${sourceId}'.`,
      );
    }
  }
  for (const facet of relation.facets || []) {
    if (!validFacetNames.has(facet)) {
      fail(
        `Relation '${relation.source} -> ${relation.target}' uses invalid facet '${facet}'.`,
      );
    }
  }
}

for (const relation of relations) {
  if (!validRelationTypes.has(relation.type)) {
    fail(
      `Explicit relation '${relation.source} -> ${relation.target}' has invalid type '${relation.type}'.`,
    );
  }
  for (const facet of relation.facets || []) {
    if (!validFacetNames.has(facet)) {
      fail(
        `Explicit relation '${relation.source} -> ${relation.target}' uses invalid facet '${facet}'.`,
      );
    }
  }
}

const degree = new Map(graph.nodes.map((node) => [node.id, 0]));
for (const relation of graph.links) {
  degree.set(relation.source, (degree.get(relation.source) || 0) + 1);
  degree.set(relation.target, (degree.get(relation.target) || 0) + 1);
}

for (const source of sources) {
  if (
    (source.type === "exercise" || source.type === "pastExam") &&
    !drillsBySource.has(source.id)
  ) {
    fail(`Source '${source.id}' has no drill tied to that source.`);
  }
  if (strictSourceTypes.has(source.type) && !hasJustifiedContextOnly(source)) {
    const requiredCards = source.requiredCards || [];
    const requiredDrills = source.requiredDrills || [];
    const cardExempt = hasJustifiedCardExemption(source);
    const requiredConcepts = source.requiredConcepts || [];
    const requiredBundles = source.requiredBundles || [];

    if (!Array.isArray(source.requiredDrills) || requiredDrills.length === 0) {
      fail(`Source '${source.id}' must define non-empty requiredDrills.`);
    }

    if (source.type === "lecture") {
      if (
        !Array.isArray(source.requiredConcepts) ||
        requiredConcepts.length === 0
      ) {
        fail(`Lecture source '${source.id}' must define requiredConcepts.`);
      }
      if (!Array.isArray(source.requiredCards)) {
        fail(`Lecture source '${source.id}' must define requiredCards.`);
      }
    }

    if (!cardExempt && source.type !== "lecture") {
      if (!Array.isArray(source.requiredCards) || requiredCards.length === 0) {
        fail(
          `Source '${source.id}' must define requiredCards or a justified cardExemptReason.`,
        );
      }
      for (const cardId of requiredCards) {
        if (!codeCards[cardId]) {
          fail(`Source '${source.id}' requires missing code card '${cardId}'.`);
        }
      }
    }
    if (source.type === "lecture") {
      for (const cardId of requiredCards) {
        if (!codeCards[cardId]) {
          fail(
            `Lecture source '${source.id}' requires missing code card '${cardId}'.`,
          );
        }
      }
    }

    if (source.cardExempt === true && !cardExempt) {
      fail(`Source '${source.id}' has cardExempt without a reason.`);
    }

    for (const drillId of requiredDrills) {
      const drill = drillById.get(drillId);
      if (!drill) {
        fail(`Source '${source.id}' requires missing drill '${drillId}'.`);
        continue;
      }
      if (drill.source !== source.id) {
        fail(
          `Source '${source.id}' requires drill '${drillId}', but it is tied to '${drill.source || "no source"}'.`,
        );
      }
    }

    if (source.type === "lecture") {
      for (const conceptId of requiredConcepts) {
        const node = graphNodeById.get(conceptId);
        if (!node) {
          fail(
            `Lecture source '${source.id}' requires missing concept '${conceptId}'.`,
          );
          continue;
        }
        if (node.generated) {
          fail(
            `Lecture source '${source.id}' requires generated concept '${conceptId}'.`,
          );
        }
        if (!node.evidence || !node.evidence.includes(source.id)) {
          fail(
            `Lecture source '${source.id}' required concept '${conceptId}' has no source evidence.`,
          );
        }
        if ((degree.get(conceptId) || 0) === 0) {
          fail(
            `Lecture source '${source.id}' required concept '${conceptId}' is not connected by a relation.`,
          );
        }
        if (node.kind === "algorithm") {
          failMissingFacet(source, node, "representation");
          failMissingFacet(source, node, "mechanism");
          failMissingFacet(source, node, "proofRuntime");
          failMissingFacet(source, node, "examForm");
          if (
            !(
              node.facets?.cPattern?.length ||
              node.facets?.pseudocodePattern?.length
            )
          ) {
            fail(
              `Lecture source '${source.id}' requires algorithm concept '${conceptId}' without C or pseudocode facet.`,
            );
          }
        }
        if (node.kind === "dataStructure") {
          failMissingFacet(source, node, "representation");
          failMissingFacet(source, node, "mechanism");
          failMissingFacet(source, node, "examForm");
        }
        if (node.kind === "proofPattern") {
          failMissingFacet(source, node, "mechanism");
          failMissingFacet(source, node, "proofRuntime");
          failMissingFacet(source, node, "examForm");
        }
        if (isCHeavy(node)) {
          failMissingFacet(source, node, "cPattern");
          if (!node.evidence || !node.evidence.length) {
            fail(
              `Lecture source '${source.id}' requires C-heavy concept '${conceptId}' without evidence.`,
            );
          }
        }
      }
    }

    if (source.type === "exercise" || source.type === "pastExam") {
      if (
        !Array.isArray(source.requiredBundles) ||
        requiredBundles.length === 0
      ) {
        fail(`Source '${source.id}' must define non-empty requiredBundles.`);
      }
      for (const bundle of requiredBundles) {
        const node = graphNodeById.get(bundle.concept);
        if (!bundle.concept || !node) {
          fail(
            `Source '${source.id}' has requiredBundle with missing concept '${bundle.concept}'.`,
          );
          continue;
        }
        const facetEntries = Object.entries(bundle).filter(
          ([key]) => key !== "concept",
        );
        if (!facetEntries.length) {
          fail(
            `Source '${source.id}' requiredBundle for '${bundle.concept}' has no facet entries.`,
          );
        }
        for (const [facetName, values] of facetEntries) {
          if (!validFacetNames.has(facetName)) {
            fail(
              `Source '${source.id}' requiredBundle for '${bundle.concept}' uses invalid facet '${facetName}'.`,
            );
            continue;
          }
          if (!Array.isArray(values) || !values.length) {
            fail(
              `Source '${source.id}' requiredBundle for '${bundle.concept}' has empty ${facetName} facet.`,
            );
            continue;
          }
          for (const value of values) {
            if (!(node.facets?.[facetName] || []).includes(value)) {
              fail(
                `Source '${source.id}' requiredBundle for '${bundle.concept}' expects missing ${facetName} facet '${value}'.`,
              );
            }
          }
        }
      }
    }
  }
  if (source.contextOnly === true && !hasJustifiedContextOnly(source)) {
    fail(`Source '${source.id}' has contextOnly without a reason.`);
  }
  if (
    source.type === "pastExam" &&
    (!source.taskTypes || source.taskTypes.length === 0)
  ) {
    fail(`Past-exam source '${source.id}' has no task type.`);
  }
  for (const id of source.concepts || []) {
    if (!conceptIds.has(id))
      fail(`Source '${source.id}' references missing concept '${id}'.`);
    if (graphNodeById.get(id)?.generated) {
      fail(`Source '${source.id}' references generated concept '${id}'.`);
    }
  }
  for (const task of source.taskTypes || []) {
    if (!validTaskTypes.has(task))
      fail(`Source '${source.id}' uses invalid task type '${task}'.`);
  }
  for (const edge of source.strengthens || []) {
    const [a, b, type] = edge;
    if (!conceptIds.has(a))
      fail(`Source '${source.id}' strengthens missing concept '${a}'.`);
    if (!conceptIds.has(b))
      fail(`Source '${source.id}' strengthens missing concept '${b}'.`);
    if (!validRelationTypes.has(type))
      fail(`Source '${source.id}' uses invalid relation type '${type}'.`);
  }
}

for (const drill of drills) {
  if (!conceptIds.has(drill.concept)) {
    fail(`Drill '${drill.id}' references missing concept '${drill.concept}'.`);
  }
  if (drill.source && !sourceIds.has(drill.source)) {
    fail(`Drill '${drill.id}' references missing source '${drill.source}'.`);
  }
  for (const task of drill.taskTypes || []) {
    if (!validTaskTypes.has(task))
      fail(`Drill '${drill.id}' uses invalid task type '${task}'.`);
  }
}

for (const node of graph.nodes) {
  if (
    node.id !== "root" &&
    !node.generated &&
    (degree.get(node.id) || 0) === 0
  ) {
    warn(`Concept '${node.id}' is currently orphaned.`);
  }
}

for (const message of warnings) console.warn(`warn: ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`error: ${message}`);
  process.exit(1);
}

console.log(
  `Graph valid: ${graph.nodes.length} concepts, ${graph.links.length} relations, ${sources.length} sources, ${drills.length} drills.`,
);
