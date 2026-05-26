# Informatics II - Full C-Code Exam Script

*Smartly rearranged syllabus | C-first code cards | comments explain new logic once*

Use this as a pattern bank: arrays -> sorting -> recursion -> pointers -> ADTs -> trees -> hashing -> DP -> graphs.

## 0. How to use this script

### Core workflow

- Problem specification -> representation -> C/pseudocode -> invariant -> runtime -> edge cases.
- Each card gives the idea on the left and the exam-C template on the right.
- Function atlas blocks explain parameters, use case, combinations, and a concrete input/output.
- Comments explain new logic once. Repeated syntax is kept compact.
- Graph/ADT code is C-shaped and uses the abstract operations from the exercises when the task does.

### Exam warning

- Match the exact task restrictions: in-place, no auxiliary composite structure, Stack-only, Queue-only, etc.
- For heap tasks, first check whether the array is 0-indexed or 1-indexed.
- For dynamic programming, write the state meaning before the recurrence.
- For graphs, decide matrix/list, directed/undirected, weighted/unweighted before writing code.

## 0.1 Quick map of the document

| Block | What to master | Main functions/cards |
|---|---|---|
| A | C survival + arrays | swap, printArray, linearSearch, matrix loops |
| B | Sorting and two-pointers | bubble, XSort, selection, insertion, sortK, sort012, pairSum |
| C | Recursion, proofs, divide-and-conquer | palindrome, printRec, Hanoi, mergeSort, maxSubArray |
| D | Heaps and quicksort | heapify, buildMaxHeap, heapSort, d-ary heap, partition |
| E | Pointers, lists, stacks, queues | reverseList, array stack/queue, linked stack/queue, Kth |
| F | Trees and hashing | traversals, BST insert/delete, AVL rotations, HT insert/search/delete |
| G | Dynamic programming | longestPath, palindrome cuts, LCS, edit distance, coin change, matrix-chain |
| H | Graphs | BFS, DFS, cycle, simple paths, k-hop, Dijkstra, Bellman-Ford, MST |

# A. C survival layer: arrays, loops, matrices

Small C patterns used by every later algorithm.

## A0. Global exam-C header and helpers

**Tags:** C setup | helpers | constants

**Purpose:** Use one small helper layer so later cards read like one connected program.

**Runtime:** All helper functions here are O(1).

**Edge cases:** INF must be larger than any possible finite answer.

**Exam traps:** EMPTY=0 works only when valid keys are strictly positive.

**Function atlas:**

- `max(a, b)` / `min(a, b)`: `a` and `b` are integers. Use for scalar comparisons in DP, trees, and graph relaxations. Combines with recurrence updates and best/worst tracking. Example: `max(4,7)` -> `7`.
- `abs_int(x)`: `x` is an integer. Use when C exam code needs absolute difference without library assumptions. Combines with matrix/path constraints. Example: `abs_int(-3)` -> `3`.
- `max3(a, b, c)` / `min3(a, b, c)`: three integers. Use when a recurrence chooses among three cases. Combines with maximum subarray and edit distance. Example: `min3(5,2,4)` -> `2`.

```c
// A0. GLOBAL EXAM-C HEADER AND HELPERS
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define INF 1000000000
#define EMPTY 0          // For positive-key open-address hash tables.
#define TRUE 1
#define FALSE 0
int max(int a, int b) { return a > b ? a : b; }
int min(int a, int b) { return a < b ? a : b; }
int abs_int(int x) { return x < 0 ? -x : x; }
int max3(int a, int b, int c) {
    return max(max(a, b), c);
}
int min3(int a, int b, int c) {
    return min(min(a, b), c);
}
```

## A1. swap and printArray

**Tags:** array | in-place | tracing

**Purpose:** The atomic operation behind sorting, heapify, quicksort, and manual trace output.

**Invariant:** swap changes only positions i and j; all other cells stay fixed.

**Runtime:** swap is O(1); printArray is O(n).

**Edge cases:** For n=0 printArray prints only a newline.

**Exam traps:** Array parameters let the function change the caller array.

**Function atlas:**

- `swap(A, i, j)`: `A[]` is the array, `i` and `j` are positions to exchange. Use when an in-place algorithm must move two array values. Combines with bubble sort, selection sort, heapify, quicksort, and Sort3. Example: `A={4,1,7}`, `i=0`, `j=1` -> `A={1,4,7}`.
- `swapInt(a, b)`: `a` and `b` are addresses of two integers. Use when the variables are not array cells. Combines with scalar DP where two running values must be exchanged. Example: `x=2`, `y=9`, `swapInt(&x,&y)` -> `x=9`, `y=2`.
- `printArray(A, n)`: `A[]` is the array, `n` is the number of cells to print. Use for trace-after-pass tasks. Combines with bubble sort and heap/sort trace questions. Example: `A={3,5,1}`, `n=3` -> prints `3 5 1`.

```c
// A1. SWAP AND PRINTARRAY
void swap(int A[], int i, int j) {
    int tmp = A[i];          // Save A[i] before overwriting it.
    A[i] = A[j];             // Put the right value into the left slot.
    A[j] = tmp;              // Restore the saved value into the right slot.
}
void swapInt(int *a, int *b) {
    int tmp = *a;            // *a is the value stored at address a.
    *a = *b;                 // Write through pointer a.
    *b = tmp;                // Write old *a through pointer b.
}
void printArray(int A[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", A[i]);
    }
    printf("\n");
}

```

## A2. Linear search and exact output tracing

**Tags:** search | trace | loop condition

**Purpose:** Scan an array and return the first occurrence. This is also the base pattern for C-output tracing.

**Invariant:** Before each loop test, positions before i still may contain x; positions already skipped do not.

**Runtime:** O(n), because each array position is inspected at most once.

**Edge cases:** n=0 returns -1; run-length code prints NULL for empty input.

**Exam traps:** For exact-output tasks, the final print after the loop is often the missing line.

**Function atlas:**

- `linearSearch(A, n, x)`: `A[]` is the input array, `n` is its length, `x` is the searched value. Use when the array is unsorted or sortedness is not guaranteed. Combines with scanning, duplicate checks, and the base idea behind hash search. Example: `A={5,2,7}`, `x=7` -> returns `2`.
- `backwardRunLength(A, n)`: `A[]` is the array to encode from right to left, `n` is its length. Use for exact-output trace questions with loops and final print-after-loop behavior. Combines with array traversal and run counting. Example: `A={1,2,2,3,3,3}` -> prints `332211` in this template.

```c
// A2. LINEAR SEARCH AND EXACT OUTPUT TRACING
int linearSearch(int A[], int n, int x) {
    int i = 0;
    while (i < n && A[i] != x) {
        i++;                 // Stop at first match or after last index.
    }
    if (i < n) return i;      // i is valid exactly when a match was found.
    return -1;
}
void backwardRunLength(int A[], int n) {
    if (n <= 0) { printf("NULL"); return; }
    int count = 1;
    int num = A[n - 1];       // Start with last value.
    for (int i = n - 2; i >= 0; i--) {
        if (A[i] == num) count++;
        else {
            printf("%d%d", num, count);
            num = A[i];       // New run starts at A[i].
            count = 1;
        }
    }
    printf("%d%d", num, count);  // Final run is printed after loop.
}
```

## A3. Binary search

**Tags:** sorted array | divide-and-conquer | invariant

**Purpose:** Search a sorted array by discarding half of the remaining interval every iteration.

**Invariant:** If x occurs in A, then x is inside A[l..r].

**Runtime:** O(log n), because the remaining interval is halved each iteration.

**Edge cases:** n=0 gives r=-1, loop is skipped, returns -1.

**Exam traps:** The precondition is sortedness. Without it, the discard step is invalid.

**Function atlas:**

- `binarySearch(A, n, x)`: `A[]` is a sorted array, `n` is the number of elements, `x` is the searched value. Use when sorted input allows fast search. Combines with sorting -> binary search, pair-sum sorted two-pointer discard logic, and BST search as the same "discard half/search branch" idea. Example: `A={1,3,5,7,9}`, `n=5`, `x=7` -> returns `3` because `A[3]==7`; `x=4` -> returns `-1`.

```c
// A3. BINARY SEARCH
int binarySearch(int A[], int n, int x) {
    int l = 0;
    int r = n - 1;
    while (l <= r) {          // Search interval is still nonempty.
        int m = l + (r - l) / 2;
        if (A[m] == x) return m;
        if (A[m] < x) {
            l = m + 1;        // x can only be right of m.
        } else {
            r = m - 1;        // x can only be left of m.
        }
    }
    return -1;
}

```

## A4. Matrices: diagonal sum and square

**Tags:** 2D arrays | nested loops | command-line style

**Purpose:** Matrix tasks train nested loops, row/column indexing, and helper tables for DP/graphs.

**Invariant:** After k inner iterations, B[i][j] holds the partial dot product up to k-1.

**Runtime:** Diagonal sum O(n); matrix square O(n^3).

**Edge cases:** n=1 works: the square is the single value multiplied by itself.

**Exam traps:** A[i][j] means row i, column j. Matrix multiplication uses A[i][k] and A[k][j].

**Function atlas:**

- `diagonalSum4()`: Uses a fixed `4x4` matrix inside the function. Use when the task asks for main diagonal traversal or exact tracing of matrix indices. Combines with DP table diagonals and graph adjacency matrices. Example: diagonal `2,7,4,6` -> returns `19`.
- `squareMatrix(n, A, B)`: `n` is the matrix size, `A` is the input `n x n` matrix, `B` is the output matrix. Use when every output cell is a dot product of a row and column. Combines with nested-loop runtime analysis and matrix-chain motivation. Example: `A={{1,2},{3,4}}` -> `B={{7,10},{15,22}}`.

```c
// A4. MATRICES: DIAGONAL SUM AND SQUARE
int diagonalSum4(void) {
    int A[4][4] = {
        {2, 4, 1, 3},
        {5, 7, 8, 2},
        {9, 6, 4, 1},
        {3, 8, 5, 6}
    };
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += A[i][i];       // Main diagonal has equal row/column index.
    }
    return sum;
}
void squareMatrix(int n, int A[n][n], int B[n][n]) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            B[i][j] = 0;      // Each output cell starts from zero.
            for (int k = 0; k < n; k++) {
                B[i][j] += A[i][k] * A[k][j];
            }
        }
    }
}

```

# B. Sorting-first algorithm base

Start from swap, build to in-place and range-based sorting.

## B1. Bubble sort with pass tracing

**Tags:** sorting | adjacent swap | trace

**Purpose:** Repeatedly swap adjacent inverted pairs. Good first full sorting loop.

**Invariant:** After each outer pass, A[end+1..n-1] is sorted and final.

**Runtime:** Worst O(n^2); optimized best O(n) if already sorted.

**Edge cases:** n=0 or n=1 skips loops.

**Exam traps:** The inner loop stops at end-1 because it compares A[j] with A[j+1].

**Function atlas:**

- `bubbleSort(A, n)`: `A[]` is the array, `n` is its length. Use when adjacent swaps and pass-by-pass trace output are required. Combines with `swap`, `printArray`, inversion reasoning, and sorted-suffix invariants. Example: `A={3,1,2}` -> after pass 1 prints `1 2 3`; final array `{1,2,3}`.
- `bubbleSortOptimized(A, n)`: Same parameters, with early stop if no swap occurs. Use when best-case runtime matters. Combines with loop flags and best/worst-case analysis. Example: `A={1,2,3}` -> no swaps, stops after one pass.

```c
// B1. BUBBLE SORT WITH PASS TRACING
void bubbleSort(int A[], int n) {
    for (int end = n - 1; end > 0; end--) {
        for (int j = 0; j < end; j++) {
            if (A[j] > A[j + 1]) {
                swap(A, j, j + 1);
            }
        }
        printArray(A, n);     // Exercise-style: show state after full pass.
    }
}
void bubbleSortOptimized(int A[], int n) {
    int swapped = TRUE;
    for (int end = n - 1; end > 0 && swapped; end--) {
        swapped = FALSE;
        for (int j = 0; j < end; j++) {
            if (A[j] > A[j + 1]) {
                swap(A, j, j + 1);
                swapped = TRUE;
            }
        }
    }
}
```

## B2. XSort / cocktail-style bidirectional passes

**Tags:** sorting | bidirectional | l-r-m trace

**Purpose:** Move small values left in one direction and large values right in the other direction.

**Invariant:** Values left of l and right of r are already in final region.

**Runtime:** Worst O(n^2).

**Edge cases:** Works for n<=1 because l<r is false.

**Exam traps:** Trace l, r, and m exactly. Do not guess from normal bubble sort.

**Function atlas:**

- `xsort(A, n)`: `A[]` is the array, `n` is its length. Use when a task describes bidirectional bubble/cocktail passes or asks to trace `l`, `r`, and `m`. Combines with `swap`, boundary shrinking, and bubble-sort adjacent comparisons. Example: `A={3,2,1}` -> final array `{1,2,3}` after left-moving and right-moving passes.

