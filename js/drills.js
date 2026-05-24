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
  {
    id: "drill-ex00-compile-run-c",
    concept: "compileRunC",
    source: "Ex00",
    taskTypes: ["writeC", "traceOutput", "traceArray", "runtime"],
    prompt:
      "Reconstruct the Compile and run C card for Ex00 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex00-linear-search-variants",
    concept: "linearSearchVariants",
    source: "Ex00",
    taskTypes: ["writeC", "traceOutput", "traceArray", "runtime"],
    prompt:
      "Reconstruct the Linear search variants card for Ex00 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex00-diagonal-sum",
    concept: "diagonalSum",
    source: "Ex00",
    taskTypes: ["writeC", "traceOutput", "traceArray", "runtime"],
    prompt:
      "Reconstruct the Main diagonal sum card for Ex00 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex01-bubble",
    concept: "bubble",
    source: "Ex01",
    taskTypes: ["writeC", "traceArray", "countComparisons", "recurrence"],
    prompt:
      "Reconstruct the Bubble Sort using swap() card for Ex01 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex01-xsort",
    concept: "xsort",
    source: "Ex01",
    taskTypes: ["writeC", "traceArray", "countComparisons", "recurrence"],
    prompt:
      "Reconstruct the XSort / cocktail-style bubble card for Ex01 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex01-pair-sum",
    concept: "pairSum",
    source: "Ex01",
    taskTypes: ["writeC", "traceArray", "countComparisons", "recurrence"],
    prompt:
      "Reconstruct the Pair sum: naive card for Ex01 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex01-command-line-input",
    concept: "commandLineInput",
    source: "Ex01",
    taskTypes: ["writeC", "traceArray", "countComparisons", "recurrence"],
    prompt:
      "Reconstruct the argc / argv / sscanf matrix task card for Ex01 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex02-pal-rec",
    concept: "palRec",
    source: "Ex02",
    taskTypes: ["traceOutput", "writeC", "recurrence", "edgeCase"],
    prompt:
      "Reconstruct the Palindrome recursion card for Ex02 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex02-hanoi",
    concept: "hanoi",
    source: "Ex02",
    taskTypes: ["traceOutput", "writeC", "recurrence", "edgeCase"],
    prompt:
      "Reconstruct the Tower of Hanoi with digit pegs card for Ex02 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex02-pyramid",
    concept: "pyramid",
    source: "Ex02",
    taskTypes: ["traceOutput", "writeC", "recurrence", "edgeCase"],
    prompt:
      "Reconstruct the Triangle / pyramid recursion card for Ex02 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex02-c-strings",
    concept: "cStrings",
    source: "Ex02",
    taskTypes: ["traceOutput", "writeC", "recurrence", "edgeCase"],
    prompt:
      "Reconstruct the C strings and indexing card for Ex02 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex03-binary-search",
    concept: "binarySearch",
    source: "Ex03",
    taskTypes: ["runtime", "invariant", "pseudocode", "edgeCase"],
    prompt:
      "Reconstruct the Binary Search card for Ex03 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex03-count-occurrence-sorted",
    concept: "countOccurrenceSorted",
    source: "Ex03",
    taskTypes: ["runtime", "invariant", "pseudocode", "edgeCase"],
    prompt:
      "Reconstruct the Count occurrences with sorted helper array card for Ex03 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex03-function-growth-ranking",
    concept: "functionGrowthRanking",
    source: "Ex03",
    taskTypes: ["runtime", "invariant", "pseudocode", "edgeCase"],
    prompt:
      "Reconstruct the Function growth ranking card for Ex03 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex03-coupled-loop-sum",
    concept: "coupledLoopSum",
    source: "Ex03",
    taskTypes: ["runtime", "invariant", "pseudocode", "edgeCase"],
    prompt:
      "Reconstruct the Coupled-loop sum card for Ex03 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex03-exact-analysis-workflow",
    concept: "exactAnalysisWorkflow",
    source: "Ex03",
    taskTypes: ["runtime", "invariant", "pseudocode", "edgeCase"],
    prompt:
      "Reconstruct the Exact-analysis workflow card for Ex03 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-binary-search",
    concept: "binarySearch",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Binary Search card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-max-subarray",
    concept: "maxSubarray",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Maximum subarray D&C card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-ta-recurrence",
    concept: "taRecurrence",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Ta(n)=2Ta(n-1)+c recurrence card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-substitution",
    concept: "substitution",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Substitution proof card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-asymmetric-recursion-tree",
    concept: "asymmetricRecursionTree",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Asymmetric recursion tree card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-master-worksheet",
    concept: "masterWorksheet",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Master Method worksheet card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex04-dynamic-array-growth",
    concept: "dynamicArrayGrowth",
    source: "Ex04",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Dynamic array growth card for Ex04 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-heap-sort",
    concept: "heapSort",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the HeapSort card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-heap-trace-table",
    concept: "heapTraceTable",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the Heap trace table card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-build-heap-exchange-count",
    concept: "buildHeapExchangeCount",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the BuildHeap exchange count card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-dary-heap",
    concept: "daryHeap",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the d-ary heap child formula card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-print-heap",
    concept: "printHeap",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the printHeap / Graphviz edges card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex05-quick",
    concept: "quick",
    source: "Ex05",
    taskTypes: ["manualTrace", "drawDataStructure", "writeC", "runtime"],
    prompt:
      "Reconstruct the Dual-pivot quicksort skeleton card for Ex05 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-pointer-print-addresses",
    concept: "pointerPrintAddresses",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Pointer address tracing card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-malloc-copy-free",
    concept: "mallocCopyFree",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the malloc-copy-free card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-c-pass-by-value",
    concept: "cPassByValue",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the C passes by value card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-array-assignment-invalid",
    concept: "arrayAssignmentInvalid",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Array assignment invalid card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-array-decay",
    concept: "arrayDecay",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Array name as pointer card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-dynamic-reverse-prepend-ownership",
    concept: "dynamicReversePrependOwnership",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Dynamic reverse/prepend ownership card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-array-to-linked-list",
    concept: "arrayToLinkedList",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Array to linked list card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex06-linked-list-rearrangement-trace",
    concept: "linkedListRearrangementTrace",
    source: "Ex06",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Linked-list rearrangement trace card for Ex06 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-stack",
    concept: "stack",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Stack with array card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-queue",
    concept: "queue",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Queue with circular array card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-two-stacks-one-array",
    concept: "twoStacksOneArray",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Two stacks in one array card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-queue-two-stacks",
    concept: "queueTwoStacks",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Queue using two stacks card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-stack-two-queues",
    concept: "stackTwoQueues",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Stack using two queues card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-array-stack-implementation",
    concept: "arrayStackImplementation",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Stack using array card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-array-circular-queue-implementation",
    concept: "arrayCircularQueueImplementation",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Circular queue using array card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-stack-linked-list",
    concept: "stackLinkedList",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Stack using linked list card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex07-queue-linked-list",
    concept: "queueLinkedList",
    source: "Ex07",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace"],
    prompt:
      "Reconstruct the Queue using linked list card for Ex07 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-expression-tree",
    concept: "expressionTree",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the Expression tree traversals card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-reconstruct-tree",
    concept: "reconstructTree",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the Reconstruct from preorder + inorder card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-tree-traversal",
    concept: "treeTraversal",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the Preorder / inorder / postorder card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-bst-insert",
    concept: "bstInsert",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the BST insert card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-bst-min-max",
    concept: "bstMinMax",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the BST min / max card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-bst-delete",
    concept: "bstDelete",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the BST delete cases card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-print-tree-levels",
    concept: "printTreeLevels",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the printTree with levels card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-lrlp",
    concept: "lrlp",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the Largest root-leaf path card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex08-rotations",
    concept: "rotations",
    source: "Ex08",
    taskTypes: ["drawDataStructure", "manualTrace", "writeC", "pseudocode"],
    prompt:
      "Reconstruct the AVL rotations card for Ex08 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-chaining",
    concept: "chaining",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Hash insert with chaining card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-chaining-order",
    concept: "chainingOrder",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Chaining insertion order card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-double-hash",
    concept: "doubleHash",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Double hashing card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-open-address",
    concept: "openAddress",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Open addressing insert/search card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-search-chain",
    concept: "searchChain",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Search in hash chain card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-delete-hash",
    concept: "deleteHash",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the HTDelete with repair card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-tombstone-repair",
    concept: "tombstoneRepair",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Tombstone vs reinsertion repair card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-print-overlap",
    concept: "printOverlap",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the print_overlap(A1,A2,n) card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex09-target-sum-hash",
    concept: "targetSumHash",
    source: "Ex09",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Target sum with hash table card for Ex09 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex10-matrix-path",
    concept: "matrixPath",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "writeC", "runtime", "recurrence"],
    prompt:
      "Reconstruct the DP helper matrix: longest path card for Ex10 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex10-pal-cuts",
    concept: "palCuts",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "writeC", "runtime", "recurrence"],
    prompt:
      "Reconstruct the Palindrome cuts DP card for Ex10 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex10-lcs",
    concept: "lcs",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "writeC", "runtime", "recurrence"],
    prompt:
      "Reconstruct the Longest common subsequence card for Ex10 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex10-edit-distance",
    concept: "editDistance",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "writeC", "runtime", "recurrence"],
    prompt:
      "Reconstruct the Edit distance card for Ex10 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex10-dp-runtime-memory",
    concept: "dpRuntimeMemory",
    source: "Ex10",
    taskTypes: ["fillHelperTable", "writeC", "runtime", "recurrence"],
    prompt:
      "Reconstruct the DP runtime / memory card for Ex10 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-bfs",
    concept: "bfs",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the BFS card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-possible-bfs-sequence",
    concept: "possibleBfsSequence",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the Possible BFS sequence card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-dfs",
    concept: "dfs",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the DFS card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-possible-dfs-sequence",
    concept: "possibleDfsSequence",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the Possible DFS sequence card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-undirected-cycle-detection",
    concept: "undirectedCycleDetection",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the Undirected cycle detection card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-all-paths",
    concept: "allPaths",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the All simple paths card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-all-simple-paths-count",
    concept: "allSimplePathsCount",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the All simple paths count card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-ex11-adjacency-complexity",
    concept: "adjacencyComplexity",
    source: "Ex11",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the Adjacency matrix vs list complexity card for Ex11 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-build-heap-exchange-count-build-heap",
    concept: "buildHeap",
    source: "FS23-BuildHeap-exchange-count",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Reconstruct the BuildMaxHeap card for FS23-BuildHeap-exchange-count and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-build-heap-exchange-count-heapify",
    concept: "heapify",
    source: "FS23-BuildHeap-exchange-count",
    taskTypes: ["manualTrace", "drawDataStructure"],
    prompt:
      "Reconstruct the Heapify card for FS23-BuildHeap-exchange-count and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-inversion-count-merge",
    concept: "merge",
    source: "FS23-inversion-count",
    taskTypes: ["runtime", "pseudocode"],
    prompt:
      "Reconstruct the Merge Sort card for FS23-inversion-count and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-logarithmic-nested-loops-exact-analysis-workflow",
    concept: "exactAnalysisWorkflow",
    source: "FS23-logarithmic-nested-loops",
    taskTypes: ["runtime"],
    prompt:
      "Reconstruct the Exact-analysis workflow card for FS23-logarithmic-nested-loops and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-dfs-edge-classification-dfs",
    concept: "dfs",
    source: "FS23-DFS-edge-classification",
    taskTypes: ["manualTrace", "pseudocode"],
    prompt:
      "Reconstruct the DFS card for FS23-DFS-edge-classification and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs23-stack-sorting-stack",
    concept: "stack",
    source: "FS23-stack-sorting",
    taskTypes: ["adtOnly", "pseudocode", "runtime"],
    prompt:
      "Reconstruct the Stack with array card for FS23-stack-sorting and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q2-recursive-f-output-binary-print",
    concept: "binaryPrint",
    source: "FS24-Q2-recursive-F-output",
    taskTypes: ["traceOutput", "recurrence"],
    prompt:
      "Reconstruct the Recursive binary print order card for FS24-Q2-recursive-F-output and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q3-recurrence-3-t-n-3-n-master-worksheet",
    concept: "masterWorksheet",
    source: "FS24-Q3-recurrence-3T(n/3)+n",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Reconstruct the Master Method worksheet card for FS24-Q3-recurrence-3T(n/3)+n and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q3-recurrence-3-t-n-3-n-backward-substitution",
    concept: "backwardSubstitution",
    source: "FS24-Q3-recurrence-3T(n/3)+n",
    taskTypes: ["recurrence", "runtime"],
    prompt:
      "Reconstruct the Backward substitution card for FS24-Q3-recurrence-3T(n/3)+n and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q6-stack",
    concept: "stack",
    source: "FS24-Q6",
    taskTypes: ["adtOnly", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Stack with array card for FS24-Q6 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q6-top-kselection-analysis",
    concept: "topKSelectionAnalysis",
    source: "FS24-Q6",
    taskTypes: ["adtOnly", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the algo1 / top-k selection pattern card for FS24-Q6 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q7-best-worst-log-loop-log-loops",
    concept: "logLoops",
    source: "FS24-Q7-best-worst-log-loop",
    taskTypes: ["runtime", "edgeCase"],
    prompt:
      "Reconstruct the Logarithmic loops card for FS24-Q7-best-worst-log-loop and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q7-best-worst-log-loop-exact-analysis-workflow",
    concept: "exactAnalysisWorkflow",
    source: "FS24-Q7-best-worst-log-loop",
    taskTypes: ["runtime", "edgeCase"],
    prompt:
      "Reconstruct the Exact-analysis workflow card for FS24-Q7-best-worst-log-loop and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q-dijkstra-dijkstra",
    concept: "dijkstra",
    source: "FS24-Q-Dijkstra",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Dijkstra card for FS24-Q-Dijkstra and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-q-dijkstra-relaxation",
    concept: "relaxation",
    source: "FS24-Q-Dijkstra",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Relaxation card for FS24-Q-Dijkstra and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-graph-simple-paths-all-paths",
    concept: "allPaths",
    source: "FS24-graph-simple-paths",
    taskTypes: ["pseudocode", "runtime", "manualTrace"],
    prompt:
      "Reconstruct the All simple paths card for FS24-graph-simple-paths and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-graph-simple-paths-dfs",
    concept: "dfs",
    source: "FS24-graph-simple-paths",
    taskTypes: ["pseudocode", "runtime", "manualTrace"],
    prompt:
      "Reconstruct the DFS card for FS24-graph-simple-paths and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-open-addressing-linear-probing-linear-probe",
    concept: "linearProbe",
    source: "FS24-open-addressing-linear-probing",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the Linear probing card for FS24-open-addressing-linear-probing and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-open-addressing-linear-probing-delete-hash",
    concept: "deleteHash",
    source: "FS24-open-addressing-linear-probing",
    taskTypes: ["manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the HTDelete with repair card for FS24-open-addressing-linear-probing and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-sort3-swap",
    concept: "swap",
    source: "FS24-Sort3",
    taskTypes: ["writeC", "traceArray", "runtime"],
    prompt:
      "Reconstruct the Swap / exchange in C card for FS24-Sort3 and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs24-maximum-product-three-values-edge-cases",
    concept: "edgeCases",
    source: "FS24-maximum-product-three-values",
    taskTypes: ["writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Edge-case checklist card for FS24-maximum-product-three-values and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-selection-sort-swap",
    concept: "swap",
    source: "FS25-selection-sort",
    taskTypes: ["writeC", "traceArray", "runtime"],
    prompt:
      "Reconstruct the Swap / exchange in C card for FS25-selection-sort and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-sort-k-frequency-array-frequency-array",
    concept: "frequencyArray",
    source: "FS25-sortK-frequency-array",
    taskTypes: ["writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Frequency array card for FS25-sortK-frequency-array and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-sort-k-frequency-array-direct-addressing",
    concept: "directAddressing",
    source: "FS25-sortK-frequency-array",
    taskTypes: ["writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Direct addressing card for FS25-sortK-frequency-array and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-q-sort-k-counting",
    concept: "counting",
    source: "FS25-Q-sortK",
    taskTypes: ["writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Counting / frequency sort card for FS25-Q-sortK and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-q-sort-k-direct-addressing",
    concept: "directAddressing",
    source: "FS25-Q-sortK",
    taskTypes: ["writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the Direct addressing card for FS25-Q-sortK and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-htinsert-chaining-chaining",
    concept: "chaining",
    source: "FS25-HTInsert-chaining",
    taskTypes: ["manualTrace", "writeC"],
    prompt:
      "Reconstruct the Hash insert with chaining card for FS25-HTInsert-chaining and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-print-overlap-search-chain",
    concept: "searchChain",
    source: "FS25-print-overlap",
    taskTypes: ["writeC", "runtime"],
    prompt:
      "Reconstruct the Search in hash chain card for FS25-print-overlap and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-print-overlap-chaining",
    concept: "chaining",
    source: "FS25-print-overlap",
    taskTypes: ["writeC", "runtime"],
    prompt:
      "Reconstruct the Hash insert with chaining card for FS25-print-overlap and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-shortest-root-leaf-bfs-queue",
    concept: "queue",
    source: "FS25-shortest-root-leaf-BFS",
    taskTypes: ["pseudocode", "runtime"],
    prompt:
      "Reconstruct the Queue with circular array card for FS25-shortest-root-leaf-BFS and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-shortest-root-leaf-bfs-bfs",
    concept: "bfs",
    source: "FS25-shortest-root-leaf-BFS",
    taskTypes: ["pseudocode", "runtime"],
    prompt:
      "Reconstruct the BFS card for FS25-shortest-root-leaf-BFS and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-fs25-nearest-zero-dp-dp-runtime-memory",
    concept: "dpRuntimeMemory",
    source: "FS25-nearest-zero-DP",
    taskTypes: ["fillHelperTable", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the DP runtime / memory card for FS25-nearest-zero-DP and state the state, edge cases and runtime/correctness hook.",
  },
  {
    id: "drill-sl01-algorithm-program-data-structure",
    concept: "algorithmProgramDataStructure",
    source: "SL01",
    taskTypes: ["pseudocode", "writeC", "traceArray", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the algorithm vs program vs data structure lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-input-output-spec",
    concept: "inputOutputSpec",
    source: "SL01",
    taskTypes: ["pseudocode", "edgeCase", "writeC", "traceArray", "runtime"],
    prompt:
      "Reconstruct the input/output specification lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-compile-run-c",
    concept: "compileRunC",
    source: "SL01",
    taskTypes: ["traceOutput", "writeC", "traceArray", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the compile and run C program lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-c-strings",
    concept: "cStrings",
    source: "SL01",
    taskTypes: [
      "fillHelperTable",
      "traceOutput",
      "writeC",
      "recurrence",
      "edgeCase",
    ],
    prompt:
      "Reconstruct the C strings lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-sieve",
    concept: "sieve",
    source: "SL01",
    taskTypes: ["writeC", "traceArray", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the sieve of Eratosthenes lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-bubble",
    concept: "bubble",
    source: "SL01",
    taskTypes: [
      "manualTrace",
      "writeC",
      "traceArray",
      "countComparisons",
      "runtime",
    ],
    prompt:
      "Reconstruct the Bubble Sort lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-selection",
    concept: "selection",
    source: "SL01",
    taskTypes: ["writeC", "traceArray", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the selection sort lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-insertion",
    concept: "insertion",
    source: "SL01",
    taskTypes: ["invariant", "runtime", "manualTrace", "edgeCase", "writeC"],
    prompt:
      "Reconstruct the insertion sort lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl01-recursion",
    concept: "recursion",
    source: "SL01",
    taskTypes: [
      "fillHelperTable",
      "traceOutput",
      "writeC",
      "recurrence",
      "edgeCase",
    ],
    prompt:
      "Reconstruct the Recursion & D&C lecture braid for SL01: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-exact-analysis-workflow",
    concept: "exactAnalysisWorkflow",
    source: "SL02",
    taskTypes: [
      "runtime",
      "invariant",
      "manualTrace",
      "edgeCase",
      "pseudocode",
    ],
    prompt:
      "Reconstruct the exact-analysis workflow lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-best-worst-avg",
    concept: "bestWorstAvg",
    source: "SL02",
    taskTypes: ["runtime", "invariant", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the best / worst / average lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-big-o",
    concept: "bigO",
    source: "SL02",
    taskTypes: ["runtime", "invariant", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the O Ω Θ lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-loopcount",
    concept: "loopcount",
    source: "SL02",
    taskTypes: ["runtime", "invariant", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the exact line counting lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-invariant",
    concept: "invariant",
    source: "SL02",
    taskTypes: [
      "invariant",
      "fillHelperTable",
      "runtime",
      "writeC",
      "traceArray",
    ],
    prompt:
      "Reconstruct the invariant lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl02-edge-cases",
    concept: "edgeCases",
    source: "SL02",
    taskTypes: ["writeC", "traceOutput", "traceArray", "runtime", "recurrence"],
    prompt:
      "Reconstruct the edge cases lecture braid for SL02: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-max-subarray",
    concept: "maxSubarray",
    source: "SL03",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the max subarray D&C lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-merge",
    concept: "merge",
    source: "SL03",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the merge sort lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-recurrences",
    concept: "recurrences",
    source: "SL03",
    taskTypes: ["runtime", "recurrence", "pseudocode"],
    prompt:
      "Reconstruct the recurrences lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-substitution",
    concept: "substitution",
    source: "SL03",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the substitution lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-backward-substitution",
    concept: "backwardSubstitution",
    source: "SL03",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the backward substitution lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl03-recursion-tree",
    concept: "recursionTree",
    source: "SL03",
    taskTypes: ["recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the recursion tree lecture braid for SL03: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-heap",
    concept: "heap",
    source: "SL04",
    taskTypes: ["manualTrace", "drawDataStructure", "runtime"],
    prompt:
      "Reconstruct the heap lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-heapify",
    concept: "heapify",
    source: "SL04",
    taskTypes: ["manualTrace", "runtime", "drawDataStructure", "writeC"],
    prompt:
      "Reconstruct the heapify lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-build-heap",
    concept: "buildHeap",
    source: "SL04",
    taskTypes: ["manualTrace", "drawDataStructure", "runtime", "writeC"],
    prompt:
      "Reconstruct the BuildHeap lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-heap-sort",
    concept: "heapSort",
    source: "SL04",
    taskTypes: [
      "traceArray",
      "drawDataStructure",
      "runtime",
      "manualTrace",
      "writeC",
    ],
    prompt:
      "Reconstruct the HeapSort lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-quick",
    concept: "quick",
    source: "SL04",
    taskTypes: ["manualTrace", "drawDataStructure", "runtime", "writeC"],
    prompt:
      "Reconstruct the quick / dual-pivot lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-quick-partition",
    concept: "quickPartition",
    source: "SL04",
    taskTypes: ["invariant", "manualTrace", "drawDataStructure", "runtime"],
    prompt:
      "Reconstruct the standard quick partition lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-quicksort-assumptions",
    concept: "quicksortAssumptions",
    source: "SL04",
    taskTypes: [
      "runtime",
      "edgeCase",
      "manualTrace",
      "drawDataStructure",
      "writeC",
    ],
    prompt:
      "Reconstruct the quicksort assumptions lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl04-best-worst-avg",
    concept: "bestWorstAvg",
    source: "SL04",
    taskTypes: [
      "runtime",
      "invariant",
      "manualTrace",
      "edgeCase",
      "drawDataStructure",
    ],
    prompt:
      "Reconstruct the best / worst / average lecture braid for SL04: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-pointers",
    concept: "pointers",
    source: "SL05",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the pointers lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-malloc-free",
    concept: "mallocFree",
    source: "SL05",
    taskTypes: ["writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the malloc / free lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-linked",
    concept: "linked",
    source: "SL05",
    taskTypes: ["manualTrace", "writeC", "traceOutput", "edgeCase"],
    prompt:
      "Reconstruct the linked list lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-head-changing-adt",
    concept: "headChangingAdt",
    source: "SL05",
    taskTypes: ["adtOnly", "writeC", "traceOutput", "manualTrace", "edgeCase"],
    prompt:
      "Reconstruct the changing an ADT instance lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-stack",
    concept: "stack",
    source: "SL05",
    taskTypes: ["adtOnly", "writeC", "pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the Stack ADT lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-queue",
    concept: "queue",
    source: "SL05",
    taskTypes: ["adtOnly", "pseudocode", "manualTrace", "runtime", "writeC"],
    prompt:
      "Reconstruct the Queue ADT lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl05-adt-rules",
    concept: "adtRules",
    source: "SL05",
    taskTypes: ["adtOnly", "pseudocode", "writeC", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the ADT restrictions lecture braid for SL05: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-dictionary",
    concept: "dictionary",
    source: "SL06",
    taskTypes: [
      "adtOnly",
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "runtime",
    ],
    prompt:
      "Reconstruct the dictionary ADT lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-binary-tree",
    concept: "binaryTree",
    source: "SL06",
    taskTypes: [
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "runtime",
      "edgeCase",
    ],
    prompt:
      "Reconstruct the binary tree lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-tree-traversal",
    concept: "treeTraversal",
    source: "SL06",
    taskTypes: [
      "manualTrace",
      "drawDataStructure",
      "pseudocode",
      "runtime",
      "writeC",
    ],
    prompt:
      "Reconstruct the tree traversals lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-expression-tree",
    concept: "expressionTree",
    source: "SL06",
    taskTypes: [
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "runtime",
      "writeC",
    ],
    prompt:
      "Reconstruct the expression tree lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-bst",
    concept: "bst",
    source: "SL06",
    taskTypes: [
      "runtime",
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "writeC",
    ],
    prompt:
      "Reconstruct the BST lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-bst-insert",
    concept: "bstInsert",
    source: "SL06",
    taskTypes: [
      "drawDataStructure",
      "manualTrace",
      "writeC",
      "pseudocode",
      "runtime",
    ],
    prompt:
      "Reconstruct the BST insert lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-bst-delete",
    concept: "bstDelete",
    source: "SL06",
    taskTypes: [
      "manualTrace",
      "drawDataStructure",
      "writeC",
      "pseudocode",
      "runtime",
    ],
    prompt:
      "Reconstruct the BST delete lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-bst-min-max",
    concept: "bstMinMax",
    source: "SL06",
    taskTypes: [
      "runtime",
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "writeC",
    ],
    prompt:
      "Reconstruct the BST min / max lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-successor",
    concept: "successor",
    source: "SL06",
    taskTypes: ["drawDataStructure", "manualTrace", "pseudocode", "runtime"],
    prompt:
      "Reconstruct the successor / predecessor lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-avl",
    concept: "avl",
    source: "SL06",
    taskTypes: [
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "runtime",
      "writeC",
    ],
    prompt:
      "Reconstruct the AVL lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl06-rotations",
    concept: "rotations",
    source: "SL06",
    taskTypes: [
      "drawDataStructure",
      "manualTrace",
      "pseudocode",
      "runtime",
      "writeC",
    ],
    prompt:
      "Reconstruct the AVL rotations lecture braid for SL06: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-hash-function",
    concept: "hashFunction",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the hash function lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-direct-addressing",
    concept: "directAddressing",
    source: "SL07",
    taskTypes: ["writeC", "runtime", "edgeCase", "manualTrace"],
    prompt:
      "Reconstruct the direct addressing lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-chaining",
    concept: "chaining",
    source: "SL07",
    taskTypes: ["writeC", "manualTrace", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the chaining lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-open-address",
    concept: "openAddress",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the open addressing lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-linear-probe",
    concept: "linearProbe",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the linear probing lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-quadratic-probe",
    concept: "quadraticProbe",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the quadratic probing lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-double-hash",
    concept: "doubleHash",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the double hashing lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-load-factor",
    concept: "loadFactor",
    source: "SL07",
    taskTypes: ["manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the load factor α lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl07-delete-hash",
    concept: "deleteHash",
    source: "SL07",
    taskTypes: ["invariant", "manualTrace", "writeC", "runtime", "edgeCase"],
    prompt:
      "Reconstruct the HTDelete lecture braid for SL07: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-dp-template",
    concept: "dpTemplate",
    source: "SL08",
    taskTypes: [
      "runtime",
      "fillHelperTable",
      "invariant",
      "recurrence",
      "pseudocode",
    ],
    prompt:
      "Reconstruct the DP template lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-memoization",
    concept: "memoization",
    source: "SL08",
    taskTypes: ["fillHelperTable", "recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the memoization vs bottom-up lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-helper-table",
    concept: "helperTable",
    source: "SL08",
    taskTypes: [
      "fillHelperTable",
      "writeC",
      "runtime",
      "recurrence",
      "pseudocode",
    ],
    prompt:
      "Reconstruct the helper table lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-matrix-chain",
    concept: "matrixChain",
    source: "SL08",
    taskTypes: ["runtime", "fillHelperTable", "recurrence", "pseudocode"],
    prompt:
      "Reconstruct the matrix-chain multiplication lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-lcs",
    concept: "lcs",
    source: "SL08",
    taskTypes: [
      "fillHelperTable",
      "recurrence",
      "runtime",
      "pseudocode",
      "writeC",
    ],
    prompt:
      "Reconstruct the longest common subsequence lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-coin-change",
    concept: "coinChange",
    source: "SL08",
    taskTypes: ["fillHelperTable", "recurrence", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the coin change lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl08-dp-runtime-memory",
    concept: "dpRuntimeMemory",
    source: "SL08",
    taskTypes: [
      "runtime",
      "fillHelperTable",
      "recurrence",
      "pseudocode",
      "writeC",
    ],
    prompt:
      "Reconstruct the DP runtime / memory lecture braid for SL08: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-graph-terminology",
    concept: "graphTerminology",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the graph terminology lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-adjacency",
    concept: "adjacency",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the adjacency matrix/list lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-bfs",
    concept: "bfs",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the BFS lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-dfs",
    concept: "dfs",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the DFS lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-graph-state",
    concept: "graphState",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the graph state fields lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-cycle",
    concept: "cycle",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the cycle detection lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-dfs-edge-code",
    concept: "dfsEdgeCode",
    source: "SL09",
    taskTypes: ["manualTrace", "pseudocode", "runtime"],
    prompt:
      "Reconstruct the DFS edge classification code lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl09-topological-sort",
    concept: "topologicalSort",
    source: "SL09",
    taskTypes: ["pseudocode", "manualTrace", "runtime"],
    prompt:
      "Reconstruct the topological sort lecture braid for SL09: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-weighted-graph",
    concept: "weightedGraph",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the weighted graph lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-mst",
    concept: "mst",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the minimum spanning tree lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-spanning-tree",
    concept: "spanningTree",
    source: "SL10",
    taskTypes: ["manualTrace", "edgeCase", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the spanning tree lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-safe-edge",
    concept: "safeEdge",
    source: "SL10",
    taskTypes: ["invariant", "manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the safe edge lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-cut-light-edge-proof",
    concept: "cutLightEdgeProof",
    source: "SL10",
    taskTypes: ["invariant", "runtime", "manualTrace", "pseudocode"],
    prompt:
      "Reconstruct the cut/light-edge theorem proof lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-prim-jarnik",
    concept: "primJarnik",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Prim-Jarnik lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-relaxation",
    concept: "relaxation",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the relaxation lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-bellman-ford",
    concept: "bellmanFord",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Bellman-Ford lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-dag-sssp",
    concept: "dagSSSP",
    source: "SL10",
    taskTypes: ["runtime", "manualTrace", "pseudocode"],
    prompt:
      "Reconstruct the DAG shortest paths lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-dijkstra",
    concept: "dijkstra",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the Dijkstra lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-negative-cycle",
    concept: "negativeCycle",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the negative cycles lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
  {
    id: "drill-sl10-arbitrage-transform",
    concept: "arbitrageTransform",
    source: "SL10",
    taskTypes: ["manualTrace", "runtime", "pseudocode"],
    prompt:
      "Reconstruct the arbitrage transform lecture braid for SL10: representation, C/pseudocode pattern, mechanism, proof/runtime and exam form.",
  },
];
