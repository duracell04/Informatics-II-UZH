const drills = [
  {
    id: "drill-sl01-search-spec",
    concept: "linearSearchVariants",
    source: "SL01",
    taskTypes: ["traceArray", "edgeCase"],
    prompt:
      "Trace a missing-target linear search and state exactly which index or sentinel is returned.",
  },
  {
    id: "drill-sl02-binary-insertion",
    concept: "binaryInsertionSortNuance",
    source: "SL02",
    taskTypes: ["runtime"],
    prompt:
      "Explain why binary search does not improve insertion sort's worst-case asymptotic runtime.",
  },
  {
    id: "drill-sl03-master-worksheet",
    concept: "masterWorksheet",
    source: "SL03",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Fill a, b, f(n), comparison term and case/non-case for a recurrence.",
  },
  {
    id: "drill-sl04-heap-trace",
    concept: "heapTraceTable",
    source: "SL04",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Trace heap extraction with active heap size, exchange, heapify path and resulting array.",
  },
  {
    id: "drill-sl05-pointer-addresses",
    concept: "pointerPrintAddresses",
    source: "SL05",
    taskTypes: ["traceOutput"],
    prompt:
      "Given int a and int *p, label &a, p, &p and *p before predicting printf output.",
  },
  {
    id: "drill-sl06-bst-vs-heap",
    concept: "bstVsHeap",
    source: "SL06",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt:
      "Decide whether inorder printing is sorted for a BST, min-heap or arbitrary binary tree.",
  },
  {
    id: "drill-sl07-probing-delete",
    concept: "tombstoneRepair",
    source: "SL07",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt:
      "Delete from a linear-probing hash table and explain tombstone vs cluster reinsertion repair.",
  },
  {
    id: "drill-sl08-dp-reconstruction",
    concept: "solutionReconstruction",
    source: "SL08",
    taskTypes: ["fillHelperTable", "pseudocode"],
    prompt:
      "Identify which helper table stores values and which stores choices for reconstruction.",
  },
  {
    id: "drill-sl09-bfs-dfs-order",
    concept: "possibleBfsSequence",
    source: "SL09",
    taskTypes: ["manualTrace"],
    prompt:
      "Reject or accept a proposed BFS order by checking layer consistency.",
  },
  {
    id: "drill-sl10-prim-trace",
    concept: "primTrace",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime"],
    prompt:
      "Trace Prim-Jarnik with extracted vertex, candidate edge, old key, new key and predecessor.",
  },
  {
    id: "drill-ex00-c-basics",
    concept: "secondLargest",
    source: "Ex00",
    taskTypes: ["writeC", "traceArray", "runtime"],
    prompt:
      "Write one-pass second-largest code and trace largest/second-largest on an edge case.",
  },
  {
    id: "drill-ex01-hilbert-length",
    concept: "hilbertLengthRecurrence",
    source: "Ex01",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Solve or expand H(i)=2H(i-1)+3*l/2^i with H(0)=0 and contrast it with drawing-call work.",
  },
  {
    id: "drill-ex02-recursive-output",
    concept: "binaryPrint",
    source: "Ex02",
    taskTypes: ["traceOutput", "recurrence"],
    prompt:
      "Trace recursive binary printing with the printf before recursion and after recursion.",
  },
  {
    id: "drill-ex03-algo1-proof",
    concept: "topKSelectionAnalysis",
    source: "Ex03",
    taskTypes: ["runtime", "invariant"],
    prompt:
      "State precondition, postcondition, loop invariant and exact comparison sum for top-k selection.",
  },
  {
    id: "drill-ex04-recurrences",
    concept: "backwardSubstitution",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Expand T(n)=2T(n/2)+n until the base case and sum the level costs.",
  },
  {
    id: "drill-ex05-dual-pivot",
    concept: "dualPivotTrace",
    source: "Ex05",
    taskTypes: ["manualTrace", "traceArray"],
    prompt:
      "Trace low, high, lt, i, gt and the three regions of dual-pivot quicksort.",
  },
  {
    id: "drill-ex06-pointer-offset",
    concept: "pointerOffsetSwap",
    source: "Ex06",
    taskTypes: ["traceArray", "writeC"],
    prompt:
      "Trace swap(&A[1], 2, 3) by translating logical indices to physical array slots.",
  },
  {
    id: "drill-ex07-reverse-even",
    concept: "reverseEven",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode"],
    prompt:
      "Reverse even queue elements using only the listed queue and stack operations.",
  },
  {
    id: "drill-ex08-avl-cases",
    concept: "avlExactCases",
    source: "Ex08",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Classify an AVL imbalance as LL, RR, LR or RL and return the new subtree root.",
  },
  {
    id: "drill-ex09-open-addressing",
    concept: "linearProbe",
    source: "Ex09",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt:
      "Insert keys with linear probing and show the probe sequence until an empty slot appears.",
  },
  {
    id: "drill-ex10-big-plus",
    concept: "bigPlus",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "runtime"],
    prompt:
      "Fill top, bottom, left and right helper tables and compute the biggest plus area.",
  },
  {
    id: "drill-ex11-khop",
    concept: "kHopExact",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace"],
    prompt:
      "Run BFS from a source and list exactly the vertices whose distance is k.",
  },
  {
    id: "drill-fs23-linked-list-procedurex",
    concept: "linkedListRearrangementTrace",
    source: "FS23-linked-list-procedureX",
    taskTypes: ["manualTrace", "traceOutput"],
    prompt:
      "Trace h, cur, next and relinked next fields for a linked-list procedure.",
  },
  {
    id: "drill-fs23-buildheap-exchanges",
    concept: "buildHeapExchangeCount",
    source: "FS23-BuildHeap-exchange-count",
    taskTypes: ["manualTrace"],
    prompt: "Run BuildHeap bottom-up and count only swaps, not comparisons.",
  },
  {
    id: "drill-fs23-red-black-warning",
    concept: "redBlackHistorical",
    source: "FS23-red-black-historical",
    taskTypes: ["drawDataStructure"],
    prompt:
      "Summarize the red-black insertion warning and contrast its priority with AVL rotations.",
  },
  {
    id: "drill-fs23-master-none",
    concept: "masterWorksheet",
    source: "FS23-Master-method-none-case",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Explain why a recurrence does not match a Master Method case and choose another proof method.",
  },
  {
    id: "drill-fs23-inversion-count",
    concept: "mergeHelper",
    source: "FS23-inversion-count",
    taskTypes: ["runtime", "pseudocode"],
    prompt:
      "Add inversion counting to merge and justify the runtime recurrence.",
  },
  {
    id: "drill-fs23-log-loops",
    concept: "logLoops",
    source: "FS23-logarithmic-nested-loops",
    taskTypes: ["runtime"],
    prompt:
      "Count nested loops where one variable repeatedly doubles or halves.",
  },
  {
    id: "drill-fs23-asymptotic-tf",
    concept: "functionGrowthRanking",
    source: "FS23-asymptotic-true-false",
    taskTypes: ["runtime"],
    prompt:
      "Rank a mixed list of logarithmic, polynomial, exponential and factorial functions.",
  },
  {
    id: "drill-fs23-sieve-bounds",
    concept: "sieve",
    source: "FS23-sieve-loop-bounds",
    taskTypes: ["writeC", "edgeCase"],
    prompt:
      "Justify p*p <= n and starting the marking loop at p*p in the sieve.",
  },
  {
    id: "drill-fs23-dfs-edge-classification",
    concept: "dfsEdgeCode",
    source: "FS23-DFS-edge-classification",
    taskTypes: ["manualTrace"],
    prompt: "Classify DFS edges using color and discovery/finish times.",
  },
  {
    id: "drill-fs23-edit-distance",
    concept: "editDistance",
    source: "FS23-edit-distance-C",
    taskTypes: ["fillHelperTable", "writeC"],
    prompt:
      "Fill the edit-distance helper table and name the insert/delete/replace transitions.",
  },
  {
    id: "drill-fs23-stack-sorting",
    concept: "stackSort",
    source: "FS23-stack-sorting",
    taskTypes: ["adtOnly", "runtime"],
    prompt:
      "Sort or select with stack-only operations and state the legal operation set.",
  },
  {
    id: "drill-fs24-q1-run-length",
    concept: "backwardRunLength",
    source: "FS24-Q1",
    taskTypes: ["traceOutput", "manualTrace"],
    prompt:
      "Trace i, num, count and print events for backward run-length output.",
  },
  {
    id: "drill-fs24-q2-recursive-output",
    concept: "traceOutput",
    source: "FS24-Q2-recursive-F-output",
    taskTypes: ["traceOutput"],
    prompt: "Make a call-stack table and record print events in exact order.",
  },
  {
    id: "drill-fs24-q3-recurrence",
    concept: "master",
    source: "FS24-Q3-recurrence-3T(n/3)+n",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Solve T(n)=3T(n/3)+n with the Master Method and verify by expansion.",
  },
  {
    id: "drill-fs24-q4-pointer-changes",
    concept: "linkedListRearrangementTrace",
    source: "FS24-Q4-min-pointer-changes",
    taskTypes: ["manualTrace", "writeC"],
    prompt:
      "Find the minimum next-pointer changes needed for a list rearrangement.",
  },
  {
    id: "drill-fs24-q6-kth-stack",
    concept: "kthLargestStack",
    source: "FS24-Q6",
    taskTypes: ["adtOnly", "runtime"],
    prompt: "Find kth-largest while using only push, pop and isEmpty.",
  },
  {
    id: "drill-fs24-q7-log-loop",
    concept: "bestWorstAvg",
    source: "FS24-Q7-best-worst-log-loop",
    taskTypes: ["runtime", "edgeCase"],
    prompt:
      "Identify the input branch that gives the best and worst loop count.",
  },
  {
    id: "drill-fs24-dijkstra",
    concept: "dijkstraTrace",
    source: "FS24-Q-Dijkstra",
    taskTypes: ["manualTrace", "runtime"],
    prompt:
      "Trace extracted vertex, relaxed edge, old distance, candidate, new distance and predecessor.",
  },
  {
    id: "drill-fs24-simple-paths",
    concept: "allSimplePathsCount",
    source: "FS24-graph-simple-paths",
    taskTypes: ["pseudocode", "runtime"],
    prompt:
      "Count simple paths with path-local visited state and unmark on return.",
  },
  {
    id: "drill-fs24-linear-probing",
    concept: "openAddress",
    source: "FS24-open-addressing-linear-probing",
    taskTypes: ["manualTrace"],
    prompt:
      "Trace every probe for open addressing and stop only at an empty slot.",
  },
  {
    id: "drill-fs24-sort3",
    concept: "sort3",
    source: "FS24-Sort3",
    taskTypes: ["traceArray", "writeC"],
    prompt: "Trace the three regions of Sort3 after every swap.",
  },
  {
    id: "drill-fs24-max-product-three",
    concept: "selectionLogic",
    source: "FS24-maximum-product-three-values",
    taskTypes: ["writeC", "edgeCase"],
    prompt:
      "Track the needed largest and smallest values for a maximum product of three.",
  },
  {
    id: "drill-fs24-max-product-subarray",
    concept: "maxProduct",
    source: "FS24-max-product-subarray",
    taskTypes: ["fillHelperTable", "runtime"],
    prompt:
      "Trace maxHere, minHere and best across positive, negative and zero values.",
  },
  {
    id: "drill-fs25-selection-sort",
    concept: "selection",
    source: "FS25-selection-sort",
    taskTypes: ["writeC", "traceArray"],
    prompt:
      "Trace selection sort by recording the selected minimum and swap per outer pass.",
  },
  {
    id: "drill-fs25-sortk",
    concept: "counting",
    source: "FS25-sortK-frequency-array",
    taskTypes: ["writeC", "runtime"],
    prompt: "Build and consume a frequency array, then justify O(n+k).",
  },
  {
    id: "drill-fs25-sortk-alias",
    concept: "frequencyArray",
    source: "FS25-Q-sortK",
    taskTypes: ["writeC", "runtime"],
    prompt:
      "Initialize the frequency array before counting and explain the direct-address assumption.",
  },
  {
    id: "drill-fs25-htinsert",
    concept: "chainingOrder",
    source: "FS25-HTInsert-chaining",
    taskTypes: ["manualTrace", "writeC"],
    prompt:
      "Insert chained hash-table keys and preserve the required chain order.",
  },
  {
    id: "drill-fs25-overlap",
    concept: "printOverlap",
    source: "FS25-print-overlap",
    taskTypes: ["writeC", "runtime"],
    prompt:
      "Insert one array into a hash table and print elements from the other array that are found.",
  },
  {
    id: "drill-fs25-shortest-root-leaf-bfs",
    concept: "shortestRootLeaf",
    source: "FS25-shortest-root-leaf-BFS",
    taskTypes: ["pseudocode", "runtime"],
    prompt: "Use a queue and return when the first leaf is dequeued.",
  },
  {
    id: "drill-fs25-shortest-root-leaf-rec",
    concept: "shortestRootLeaf",
    source: "FS25-shortest-root-leaf-recursive",
    taskTypes: ["pseudocode", "edgeCase"],
    prompt:
      "Write the recursive shortest root-leaf distance with empty-child base cases.",
  },
  {
    id: "drill-fs25-substitution-tree",
    concept: "substitution",
    source: "FS25-substitution-proof-tree-runtime",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Prove a tree-recursion runtime bound by substitution with a clear base case.",
  },
  {
    id: "drill-fs25-nearest-zero",
    concept: "nearestZero",
    source: "FS25-nearest-zero-DP",
    taskTypes: ["fillHelperTable", "runtime"],
    prompt:
      "Run directional DP passes to compute nearest-zero matrix distances.",
  },
  {
    id: "drill-core-scan-boundaries",
    concept: "scan",
    taskTypes: ["traceArray", "edgeCase"],
    prompt:
      "Build a trace table for a one-pass scan, including index bounds and update state.",
  },
  {
    id: "drill-core-boundaries",
    concept: "boundaries",
    taskTypes: ["traceArray", "edgeCase"],
    prompt:
      "Mark the first valid, last valid and first invalid index for an array algorithm.",
  },
  {
    id: "drill-core-matrix",
    concept: "matrix",
    taskTypes: ["writeC", "fillHelperTable"],
    prompt:
      "Choose row and column loop bounds for a matrix task and identify the answer cell or diagonal cells.",
  },
  {
    id: "drill-core-exact-analysis",
    concept: "exactAnalysisWorkflow",
    taskTypes: ["runtime"],
    prompt:
      "Count exact loop executions first, then simplify the resulting formula to Theta notation.",
  },
  {
    id: "drill-core-recurrences",
    concept: "recurrences",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Translate recursive calls and nonrecursive work into a recurrence before solving it.",
  },
  {
    id: "drill-core-invariant",
    concept: "invariant",
    taskTypes: ["invariant"],
    prompt:
      "Write initialization, maintenance and termination bullets for a loop invariant.",
  },
  {
    id: "drill-core-edge-cases",
    concept: "edgeCases",
    taskTypes: ["edgeCase"],
    prompt:
      "List the smallest, empty, missing-target and boundary cases for a proposed algorithm.",
  },
  {
    id: "drill-core-binary-search",
    concept: "binarySearch",
    taskTypes: ["traceArray", "runtime"],
    prompt:
      "Trace l, r and m for binary search on a missing target and justify logarithmic runtime.",
  },
  {
    id: "drill-core-stack",
    concept: "stack",
    taskTypes: ["adtOnly", "manualTrace"],
    prompt: "Draw stack state after a sequence of push and pop operations.",
  },
  {
    id: "drill-core-chaining",
    concept: "chaining",
    taskTypes: ["manualTrace", "writeC"],
    prompt:
      "Draw final hash chains and state whether insertion is at head or tail.",
  },
  {
    id: "drill-core-delete-hash",
    concept: "deleteHash",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt: "Delete from an open-address table and repair search correctness.",
  },
  {
    id: "drill-core-heapify",
    concept: "heapify",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Trace heapify by selecting the larger child and counting each real exchange.",
  },
  {
    id: "drill-core-build-heap",
    concept: "buildHeap",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Run heapify from floor(n/2)-1 down to 0 and record the array after each exchange.",
  },
  {
    id: "drill-core-dp-template",
    concept: "dpTemplate",
    taskTypes: ["fillHelperTable", "recurrence"],
    prompt:
      "State DP state meaning, base cases, recurrence, fill order, answer cell and runtime.",
  },
  {
    id: "drill-core-dp-runtime-memory",
    concept: "dpRuntimeMemory",
    taskTypes: ["runtime", "fillHelperTable"],
    prompt:
      "Compute DP runtime as number of states times transition cost and state the memory use.",
  },
  {
    id: "drill-core-graph-state",
    concept: "graphState",
    taskTypes: ["manualTrace"],
    prompt:
      "Track color, predecessor, distance and timestamps for a graph traversal.",
  },
  {
    id: "drill-core-dfs",
    concept: "dfs",
    taskTypes: ["pseudocode", "manualTrace"],
    prompt:
      "Trace DFS recursion and mark discovery, finish and predecessor state.",
  },
  {
    id: "drill-sl10-min-edge-mst",
    concept: "minimumEdgeMstProof",
    source: "SL10",
    taskTypes: ["invariant", "edgeCase"],
    prompt:
      "Prove by exchange that a minimum-weight edge belongs to some MST, including ties.",
  },
];
