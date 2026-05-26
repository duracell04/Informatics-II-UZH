# Informatics-II-UZH

Static semantic study graph for Informatics II at UZH. Concepts, mechanisms, algorithms, proof patterns, C/pseudocode cards, drills, and exam/exercise evidence are merged into an evidence-weighted learning map.

The static HTML app lives in `html/`. Supporting markdown notes live in `markdown/`.

## Coverage Dashboard

Generated from `html/js/sources.js`.

- Sources: 54
- Concepts: 229
- Drills: 264
- Missing lecture required concepts: 0
- Missing lecture required cards: 0
- Missing lecture required drills: 0
- Uncovered lecture sources: 0 (none)
- Uncovered exercise sources: 0 (none)
- Uncovered past-exam sources: 0 (none)
- Generated placeholders: 0
- High-priority concepts without drills: none

Alias notes: `biggestPlus` = `bigPlus`; all simple paths = `allPaths`; k-hop = `khop`; DAG shortest paths = `dagSSSP`; arbitrage transform = `arbitrageTransform`.

## Lecture Coverage SL01-SL10

| Source | Status   | Title                                                    | Concepts | Code card | Concept drill | Source drill | Req concepts | Missing concepts | Req cards | Missing cards | Req drills | Missing drills | Req bundles | Missing bundles | Task types                                          |
| ------ | -------- | -------------------------------------------------------- | -------- | --------- | ------------- | ------------ | ------------ | ---------------- | --------- | ------------- | ---------- | -------------- | ----------- | --------------- | --------------------------------------------------- |
| SL01   | complete | Specification, C arrays, search and early loop reasoning | yes      | yes       | yes           | yes          | 10/10        | none             | 7/7       | none          | 10/10      | none           | 0/0         | none            | writeC, traceArray, runtime, edgeCase               |
| SL02   | complete | Search, sorting costs, invariants and growth             | yes      | yes       | yes           | yes          | 6/6          | none             | 3/3       | none          | 6/6        | none           | 0/0         | none            | runtime, invariant, manualTrace, edgeCase           |
| SL03   | complete | Divide and conquer and recurrence solving                | yes      | yes       | yes           | yes          | 7/7          | none             | 5/5       | none          | 7/7        | none           | 0/0         | none            | recurrence, runtime, pseudocode                     |
| SL04   | complete | Heaps, priority queues and quicksort partitioning        | yes      | yes       | yes           | yes          | 8/8          | none             | 6/6       | none          | 8/8        | none           | 0/0         | none            | manualTrace, drawDataStructure, runtime             |
| SL05   | complete | Pointers, dynamic memory and linked structures           | yes      | yes       | yes           | yes          | 7/7          | none             | 3/3       | none          | 7/7        | none           | 0/0         | none            | writeC, traceOutput, manualTrace, edgeCase          |
| SL06   | complete | Dictionaries, trees, BSTs, expression trees and AVL      | yes      | yes       | yes           | yes          | 11/11        | none             | 6/6       | none          | 11/11      | none           | 0/0         | none            | drawDataStructure, manualTrace, pseudocode, runtime |
| SL07   | complete | Hashing, probing, deletion and resizing                  | yes      | yes       | yes           | yes          | 10/10        | none             | 9/9       | none          | 10/10      | none           | 0/0         | none            | manualTrace, writeC, runtime, edgeCase              |
| SL08   | complete | Dynamic programming templates and reconstruction         | yes      | yes       | yes           | yes          | 8/8          | none             | 4/4       | none          | 8/8        | none           | 0/0         | none            | fillHelperTable, recurrence, runtime, pseudocode    |
| SL09   | complete | Graph representation, BFS, DFS and path reasoning        | yes      | yes       | yes           | yes          | 8/8          | none             | 5/5       | none          | 8/8        | none           | 0/0         | none            | pseudocode, manualTrace, runtime                    |
| SL10   | complete | Weighted graph algorithms                                | yes      | yes       | yes           | yes          | 12/12        | none             | 7/7       | none          | 12/12      | none           | 0/0         | none            | manualTrace, runtime, pseudocode                    |

## Exercise Coverage Ex00-Ex11

