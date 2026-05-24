import fs from "node:fs";
import { loadGraphContext } from "./graphLoader.mjs";

const { codeCards, sources, drills, graph } = loadGraphContext();
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const drillsByConcept = new Map();
for (const drill of drills) {
  if (!drillsByConcept.has(drill.concept))
    drillsByConcept.set(drill.concept, []);
  drillsByConcept.get(drill.concept).push(drill);
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
  const hasDrill = sourceNodes.some((node) => drillsByConcept.has(node.id));
  const taskTypes = (source.taskTypes || []).join(", ");
  return [
    source.id,
    source.type,
    source.title,
    yesNo(sourceNodes.length),
    yesNo(hasCard),
    yesNo(hasDrill),
    taskTypes,
  ];
});

const table = `## Coverage Dashboard

Generated from \`js/sources.js\`.

${markdownTable(
  ["Source", "Type", "Title", "Concepts", "Code card", "Drill", "Task types"],
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