```c
// B2. XSORT / COCKTAIL-STYLE BIDIRECTIONAL PASSES
void xsort(int A[], int n) {
    int l = 0;
    int r = n - 1;
    int m = 0;
    do {
        for (int j = r; j > l; j--) {
            if (A[j] < A[j - 1]) {
                swap(A, j, j - 1);
                m = j;        // Last left-moving change gives new boundary.
            }
        }
        l = m;
        for (int j = l; j < r; j++) {
            if (A[j] > A[j + 1]) {
                swap(A, j, j + 1);
                m = j;        // Last right-moving change gives new boundary.
            }
        }
        r = m;
    } while (l < r);
}
```

## B3. Selection sort

**Tags:** sorting | in-place | exam-safe

**Purpose:** Find the minimum of the unsorted suffix and swap it into the next sorted position.

**Invariant:** Before iteration i, A[0..i-1] contains the i smallest values in sorted order.

**Runtime:** Theta(n^2) comparisons: (n-1)+(n-2)+...+1.

**Edge cases:** n=0, n=1: no swap is needed.

**Exam traps:** Good choice when task asks for in-place sorting and no auxiliary composite structure.

**Function atlas:**

- `selectionSort(A, n)`: `A[]` is the array, `n` is its length. Use when an exam asks for a simple in-place sort with predictable comparison count. Combines with `swap`, scan-for-min, kth/extreme selection, and invariant proofs. Example: `A={4,1,3}` -> first pass swaps `4` and `1`, final array `{1,3,4}`.

```c
// B3. SELECTION SORT
void selectionSort(int A[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;     // Smallest known index in A[i..n-1].
        for (int j = i + 1; j < n; j++) {
            if (A[j] < A[minIndex]) {
                minIndex = j;
            }
        }
        swap(A, i, minIndex); // Put next smallest value into position i.
    }
}

```

## B4. Insertion sort

**Tags:** sorting | sorted prefix | shifting

**Purpose:** Keep a sorted prefix and insert the next key by shifting larger values right.

**Invariant:** Before iteration i, A[0..i-1] is sorted.

**Runtime:** Best O(n) if sorted; worst O(n^2) if reverse sorted.

**Edge cases:** The j>=0 guard prevents reading A[-1].

**Exam traps:** Store key before shifting, because A[i] may be overwritten.

**Function atlas:**

- `insertionSort(A, n)`: `A[]` is the array, `n` is its length. Use when a sorted prefix is natural or the array is almost sorted. Combines with shifting, loop guards, and best-case `O(n)` reasoning. Example: `A={2,5,3}` -> key `3` shifts `5`, final array `{2,3,5}`.

```c
// B4. INSERTION SORT
void insertionSort(int A[], int n) {
    for (int i = 1; i < n; i++) {
        int key = A[i];       // Value to insert into sorted prefix.
        int j = i - 1;
        while (j >= 0 && A[j] > key) {
            A[j + 1] = A[j];  // Shift larger value right to open a gap.
            j--;
        }
        A[j + 1] = key;       // Insert key into the gap.
    }
}
```

## B5. Counting / frequency sort for values 0..k-1

**Tags:** frequency array | range precondition | O(n+k)

**Purpose:** Use an array as a table of counts when values have a small known range.

**Invariant:** After processing value v, all values <= v are written in sorted order.

**Runtime:** Theta(n+k), which is Theta(n) when k<n.

**Edge cases:** k must be positive; values outside 0..k-1 break indexing.

**Exam traps:** Frequency array is an auxiliary composite data structure, but this task explicitly allows it.

**Function atlas:**

- `sortK(A, n, k)`: `A[]` contains integer keys, `n` is the length, `k` is the key range size, valid values are `0..k-1`. Use when keys are small nonnegative integers and a frequency table is allowed. Combines with direct addressing, hashing intuition, and `O(n+k)` runtime. Example: `A={2,0,2,1}`, `k=3` -> `A={0,1,2,2}`.

```c
// B5. COUNTING / FREQUENCY SORT FOR VALUES 0..K-1
void sortK(int A[], int n, int k) {
    int F[k];                 // F[v] stores frequency of value v.
    for (int v = 0; v < k; v++) {
        F[v] = 0;
    }
    for (int i = 0; i < n; i++) {
        F[A[i]]++;            // Valid only because 0 <= A[i] < k.
    }
    int pos = 0;
    for (int v = 0; v < k; v++) {
        for (int c = 0; c < F[v]; c++) {
            A[pos] = v;
            pos++;
        }
    }
}
```

## B6. Dutch flag / Sort3 for 0,1,2

**Tags:** one pass | partition | invariant

**Purpose:** Sort values 0, 1, and 2 in one scan by maintaining four regions.

**Invariant:** A[0..low-1]=0, A[low..mid-1]=1, A[mid..high]=unknown, A[high+1..n-1]=2.

**Runtime:** O(n), each index moves toward the middle.

**Edge cases:** Works for n=0: high=-1, loop skipped.

**Exam traps:** When value 2 is swapped from the right, inspect the new A[mid] next.

**Function atlas:**

- `sort012(A, n)`: `A[]` contains only `0`, `1`, and `2`; `n` is its length. Use when the task asks for one-pass sorting of three categories. Combines with partition invariants, quicksort partitioning, and `swap`. Example: `A={2,0,1,2,0}` -> `A={0,0,1,2,2}`.

```c
// B6. DUTCH FLAG / SORT3 FOR 0,1,2
void sort012(int A[], int n) {
    int low = 0;
    int mid = 0;
    int high = n - 1;
    while (mid <= high) {
        if (A[mid] == 0) {
            swap(A, low, mid);
            low++;
            mid++;
        } else if (A[mid] == 1) {
            mid++;
        } else {
            swap(A, mid, high);
            high--;           // Do not increment mid: swapped-in value is unknown.
        }
    }
}

```

## B7. Pair sum: naive and sorted two-pointer

**Tags:** pair search | sorted property | discard logic

**Purpose:** Compare O(n^2) brute force with O(n) two-pointer search on sorted input.

**Invariant:** Two-pointer version never discards a pair that can still reach target.

**Runtime:** Naive O(n^2); sorted two-pointer O(n).

**Edge cases:** n<2 returns FALSE.

**Exam traps:** Two-pointer version requires nondecreasing sorted order.

**Function atlas:**

- `pairSum(A, n, target)`: `A[]` is any array, `n` is its length, `target` is the required sum. Use when no sortedness or hashing is allowed. Combines with nested-loop runtime and duplicate/index-pair reasoning. Example: `A={4,1,7}`, `target=8` -> returns `TRUE`.
- `pairSumSorted(A, n, target)`: `A[]` is sorted, `n` is its length, `target` is the required sum. Use when sorted input lets you discard impossible pairs from either end. Combines with binary-search-style discard logic and two-pointer scans. Example: `A={1,3,5,8}`, `target=8` -> returns `TRUE` from `3+5`.

```c
// B7. PAIR SUM: NAIVE AND SORTED TWO-POINTER
int pairSum(int A[], int n, int target) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (A[i] + A[j] == target) return TRUE;
        }
    }
    return FALSE;
}
int pairSumSorted(int A[], int n, int target) {
    int i = 0;
    int j = n - 1;
    while (i < j) {
        int s = A[i] + A[j];
        if (s == target) return TRUE;
        if (s < target) i++;  // Need a larger sum.
        else j--;             // Need a smaller sum.
    }
    return FALSE;
}

```

# C. Recursion, correctness, and divide-and-conquer

Attach proof and runtime logic to C code.

## C1. Runtime and invariant proof templates

**Tags:** analysis | correctness | exam writing

**Purpose:** Attach a short proof/running-time card to code answers without writing unnecessary prose.

**Invariant:** The invariant is the bridge between code and correctness.

**Runtime:** Analysis text itself has no runtime; it explains the code card beside it.

**Edge cases:** State base cases for recursive proofs explicitly.

**Exam traps:** Master method applies only when the recurrence matches its required form.

```c
// C1. RUNTIME AND INVARIANT PROOF TEMPLATES
/* Exact loop analysis workflow:
 * 1) Count outer iterations.
 * 2) Count inner iterations as a function of the outer variable.
 * 3) Sum the counts.
 * 4) Drop constants and lower-order terms.
 * 5) State O, Omega, or Theta.
 */
/* Loop invariant proof:
 * Initialization: invariant holds before the first iteration.
 * Maintenance: one loop step preserves the invariant.
 * Termination: when the loop stops, invariant implies the result.
 */
/* Substitution proof:
 * Guess T(n) <= c*f(n).
 * Use induction on recursive calls.
 * Simplify algebraically.
 * Choose constants so the inequality holds.
 */
```

## C2. Palindrome recursion and binary print order

**Tags:** recursion | base case | output order

**Purpose:** Small recursion cards that train base cases, progress, and print-before/print-after behavior.

**Invariant:** Palindrome call is responsible only for substring s[l..r].

**Runtime:** Palindrome O(n); binary print O(log n).

**Edge cases:** For n=0, binary functions print nothing; define separately if output should be 0.

**Exam traps:** Moving printf before/after recursion reverses the output.

**Function atlas:**

- `isPalindrome(s, l, r)`: `s[]` is the string, `l` and `r` are current left/right indices. Use when a symmetric property shrinks from both ends. Combines with recursion base cases and string DP palindrome tables. Example: `s="level"`, `l=0`, `r=4` -> returns `TRUE`.
- `printBinaryReverse(n)`: `n` is a nonnegative integer. Use to show print-before-recursion behavior. Combines with modulo/division tracing. Example: `n=6` -> prints `011`.
- `printBinaryNormal(n)`: `n` is a nonnegative integer. Use to print bits in normal order by printing after recursion. Combines with recursion unwind output. Example: `n=6` -> prints `110`.

```c
// C2. PALINDROME RECURSION AND BINARY PRINT ORDER
int isPalindrome(char s[], int l, int r) {
    if (l >= r) return TRUE;       // Empty or one-character middle.
    if (s[l] != s[r]) return FALSE;
    return isPalindrome(s, l + 1, r - 1);  // Shrink both ends.
}
void printBinaryReverse(int n) {
    if (n == 0) return;
    printf("%d", n % 2);          // Print before recursion: reverse order.
    printBinaryReverse(n / 2);
}
void printBinaryNormal(int n) {
    if (n == 0) return;
    printBinaryNormal(n / 2);     // Recurse first: most significant bit prints first.
    printf("%d", n % 2);
}
```

## C3. Tower of Hanoi and pyramid recursion

**Tags:** recursion | call order | unwind print

**Purpose:** Classic recursive decomposition plus a print-on-unwind array pattern.

**Invariant:** Hanoi preserves peg rules before and after each move.

**Runtime:** Hanoi Theta(2^n); pyramid Theta(n^2) total additions/printing.

**Edge cases:** n=0 is the empty move/pyramid case.

**Exam traps:** For pyramid output, print after recursion to get top-down order.

**Function atlas:**

- `Hanoi(n, A, B, C, p)`: `n` is the number of disks, `A` is source peg, `B` target peg, `C` auxiliary peg, `p[]` stores peg states. Use when a task asks for recursive move order or exact peg output. Combines with exponential recurrence and call-order tracing. Example: `n=1` moves one disk from `A` to `B` and prints once.
- `draw_pyramid(A, n, level)`: `A[]` is the current row, `n` is row length, `level` controls indentation/output. Use when each recursive level builds a smaller derived array and prints on unwind. Combines with recursion, temporary arrays, and exact output. Example: `A={1,2,3}` builds `{3,5}` then `{8}` and prints top before lower rows.

```c
// C3. TOWER OF HANOI AND PYRAMID RECURSION
void Hanoi(int n, int A, int B, int C, int p[]) {
    if (n == 0) return;
    Hanoi(n - 1, A, C, B, p);     // Move small stack away.
    p[B] = p[B] * 10 + p[A] % 10; // Move top digit/disk from A to B.
    p[A] = p[A] / 10;
    print_pegs(p);
    Hanoi(n - 1, C, B, A, p);     // Move small stack onto target.
}
void draw_pyramid(const int A[], int n, int level) {
    if (n < 1) return;
    int T[n - 1];
    for (int i = 0; i < n - 1; i++) {
        T[i] = A[i] + A[i + 1];   // Parent value from neighboring children.
    }
    draw_pyramid(T, n - 1, level + 1);
    print_level(A, n, level);     // Print after recursion: top appears first.
}

```

## C4. Merge sort and merge helper

**Tags:** divide-and-conquer | merge | auxiliary array

**Purpose:** The canonical split, solve, combine algorithm and its C boundary pattern.

**Invariant:** merge assumes A[l..m] and A[m+1..r] are sorted.

**Runtime:** T(n)=2T(n/2)+Theta(n)=Theta(n log n).

**Edge cases:** l==r is already sorted.

**Exam traps:** Merge sort uses an auxiliary array, so it may violate no-extra-composite-structure restrictions.

