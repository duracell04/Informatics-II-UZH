# Informatics-II-UZH

Static study map for Informatics II at UZH. The current focus is the exam-trap layer: small C traces, ADT restrictions, exact analysis, recursion call order, tree printing, hashing probes, and weighted-graph trace tables.

## Coverage Dashboard

| Source / Pattern                  | Covered as node | Covered as code card | Covered as drill / trace checklist | Notes                                                                          |
| --------------------------------- | --------------: | -------------------: | ---------------------------------: | ------------------------------------------------------------------------------ |
| Ex01 Hilbert recurrence           |             yes |                  yes |                            partial | `hilbertRecurrence` covers recursive call order and recurrence shape.          |
| Ex01 command-line matrix          |             yes |                  yes |                            partial | `commandLineInput` covers `argc`, `argv`, `sscanf`, and 2x2 square output.     |
| Ex01 XSort                        |             yes |                  yes |                            partial | `xsort` tracks `l`, `r`, `m`, and bidirectional passes.                        |
| Ex01 pair-sum                     |             yes |                  yes |                            partial | Naive and sorted two-pointer variants are mapped.                              |
| Ex02 palindrome recursion         |             yes |              partial |                            partial | Node exists; DP extension links through palindrome cuts.                       |
| Ex02 binary print order           |             yes |                  yes |                                yes | `binaryPrint` distinguishes print-before vs print-after recursion.             |
| Ex02 Hanoi digit pegs             |             yes |                  yes |                                yes | `hanoi` now treats printed digit pairs as moves.                               |
| Ex02 triangle / pyramid recursion |             yes |                  yes |                                yes | `pyramid` covers neighbour sums and print-on-unwind order.                     |
| Ex03 exact counts                 |             yes |                  yes |                                yes | `exactAnalysisWorkflow` separates exact counts from asymptotic simplification. |
| Ex03 top-k selection / `algo1`    |             yes |                  yes |                                yes | `topKSelectionAnalysis` covers invariant and `Theta(kn)`.                      |
| Ex04 asymmetric recursion tree    |             yes |                  yes |                                yes | `asymmetricRecursionTree` covers `T(n/10)+T(9n/10)+Theta(n)`.                  |
| SL06 expression tree              |             yes |                  yes |                            partial | `expressionTree` covers infix/postfix and parentheses.                         |
| SL07 quadratic probing            |             yes |                  yes |                                yes | `quadraticProbe` covers formula, table trace, and coverage proof prompt.       |
| SL10 weighted-graph trace tables  |             yes |                  yes |                                yes | Dijkstra, Prim-Jarnik, and Bellman-Ford trace cards are included.              |
| FS24 backward run-length tracing  |             yes |                  yes |                                yes | `backwardRunLength` covers reverse scan, `num`, `count`, and final print.      |
| FS24 k-th largest with Stack ADT  |             yes |                  yes |                            partial | `kthLargestStack` uses only `push`, `pop`, and `isEmpty`.                      |
| FS24 Dijkstra relaxation changes  |             yes |                  yes |                                yes | `dijkstraTrace` explicitly tracks changed distance counts.                     |
| FS23 red-black historical warning |             yes |                  yes |                            partial | `redBlackHistorical` is intentionally low priority versus AVL.                 |

## Local Commands

```bash
npm run format
npm run format:check
```