| Source | Status   | Title                                                              | Concepts | Code card | Concept drill | Source drill | Req concepts | Missing concepts | Req cards | Missing cards | Req drills | Missing drills | Req bundles | Missing bundles | Task types                                         |
| ------ | -------- | ------------------------------------------------------------------ | -------- | --------- | ------------- | ------------ | ------------ | ---------------- | --------- | ------------- | ---------- | -------------- | ----------- | --------------- | -------------------------------------------------- |
| Ex00   | complete | C compile/run, linear search, second largest and diagonal sum      | yes      | yes       | yes           | yes          | 0/0          | none             | 4/4       | none          | 4/4        | none           | 4/4         | none            | writeC, traceOutput, traceArray, runtime           |
| Ex01   | complete | Sorting traces, XSort, Hilbert length and array C patterns         | yes      | yes       | yes           | yes          | 0/0          | none             | 5/5       | none          | 5/5        | none           | 5/5         | none            | writeC, traceArray, countComparisons, recurrence   |
| Ex02   | complete | Recursive output, strings, binary print and Hanoi                  | yes      | yes       | yes           | yes          | 0/0          | none             | 5/5       | none          | 5/5        | none           | 5/5         | none            | traceOutput, writeC, recurrence, edgeCase          |
| Ex03   | complete | Exact analysis, binary search, invariants and top-k algo1          | yes      | yes       | yes           | yes          | 0/0          | none             | 6/6       | none          | 6/6        | none           | 6/6         | none            | runtime, invariant, pseudocode, edgeCase           |
| Ex04   | complete | Divide and conquer, recurrence proofs and dynamic arrays           | yes      | yes       | yes           | yes          | 0/0          | none             | 8/8       | none          | 8/8        | none           | 8/8         | none            | recurrence, runtime, pseudocode                    |
| Ex05   | complete | Heapsort trace, d-ary heap helpers and dual-pivot quicksort        | yes      | yes       | yes           | yes          | 0/0          | none             | 7/7       | none          | 7/7        | none           | 7/7         | none            | manualTrace, drawDataStructure, writeC, runtime    |
| Ex06   | complete | Pointer values, malloc, array decay and linked-list conversion     | yes      | yes       | yes           | yes          | 0/0          | none             | 9/9       | none          | 9/9        | none           | 9/9         | none            | writeC, traceOutput, manualTrace, edgeCase         |
| Ex07   | complete | Stack and queue ADT implementations and transformations            | yes      | yes       | yes           | yes          | 0/0          | none             | 10/10     | none          | 10/10      | none           | 10/10       | none            | adtOnly, pseudocode, writeC, manualTrace           |
| Ex08   | complete | Binary trees, BST operations, paths and AVL rotations              | yes      | yes       | yes           | yes          | 0/0          | none             | 10/10     | none          | 10/10      | none           | 10/10       | none            | drawDataStructure, manualTrace, writeC, pseudocode |
| Ex09   | complete | Hash-table drawing, probing, deletion repair and hash applications | yes      | yes       | yes           | yes          | 0/0          | none             | 10/10     | none          | 10/10      | none           | 10/10       | none            | manualTrace, writeC, runtime, edgeCase             |
| Ex10   | complete | Dynamic programming helper tables                                  | yes      | yes       | yes           | yes          | 0/0          | none             | 6/6       | none          | 6/6        | none           | 6/6         | none            | fillHelperTable, writeC, runtime, recurrence       |
| Ex11   | complete | Graph traversal, path counting and k-hop reasoning                 | yes      | yes       | yes           | yes          | 0/0          | none             | 10/10     | none          | 10/10      | none           | 10/10       | none            | pseudocode, manualTrace, runtime                   |

## Past Exam Coverage FS23-FS25