**Function atlas:**

- `merge(A, l, m, r)`: `A[]` is the array, `l..m` and `m+1..r` are already sorted ranges. Use when two sorted halves must become one sorted range. Combines with merge sort, inversion counting, and auxiliary-array copying. Example: `A={1,4,2,3}`, `l=0`, `m=1`, `r=3` -> range becomes `{1,2,3,4}`.
- `mergeSort(A, l, r)`: `A[]` is the array, `l` and `r` delimit the current segment. Use when divide-and-conquer sorting with guaranteed `Theta(n log n)` is allowed. Combines with recurrence solving and `merge`. Example: `A={3,1,2}` -> `A={1,2,3}`.

```c
// C4. MERGE SORT AND MERGE HELPER
void merge(int A[], int l, int m, int r) {
    int B[r - l + 1];
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) {
        if (A[i] <= A[j]) B[k++] = A[i++];
        else B[k++] = A[j++];
    }
    while (i <= m) B[k++] = A[i++];
    while (j <= r) B[k++] = A[j++];
    for (int t = 0; t < k; t++) {
        A[l + t] = B[t];          // Copy merged block back to A[l..r].
    }
}
void mergeSort(int A[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(A, l, m);
    mergeSort(A, m + 1, r);
    merge(A, l, m, r);
}
```

## C5. Maximum subarray by divide and conquer

**Tags:** divide-and-conquer | crossing sum | recurrence

**Purpose:** Split array, solve left/right, and compute the best subarray that crosses the middle.

**Invariant:** A maximum subarray is either left-only, right-only, or crosses the split.

**Runtime:** T(n)=2T(n/2)+Theta(n)=Theta(n log n).

**Edge cases:** All-negative arrays work because base case returns A[l].

**Exam traps:** Crossing case must include a suffix of the left part and a prefix of the right part.

**Function atlas:**

- `maxCrossing(A, l, m, r)`: `A[]` is the array, `l..m` is the left half, `m+1..r` is the right half. Use inside maximum-subarray divide and conquer to handle intervals crossing the split. Combines with prefix/suffix scans and recurrence cases. Example: `A={-2,4,-1,3}`, `m=1` -> crossing sum `6`.
- `maxSubArray(A, l, r)`: `A[]` is the array, `l` and `r` delimit the segment. Use when the best contiguous sum is solved by left/right/crossing cases. Combines with divide-and-conquer recurrence `2T(n/2)+n`. Example: `A={-2,4,-1,3}` -> returns `6`.

```c
// C5. MAXIMUM SUBARRAY BY DIVIDE AND CONQUER
int maxCrossing(int A[], int l, int m, int r) {
    int sum = 0;
    int leftBest = -INF;
    for (int i = m; i >= l; i--) {
        sum += A[i];
        leftBest = max(leftBest, sum);
    }
    sum = 0;
    int rightBest = -INF;
    for (int i = m + 1; i <= r; i++) {
        sum += A[i];
        rightBest = max(rightBest, sum);
    }
    return leftBest + rightBest;
}
int maxSubArray(int A[], int l, int r) {
    if (l == r) return A[l];
    int m = (l + r) / 2;
    int left = maxSubArray(A, l, m);
    int right = maxSubArray(A, m + 1, r);
    int cross = maxCrossing(A, l, m, r);
    return max3(left, right, cross);
}

```

# D. Heaps and quicksort

Array-as-tree thinking, heap boundary, pivot partitions.

## D1. Binary heap: heapify and buildMaxHeap, 0-indexed

**Tags:** heap | array tree | trace

**Purpose:** Represent a nearly complete tree inside an array and restore the max-heap property.

**Invariant:** After heapify(A,n,i), subtree rooted at i satisfies max-heap property.

**Runtime:** heapify O(log n); buildMaxHeap O(n).

**Edge cases:** n=0 makes n/2-1 negative; loop is skipped.

**Exam traps:** If the exam uses 1-indexed heaps, children are 2*i and 2*i+1.

**Function atlas:**

- `leftChild(i)` / `rightChild(i)`: `i` is a 0-indexed heap position. Use to convert an array index into tree-child positions. Combines with heapify and heap trace drawings. Example: `i=2` -> children `5` and `6`.
- `heapify(A, n, i)`: `A[]` stores the heap array, `n` is current heap size, `i` is the root of the possibly broken subtree. Use when children are already heaps but node `i` may be too small. Combines with build-heap, heapsort, priority queues, and manual heap traces. Example: `A={1,5,3}`, `i=0` -> swaps to `{5,1,3}`.
- `buildMaxHeap(A, n)`: `A[]` is an unsorted array, `n` is its length. Use to prepare an array for repeated max removal. Combines with heapify and heapsort. Example: `A={1,5,3}` -> valid max heap with `5` at root.

```c
// D1. BINARY HEAP: HEAPIFY AND BUILDMAXHEAP, 0-INDEXED
int leftChild(int i)  { return 2 * i + 1; }
int rightChild(int i) { return 2 * i + 2; }
void heapify(int A[], int n, int i) {
    int largest = i;
    int l = leftChild(i);
    int r = rightChild(i);
    if (l < n && A[l] > A[largest]) largest = l;
    if (r < n && A[r] > A[largest]) largest = r;
    if (largest != i) {
        swap(A, i, largest);
        heapify(A, n, largest);   // Continue where the old root moved.
    }
}
void buildMaxHeap(int A[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(A, n, i);         // Leaves already satisfy heap property.
    }
}
```

## D2. Heapsort and d-ary heap

**Tags:** heap sort | d-ary heap | graph output

**Purpose:** Use a max heap to repeatedly move the largest value into the sorted suffix.

**Invariant:** A[0..end-1] is heap; A[end..n-1] is sorted suffix.

**Runtime:** Heapsort O(n log n); dHeapify O(d log_d n).

**Edge cases:** For d=2, d-ary formulas match binary 0-indexed heap.

**Exam traps:** The sorted suffix is outside the heap size.

**Function atlas:**

- `heapSort(A, n)`: `A[]` is the array, `n` is its length. Use when in-place `O(n log n)` sorting is allowed and heap concepts are tested. Combines with `buildMaxHeap`, `heapify`, and sorted-suffix invariants. Example: `A={4,1,3}` -> `A={1,3,4}`.
- `dChild(i, c, d)`: `i` is a node index, `c` is child number `0..d-1`, `d` is heap arity. Use for d-ary heap indexing. Combines with d-ary heapify and heap drawing. Example: `i=1`, `c=2`, `d=3` -> child index `6`.
- `dHeapify(A, n, i, d)`: Same as binary heapify but with `d` children per node. Use when the exam gives a d-ary heap. Combines with child-index formulas and `O(d log_d n)` analysis. Example: with `d=3`, inspect up to three children before swapping.
- `printHeapEdges(A, n, d)`: `A[]` is heap array, `n` heap size, `d` arity. Use when a heap must be drawn as tree/graph output. Combines with d-child indexing. Example: `A={9,5,7}`, `d=2` -> prints edges `9 -- 5` and `9 -- 7`.

```c
// D2. HEAPSORT AND D-ARY HEAP
void heapSort(int A[], int n) {
    buildMaxHeap(A, n);
    for (int end = n - 1; end > 0; end--) {
        swap(A, 0, end);          // Max goes to final sorted suffix.
        heapify(A, end, 0);       // end is the new heap size.
    }
}
int dChild(int i, int c, int d) {
    return d * i + c + 1;         // c = 0..d-1 in 0-indexed heap.
}
void dHeapify(int A[], int n, int i, int d) {
    int largest = i;
    for (int c = 0; c < d; c++) {
        int child = dChild(i, c, d);
        if (child < n && A[child] > A[largest]) largest = child;
    }
    if (largest != i) {
        swap(A, i, largest);
        dHeapify(A, n, largest, d);
    }
}
void printHeapEdges(int A[], int n, int d) {
    printf("graph g {\n");
    for (int i = 0; i < n; i++) {
        for (int c = 0; c < d; c++) {
            int child = dChild(i, c, d);
            if (child < n) printf("%d -- %d\n", A[i], A[child]);
        }
    }
    printf("}\n");
}

```

## D3. Quicksort partition and dual-pivot quicksort

**Tags:** partition | pivots | recursion

**Purpose:** Partition is the core movement logic. Dual pivot divides into three regions.

**Invariant:** Single pivot: A[low..i] < pivot, A[i+1..j-1] >= pivot.

**Runtime:** Average O(n log n); worst O(n^2) with bad pivots.

**Edge cases:** low>=high is empty or one-element segment.

**Exam traps:** In dual-pivot quicksort, when swapping from gt, inspect the new A[i] before i++.

**Function atlas:**

- `partition(A, low, high)`: `A[]` is the array segment, `low..high` is the range, pivot is `A[high]`. Use to place one pivot in final position. Combines with quicksort, Sort3 partition thinking, and invariant proofs. Example: `A={3,1,4,2}`, pivot `2` -> returns pivot index `1` with values left of it smaller.
- `quickSort(A, low, high)`: Sorts `A[low..high]` recursively. Use when partition-based average `O(n log n)` sorting is accepted. Combines with `partition` and recurrence best/worst cases. Example: `A={3,1,2}` -> `A={1,2,3}`.
- `dualPivotQuickSort(A, low, high)`: Uses two pivots to split into three regions. Use when the task specifically describes dual-pivot or three-region partitioning. Combines with Sort3-style region invariants. Example: `A={5,1,3,7,2}` -> final sorted segment `{1,2,3,5,7}`.

```c
// D3. QUICKSORT PARTITION AND DUAL-PIVOT QUICKSORT
int partition(int A[], int low, int high) {
    int pivot = A[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (A[j] < pivot) {
            i++;
            swap(A, i, j);
        }
    }
    swap(A, i + 1, high);
    return i + 1;
}
void quickSort(int A[], int low, int high) {
    if (low < high) {
        int p = partition(A, low, high);
        quickSort(A, low, p - 1);
        quickSort(A, p + 1, high);
    }
}
void dualPivotQuickSort(int A[], int low, int high) {
    if (low >= high) return;
    if (A[low] > A[high]) swap(A, low, high);
    int p1 = A[low], p2 = A[high];
    int lt = low + 1, gt = high - 1, i = lt;
    while (i <= gt) {
        if (A[i] < p1) swap(A, i++, lt++);
        else if (A[i] >= p2) swap(A, i, gt--);
        else i++;
    }
    swap(A, low, --lt);
    swap(A, high, ++gt);
    dualPivotQuickSort(A, low, lt - 1);
    dualPivotQuickSort(A, lt + 1, gt - 1);
    dualPivotQuickSort(A, gt + 1, high);
}

```

# E. Pointers, linked lists, stacks, queues

Dynamic memory and abstract-data-type restrictions.

## E1. Pointers, malloc, dynamic array reverse/prepend

**Tags:** pointers | malloc | array decay

**Purpose:** Understand pass-by-value, pointer writes, and heap-allocated arrays.

**Invariant:** Pointer version changes caller values because it writes to caller addresses.

**Runtime:** reverseArray O(n); prepend O(n).

**Edge cases:** Always handle malloc returning NULL in real C.

**Exam traps:** C passes pointer values by value; the pointer copy still points to original memory.

**Function atlas:**

- `swapByValue(a, b)`: `a` and `b` are local integer copies. Use as a warning example: caller variables do not change. Combines with pass-by-value explanations. Example: `x=1`, `y=2`, `swapByValue(x,y)` -> caller still has `x=1`, `y=2`.
- `swapByAddress(a, b)`: `a` and `b` are integer addresses. Use when caller variables must change. Combines with pointer parameters and `swapInt`. Example: `swapByAddress(&x,&y)` changes caller values.
- `reverseArray(A, n)`: `A` points to the input array, `n` is its length, return value is a new heap array. Use when output must be a new reversed array. Combines with malloc, array indexing, and memory ownership. Example: `A={1,2,3}` -> returns `{3,2,1}`.
- `prepend(A, n, x)`: `A` points to old array, `n` is old length, `x` is new first value. Use when array size must grow by one. Combines with malloc and shifting/copying. Example: `A={2,3}`, `x=1` -> returns `{1,2,3}`.

```c
// E1. POINTERS, MALLOC, DYNAMIC ARRAY REVERSE/PREPEND
void swapByValue(int a, int b) {
    int tmp = a; a = b; b = tmp;  // Changes only local copies.
}
void swapByAddress(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
int* reverseArray(int *A, int n) {
    int *B = malloc(n * sizeof(int));
    if (B == NULL) return NULL;
    for (int i = 0; i < n; i++) {
        B[i] = A[n - 1 - i];      // Mirror index.
    }
    return B;
}
int* prepend(int *A, int n, int x) {
    int *B = malloc((n + 1) * sizeof(int));
    if (B == NULL) return NULL;
    B[0] = x;
    for (int i = 0; i < n; i++) {
        B[i + 1] = A[i];
    }
    return B;
}

```

## E2. Singly linked list core

