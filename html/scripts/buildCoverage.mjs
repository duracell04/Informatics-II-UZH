import fs from "node:fs";
import path from "node:path";
import { htmlRoot, loadGraphContext } from "./graphLoader.mjs";

const { codeCards, sources, drills, graph } = loadGraphContext();
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const drillById = new Map(drills.map((drill) => [drill.id, drill]));
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

function bundleMissingReason(source, bundle) {
  const node = nodes.get(bundle.concept);
  if (!bundle.concept || !node) return `missing concept ${bundle.concept}`;
  const facetEntries = Object.entries(bundle).filter(
    ([key]) => key !== "concept",
  );
  if (!facetEntries.length) return `${bundle.concept}: no facets`;
  const missing = [];
  for (const [facetName, values] of facetEntries) {
    if (!Array.isArray(values) || !values.length) {
      missing.push(`${bundle.concept}.${facetName}: empty`);
      continue;
    }
    for (const value of values) {
      if (!(node.facets?.[facetName] || []).includes(value)) {
        missing.push(`${bundle.concept}.${facetName}: ${value}`);
      }
    }
  }
  return missing.join("; ");
}

function sourceCoverage(source) {
  const strict = ["lecture", "exercise", "pastExam"].includes(source.type);
  const contextOnly = hasJustifiedContextOnly(source);
  const requiredConcepts = source.requiredConcepts || [];
  const requiredCards = source.requiredCards || [];
  const requiredDrills = source.requiredDrills || [];
  const requiredBundles = source.requiredBundles || [];
  const missingConcepts = requiredConcepts.filter((id) => !nodes.has(id));
  const missingCards = requiredCards.filter((cardId) => !codeCards[cardId]);
  const missingDrills = requiredDrills.filter((drillId) => {
    const drill = drillById.get(drillId);
    return !drill || drill.source !== source.id;
  });
  const missingBundles = requiredBundles
    .map((bundle) => bundleMissingReason(source, bundle))
    .filter(Boolean);

  let status = "complete";
  if (contextOnly) {
    status = "contextOnly";
  } else if (strict) {
    const missingRequiredConceptMetadata =
      source.type === "lecture" &&
      (!Array.isArray(source.requiredConcepts) ||
        requiredConcepts.length === 0);
    const missingRequiredCardMetadata =
      source.type !== "lecture" &&
      !hasJustifiedCardExemption(source) &&
      (!Array.isArray(source.requiredCards) || requiredCards.length === 0);
    const missingRequiredDrillMetadata =
      !Array.isArray(source.requiredDrills) || requiredDrills.length === 0;
    const missingBundleMetadata =
      source.type !== "lecture" &&
      (!Array.isArray(source.requiredBundles) || requiredBundles.length === 0);

    if (
      missingRequiredConceptMetadata ||
      missingRequiredCardMetadata ||
      missingRequiredDrillMetadata ||
      missingBundleMetadata
    ) {
      status = "missing";
    } else if (
      missingConcepts.length ||
      missingCards.length ||
      missingDrills.length ||
      missingBundles.length
    ) {
      status = "partial";
    }
  }

  return {
    status,
    requiredConcepts,
    requiredCards,
    requiredDrills,
    requiredBundles,
    missingConcepts,
    missingCards,
    missingDrills,
    missingBundles,
  };
}

function sourceRows(group) {
  return group.map((source) => {
    const sourceNodes = (source.concepts || [])
      .map((id) => nodes.get(id))
      .filter(Boolean);
    const coverage = sourceCoverage(source);
    const hasConceptDrill = sourceNodes.some((node) =>
      drillsByConcept.has(node.id),
    );
    return [
      source.id,
      coverage.status,
      source.title,
      yesNo(sourceNodes.length),
      yesNo(sourceNodes.some(hasCodeCard)),
      yesNo(hasConceptDrill),
      yesNo(drillsBySource.has(source.id)),
      `${coverage.requiredConcepts.length - coverage.missingConcepts.length}/${coverage.requiredConcepts.length}`,
      coverage.missingConcepts.join(", ") || "none",
      `${coverage.requiredCards.length - coverage.missingCards.length}/${coverage.requiredCards.length}`,
      coverage.missingCards.join(", ") || "none",
      `${coverage.requiredDrills.length - coverage.missingDrills.length}/${coverage.requiredDrills.length}`,
      coverage.missingDrills.join(", ") || "none",
      `${coverage.requiredBundles.length - coverage.missingBundles.length}/${coverage.requiredBundles.length}`,
      coverage.missingBundles.join("; ") || "none",
      (source.taskTypes || []).join(", "),
    ];
  });
}