| Source                               | Status   | Title                                    | Concepts | Code card | Concept drill | Source drill | Req concepts | Missing concepts | Req cards | Missing cards | Req drills | Missing drills | Req bundles | Missing bundles | Task types                           |
| ------------------------------------ | -------- | ---------------------------------------- | -------- | --------- | ------------- | ------------ | ------------ | ---------------- | --------- | ------------- | ---------- | -------------- | ----------- | --------------- | ------------------------------------ |
| FS23-linked-list-procedureX          | complete | Linked-list C procedure trace            | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | traceOutput, manualTrace, writeC     |
| FS23-BuildHeap-exchange-count        | complete | BuildHeap exchange count                 | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | manualTrace, drawDataStructure       |
| FS23-red-black-historical            | complete | Red-black historical warning             | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | drawDataStructure, manualTrace       |
| FS23-Master-method-none-case         | complete | Master method non-applicability          | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | recurrence, runtime                  |
| FS23-inversion-count                 | complete | Inversion counting                       | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | runtime, pseudocode                  |
| FS23-logarithmic-nested-loops        | complete | Logarithmic nested loops                 | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | runtime                              |
| FS23-asymptotic-true-false           | complete | Asymptotic true/false                    | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | runtime                              |
| FS23-sieve-loop-bounds               | complete | Sieve loop-bound trap                    | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | writeC, runtime, edgeCase            |
| FS23-DFS-edge-classification         | complete | DFS edge classification                  | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | manualTrace, pseudocode              |
| FS23-edit-distance-C                 | complete | Edit distance C-style DP                 | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | fillHelperTable, writeC, runtime     |
| FS23-stack-sorting                   | complete | Stack sorting under ADT rules            | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | adtOnly, pseudocode, runtime         |
| FS24-Q1                              | complete | Backward run-length tracing              | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | traceOutput, manualTrace, edgeCase   |
| FS24-Q2-recursive-F-output           | complete | Recursive F output trace                 | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | traceOutput, recurrence              |
| FS24-Q3-recurrence-3T(n/3)+n         | complete | Recurrence 3T(n/3)+n                     | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | recurrence, runtime                  |
| FS24-Q4-min-pointer-changes          | complete | Minimum pointer-change list task         | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | manualTrace, writeC, edgeCase        |
| FS24-Q6                              | complete | Kth largest using only Stack ADT         | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | adtOnly, runtime, pseudocode         |
| FS24-Q7-best-worst-log-loop          | complete | Best/worst logarithmic loop by branch    | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | runtime, edgeCase                    |
| FS24-Q-Dijkstra                      | complete | Dijkstra relaxation changes              | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | manualTrace, runtime, pseudocode     |
| FS24-graph-simple-paths              | complete | Graph simple paths                       | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | pseudocode, runtime, manualTrace     |
| FS24-open-addressing-linear-probing  | complete | Open addressing with linear probing      | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | manualTrace, edgeCase                |
| FS24-Sort3                           | complete | Sort3 one-pass partitioning              | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | writeC, traceArray, runtime          |
| FS24-maximum-product-three-values    | complete | Maximum product of three values          | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | writeC, runtime, edgeCase            |
| FS24-max-product-subarray            | complete | Maximum product subarray DP              | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | fillHelperTable, runtime, pseudocode |
| FS25-selection-sort                  | complete | Simple in-place selection sorting        | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | writeC, traceArray, runtime          |
| FS25-sortK-frequency-array           | complete | Frequency/direct-address sorting         | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | writeC, runtime, edgeCase            |
| FS25-Q-sortK                         | complete | Frequency/direct-address sorting alias   | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | writeC, runtime, edgeCase            |
| FS25-HTInsert-chaining               | complete | Chained hash insertion                   | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | manualTrace, writeC                  |
| FS25-print-overlap                   | complete | Print overlap with hashing               | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | writeC, runtime                      |
| FS25-shortest-root-leaf-BFS          | complete | Shortest root-leaf distance by queue/BFS | yes      | yes       | yes           | yes          | 0/0          | none             | 3/3       | none          | 3/3        | none           | 3/3         | none            | pseudocode, runtime                  |
| FS25-shortest-root-leaf-recursive    | complete | Shortest root-leaf distance recursively  | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | pseudocode, runtime, edgeCase        |
| FS25-substitution-proof-tree-runtime | complete | Substitution proof for tree runtime      | yes      | yes       | yes           | yes          | 0/0          | none             | 1/1       | none          | 1/1        | none           | 1/1         | none            | recurrence, runtime                  |
| FS25-nearest-zero-DP                 | complete | Nearest-zero dynamic programming         | yes      | yes       | yes           | yes          | 0/0          | none             | 2/2       | none          | 2/2        | none           | 2/2         | none            | fillHelperTable, runtime, pseudocode |

## Local Commands

```bash
npm --prefix html run format
npm --prefix html run format:check
npm --prefix html run validate
npm --prefix html run coverage
```