**Tags:** struct node | traversal | insert

**Purpose:** Linked lists introduce node allocation and pointer rewiring.

**Invariant:** During traversal, p points to the next unprocessed node.

**Runtime:** Traversal and arrayToList are O(n); pushFront is O(1).

**Edge cases:** Empty list has head==NULL.

**Exam traps:** p->next means the next field of the node p points to.

**Function atlas:**

- `newNode(x)`: `x` is the key stored in the node. Use whenever a linked structure needs a fresh node. Combines with lists, linked stacks, linked queues, and chaining hash tables. Example: `x=7` -> node with `key=7`, `next=NULL`.
- `pushFront(head, x)`: `head` is current first node, `x` is the new value. Use for O(1) insertion at the front. Combines with stack push and chaining insertion. Example: list `2->3`, `x=1` -> `1->2->3`.
- `printList(head)`: `head` is the first node or `NULL`. Use for traversal/output tasks. Combines with linked-list tracing. Example: `1->4->NULL` -> prints `1 4`.
- `arrayToList(A, n)`: `A[]` is input array, `n` is length. Use when array data must become a linked list in same order. Combines with node allocation and tail pointer maintenance. Example: `A={1,2,3}` -> `1->2->3`.

```c
// E2. SINGLY LINKED LIST CORE
struct node {
    int key;
    struct node *next;
};
struct node* newNode(int x) {
    struct node *p = malloc(sizeof(struct node));
    if (p == NULL) return NULL;
    p->key = x;
    p->next = NULL;
    return p;
}
struct node* pushFront(struct node *head, int x) {
    struct node *p = newNode(x);
    if (p == NULL) return head;
    p->next = head;              // New node points to old first node.
    return p;                    // New node becomes head.
}
void printList(struct node *head) {
    for (struct node *p = head; p != NULL; p = p->next) {
        printf("%d ", p->key);
    }
}
struct node* arrayToList(int A[], int n) {
    struct node *head = NULL, *tail = NULL;
    for (int i = 0; i < n; i++) {
        struct node *p = newNode(A[i]);
        if (head == NULL) head = tail = p;
        else { tail->next = p; tail = p; }
    }
    return head;
}
```

## E3. Reverse linked list and delete-after

**Tags:** linked list | pointer rewiring | save next

**Purpose:** The most important linked-list pointer pattern: save next, then rewire.

**Invariant:** reverseList: prev is reversed prefix; cur is first node of unreversed suffix.

**Runtime:** reverseList O(n); insertAfter/deleteAfter O(1).

**Edge cases:** Empty and one-node lists reverse correctly.

**Exam traps:** cur=cur->next after rewiring loses the old suffix. Save next first.

**Function atlas:**

- `reverseList(head)`: `head` is the first node. Use when a list must be reversed in place. Combines with save-next pointer discipline and stack-like order reversal. Example: `1->2->3` -> `3->2->1`.
- `insertAfter(p, x)`: `p` points to the node after which to insert, `x` is the new key. Use for O(1) insertion when the predecessor is known. Combines with pointer rewiring and allocation. Example: at node `2` in `1->2->4`, insert `3` -> `1->2->3->4`.
- `deleteAfter(p)`: `p` points to the predecessor of the node to remove. Use for O(1) deletion when predecessor is known. Combines with save pointer, bypass, and `free`. Example: at node `2` in `1->2->3->4` -> `1->2->4`.

```c
// E3. REVERSE LINKED LIST AND DELETE-AFTER
struct node* reverseList(struct node *head) {
    struct node *prev = NULL;
    struct node *cur = head;
    while (cur != NULL) {
        struct node *next = cur->next;  // Save original next before rewiring.
        cur->next = prev;              // Reverse current arrow.
        prev = cur;                    // Current joins reversed prefix.
        cur = next;                    // Continue with original suffix.
    }
    return prev;
}
void insertAfter(struct node *p, int x) {
    if (p == NULL) return;
    struct node *q = newNode(x);
    if (q == NULL) return;
    q->next = p->next;          // First point q to old suffix.
    p->next = q;                // Then link p to q.
}
void deleteAfter(struct node *p) {
    if (p == NULL || p->next == NULL) return;
    struct node *q = p->next;
    p->next = q->next;          // Skip q.
    free(q);
}

```

## E4. Stack and queue with arrays

**Tags:** ADT implementation | stack | circular queue

**Purpose:** Concrete implementation of LIFO and FIFO using fixed arrays.

**Invariant:** Stack uses top as last occupied index; queue uses front as next removal and rear as next insertion.

**Runtime:** All operations O(1).

**Edge cases:** Underflow/overflow checks prevent invalid access.

**Exam traps:** Circular queue needs size or another convention to distinguish full from empty.

**Function atlas:**

- `pushArr(x)` / `popArr()`: `x` is the pushed value; global `S` and `top` hold stack state. Use for LIFO behavior with fixed capacity. Combines with recursion simulation, DFS stacks, and ADT-only questions. Example: push `4`, push `7`, pop -> returns `7`.
- `enqueueArr(x)` / `dequeueArr()`: `x` is the enqueued value; global `Q`, `front`, `rear`, and `qsize` hold queue state. Use for FIFO behavior with circular array indices. Combines with BFS and level-order tree traversal. Example: enqueue `4`, enqueue `7`, dequeue -> returns `4`.

```c
// E4. STACK AND QUEUE WITH ARRAYS
#define STACK_SIZE 100
int S[STACK_SIZE];
int top = -1;
int stackEmpty(void) { return top < 0; }
int stackFull(void)  { return top == STACK_SIZE - 1; }
void pushArr(int x) {
    if (stackFull()) return;
    S[++top] = x;
}
int popArr(void) {
    if (stackEmpty()) return -INF;
    return S[top--];
}
#define QSIZE 100
int Q[QSIZE];
int front = 0, rear = 0, qsize = 0;
int queueEmpty(void) { return qsize == 0; }
int queueFull(void)  { return qsize == QSIZE; }
void enqueueArr(int x) {
    if (queueFull()) return;
    Q[rear] = x;
    rear = (rear + 1) % QSIZE;  // Wrap around at array end.
    qsize++;
}
int dequeueArr(void) {
    if (queueEmpty()) return -INF;
    int x = Q[front];
    front = (front + 1) % QSIZE;
    qsize--;
    return x;
}

```

## E5. Stack and queue with linked lists

**Tags:** linked list ADT | O(1) operations

**Purpose:** Implement stacks at the head and queues with both front and rear pointers.

**Invariant:** Queue rear always points to last node; if front becomes NULL, rear must also become NULL.

**Runtime:** push/pop/enqueue/dequeue are O(1).

**Edge cases:** Dequeuing last element resets both front and rear.

**Exam traps:** Forgetting rear=NULL after last dequeue leaves a dangling pointer.

**Function atlas:**

- `pushLL(S, x)` / `popLL(S)`: `S` is a linked stack object, `x` is the pushed key. Use when stack size is dynamic. Combines with `newNode`, push-front, DFS-style LIFO behavior. Example: push `2`, push `5`, pop -> returns `5`.
- `enqueueLL(Q, x)` / `dequeueLL(Q)`: `Q` is a linked queue object, `x` is the enqueued key. Use when FIFO size is dynamic. Combines with BFS, tree shortest root-leaf distance, and front/rear pointer maintenance. Example: enqueue `2`, enqueue `5`, dequeue -> returns `2`.

```c
// E5. STACK AND QUEUE WITH LINKED LISTS
struct StackLL { struct node *top; };
void pushLL(struct StackLL *S, int x) {
    struct node *p = newNode(x);
    p->next = S->top;
    S->top = p;
}
int popLL(struct StackLL *S) {
    if (S->top == NULL) return -INF;
    struct node *p = S->top;
    int x = p->key;
    S->top = p->next;
    free(p);
    return x;
}
struct QueueLL { struct node *front; struct node *rear; };
void enqueueLL(struct QueueLL *Q, int x) {
    struct node *p = newNode(x);
    if (Q->rear == NULL) Q->front = Q->rear = p;
    else { Q->rear->next = p; Q->rear = p; }
}
int dequeueLL(struct QueueLL *Q) {
    if (Q->front == NULL) return -INF;
    struct node *p = Q->front;
    int x = p->key;
    Q->front = p->next;
    if (Q->front == NULL) Q->rear = NULL;
    free(p);
    return x;
}
```

## E6. ADT-only Kth largest using one auxiliary stack

**Tags:** Stack ADT | restrictions | selection

**Purpose:** Use only pop, push, and isEmpty to remove the maximum k times.

**Invariant:** After round r, the r largest values have been removed; x is the last removed maximum.

**Runtime:** O(k*n), worst O(n^2) if k grows with n.

**Edge cases:** Assumes values are unique, as in the exam statement.

**Exam traps:** Every popped value must be pushed somewhere or deliberately removed.

**Function atlas:**

- `Kth(S, n, k)`: `S` is the input stack, `n` is its size, `k` asks for the kth largest value. Use when the task restricts you to Stack ADT operations and one auxiliary stack. Combines with repeated maximum selection and ADT-only discipline. Example: stack values `{3,9,1}` with top anywhere, `k=2` -> returns `3` after removing max once and selecting next max.

```c
// E6. ADT-ONLY KTH LARGEST USING ONE AUXILIARY STACK
/***** Abstract stack operations assumed by task:
 * struct Stack* initStack();
 * void push(struct Stack* S, int x);
 * int pop(struct Stack* S);
 * int isEmpty(struct Stack* S);
 *****/
int Kth(struct Stack *S, int n, int k) {
    struct Stack *T = initStack();
    int x = 0;
    for (int round = 1; round <= k; round++) {
        int topValue = pop(S);
        push(T, topValue);
        x = topValue;
        while (!isEmpty(S)) {
            topValue = pop(S);
            push(T, topValue);
            if (topValue > x) x = topValue;
        }
        while (!isEmpty(T)) {
            topValue = pop(T);
            if (topValue != x) push(S, topValue);  // Remove one max value.
        }
    }
    return x;
}

```

## E7. Queue/stack transformations

**Tags:** ADT-only | reverse evens | two stacks/queues

**Purpose:** Common ADT transformation patterns under restricted operations.

**Invariant:** reverseEven: odd positions keep original values; even values are supplied from the stack.

**Runtime:** reverseEven O(n); two-stack push O(1).

**Edge cases:** No even values: stack stays empty and queue is unchanged.

**Exam traps:** Queue order is FIFO; stack order is LIFO. Use both deliberately.

**Function atlas:**

- `reverseEven(Q)`: `Q` is a queue of integers. Use when only even values must reverse while positions/order of odd values remain compatible with queue traversal. Combines with auxiliary stack for reversal and auxiliary queue for preserving scan order. Example: queue `1,2,3,4,6` -> `1,6,3,4,2`.
- `twoStacksOneArrayPush1(A, n, t1, t2, x)` / `twoStacksOneArrayPush2(...)`: `A[]` is shared storage, `n` is capacity, `t1/t2` are top indices by address, `x` is pushed value. Use to implement two stacks growing toward each other. Combines with array bounds and overflow condition. Example: `t1=-1`, `t2=5`, push1 `8` -> `A[0]=8`, `t1=0`.

```c
// E7. QUEUE/STACK TRANSFORMATIONS
void reverseEven(struct Queue *Q) {
    struct Stack *S = initStack();
    struct Queue *T = initQueue();
    int n = queueSize(Q);
    for (int i = 0; i < n; i++) {
        int x = deQueue(Q);
        if (x % 2 == 0) push(S, x);     // Store evens in reverse order.
        enQueue(T, x);                  // Preserve original position sequence.
    }
    for (int i = 0; i < n; i++) {
        int x = deQueue(T);
        if (x % 2 == 0) enQueue(Q, pop(S));
        else enQueue(Q, x);
    }
}
void twoStacksOneArrayPush1(int A[], int n, int *t1, int *t2, int x) {
    if (*t1 + 1 == *t2) return;         // Total array is full.
    A[++(*t1)] = x;
}
void twoStacksOneArrayPush2(int A[], int n, int *t1, int *t2, int x) {
    if (*t1 + 1 == *t2) return;
    A[--(*t2)] = x;
}

```

# F. Trees, AVL, and hashing

Pointer structures for dictionaries and search.

## F1. Binary tree traversals and expression tree order

**Tags:** tree | recursion | traversal

**Purpose:** Traversal order is controlled only by where the visit/print line is placed.

**Invariant:** Each call is responsible for exactly the subtree rooted at p.

**Runtime:** O(n), each node is visited once.

**Edge cases:** NULL subtree prints nothing.

**Exam traps:** For a BST, inorder prints sorted values; for a general binary tree, it does not.

**Function atlas:**

