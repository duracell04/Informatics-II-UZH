import fs from "node:fs";
import vm from "node:vm";

const files = [
  "js/data.js",
  "js/codeCards.js",
  "js/crossLinks.js",
  "js/concepts.js",
  "js/relations.js",
  "js/sources.js",
  "js/drills.js",
  "js/graphBuilder.js",
  "js/semanticLayout.js",
];

export function loadGraphContext() {
  const context = {
    console,
    window: {},
  };
  vm.createContext(context);
  for (const file of files) {
    vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  }
  return vm.runInContext(
    `({
      data,
      codeCards,
      crossLinks,
      concepts,
      relations,
      sources,
      drills,
      relationTypes,
      taskTypeLabels,
      graph: buildSemanticGraph({
        data,
        concepts,
        relations,
        sources,
        drills,
        crossLinks,
        codeCards
      })
    })`,
    context,
  );
}
