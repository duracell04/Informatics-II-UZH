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
const conceptIds = new Set(graph.nodes.map((node) => node.id));
const sourceIds = new Set(sources.map((source) => source.id));
const validTaskTypes = new Set(Object.keys(taskTypeLabels));
const validRelationTypes = new Set(relationTypes);
const graphNodeById = new Map(graph.nodes.map((node) => [node.id, node]));
const drillsByConcept = new Map();
const drillsBySource = new Map();
const highPriorityDrillThreshold = 3.5;

for (const drill of drills) {
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
}

for (const relation of relations) {
  if (!validRelationTypes.has(relation.type)) {
    fail(
      `Explicit relation '${relation.source} -> ${relation.target}' has invalid type '${relation.type}'.`,
    );
  }
}

for (const source of sources) {
  if (
    (source.type === "exercise" || source.type === "pastExam") &&
    !drillsBySource.has(source.id)
  ) {
    fail(`Source '${source.id}' has no drill tied to that source.`);
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

const degree = new Map(graph.nodes.map((node) => [node.id, 0]));
for (const relation of graph.links) {
  degree.set(relation.source, (degree.get(relation.source) || 0) + 1);
  degree.set(relation.target, (degree.get(relation.target) || 0) + 1);
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