- `preorder(p)`: `p` is the current tree node. Use when the root must be processed before subtrees. Combines with expression prefix notation and DFS visit-before-recursion. Example: tree root `+` with leaves `2,3` -> prints `+ 2 3`.
- `inorder(p)`: `p` is the current tree node. Use for BST sorted output or infix expression order. Combines with BST property. Example: BST with keys `1,2,3` -> prints `1 2 3`.
- `postorder(p)`: `p` is the current tree node. Use when children must be processed before parent. Combines with expression evaluation and delete/free-tree order. Example: root `+` with leaves `2,3` -> prints `2 3 +`.

```c
// F1. BINARY TREE TRAVERSALS AND EXPRESSION TREE ORDER
struct TreeNode {
    int val;
    int aux;
    struct TreeNode *left;
    struct TreeNode *right;
};
void preorder(struct TreeNode *p) {
    if (p == NULL) return;
    printf("%d ", p->val);       // Visit before subtrees.
    preorder(p->left);
    preorder(p->right);
}
void inorder(struct TreeNode *p) {
    if (p == NULL) return;
    inorder(p->left);
    printf("%d ", p->val);       // Visit between left and right.
    inorder(p->right);
}
void postorder(struct TreeNode *p) {
    if (p == NULL) return;
    postorder(p->left);
    postorder(p->right);
    printf("%d ", p->val);       // Visit after subtrees.
}
```

## F2. BST search, min, insert

**Tags:** BST | one-step delayed pointer | O(h)

**Purpose:** BST operations are search-path operations controlled by the key-order invariant.

**Invariant:** BST property: left values <= node <= right values.

**Runtime:** O(h), where h is the tree height; balanced h=O(log n), degenerate h=O(n).

**Edge cases:** Insert into empty tree updates *root.

**Exam traps:** Use struct TreeNode **root when insertion/deletion may change the root pointer.

**Function atlas:**

- `bstSearch(p, x)`: `p` is the root of the current subtree, `x` is the searched key. Use when the BST order lets you choose one branch. Combines with binary-search discard logic and dictionary lookup. Example: search `7` in root `5` with right child `7` -> returns the `7` node.
- `bstMin(p)`: `p` is a subtree root. Use to find the minimum key by following left links. Combines with successor/delete logic. Example: tree `5 <- 2 <- 1` -> returns node `1`.
- `newTreeNode(x)`: `x` is the key. Use before inserting a tree node. Combines with malloc and BST/AVL insertion. Example: `x=4` -> node with no children.
- `bstInsert(root, x)`: `root` is the address of the root pointer, `x` is the inserted key. Use when insertion may change an empty root. Combines with parent tracking and pointer-to-pointer updates. Example: empty tree, insert `5` -> `*root` points to key `5`.

```c
// F2. BST SEARCH, MIN, INSERT
struct TreeNode* bstSearch(struct TreeNode *p, int x) {
    while (p != NULL && p->val != x) {
        if (x < p->val) p = p->left;
        else p = p->right;
    }
    return p;
}
struct TreeNode* bstMin(struct TreeNode *p) {
    if (p == NULL) return NULL;
    while (p->left != NULL) p = p->left;
    return p;
}
struct TreeNode* newTreeNode(int x) {
    struct TreeNode *p = malloc(sizeof(struct TreeNode));
    p->val = x; p->aux = 0; p->left = NULL; p->right = NULL;
    return p;
}
void bstInsert(struct TreeNode **root, int x) {
    struct TreeNode *parent = NULL;
    struct TreeNode *cur = *root;
    while (cur != NULL) {
        parent = cur;
        if (x < cur->val) cur = cur->left;
        else cur = cur->right;
    }
    struct TreeNode *p = newTreeNode(x);
    if (parent == NULL) *root = p;
    else if (x < parent->val) parent->left = p;
    else parent->right = p;
}

```

## F3. BST delete with predecessor

**Tags:** BST | delete cases | pointer-to-pointer

**Purpose:** Deletion is case-based: leaf, one child, two children. This version uses the predecessor.

**Invariant:** After deletion, all remaining nodes still satisfy the BST property.

**Runtime:** O(h).

**Edge cases:** Deleting root works because root is passed by address.

**Exam traps:** Two-child deletion replaces the node by predecessor or successor, not by an arbitrary child.

**Function atlas:**

- `detachMax(root)`: `root` is the address of a subtree root pointer. Use to remove and return the largest node of that subtree. Combines with predecessor-based BST deletion. Example: subtree keys `{2,4,3}` -> returns node `4` and reconnects its left child if needed.
- `bstDelete(root, x)`: `root` is the address of the root/subtree pointer, `x` is the key to remove. Use for BST deletion with leaf, one-child, and two-child cases. Combines with `detachMax`, pointer-to-pointer recursion, and memory freeing. Example: deleting root `5` with predecessor `4` -> `4` replaces `5`.

```c
// F3. BST DELETE WITH PREDECESSOR
struct TreeNode* detachMax(struct TreeNode **root) {
    while ((*root)->right != NULL) {
        root = &((*root)->right);
    }
    struct TreeNode *maxNode = *root;
    *root = maxNode->left;       // Remove maxNode from its old position.
    maxNode->left = NULL;
    return maxNode;
}
void bstDelete(struct TreeNode **root, int x) {
    if (*root == NULL) return;
    if (x < (*root)->val) bstDelete(&((*root)->left), x);
    else if (x > (*root)->val) bstDelete(&((*root)->right), x);
    else {
        struct TreeNode *old = *root;
        if (old->left == NULL) *root = old->right;
        else if (old->right == NULL) *root = old->left;
        else {
            struct TreeNode *pred = detachMax(&(old->left));
            pred->left = old->left;
            pred->right = old->right;
            *root = pred;
        }
        free(old);
    }
}
```

## F4. Root-to-leaf distances and largest root-leaf path

**Tags:** tree | BFS | recursion

**Purpose:** Tree path tasks combine recursion with queue-based BFS and aux fields.

**Invariant:** BFS queue contains nodes in nondecreasing distance from root.

**Runtime:** O(n). BFS may stop early at first leaf.

**Edge cases:** One-child cases are handled separately in recursive shortest distance.

**Exam traps:** min(-1, something) would be wrong, so handle one-child cases explicitly.

**Function atlas:**

- `isLeaf(p)`: `p` is a tree node pointer. Use to detect a root-to-leaf endpoint. Combines with tree distance, path sum, and traversal base cases. Example: node with no children -> returns `TRUE`.
- `shortestDistRec(p)`: `p` is a tree root. Use when recursive shortest root-to-leaf distance is required. Combines with one-child edge cases and min recursion. Example: single-node tree -> returns `0`.
- `shortestDistBFS(p)`: `p` is a tree root. Use when shortest root-to-leaf should be found level by level. Combines with queue/BFS and `aux` distance fields. Example: root with left leaf -> returns `1`.
- `largestRootLeafSum(p)`: `p` is a tree root. Use when the best root-to-leaf sum is required. Combines with recursive max over branches. Example: paths `5->2` and `5->4` -> returns `9`.

```c
// F4. ROOT-TO-LEAF DISTANCES AND LARGEST ROOT-LEAF PATH
int isLeaf(struct TreeNode *p) {
    return p != NULL && p->left == NULL && p->right == NULL;
}
int shortestDistRec(struct TreeNode *p) {
    if (p == NULL) return -1;
    if (isLeaf(p)) return 0;
    if (p->left == NULL) return 1 + shortestDistRec(p->right);
    if (p->right == NULL) return 1 + shortestDistRec(p->left);
    return 1 + min(shortestDistRec(p->left), shortestDistRec(p->right));
}
int shortestDistBFS(struct TreeNode *p) {
    if (p == NULL) return -1;
    struct Queue *Q = initQueue();
    p->aux = 0;
    enqueue(Q, p);
    while (!isEmpty(Q)) {
        p = dequeue(Q);
        if (isLeaf(p)) return p->aux;
        if (p->left != NULL) { p->left->aux = p->aux + 1; enqueue(Q, p->left); }
        if (p->right != NULL) { p->right->aux = p->aux + 1; enqueue(Q, p->right); }
    }
    return -1;
}
int largestRootLeafSum(struct TreeNode *p) {
    if (p == NULL) return -INF;
    if (isLeaf(p)) return p->val;
    return p->val + max(largestRootLeafSum(p->left),
                        largestRootLeafSum(p->right));
}

```

## F5. AVL height, rotations, rebalance

**Tags:** AVL | rotations | height update

**Purpose:** AVL keeps the BST height logarithmic using rotations after updates.

**Invariant:** Every AVL node has balance factor -1, 0, or +1 after rebalancing.

**Runtime:** Each rotation is O(1); insertion/deletion rebalance over a path is O(log n).

**Edge cases:** Height convention: NULL=-1, leaf=0.

**Exam traps:** After a rotation, update heights bottom-up: old root first, new root second.

**Function atlas:**

- `hgt(p)` / `updateHgt(p)` / `balance(p)`: `p` is an AVL node. Use to compute and maintain height and balance factor after updates. Combines with rotations and rebalance decisions. Example: NULL height is `-1`; leaf height becomes `0`.
- `leftRotate(x)`: `x` is the root of a right-heavy subtree. Use for RR case or after right-left preparation. Combines with AVL rebalance and BST-preserving pointer rewiring. Example: subtree `1 ->right 2` rotates so `2` becomes root.
- `rightRotate(y)`: `y` is the root of a left-heavy subtree. Use for LL case or after left-right preparation. Combines with AVL rebalance. Example: subtree `2 ->left 1` rotates so `1` becomes root.
- `rebalance(p)`: `p` is the root of a possibly unbalanced AVL subtree. Use after insertion/deletion on a search path. Combines with height updates and single/double rotations. Example: left-right imbalance first rotates left child left, then rotates root right.

```c
// F5. AVL HEIGHT, ROTATIONS, REBALANCE
struct AVLNode {
    int key;
    int hgt;
    struct AVLNode *lft;
    struct AVLNode *rgt;
};
int hgt(struct AVLNode *p) { return p == NULL ? -1 : p->hgt; }
void updateHgt(struct AVLNode *p) {
    if (p != NULL) p->hgt = 1 + max(hgt(p->lft), hgt(p->rgt));
}
int balance(struct AVLNode *p) {
    return hgt(p->rgt) - hgt(p->lft);  // right-heavy is positive.
}
struct AVLNode* leftRotate(struct AVLNode *x) {
    struct AVLNode *y = x->rgt;
    struct AVLNode *b = y->lft;
    y->lft = x;
    x->rgt = b;
    updateHgt(x);              // Update lower node first.
    updateHgt(y);
    return y;
}
struct AVLNode* rightRotate(struct AVLNode *y) {
    struct AVLNode *x = y->lft;
    struct AVLNode *b = x->rgt;
    x->rgt = y;
    y->lft = b;
    updateHgt(y);
    updateHgt(x);
    return x;
}
struct AVLNode* rebalance(struct AVLNode *p) {
    updateHgt(p);
    if (balance(p) < -1) {
        if (balance(p->lft) > 0) p->lft = leftRotate(p->lft);
        return rightRotate(p);
    }
    if (balance(p) > 1) {
        if (balance(p->rgt) < 0) p->rgt = rightRotate(p->rgt);
        return leftRotate(p);
    }
    return p;
}

```

## F6. Hash table with chaining

**Tags:** hashing | linked lists | expected O(1)

**Purpose:** Use an array of linked-list heads to resolve collisions.

**Invariant:** A value k can only appear in bucket HT[hChain(k)].

**Runtime:** Expected O(1) search/insert; worst O(n) if all collide; overlap expected O(n).

**Edge cases:** Initialize HT before use.

**Exam traps:** If task says insert newer elements at the end of the list, adapt the insertion order.

**Function atlas:**

- `hChain(k)`: `k` is a key. Use to map a key to a chaining bucket. Combines with insert/search bucket selection. Example: with `HM=100`, `k=123` -> bucket `23`.
- `HTinit()`: Initializes all buckets to `NULL`. Use before any hash-table operation. Combines with every chaining hash application. Example: after call, `HT[i]==NULL` for all buckets.
- `HTInsert(k)`: `k` is the key to insert. Use to add a value to its bucket list. Combines with linked-list push-front and expected O(1) hashing. Example: insert `104` with `HM=100` -> bucket `4`.
- `HTSearch(k)`: `k` is the searched key. Use to test membership. Combines with overlap, target sum, duplicates, and dictionary lookup. Example: after inserting `4`, search `4` -> non-NULL.
- `print_overlap(A1, A2, n)`: `A1[]` and `A2[]` are arrays of equal length `n`. Use when all values appearing in both arrays must be printed. Combines: `HTInsert` inserts `A1`, `HTSearch` checks `A2`, hashing replaces nested `O(n^2)` comparison with expected `O(n)`. Example: `A1={4,3,12}`, `A2={7,4,9}` -> prints `4`.

