import fs from "node:fs";
import { loadGraphContext } from "./graphLoader.mjs";

const { codeCards, sources, drills, graph } = loadGraphContext();
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const drillsByConcept = new Map();
const drillsBySource = new Map();
for (const drill of drills) {
  if (!drillsByConcept.has(drill.concept))
    drillsByConcept.set(drill.concept, []);
  drillsByConcept.get(drill.concept).push(drill);
  if (drill.source) {
    if (!drillsBySource.has(drill.source)) drillsBySource.set(drill.source, []);
    drillsBySource.get(drill.source).push(drill);
  }
}

function yesNo(value) {
  return value ? "yes" : "no";
}

function markdownTable(headers, rows) {
  const allRows = [headers, ...rows];
  const widths = headers.map((_, index) =>
    Math.max(...allRows.map((row) => String(row[index] || "").length)),
  );
  const formatRow = (row) =>
    `| ${row
      .map((cell, index) => String(cell || "").padEnd(widths[index], " "))
      .join(" | ")} |`;
  return [
    formatRow(headers),
    formatRow(widths.map((width) => "-".repeat(width))),
    ...rows.map(formatRow),
  ].join("\n");
}

const rows = sources.map((source) => {
  const sourceNodes = (source.concepts || [])
    .map((id) => nodes.get(id))
    .filter(Boolean);
  const hasCard = sourceNodes.some((node) => node.card && codeCards[node.card]);
  const hasConceptDrill = sourceNodes.some((node) =>
    drillsByConcept.has(node.id),
  );
  const hasSourceDrill = drillsBySource.has(source.id);
  const taskTypes = (source.taskTypes || []).join(", ");
  return [
    source.id,
    source.type,
    source.title,
    yesNo(sourceNodes.length),
    yesNo(hasCard),
    yesNo(hasConceptDrill),
    yesNo(hasSourceDrill),
    taskTypes,
  ];
});

const highPriorityDrillThreshold = 3.5;
const generatedNodes = graph.nodes.filter((node) => node.generated);
const highPriorityWithoutDrill = graph.nodes.filter(
  (node) =>
    node.id !== "root" &&
    (node.priority || 0) >= highPriorityDrillThreshold &&
    !drillsByConcept.has(node.id),
);
const sourcesWithDrills = sources.filter((source) =>
  drillsBySource.has(source.id),
);
const exerciseExamSources = sources.filter(
  (source) => source.type === "exercise" || source.type === "pastExam",
);
const exerciseExamSourcesWithDrills = exerciseExamSources.filter((source) =>
  drillsBySource.has(source.id),
);
const uncoveredHighPriority = highPriorityWithoutDrill.length
  ? highPriorityWithoutDrill
      .map((node) => `${node.id} (${node.priority.toFixed(2)})`)
      .join(", ")
  : "none";

const table = `## Coverage Dashboard

Generated from \`js/sources.js\`.

- Sources: ${sources.length}
- Concepts: ${graph.nodes.length}
- Drills: ${drills.length}
- Source drill coverage: ${sourcesWithDrills.length}/${sources.length}
- Exercise/exam drill coverage: ${exerciseExamSourcesWithDrills.length}/${exerciseExamSources.length}
- Generated placeholders: ${generatedNodes.length}
- High-priority concepts without drills: ${uncoveredHighPriority}

${markdownTable(
  [
    "Source",
    "Type",
    "Title",
    "Concepts",
    "Code card",
    "Concept drill",
    "Source drill",
    "Task types",
  ],
  rows,
)}
`;

const readmePath = "README.md";
const current = fs.readFileSync(readmePath, "utf8");
const start = current.indexOf("## Coverage Dashboard");
const end = current.indexOf("## Local Commands");
let next;
if (start !== -1 && end !== -1 && end > start) {
  next = `${current.slice(0, start)}${table}\n${current.slice(end)}`;
} else {
  next = `${current.trim()}\n\n${table}\n`;
}
fs.writeFileSync(readmePath, next);
console.log(`Coverage table updated for ${sources.length} sources.`);