function sourceTable(title, group) {
  return `## ${title}

${markdownTable(
  [
    "Source",
    "Status",
    "Title",
    "Concepts",
    "Code card",
    "Concept drill",
    "Source drill",
    "Req concepts",
    "Missing concepts",
    "Req cards",
    "Missing cards",
    "Req drills",
    "Missing drills",
    "Req bundles",
    "Missing bundles",
    "Task types",
  ],
  sourceRows(group),
)}`;
}

const highPriorityDrillThreshold = 3.5;
const generatedNodes = graph.nodes.filter((node) => node.generated);
const highPriorityWithoutDrill = graph.nodes.filter(
  (node) =>
    node.id !== "root" &&
    (node.priority || 0) >= highPriorityDrillThreshold &&
    !drillsByConcept.has(node.id),
);

const lectureSources = sources.filter((source) => source.type === "lecture");
const exerciseSources = sources.filter((source) => source.type === "exercise");
const pastExamSources = sources.filter((source) => source.type === "pastExam");
const uncoveredLectureSources = lectureSources.filter(
  (source) =>
    !["complete", "contextOnly"].includes(sourceCoverage(source).status),
);
const uncoveredExerciseSources = exerciseSources.filter(
  (source) =>
    !["complete", "contextOnly"].includes(sourceCoverage(source).status),
);
const uncoveredPastExamSources = pastExamSources.filter(
  (source) =>
    !["complete", "contextOnly"].includes(sourceCoverage(source).status),
);
const lectureCoverage = lectureSources.map(sourceCoverage);
const missingLectureConceptCount = lectureCoverage.reduce(
  (sum, coverage) => sum + coverage.missingConcepts.length,
  0,
);
const missingLectureCardCount = lectureCoverage.reduce(
  (sum, coverage) => sum + coverage.missingCards.length,
  0,
);
const missingLectureDrillCount = lectureCoverage.reduce(
  (sum, coverage) => sum + coverage.missingDrills.length,
  0,
);
const uncoveredHighPriority = highPriorityWithoutDrill.length
  ? highPriorityWithoutDrill
      .map((node) => `${node.id} (${node.priority.toFixed(2)})`)
      .join(", ")
  : "none";

const table = `## Coverage Dashboard

Generated from \`html/js/sources.js\`.

- Sources: ${sources.length}
- Concepts: ${graph.nodes.length}
- Drills: ${drills.length}
- Missing lecture required concepts: ${missingLectureConceptCount}
- Missing lecture required cards: ${missingLectureCardCount}
- Missing lecture required drills: ${missingLectureDrillCount}
- Uncovered lecture sources: ${uncoveredLectureSources.length} (${uncoveredLectureSources.map((source) => source.id).join(", ") || "none"})
- Uncovered exercise sources: ${uncoveredExerciseSources.length} (${uncoveredExerciseSources.map((source) => source.id).join(", ") || "none"})
- Uncovered past-exam sources: ${uncoveredPastExamSources.length} (${uncoveredPastExamSources.map((source) => source.id).join(", ") || "none"})
- Generated placeholders: ${generatedNodes.length}
- High-priority concepts without drills: ${uncoveredHighPriority}

Alias notes: \`biggestPlus\` = \`bigPlus\`; all simple paths = \`allPaths\`; k-hop = \`khop\`; DAG shortest paths = \`dagSSSP\`; arbitrage transform = \`arbitrageTransform\`.

${sourceTable("Lecture Coverage SL01-SL10", lectureSources)}

${sourceTable("Exercise Coverage Ex00-Ex11", exerciseSources)}

${sourceTable("Past Exam Coverage FS23-FS25", pastExamSources)}
`;

const readmePath = path.resolve(htmlRoot, "..", "README.md");
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