```c
// F6. HASH TABLE WITH CHAINING
#define HM 100
struct HNode {
    int value;
    struct HNode *next;
};
struct HNode *HT[HM];
int hChain(int k) { return k % HM; }
void HTinit(void) {
    for (int i = 0; i < HM; i++) HT[i] = NULL;
}
void HTInsert(int k) {
    struct HNode *p = malloc(sizeof(struct HNode));
    p->value = k;
    p->next = HT[hChain(k)];      // Insert at beginning of bucket list.
    HT[hChain(k)] = p;
}
struct HNode* HTSearch(int k) {
    struct HNode *p = HT[hChain(k)];
    while (p != NULL && p->value != k) {
        p = p->next;
    }
    return p;
}
void print_overlap(int A1[], int A2[], int n) {
    for (int i = 0; i < n; i++) HTInsert(A1[i]);
    for (int i = 0; i < n; i++) {
        if (HTSearch(A2[i]) != NULL) printf("%d ", A2[i]);
    }
}

```

## F7. Open addressing with linear probing and deletion

**Tags:** hashing | probing | delete trap

**Purpose:** Store keys directly in the table; collisions move through probe sequence.

**Invariant:** Search follows the same probe sequence used by insertion.

**Runtime:** Expected O(1) under low load; worst O(m).

**Edge cases:** Full table: insert returns -1.

**Exam traps:** Deleting by setting to EMPTY can break searches unless cluster is repaired or DEL markers are used.

**Function atlas:**

- `hOpen(k, i)`: `k` is the key, `i` is the probe number. Use to compute the next linear-probing slot. Combines with open-address search/insert/delete. Example: with `OM=7`, `k=5`, `i=0` -> `(15)%7=1`.
- `initOpen(T)`: `T[]` is the open-address table. Use before inserting keys. Combines with EMPTY marker discipline. Example: all slots become `EMPTY`.
- `searchOpen(T, key)`: `T[]` is the table, `key` is searched. Use to follow the same probe sequence as insertion. Combines with deletion correctness and clustering. Example: if `key` sits at slot `3`, returns `3`; if an EMPTY slot is reached first, returns `-1`.
- `insertOpen(T, key)`: Inserts `key` into first EMPTY probe slot. Use when collision handling must be in-array. Combines with load factor and probe tracing. Example: if home slot full but next slot empty, inserts at next slot.
- `deleteOpen(T, key)`: Removes `key` and repairs the following cluster. Use when no tombstone marker is used. Combines with `searchOpen` and reinsertion. Example: deleting a key from the middle of a cluster still leaves later keys searchable.

```c
// F7. OPEN ADDRESSING WITH LINEAR PROBING AND DELETION
#define OM 7
int hOpen(int k, int i) { return (3 * k + i) % OM; }
void initOpen(int T[]) {
    for (int i = 0; i < OM; i++) T[i] = EMPTY;
}
int searchOpen(int T[], int key) {
    for (int i = 0; i < OM; i++) {
        int j = hOpen(key, i);
        if (T[j] == key) return j;
        if (T[j] == EMPTY) return -1;
    }
    return -1;
}
int insertOpen(int T[], int key) {
    for (int i = 0; i < OM; i++) {
        int j = hOpen(key, i);
        if (T[j] == EMPTY) { T[j] = key; return j; }
    }
    return -1;
}
int deleteOpen(int T[], int key) {
    int pos = searchOpen(T, key);
    if (pos == -1) return FALSE;
    T[pos] = EMPTY;
    int j = (pos + 1) % OM;
    while (T[j] != EMPTY) {
        int move = T[j];
        T[j] = EMPTY;
        insertOpen(T, move);      // Reinsert to preserve search correctness.
        j = (j + 1) % OM;
    }
    return TRUE;
}
```

## F8. Hash applications: target sum and duplicates

**Tags:** hashing | expected linear | applications

**Purpose:** Hashing removes the sortedness precondition from pair-sum style problems.

**Invariant:** Before processing A[i], HT contains exactly the earlier values A[0..i-1].

**Runtime:** Expected O(n).

**Edge cases:** Distinctness assumptions matter; targetSumHash inserts after search.

**Exam traps:** If using open addressing with EMPTY=0, strictly positive keys are needed or a different empty marker is required.

**Function atlas:**

- `targetSumHash(A, n, target)`: `A[]` is input, `n` length, `target` required sum. Use when unsorted pair-sum should be expected linear time. Combines with complement search and insert-after-search to avoid using the same element twice. Example: `A={4,1,7}`, `target=8` -> returns `TRUE`.
- `hasDuplicate(A, n)`: `A[]` is input, `n` length. Use when duplicate detection should avoid nested loops. Combines with hash membership checks. Example: `A={3,5,3}` -> returns `TRUE`.

```c
// F8. HASH APPLICATIONS: TARGET SUM AND DUPLICATES
int targetSumHash(int A[], int n, int target) {
    HTinit();
    for (int i = 0; i < n; i++) {
        int need = target - A[i];
        if (HTSearch(need) != NULL) return TRUE;
        HTInsert(A[i]);           // Insert after search to avoid using A[i] twice.
    }
    return FALSE;
}
int hasDuplicate(int A[], int n) {
    HTinit();
    for (int i = 0; i < n; i++) {
        if (HTSearch(A[i]) != NULL) return TRUE;
        HTInsert(A[i]);
    }
    return FALSE;
}

```

# G. Dynamic programming

State, base, recurrence, fill order, answer.

## G1. Universal DP template and Fibonacci

**Tags:** DP | state | fill order

**Purpose:** Turn overlapping recursive subproblems into table entries computed once.

**Invariant:** After iteration i, all F[0..i] are correct.

**Runtime:** O(n) time, O(n) memory; can compress to O(1).

**Edge cases:** n=0 and n=1 are base cases.

**Exam traps:** State meaning comes before code. Without it, DP code is easy to misindex.

**Function atlas:**

- `fibDP(n)`: `n` is the Fibonacci index. Use as the smallest bottom-up DP pattern: state, base, recurrence, fill order, answer. Combines with table initialization and state compression. Example: `n=6` -> returns `8`.

```c
// G1. UNIVERSAL DP TEMPLATE AND FIBONACCI
/* DP schema for every exam answer:
 * State: what DP[i] or DP[i][j] means.
 * Base: smallest solved cases.
 * Recurrence: how larger states use smaller states.
 * Fill order: order that makes dependencies available.
 * Answer: which cell/value is returned.
 */
int fibDP(int n) {
    if (n <= 1) return n;
    int F[n + 1];
    F[0] = 0;
    F[1] = 1;
    for (int i = 2; i <= n; i++) {
        F[i] = F[i - 1] + F[i - 2];
    }
    return F[n];
}
```

## G2. Matrix DP: longest constrained path

**Tags:** matrix DP | helper table | bottom-up

**Purpose:** Current exercise style: right/down paths with value difference at most 1.

**Invariant:** S[i][j] is the longest valid path ending at cell (i,j).

**Runtime:** O(x*y).

**Edge cases:** First row has no top predecessor; first column has no left predecessor.

**Exam traps:** Because movement is only right/down, predecessors of (i,j) are top and left.

**Function atlas:**

- `longestPath(x, y, M)`: `x` and `y` are matrix dimensions, `M` is the input matrix. Use when paths move only right/down and adjacent values must differ by at most 1. Combines with helper-table fill order and matrix DP. Example: a `1x3` row `{1,2,4}` -> longest valid path length `2`.

```c
// G2. MATRIX DP: LONGEST CONSTRAINED PATH
int longestPath(int x, int y, int M[x][y]) {
    int S[x][y];
    int best = 0;
    for (int i = 0; i < x; i++) {
        for (int j = 0; j < y; j++) {
            S[i][j] = 1;           // Every cell alone is a path of length 1.
            if (i > 0 && abs_int(M[i][j] - M[i - 1][j]) <= 1) {
                S[i][j] = max(S[i][j], S[i - 1][j] + 1);
            }
            if (j > 0 && abs_int(M[i][j] - M[i][j - 1]) <= 1) {
                S[i][j] = max(S[i][j], S[i][j - 1] + 1);
            }
            best = max(best, S[i][j]);
        }
    }
    return best;
}

```

## G3. Palindrome cuts DP

**Tags:** string DP | palindrome table | cuts array

**Purpose:** Two-stage DP: first recognize palindrome substrings, then minimize cuts.

**Invariant:** pal[i][j] is true exactly when X[i..j] is palindrome; cut[i] is min cuts for suffix X[i..n-1].

**Runtime:** O(n^2).

**Edge cases:** n=1 returns 0.

**Exam traps:** Fill pal from back to front so pal[i+1][j-1] is already known.

**Function atlas:**

- `findMinCuts(X, n)`: `X[]` is the string, `n` its length. Use to split a string into the fewest palindrome substrings. Combines with palindrome recognition table and 1D cut DP. Example: `X="aab"` -> returns `1` because `aa | b`.

```c
// G3. PALINDROME CUTS DP
int findMinCuts(char X[], int n) {
    int pal[n][n];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) pal[i][j] = FALSE;
    for (int i = n - 1; i >= 0; i--) {
        for (int j = i; j < n; j++) {
            if (i == j) pal[i][j] = TRUE;
            else if (X[i] == X[j] && (j - i == 1 || pal[i + 1][j - 1])) {
                pal[i][j] = TRUE;
            }
        }
    }
    int cut[n];
    for (int i = n - 1; i >= 0; i--) {
        if (pal[i][n - 1]) cut[i] = 0;
        else {
            cut[i] = INF;
            for (int j = i; j < n - 1; j++) {
                if (pal[i][j]) cut[i] = min(cut[i], 1 + cut[j + 1]);
            }
        }
    }
    return cut[0];
}
```

## G4. LCS and edit distance

**Tags:** 2D string DP | prefixes | indexing

**Purpose:** String DP uses prefix lengths in the table and 0-indexed characters in arrays.

**Invariant:** L[i][j] / D[i][j] refers to prefixes of length i and j.

**Runtime:** O(n*m).

**Edge cases:** Empty prefix rows/columns are base cases.

**Exam traps:** Characters are X[i-1] and Y[j-1], not X[i] and Y[j].

**Function atlas:**

- `LCS(X, n, Y, m)`: `X[]` and `Y[]` are strings/arrays, `n` and `m` are their lengths. Use to find longest common subsequence length. Combines with 2D prefix DP and reconstruction questions. Example: `X="abc"`, `Y="ac"` -> returns `2`.
- `editDistance(X, n, Y, m)`: Same string parameters. Use when insert/delete/replace cost is minimized. Combines with 2D DP base rows/columns and recurrence choices. Example: `X="cat"`, `Y="cut"` -> returns `1`.

```c
// G4. LCS AND EDIT DISTANCE
int LCS(char X[], int n, char Y[], int m) {
    int L[n + 1][m + 1];
    for (int i = 0; i <= n; i++) L[i][0] = 0;
    for (int j = 0; j <= m; j++) L[0][j] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (X[i - 1] == Y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
            else L[i][j] = max(L[i - 1][j], L[i][j - 1]);
        }
    }
    return L[n][m];
}
int editDistance(char X[], int n, char Y[], int m) {
    int D[n + 1][m + 1];
    for (int i = 0; i <= n; i++) D[i][0] = i;
    for (int j = 0; j <= m; j++) D[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (X[i - 1] == Y[j - 1]) D[i][j] = D[i - 1][j - 1];
            else D[i][j] = 1 + min3(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
        }
    }
    return D[n][m];
}

```

## G5. Coin change and matrix-chain multiplication

**Tags:** 1D DP | interval DP | optimization

**Purpose:** Coin change uses amounts; matrix-chain uses intervals and split points.

**Invariant:** Coin: D[x] is min coins for amount x. Matrix: M[i][j] is min cost for Ai..Aj.

**Runtime:** Coin O(amount*k); matrix-chain O(n^3).

**Edge cases:** Unreachable amount remains INF.

**Exam traps:** Matrix-chain cost uses p[i-1] *p[k]* p[j].

**Function atlas:**

- `coinChangeMin(C, k, amount)`: `C[]` is coin denominations, `k` count of denominations, `amount` target value. Use when unlimited coins minimize number of coins. Combines with 1D DP and unreachable `INF` states. Example: `C={1,3,4}`, `amount=6` -> returns `2` from `3+3`.
- `matrixChain(p, n)`: `p[]` stores dimensions, matrix `Ai` has size `p[i-1] x p[i]`, `n` is number of matrices. Use when parenthesization minimizes scalar multiplications. Combines with interval DP and split point loops. Example: dimensions `10x30`, `30x5`, `5x60` -> best cost `4500`.

```c
// G5. COIN CHANGE AND MATRIX-CHAIN MULTIPLICATION
int coinChangeMin(int C[], int k, int amount) {
    int D[amount + 1];
    D[0] = 0;
    for (int x = 1; x <= amount; x++) D[x] = INF;
    for (int x = 1; x <= amount; x++) {
        for (int i = 0; i < k; i++) {
            if (x >= C[i] && D[x - C[i]] != INF) {
                D[x] = min(D[x], 1 + D[x - C[i]]);
            }
        }
    }
    return D[amount];
}
int matrixChain(int p[], int n) {
    // Matrices A1..An. Ai has dimension p[i-1] x p[i].
    int M[n + 1][n + 1];
    for (int i = 1; i <= n; i++) M[i][i] = 0;
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            M[i][j] = INF;
            for (int k = i; k < j; k++) {
                int cost = M[i][k] + M[k + 1][j] + p[i - 1] * p[k] * p[j];
                M[i][j] = min(M[i][j], cost);
            }
        }
    }
    return M[1][n];
}
```

