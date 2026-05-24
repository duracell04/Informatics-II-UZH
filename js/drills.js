const drills = [
  {
    id: "drill-bubble-pass",
    concept: "bubble",
    taskTypes: ["traceArray", "countComparisons"],
    prompt:
      "Trace the array after every full Bubble Sort pass and count swaps.",
  },
  {
    id: "drill-swap-users",
    concept: "swap",
    taskTypes: ["writeC"],
    prompt: "Write an array-index swap and name five algorithms that use it.",
  },
  {
    id: "drill-kth-stack",
    concept: "kthLargestStack",
    source: "FS24-Q6",
    taskTypes: ["adtOnly", "runtime"],
    prompt: "Find kth-largest while using only push, pop and isEmpty.",
  },
  {
    id: "drill-frequency-sort",
    concept: "counting",
    source: "FS25-Q-sortK",
    taskTypes: ["writeC", "runtime"],
    prompt: "Design a frequency-array sort and justify O(n+k).",
  },
  {
    id: "drill-dp-table",
    concept: "dpTemplate",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "recurrence"],
    prompt:
      "State the helper-table meaning, recurrence, base cases and fill order.",
  },
  {
    id: "drill-dijkstra-relax",
    concept: "dijkstra",
    source: "FS24-Q-Dijkstra",
    taskTypes: ["manualTrace", "runtime"],
    prompt:
      "Trace extracted vertex, relaxed edge, old distance, new distance and predecessor.",
  },
  {
    id: "drill-bfs-khop",
    concept: "bfs",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace"],
    prompt: "Use BFS queue state to list all vertices within k hops.",
  },
];
