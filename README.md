# Informatics-II-UZH

Static semantic study graph for Informatics II at UZH. Concepts, mechanisms, algorithms, proof patterns, C/pseudocode cards, drills, and exam/exercise evidence are merged into an evidence-weighted learning map.

## Coverage Dashboard

Generated from `js/sources.js`.

- Sources: 54
- Concepts: 229
- Drills: 72
- Source drill coverage: 54/54
- Exercise/exam drill coverage: 44/44
- Generated placeholders: 0
- High-priority concepts without drills: none

| Source                               | Type     | Title                                                              | Concepts | Code card | Concept drill | Source drill | Task types                                          |
| ------------------------------------ | -------- | ------------------------------------------------------------------ | -------- | --------- | ------------- | ------------ | --------------------------------------------------- |
| SL01                                 | lecture  | Specification, C arrays, search and early loop reasoning           | yes      | yes       | yes           | yes          | writeC, traceArray, runtime, edgeCase               |
| SL02                                 | lecture  | Search, sorting costs, invariants and growth                       | yes      | yes       | yes           | yes          | runtime, invariant, manualTrace, edgeCase           |
| SL03                                 | lecture  | Divide and conquer and recurrence solving                          | yes      | yes       | yes           | yes          | recurrence, runtime, pseudocode                     |
| SL04                                 | lecture  | Heaps, priority queues and quicksort partitioning                  | yes      | yes       | yes           | yes          | manualTrace, drawDataStructure, runtime             |
| SL05                                 | lecture  | Pointers, dynamic memory and linked structures                     | yes      | yes       | yes           | yes          | writeC, traceOutput, manualTrace, edgeCase          |
| SL06                                 | lecture  | Dictionaries, trees, BSTs, expression trees and AVL                | yes      | yes       | yes           | yes          | drawDataStructure, manualTrace, pseudocode, runtime |
| SL07                                 | lecture  | Hashing, probing, deletion and resizing                            | yes      | yes       | yes           | yes          | manualTrace, writeC, runtime, edgeCase              |
| SL08                                 | lecture  | Dynamic programming templates and reconstruction                   | yes      | yes       | yes           | yes          | fillHelperTable, recurrence, runtime, pseudocode    |
| SL09                                 | lecture  | Graph representation, BFS, DFS and path reasoning                  | yes      | yes       | yes           | yes          | pseudocode, manualTrace, runtime                    |
| SL10                                 | lecture  | Weighted graph algorithms                                          | yes      | yes       | yes           | yes          | manualTrace, runtime, pseudocode                    |
| Ex00                                 | exercise | C compile/run, linear search, second largest and diagonal sum      | yes      | yes       | yes           | yes          | writeC, traceOutput, traceArray, runtime            |
| Ex01                                 | exercise | Sorting traces, XSort, Hilbert length and array C patterns         | yes      | yes       | yes           | yes          | writeC, traceArray, countComparisons, recurrence    |
| Ex02                                 | exercise | Recursive output, strings, binary print and Hanoi                  | yes      | yes       | yes           | yes          | traceOutput, writeC, recurrence, edgeCase           |
| Ex03                                 | exercise | Exact analysis, binary search, invariants and top-k algo1          | yes      | yes       | yes           | yes          | runtime, invariant, pseudocode, edgeCase            |
| Ex04                                 | exercise | Divide and conquer, recurrence proofs and dynamic arrays           | yes      | yes       | yes           | yes          | recurrence, runtime, pseudocode                     |
| Ex05                                 | exercise | Heapsort trace, d-ary heap helpers and dual-pivot quicksort        | yes      | yes       | yes           | yes          | manualTrace, drawDataStructure, writeC, runtime     |
| Ex06                                 | exercise | Pointer values, malloc, array decay and linked-list conversion     | yes      | yes       | yes           | yes          | writeC, traceOutput, manualTrace, edgeCase          |
| Ex07                                 | exercise | Stack and queue ADT implementations and transformations            | yes      | yes       | yes           | yes          | adtOnly, pseudocode, writeC, manualTrace            |
| Ex08                                 | exercise | Binary trees, BST operations, paths and AVL rotations              | yes      | yes       | yes           | yes          | drawDataStructure, manualTrace, writeC, pseudocode  |
| Ex09                                 | exercise | Hash-table drawing, probing, deletion repair and hash applications | yes      | yes       | yes           | yes          | manualTrace, writeC, runtime, edgeCase              |
| Ex10                                 | exercise | Dynamic programming helper tables                                  | yes      | yes       | yes           | yes          | fillHelperTable, writeC, runtime, recurrence        |
| Ex11                                 | exercise | Graph traversal, path counting and k-hop reasoning                 | yes      | yes       | yes           | yes          | pseudocode, manualTrace, runtime                    |
| FS23-linked-list-procedureX          | pastExam | Linked-list C procedure trace                                      | yes      | no        | yes           | yes          | traceOutput, manualTrace, writeC                    |
| FS23-BuildHeap-exchange-count        | pastExam | BuildHeap exchange count                                           | yes      | yes       | yes           | yes          | manualTrace, drawDataStructure                      |
| FS23-red-black-historical            | pastExam | Red-black historical warning                                       | yes      | yes       | yes           | yes          | drawDataStructure, manualTrace                      |
| FS23-Master-method-none-case         | pastExam | Master method non-applicability                                    | yes      | no        | yes           | yes          | recurrence, runtime                                 |
| FS23-inversion-count                 | pastExam | Inversion counting                                                 | yes      | yes       | yes           | yes          | runtime, pseudocode                                 |
| FS23-logarithmic-nested-loops        | pastExam | Logarithmic nested loops                                           | yes      | yes       | yes           | yes          | runtime                                             |
| FS23-asymptotic-true-false           | pastExam | Asymptotic true/false                                              | yes      | no        | yes           | yes          | runtime                                             |
| FS23-sieve-loop-bounds               | pastExam | Sieve loop-bound trap                                              | yes      | yes       | yes           | yes          | writeC, runtime, edgeCase                           |
| FS23-DFS-edge-classification         | pastExam | DFS edge classification                                            | yes      | yes       | yes           | yes          | manualTrace, pseudocode                             |
| FS23-edit-distance-C                 | pastExam | Edit distance C-style DP                                           | yes      | yes       | yes           | yes          | fillHelperTable, writeC, runtime                    |
| FS23-stack-sorting                   | pastExam | Stack sorting under ADT rules                                      | yes      | yes       | yes           | yes          | adtOnly, pseudocode, runtime                        |
| FS24-Q1                              | pastExam | Backward run-length tracing                                        | yes      | yes       | yes           | yes          | traceOutput, manualTrace, edgeCase                  |
| FS24-Q2-recursive-F-output           | pastExam | Recursive F output trace                                           | yes      | yes       | yes           | yes          | traceOutput, recurrence                             |
| FS24-Q3-recurrence-3T(n/3)+n         | pastExam | Recurrence 3T(n/3)+n                                               | yes      | no        | yes           | yes          | recurrence, runtime                                 |
| FS24-Q4-min-pointer-changes          | pastExam | Minimum pointer-change list task                                   | yes      | no        | yes           | yes          | manualTrace, writeC, edgeCase                       |
| FS24-Q6                              | pastExam | Kth largest using only Stack ADT                                   | yes      | yes       | yes           | yes          | adtOnly, runtime, pseudocode                        |
| FS24-Q7-best-worst-log-loop          | pastExam | Best/worst logarithmic loop by branch                              | yes      | yes       | yes           | yes          | runtime, edgeCase                                   |
| FS24-Q-Dijkstra                      | pastExam | Dijkstra relaxation changes                                        | yes      | yes       | yes           | yes          | manualTrace, runtime, pseudocode                    |
| FS24-graph-simple-paths              | pastExam | Graph simple paths                                                 | yes      | yes       | yes           | yes          | pseudocode, runtime, manualTrace                    |
| FS24-open-addressing-linear-probing  | pastExam | Open addressing with linear probing                                | yes      | yes       | yes           | yes          | manualTrace, edgeCase                               |
| FS24-Sort3                           | pastExam | Sort3 one-pass partitioning                                        | yes      | yes       | yes           | yes          | writeC, traceArray, runtime                         |
| FS24-maximum-product-three-values    | pastExam | Maximum product of three values                                    | yes      | yes       | yes           | yes          | writeC, runtime, edgeCase                           |
| FS24-max-product-subarray            | pastExam | Maximum product subarray DP                                        | yes      | yes       | yes           | yes          | fillHelperTable, runtime, pseudocode                |
| FS25-selection-sort                  | pastExam | Simple in-place selection sorting                                  | yes      | yes       | yes           | yes          | writeC, traceArray, runtime                         |
| FS25-sortK-frequency-array           | pastExam | Frequency/direct-address sorting                                   | yes      | yes       | yes           | yes          | writeC, runtime, edgeCase                           |
| FS25-Q-sortK                         | pastExam | Frequency/direct-address sorting alias                             | yes      | yes       | yes           | yes          | writeC, runtime, edgeCase                           |
| FS25-HTInsert-chaining               | pastExam | Chained hash insertion                                             | yes      | yes       | yes           | yes          | manualTrace, writeC                                 |
| FS25-print-overlap                   | pastExam | Print overlap with hashing                                         | yes      | yes       | yes           | yes          | writeC, runtime                                     |
| FS25-shortest-root-leaf-BFS          | pastExam | Shortest root-leaf distance by queue/BFS                           | yes      | yes       | yes           | yes          | pseudocode, runtime                                 |
| FS25-shortest-root-leaf-recursive    | pastExam | Shortest root-leaf distance recursively                            | yes      | yes       | yes           | yes          | pseudocode, runtime, edgeCase                       |
| FS25-substitution-proof-tree-runtime | pastExam | Substitution proof for tree runtime                                | yes      | no        | yes           | yes          | recurrence, runtime                                 |
| FS25-nearest-zero-DP                 | pastExam | Nearest-zero dynamic programming                                   | yes      | yes       | yes           | yes          | fillHelperTable, runtime, pseudocode                |

## Local Commands

```bash
npm run format
npm run format:check
npm run validate
npm run coverage
```