## G6. Scalar DP: max product subarray and product of three

**Tags:** state compression | negative values | O(n)

**Purpose:** Sometimes the state is a few scalars, not a full table.

**Invariant:** maxHere/minHere are the extreme products of a subarray ending at i.

**Runtime:** O(n).

**Edge cases:** Assumes n>=1 for subarray, n>=3 for product of three.

**Exam traps:** Negative values can turn the smallest product into the largest product.

**Function atlas:**

- `maxProductSubarray(A, n)`: `A[]` is input, `n` length. Use when contiguous product can flip sign because of negative values. Combines with scalar DP and max/min state tracking. Example: `A={2,-3,4,-1}` -> returns `24`.
- `maxProduct3(A, n)`: `A[]` is input, `n>=3`. Use when choosing three values with maximum product, including two negatives. Combines with scan for top three maxima and two minima. Example: `A={-10,-10,1,2,3}` -> returns `300`.

```c
// G6. SCALAR DP: MAX PRODUCT SUBARRAY AND PRODUCT OF THREE
int maxProductSubarray(int A[], int n) {
    int maxHere = A[0];
    int minHere = A[0];
    int ans = A[0];
    for (int i = 1; i < n; i++) {
        if (A[i] < 0) swapInt(&maxHere, &minHere);
        maxHere = max(A[i], maxHere * A[i]);
        minHere = min(A[i], minHere * A[i]);
        ans = max(ans, maxHere);
    }
    return ans;
}
int maxProduct3(int A[], int n) {
    int p1 = -INF, p2 = -INF, p3 = -INF;
    int m1 = INF, m2 = INF;
    for (int i = 0; i < n; i++) {
        int x = A[i];
        if (x > p1) { p3 = p2; p2 = p1; p1 = x; }
        else if (x > p2) { p3 = p2; p2 = x; }
        else if (x > p3) { p3 = x; }
        if (x < m1) { m2 = m1; m1 = x; }
        else if (x < m2) { m2 = x; }
    }
    return max(p1 * p2 * p3, p1 * m1 * m2);
}

```

## G7. Biggest plus and nearest zero matrix DP

**Tags:** directional passes | matrix helpers | O(xy)

**Purpose:** Directional helper tables convert geometric matrix tasks into scans.

**Invariant:** Directional table entry stores consecutive ones or best distance from already-scanned directions.

**Runtime:** O(x*y), constant number of full matrix passes.

**Edge cases:** A cell with value 0 has plus arm -1 after min-1 and is ignored by arm>=0.

**Exam traps:** Loop direction must match dependency direction.

**Function atlas:**

- `min4(a, b, c, d)`: Four integers. Use as a small helper for directional minimums. Combines with plus-arm computation. Example: `min4(3,2,5,4)` -> returns `2`.
- `biggestPlus(x, y, M)`: `x,y` are matrix dimensions, `M` is a 0/1 matrix. Use when the largest plus shape of ones is required. Combines with four directional helper tables. Example: all-ones `3x3` -> returns `5` cells for arm length `1`.
- `nearestZero(x, y, M, D)`: `M` is input matrix, `D` receives distances to nearest zero. Use when nearest-source distance can be solved by two directional DP passes. Combines with grid DP and relaxation-like updates. Example: row `{1,0,1}` -> distances `{1,0,1}`.

```c
// G7. BIGGEST PLUS AND NEAREST ZERO MATRIX DP
int min4(int a, int b, int c, int d) { return min(min(a, b), min(c, d)); }
int biggestPlus(int x, int y, int M[x][y]) {
    int up[x][y], down[x][y], left[x][y], right[x][y];
    for (int i = 0; i < x; i++) for (int j = 0; j < y; j++) {
        up[i][j] = M[i][j] ? (i == 0 ? 1 : up[i - 1][j] + 1) : 0;
        left[i][j] = M[i][j] ? (j == 0 ? 1 : left[i][j - 1] + 1) : 0;
    }
    for (int i = x - 1; i >= 0; i--) for (int j = y - 1; j >= 0; j--) {
        down[i][j] = M[i][j] ? (i == x - 1 ? 1 : down[i + 1][j] + 1) : 0;
        right[i][j] = M[i][j] ? (j == y - 1 ? 1 : right[i][j + 1] + 1) : 0;
    }
    int best = 0;
    for (int i = 0; i < x; i++) for (int j = 0; j < y; j++) {
        int arm = min4(up[i][j], down[i][j], left[i][j], right[i][j]) - 1;
        if (arm >= 0) best = max(best, 4 * arm + 1);
    }
    return best;
}
void nearestZero(int x, int y, int M[x][y], int D[x][y]) {
    for (int i = 0; i < x; i++) for (int j = 0; j < y; j++)
        D[i][j] = (M[i][j] == 0 ? 0 : INF);
    for (int i = 0; i < x; i++) for (int j = 0; j < y; j++) {
        if (i > 0) D[i][j] = min(D[i][j], D[i - 1][j] + 1);
        if (j > 0) D[i][j] = min(D[i][j], D[i][j - 1] + 1);
    }
    for (int i = x - 1; i >= 0; i--) for (int j = y - 1; j >= 0; j--) {
        if (i + 1 < x) D[i][j] = min(D[i][j], D[i + 1][j] + 1);
        if (j + 1 < y) D[i][j] = min(D[i][j], D[i][j + 1] + 1);
    }
}

```

# H. Graph algorithms

BFS/DFS, paths, weighted relaxation, MST.

## H1. Graph representation in C

**Tags:** graphs | adjacency list | matrix

**Purpose:** Pick representation before writing BFS, DFS, or weighted algorithms.

**Invariant:** Adjacency list G[u].adj contains exactly the outgoing edges of u.

**Runtime:** addDirectedEdge O(1); scanning all adjacency lists O(V+E).

**Edge cases:** For undirected graphs, add both u->v and v->u.

**Exam traps:** Adjacency matrix scans neighbors in O(V); adjacency list scans only actual outgoing edges.

**Function atlas:**

- `addDirectedEdge(G, u, v, w)`: `G[]` is the vertex array, `u` source, `v` target, `w` weight. Use to build an adjacency list edge `u -> v`. Combines with BFS, DFS, Dijkstra/Bellman-style graph data, and undirected graphs by adding both directions. Example: add `0,1,5` -> `G[0].adj` contains edge to `1` with weight `5`.
- `initGraph(G, n)`: `G[]` is the vertex array, `n` number of vertices. Use before graph algorithms so colors, distances, and predecessors are known. Combines with BFS/DFS setup. Example: after init, every vertex is `WHITE`, `dist=INF`, `pred=-1`.

```c
// H1. GRAPH REPRESENTATION IN C
#define MAXV 100
#define WHITE 0
#define GREY 1
#define BLACK 2
struct Edge {
    int to;
    int w;
    struct Edge *next;
};
struct Vertex {
    struct Edge *adj;
    int color;
    int dist;
    int pred;
    int discover;
    int finish;
};
void addDirectedEdge(struct Vertex G[], int u, int v, int w) {
    struct Edge *e = malloc(sizeof(struct Edge));
    e->to = v;
    e->w = w;
    e->next = G[u].adj;
    G[u].adj = e;
}
void initGraph(struct Vertex G[], int n) {
    for (int i = 0; i < n; i++) {
        G[i].adj = NULL;
        G[i].color = WHITE;
        G[i].dist = INF;
        G[i].pred = -1;
        G[i].discover = G[i].finish = 0;
    }
}

```

## H2. BFS and k-hop neighbors

**Tags:** BFS | queue | unweighted shortest paths

**Purpose:** BFS visits vertices in increasing distance and is the template for k-hop tasks.

**Invariant:** When a vertex is dequeued, its dist is the shortest unweighted distance from s.

**Runtime:** O(V+E).

**Edge cases:** Unreachable vertices keep dist=INF.

**Exam traps:** BFS tree can depend on adjacency order; computed distances do not.

**Function atlas:**

- `BFS(G, n, s)`: `G[]` is the graph, `n` vertex count, `s` source vertex. Use for unweighted shortest paths, reachability, and level-order processing. Combines with queues, shortest root-leaf BFS, and k-hop tasks. Example: edges `0-1-2`, source `0` -> `dist[2]=2`.
- `printKHop(G, n, s, k)`: Same graph/source parameters, `k` is exact hop distance. Use when vertices exactly k edges away must be listed. Combines with BFS distances. Example: chain `0-1-2`, `s=0`, `k=2` -> prints `2`.

```c
// H2. BFS AND K-HOP NEIGHBORS
void BFS(struct Vertex G[], int n, int s) {
    struct Queue *Q = initQueue();
    for (int i = 0; i < n; i++) {
        G[i].color = WHITE;
        G[i].dist = INF;
        G[i].pred = -1;
    }
    G[s].color = GREY;
    G[s].dist = 0;
    enqueue(Q, s);
    while (!isEmpty(Q)) {
        int u = dequeue(Q);
        for (struct Edge *e = G[u].adj; e != NULL; e = e->next) {
            int v = e->to;
            if (G[v].color == WHITE) {
                G[v].color = GREY;
                G[v].dist = G[u].dist + 1;
                G[v].pred = u;
                enqueue(Q, v);
            }
        }
        G[u].color = BLACK;
    }
}
void printKHop(struct Vertex G[], int n, int s, int k) {
    BFS(G, n, s);
    for (int v = 0; v < n; v++)
        if (G[v].dist == k) printf("%d ", v);
}

```

## H3. DFS, cycle detection, edge types

**Tags:** DFS | colors | timestamps

**Purpose:** DFS explores deeply, then backtracks. Colors/timestamps classify graph structure.

**Invariant:** GREY means active on current recursion stack; BLACK means fully finished.

**Runtime:** O(V+E).

**Edge cases:** In undirected cycle detection, the edge back to parent is not a cycle.

**Exam traps:** Back edge to GREY vertex proves a directed cycle.

**Function atlas:**

- `DFSVisit(G, u)`: `G[]` is the graph, `u` current vertex. Use for depth-first traversal, timestamps, and edge classification. Combines with recursion stack colors, topological sort, and cycle detection. Example: edge from active `u` to GREY `v` -> prints back edge.
- `hasCycleUndirectedVisit(G, u, parent)`: `u` is current vertex, `parent` is the vertex that discovered it. Use to detect cycles in undirected graphs without mistaking the parent edge for a cycle. Combines with DFS colors and parent tracking. Example: triangle graph -> returns `TRUE`.

```c
// H3. DFS, CYCLE DETECTION, EDGE TYPES
int timeDFS = 0;
void DFSVisit(struct Vertex G[], int u) {
    G[u].color = GREY;
    G[u].discover = ++timeDFS;
    for (struct Edge *e = G[u].adj; e != NULL; e = e->next) {
        int v = e->to;
        if (G[v].color == WHITE) {
            printf("tree edge %d-%d\n", u, v);
            G[v].pred = u;
            DFSVisit(G, v);
        } else if (G[v].color == GREY) {
            printf("back edge %d-%d\n", u, v);
        } else if (G[u].discover < G[v].discover) {
            printf("forward edge %d-%d\n", u, v);
        } else {
            printf("cross edge %d-%d\n", u, v);
        }
    }
    G[u].color = BLACK;
    G[u].finish = ++timeDFS;
}
int hasCycleUndirectedVisit(struct Vertex G[], int u, int parent) {
    G[u].color = GREY;
    for (struct Edge *e = G[u].adj; e != NULL; e = e->next) {
        int v = e->to;
        if (G[v].color == WHITE) {
            if (hasCycleUndirectedVisit(G, v, u)) return TRUE;
        } else if (v != parent) return TRUE;
    }
    G[u].color = BLACK;
    return FALSE;
}

```

## H4. Count / print all simple paths

**Tags:** DFS backtracking | simple path | exponential

**Purpose:** Enumerate paths while marking the current branch to avoid repeated vertices.

**Invariant:** visited marks only vertices on the current path, not all vertices seen globally.

**Runtime:** Can be exponential because the number of simple paths can be exponential.

**Edge cases:** If source equals target, one empty/current path is counted/printed.

**Exam traps:** For all paths, unmark on return. Global visited would miss valid alternative paths.

**Function atlas:**

- `printPath()`: Uses global `path[]` and `pathLen`. Use to output the current DFS path. Combines with all-simple-path enumeration. Example: `path={0,2,3}`, `pathLen=3` -> prints `0 2 3`.
- `allPaths(G, u, t, visited)`: `u` is current vertex, `t` target, `visited[]` marks current path. Use to print every simple path from source to target. Combines with DFS backtracking and unmark-on-return. Example: paths `0->1->3` and `0->2->3` -> prints both.
- `countPathsMatrix(n, A, u, t, visited)`: `A` is adjacency matrix, `n` vertex count, `u` current, `t` target. Use to count simple paths in matrix representation. Combines with DFS and exponential-output reasoning. Example: matrix with `0->1`, `1->2`, `0->2` -> count from `0` to `2` is `2`.

```c
// H4. COUNT / PRINT ALL SIMPLE PATHS
int path[MAXV];
int pathLen = 0;
void printPath(void) {
    for (int i = 0; i < pathLen; i++) printf("%d ", path[i]);
    printf("\n");
}
void allPaths(struct Vertex G[], int u, int t, int visited[]) {
    visited[u] = TRUE;
    path[pathLen++] = u;
    if (u == t) printPath();
    else {
        for (struct Edge *e = G[u].adj; e != NULL; e = e->next) {
            int v = e->to;
            if (!visited[v]) allPaths(G, v, t, visited);
        }
    }
    pathLen--;                 // Remove u from current path.
    visited[u] = FALSE;        // Backtrack so u can appear in another path.
}
int countPathsMatrix(int n, int A[n][n], int u, int t, int visited[]) {
    if (u == t) return 1;
    visited[u] = TRUE;
    int count = 0;
    for (int v = 0; v < n; v++)
        if (A[u][v] && !visited[v]) count += countPathsMatrix(n, A, v, t, visited);
    visited[u] = FALSE;
    return count;
}
```

## H5. Topological sort

**Tags:** DAG | DFS finish order | dependency

**Purpose:** Topological order is reverse finishing order of DFS on a DAG.

**Invariant:** A vertex is output after all reachable descendants are finished.

**Runtime:** O(V+E).

**Edge cases:** Disconnected DAG: start DFS from every white vertex.

**Exam traps:** Topological sort is defined for DAGs. A back edge means no valid topological order.

**Function atlas:**

- `topoVisit(G, u)`: `u` is current vertex. Use to append a vertex after all descendants finish. Combines with DFS finish order. Example: edge `0->1` means `1` is appended before `0`.
- `topologicalSort(G, n)`: `G[]` is a DAG, `n` vertex count. Use when tasks involve prerequisite/dependency order. Combines with DFS, DAG reasoning, and cycle warnings. Example: edges `0->1`, `0->2` -> prints `0` before `1` and `2`.

```c
// H5. TOPOLOGICAL SORT
int topo[MAXV];
int topoN = 0;
void topoVisit(struct Vertex G[], int u) {
    G[u].color = GREY;
    for (struct Edge *e = G[u].adj; e != NULL; e = e->next) {
        int v = e->to;
        if (G[v].color == WHITE) topoVisit(G, v);
    }
    G[u].color = BLACK;
    topo[topoN++] = u;          // Finished vertices are appended.
}
void topologicalSort(struct Vertex G[], int n) {
    topoN = 0;
    for (int i = 0; i < n; i++) G[i].color = WHITE;
    for (int u = 0; u < n; u++)
        if (G[u].color == WHITE) topoVisit(G, u);
    for (int i = topoN - 1; i >= 0; i--) printf("%d ", topo[i]);
}

```

## H6. Dijkstra with adjacency matrix

**Tags:** weighted graph | nonnegative | relaxation

**Purpose:** Repeatedly finalize the unfinished vertex with smallest tentative distance.

**Invariant:** When u is marked done, dist[u] is final, assuming all weights are nonnegative.

**Runtime:** O(V^2) with adjacency matrix and linear extract-min.

**Edge cases:** Unreachable vertices stay INF.

**Exam traps:** Dijkstra is invalid for negative edge weights.

**Function atlas:**

- `extractMinUnvisited(n, dist, done)`: `n` is vertex count, `dist[]` tentative distances, `done[]` finalized flags. Use to choose the next vertex for Dijkstra/Prim with matrix implementations. Combines with greedy extract-min. Example: `dist={0,5,2}`, `done={1,0,0}` -> returns vertex `2`.
- `dijkstraMatrix(n, W, s, dist, pred)`: `W` is adjacency matrix with `INF` for no edge, `s` source, `dist/pred` are output arrays. Use for shortest paths with nonnegative weights. Combines with relaxation and extract-min. Example: edges `0->1` weight `5`, `0->2` weight `2`, `2->1` weight `1` -> `dist[1]=3`.

```c
// H6. DIJKSTRA WITH ADJACENCY MATRIX
int extractMinUnvisited(int n, int dist[], int done[]) {
    int best = -1;
    for (int v = 0; v < n; v++) {
        if (!done[v] && (best == -1 || dist[v] < dist[best])) best = v;
    }
    return best;
}
void dijkstraMatrix(int n, int W[n][n], int s, int dist[], int pred[]) {
    int done[n];
    for (int v = 0; v < n; v++) {
        dist[v] = INF;
        pred[v] = -1;
        done[v] = FALSE;
    }
    dist[s] = 0;
    for (int step = 0; step < n; step++) {
        int u = extractMinUnvisited(n, dist, done);
        if (u == -1 || dist[u] == INF) break;
        done[u] = TRUE;
        for (int v = 0; v < n; v++) {
            if (W[u][v] != INF && !done[v] && dist[u] + W[u][v] < dist[v]) {
                dist[v] = dist[u] + W[u][v];
                pred[v] = u;
            }
        }
    }
}
```

## H7. Bellman-Ford

**Tags:** weighted graph | negative weights | edge list

**Purpose:** Relax every edge V-1 times; one more improvement means negative cycle.

**Invariant:** After i passes, all shortest paths using at most i edges are represented in dist.

**Runtime:** O(V*E).

**Edge cases:** Negative cycles reachable from s cause FALSE.

**Exam traps:** The extra pass detects cycles; it is not part of normal distance computation.

**Function atlas:**

- `bellmanFord(n, E, m, s, dist, pred)`: `n` is vertex count, `E[]` edge list, `m` edge count, `s` source, `dist/pred` outputs. Use when negative edge weights may exist and negative cycles must be detected. Combines with repeated relaxation and cycle detection. Example: edges `0->1` weight `4`, `1->2` weight `-2` -> `dist[2]=2`; reachable negative cycle -> returns `FALSE`.

```c
// H7. BELLMAN-FORD
struct WEdge { int u; int v; int w; };
int bellmanFord(int n, struct WEdge E[], int m, int s, int dist[], int pred[]) {
    for (int v = 0; v < n; v++) {
        dist[v] = INF;
        pred[v] = -1;
    }
    dist[s] = 0;
    for (int i = 1; i <= n - 1; i++) {
        for (int e = 0; e < m; e++) {
            int u = E[e].u, v = E[e].v, w = E[e].w;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pred[v] = u;
            }
        }
    }
    for (int e = 0; e < m; e++) {
        int u = E[e].u, v = E[e].v, w = E[e].w;
        if (dist[u] != INF && dist[u] + w < dist[v]) return FALSE;
    }
    return TRUE;
}

```

## H8. Minimum spanning trees: Prim and Kruskal

**Tags:** MST | undirected | weighted

**Purpose:** Prim grows one tree; Kruskal adds cheapest safe edges between components.

**Invariant:** Prim: key[v] is cheapest edge connecting v to current tree. Kruskal: chosen edges never form a cycle.

**Runtime:** Prim matrix O(V^2). Kruskal O(E log E) if sorted efficiently; with selection sort O(E^2).

**Edge cases:** MST requires connected undirected graph for a full tree.

**Exam traps:** Dijkstra minimizes path distance from one source; Prim minimizes edge connection cost to a growing tree.

**Function atlas:**

- `primMatrix(n, W, start, parent)`: `W` is undirected weighted matrix, `start` is initial vertex, `parent[]` stores chosen MST edges. Use to build an MST by growing one tree. Combines with extract-min and cut/light-edge reasoning. Example: triangle weights `0-1=1`, `1-2=2`, `0-2=5` -> chooses edges `0-1` and `1-2`.
- `findSet(parent, x)`: `parent[]` is disjoint-set parent array, `x` is an element. Use to find a component representative. Combines with Kruskal cycle checks. Example: if `parent[2]=1` and `parent[1]=1`, returns `1`.
- `unionSet(parent, a, b)`: `a` and `b` are vertices/components. Use to merge two components after accepting an edge. Combines with Kruskal. Example: union `0` and `2` makes them share one representative.
- `kruskal(E, m, n)`: `E[]` is sorted edge list, `m` edge count, `n` vertex count. Use to build MST by taking cheapest non-cycle edges. Combines with sorting, disjoint sets, and safe-edge reasoning. Example: same triangle as above -> total weight `3`.

```c
// H8. MINIMUM SPANNING TREES: PRIM AND KRUSKAL
void primMatrix(int n, int W[n][n], int start, int parent[]) {
    int key[n], inTree[n];
    for (int v = 0; v < n; v++) {
        key[v] = INF;
        parent[v] = -1;
        inTree[v] = FALSE;
    }
    key[start] = 0;
    for (int count = 0; count < n; count++) {
        int u = extractMinUnvisited(n, key, inTree);
        inTree[u] = TRUE;
        for (int v = 0; v < n; v++) {
            if (W[u][v] != INF && !inTree[v] && W[u][v] < key[v]) {
                key[v] = W[u][v];
                parent[v] = u;
            }
        }
    }
}
int findSet(int parent[], int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
void unionSet(int parent[], int a, int b) {
    int ra = findSet(parent, a);
    int rb = findSet(parent, b);
    if (ra != rb) parent[rb] = ra;
}
int kruskal(struct WEdge E[], int m, int n) {
    // First sort E by weight using selection sort or another allowed sort.
    int parent[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int total = 0, chosen = 0;
    for (int e = 0; e < m && chosen < n - 1; e++) {
        int u = E[e].u, v = E[e].v;
        if (findSet(parent, u) != findSet(parent, v)) {
            unionSet(parent, u, v);
            total += E[e].w;
            chosen++;
        }
    }
    return total;
}

```

# Z. Exam wrapper

Final checklist and answer discipline.

## Z1. Exam answer wrapper and final checklist

**Tags:** exam style | answer hygiene | restrictions

**Purpose:** Use this wrapper around every written answer under time pressure.

**Invariant:** The checklist keeps the answer aligned with the task statement.

**Runtime:** Fast to apply during the exam.

**Edge cases:** Use it especially for ADT-only, pointer, DP, and graph tasks.

**Exam traps:** A correct algorithm can lose points if it violates the allowed operations.

```c
// Z1. EXAM ANSWER WRAPPER AND FINAL CHECKLIST
/* Before submitting a C/pseudocode answer, check:
 * 1) Function signature matches the task.
 * 2) Variables, arrays, pointers are initialized.
 * 3) Loop bounds match valid indices.
 * 4) Base cases / NULL / empty ADT handled.
 * 5) Allowed data-structure restrictions respected.
 * 6) Linked-list next pointer saved before rewiring.
 * 7) Every popped stack element is stored, pushed, or removed intentionally.
 * 8) DP state meaning and fill order are visible.
 * 9) Graph representation and traversal order are stated.
 * 10) Runtime is justified by processed elements/nodes/edges/cells.
 */
/* Minimal answer frame:
 * Plan: one sentence.
 * Code: clean C-shaped function.
 * Correctness: invariant or induction idea.
 * Runtime: O/Theta with one reason.
 * Edge cases: smallest and failure inputs.
 */

```

# Appendix. Source-to-document map

Plain source notes for the script structure, not legal citations.

## Appendix A. What each source contributed

**Tags:** source map | coverage | exam signal

**Purpose:** Show how the document was grounded in the course page, GitHub map, current exercises, and past exams.

**Invariant:** The script is organized by code dependency, while coverage follows the official topic list.

**Runtime:** Not applicable.

**Edge cases:** If future lecture/exercise materials change, add a new card rather than replacing the whole structure.

**Exam traps:** Past exams train skill type, but current lecture/exercise style has priority.

```c
// APPENDIX A. WHAT EACH SOURCE CONTRIBUTED
/* Source map:
 * Official UZH course page:
 *   algorithms and data structures, C implementation,
 *   analysis/complexity, searching, sorting, lists, trees,
 *   hashing, dynamic programming, graphs.
 *
 * GitHub Informatics-II-UZH map:
 *   exam-trap layer, code cards, drill cards,
 *   C traces, ADT restrictions, exact analysis,
 *   recursion order, tree printing, hashing probes,
 *   weighted-graph trace tables.
 *
 * Current exercises Ex00-Ex11:
 *   compile/run C, matrices, sorting, recursion, exact analysis,
 *   divide-and-conquer, heaps/quicksort, pointers, ADTs,
 *   trees/AVL, hashing, dynamic programming, graphs.
 *
 * Past exams FS23-FS25:
 *   recurring task grammar: trace code, respect constraints,
 *   write compact C/pseudocode, prove runtime/correctness.
 */

```
