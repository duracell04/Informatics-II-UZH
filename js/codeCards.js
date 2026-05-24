const codeCards = {
  swap: {
    title: "Swap / exchange in C",
    kind: "C mechanism",
    note: "Basic exchange operation used by Bubble Sort, Selection Sort, Quicksort partition and Heapsort. Pointer swap explains Ex06 pass-by-value vs address modification.",
    deps: ["pointers", "arrayDecay"],
    code: `void swap(int A[], int i, int j) {
    int t = A[i];
    A[i] = A[j];
    A[j] = t;
}

void swap_ptr(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}`,
  },
  bubble: {
    title: "Bubble Sort using swap()",
    kind: "C algorithm",
    note: "Adjacent compare-and-swap. Print after each pass matches Ex01.",
    deps: ["swap", "nestedloops", "invariant"],
    code: `void bubbleSort(int A[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        for (int j = 0; j < n - 1 - pass; j++) {
            if (A[j] > A[j + 1]) swap(A, j, j + 1);
        }
        printArray(A, n);
    }
}`,
  },
  optimizedBubble: {
    title: "Optimized Bubble Sort",
    kind: "C algorithm",
    note: "The swapped flag gives early termination on already sorted input: best case Θ(n).",
    deps: ["bubble", "bestWorstAvg"],
    code: `void bubbleSortOptimized(int A[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - pass; j++) {
            if (A[j] > A[j + 1]) {
                swap(A, j, j + 1);
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  xsort: {
    title: "XSort / cocktail-style bubble",
    kind: "C-like pseudocode",
    note: "Bidirectional bubble. The essential state is l, r and m.",
    deps: ["swap", "boundaries", "bubble"],
    code: `void xsort(int A[], int n) {
    int l = 0, r = n - 1, m;
    do {
        for (int j = r; j > l; j--) {
            if (A[j] < A[j-1]) { swap(A,j,j-1); m = j; }
        }
        l = m;
        for (int j = l; j < r; j++) {
            if (A[j] > A[j+1]) { swap(A,j,j+1); m = j; }
        }
        r = m;
    } while (l < r);
}`,
  },
  selection: {
    title: "Selection Sort",
    kind: "C algorithm",
    note: "Scan suffix for minimum and swap into fixed prefix. Safe in-place exam sort.",
    deps: ["swap", "scan", "invariant"],
    code: `void selectionSort(int A[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;
        for (int j = i + 1; j < n; j++)
            if (A[j] < A[min_index]) min_index = j;
        swap(A, i, min_index);
    }
}`,
  },
  insertion: {
    title: "Insertion Sort",
    kind: "C algorithm",
    note: "Maintains sorted prefix and inserts current value by shifting.",
    deps: ["invariant", "boundaries"],
    code: `void insertionSort(int A[], int n) {
    for (int i = 1; i < n; i++) {
        int t = A[i];
        int j = i - 1;
        while (j >= 0 && t < A[j]) {
            A[j + 1] = A[j];
            j--;
        }
        A[j + 1] = t;
    }
}`,
  },
  merge: {
    title: "Merge Sort",
    kind: "C-like pattern",
    note: "Divide-and-conquer: split, recursively sort, merge. Runtime T(n)=2T(n/2)+Θ(n).",
    deps: ["recurrences", "master"],
    code: `void mergeSort(int A[], int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(A, l, m);
    mergeSort(A, m + 1, r);
    merge(A, l, m, r);  // linear merge step
}`,
  },
  mergeHelper: {
    title: "merge(A,l,m,r)",
    kind: "C helper",
    note: "Stable linear merge using temporary arrays and i/j/k pointers.",
    deps: ["merge", "boundaries"],
    code: `void merge(int A[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = A[l + i];
    for (int j = 0; j < n2; j++) R[j] = A[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) A[k++] = L[i++];
        else A[k++] = R[j++];
    }
    while (i < n1) A[k++] = L[i++];
    while (j < n2) A[k++] = R[j++];
}`,
  },
  quick: {
    title: "Dual-pivot quicksort skeleton",
    kind: "C-like pattern",
    note: "Partition into three regions: <p1, between p1 and p2, >=p2.",
    deps: ["swap", "boundaries", "invariant"],
    code: `void dualPivotQuickSort(int A[], int low, int high) {
    if (low >= high) return;
    if (A[low] > A[high]) swap(A, low, high);
    int p1 = A[low], p2 = A[high];
    int lt = low + 1, i = low + 1, gt = high - 1;
    while (i <= gt) {
        if (A[i] < p1) swap(A, i++, lt++);
        else if (A[i] >= p2) swap(A, i, gt--);
        else i++;
    }
    swap(A, low, --lt); swap(A, high, ++gt);
    dualPivotQuickSort(A, low, lt-1);
    dualPivotQuickSort(A, lt+1, gt-1);
    dualPivotQuickSort(A, gt+1, high);
}`,
  },
  quickPartition: {
    title: "Single-pivot partition",
    kind: "C-like pattern",
    note: "Good pivots give balanced recursion; bad pivots give worst-case Θ(n²). Randomized pivots reduce the chance of bad splits.",
    deps: ["quick", "swap", "invariant"],
    code: `int partition(int A[], int l, int r) {
    int pivot = A[r];
    int i = l - 1;
    for (int j = l; j < r; j++) {
        if (A[j] <= pivot) {
            i++;
            swap(A, i, j);
        }
    }
    swap(A, i + 1, r);
    return i + 1;
}`,
  },
  counting: {
    title: "Counting / frequency sort",
    kind: "C algorithm",
    note: "Use when values are in 0..k-1. Frequency array replaces comparisons.",
    deps: ["frequencyArray", "directAddressing"],
    code: `void sortK(int A[], int n, int k) {
    int F[k];
    for (int i = 0; i < k; i++) F[i] = 0;
    for (int i = 0; i < n; i++) F[A[i]]++;
    int x = 0;
    for (int value = 0; value < k; value++)
        for (int c = 0; c < F[value]; c++) A[x++] = value;
}`,
  },
  sort3: {
    title: "Sort3 / Dutch national flag",
    kind: "C algorithm",
    note: "One pass over 0/1/2 values with three regions.",
    deps: ["swap", "boundaries", "invariant"],
    code: `void sort3(int A[], int n) {
    int l = 0, i = 0, r = n - 1;
    while (i <= r) {
        if (A[i] == 0) swap(A, l++, i++);
        else if (A[i] == 2) swap(A, i, r--);
        else i++;
    }
}`,
  },
  heapify: {
    title: "Heapify",
    kind: "C algorithm",
    note: "Push a violating node down until max-heap property is restored.",
    deps: ["heap", "swap"],
    code: `void heapify(int A[], int i, int s) {
    int m = i;
    int l = 2*i + 1;
    int r = 2*i + 2;
    if (l < s && A[l] > A[m]) m = l;
    if (r < s && A[r] > A[m]) m = r;
    if (m != i) {
        swap(A, i, m);
        heapify(A, m, s);
    }
}`,
  },
  buildHeap: {
    title: "BuildMaxHeap",
    kind: "C algorithm",
    note: "Heapify from last internal node down to root.",
    deps: ["heapify"],
    code: `void buildMaxHeap(int A[], int n) {
    for (int i = n/2 - 1; i >= 0; i--) {
        heapify(A, i, n);
    }
}`,
  },
  heapSort: {
    title: "HeapSort",
    kind: "C algorithm",
    note: "Build heap, repeatedly move max to end, shrink heap, heapify.",
    deps: ["buildHeap", "heapify", "swap"],
    code: `void heapSort(int A[], int n) {
    buildMaxHeap(A, n);
    for (int end = n - 1; end > 0; end--) {
        swap(A, 0, end);
        heapify(A, 0, end);
    }
}`,
  },
  daryHeap: {
    title: "d-ary heap child formula",
    kind: "formula + C helper",
    note: "For 0-based arrays, children of node i are d*i+1 ... d*i+d.",
    deps: ["heap", "heapify"],
    code: `int child(int i, int k, int d) {
    // k = 1,...,d
    return d * i + k;
}

void daryHeapify(int A[], int i, int n, int d) {
    int largest = i;
    for (int k = 1; k <= d; k++) {
        int c = child(i, k, d);
        if (c < n && A[c] > A[largest]) largest = c;
    }
    if (largest != i) { swap(A, i, largest); daryHeapify(A, largest, n, d); }
}`,
  },
  printHeap: {
    title: "printHeap / Graphviz edges",
    kind: "C pattern",
    note: "For heap drawings, print every valid parent-child edge. Works for binary or d-ary heaps by changing d.",
    deps: ["heap", "daryHeap"],
    code: `void printHeap(int A[], int n, int d) {
    printf("graph g {\\n");
    for (int i = 0; i < n; i++) {
        for (int k = 1; k <= d; k++) {
            int c = d * i + k;
            if (c < n) printf("  %d -- %d;\\n", A[i], A[c]);
        }
    }
    printf("}\\n");
}`,
  },
  comparisonExchangeCount: {
    title: "Comparison / exchange counting",
    kind: "trace checklist",
    note: "Do not mix comparisons, assignments and swaps; exam tasks often ask for a specific count.",
    deps: ["loopcount", "heapify"],
    code: `Bubble pass p:
  comparisons += n - 1 - p
  exchanges += number of adjacent inversions swapped in that pass

Heapify trace:
  count one exchange only when parent and selected child swap
  recursive heapify can add more exchanges

BuildHeap:
  trace heapify calls from floor(n/2)-1 down to 0`,
  },
  exactAnalysisWorkflow: {
    title: "Exact-analysis workflow",
    kind: "runtime checklist",
    note: "Use this before simplifying to O/Theta notation. Ex03 tasks often grade the exact counting setup.",
    deps: ["loopcount", "nestedloops", "bestWorstAvg"],
    code: `Workflow:
1. Choose the input-size variable.
2. Count each statement before simplification.
3. Count loop-condition checks separately if requested.
4. For independent nested loops, multiply ranges.
5. For coupled nested loops, write the sum.
6. Simplify the exact formula.
7. State the asymptotic bound.
8. Name the best/worst-case trigger when branches differ.`,
  },
  topKSelectionAnalysis: {
    title: "algo1 / top-k selection pattern",
    kind: "invariant + runtime",
    note: "This is the bridge between code tracing, loop invariants and runtime.",
    deps: ["exactAnalysisWorkflow", "selection", "invariant"],
    code: `Pattern:
for i = 0..k-1:
  max = i
  for j = i+1..n-1:
    if A[j] > A[max]: max = j
  swap(A, i, max)
  sum += A[i]

Invariant:
  before iteration i, A[0..i-1] contains the i largest values
  in descending selected order.

Runtime:
  comparisons = (n-1) + (n-2) + ... + (n-k)
  Theta(k n), and Theta(n^2) when k is proportional to n.`,
  },
  sieve: {
    title: "Sieve of Eratosthenes",
    kind: "C pattern",
    note: "Boolean marking task; the main exam trap is loop bounds for p*p <= n and marking multiples.",
    deps: ["cbase", "nestedloops"],
    code: `void sieve(int n, int prime[]) {
    for (int i = 0; i <= n; i++) prime[i] = 1;
    prime[0] = prime[1] = 0;
    for (int p = 2; p * p <= n; p++) {
        if (prime[p]) {
            for (int x = p * p; x <= n; x += p)
                prime[x] = 0;
        }
    }
}`,
  },
  pairSum: {
    title: "Pair sum: naive",
    kind: "C algorithm",
    note: "Checks every pair. Correct but Θ(n²).",
    deps: ["nestedloops"],
    code: `int pairSum(int A[], int n, int c) {
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (A[i] + A[j] == c) return 1;
    return 0;
}`,
  },
  pairSumSorted: {
    title: "Pair sum sorted: two pointers",
    kind: "C algorithm",
    note: "Uses sortedness to move left/right pointers.",
    deps: ["boundaries"],
    code: `int pairSumSorted(int A[], int n, int c) {
    int i = 0, j = n - 1;
    while (i < j) {
        int s = A[i] + A[j];
        if (s == c) return 1;
        else if (s < c) i++;
        else j--;
    }
    return 0;
}`,
  },
  binarySearch: {
    title: "Binary Search",
    kind: "C algorithm",
    note: "Discard half the sorted array each iteration.",
    deps: ["boundaries", "invariant"],
    code: `int binarySearch(int A[], int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = (l + r) / 2;
        if (A[m] == x) return m;
        if (A[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
  },
  cStrings: {
    title: "C strings and indexing",
    kind: "C pattern",
    note: "A C string is a char array ending in \\0. DP and recursion tasks index X[i] and often use strlen for bounds.",
    deps: ["arrayDecay", "palRec"],
    code: `#include <string.h>

int isPalindrome(char X[]) {
    int l = 0;
    int r = strlen(X) - 1;
    while (l < r) {
        if (X[l] != X[r]) return 0;
        l++;
        r--;
    }
    return 1;
}

// X[i] is valid for 0 <= i < strlen(X); X[strlen(X)] is '\\0'.`,
  },
  commandLineInput: {
    title: "argc / argv / sscanf matrix task",
    kind: "C pattern",
    note: "Ex01-style command-line parsing: read four integers, fill a 2x2 matrix, square it and print side by side.",
    deps: ["matrix", "nestedloops"],
    code: `int main(int argc, char *argv[]) {
    if (argc != 5) return 1;
    int M[2][2], S[2][2];
    for (int i = 0; i < 4; i++) {
        if (sscanf(argv[i + 1], "%d", &M[i / 2][i % 2]) != 1) return 1;
    }
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            S[i][j] = M[i][0] * M[0][j] + M[i][1] * M[1][j];
    for (int i = 0; i < 2; i++)
        printf("%d %d   %d %d\\n", M[i][0], M[i][1], S[i][0], S[i][1]);
    return 0;
}`,
  },
  dynamicArrays: {
    title: "Dynamic array patterns",
    kind: "C patterns",
    note: "Exam patterns around malloc arrays: pointer print loops, reverse by pointers, prepend by allocating n+1, and conversion to linked nodes.",
    deps: ["mallocFree", "arrayDecay", "linked"],
    code: `int *prepend(int A[], int n, int x) {
    int *B = malloc((n + 1) * sizeof(int));
    B[0] = x;
    for (int i = 0; i < n; i++) B[i + 1] = A[i];
    return B;
}

void reversePtr(int *A, int n) {
    int *l = A, *r = A + n - 1;
    while (l < r) { int t = *l; *l++ = *r; *r-- = t; }
}

void printPtrLoop(int *A, int n) {
    for (int *p = A; p < A + n; p++) printf("%d ", *p);
}

struct node *arrayToList(int A[], int n) {
    struct node *head = NULL;
    for (int i = n - 1; i >= 0; i--) {
        struct node *p = malloc(sizeof(struct node));
        p->value = A[i];
        p->next = head;
        head = p;
    }
    return head;
}`,
  },
  hilbertRecurrence: {
    title: "Hilbert curve recurrence",
    kind: "recursion trace",
    note: "Hilbert tasks are mostly about call order: four smaller curves plus turns/connectors.",
    deps: ["recursion", "recurrences"],
    code: `Hilbert(level, direction):
  if level == 0: return

  turn(left relative to direction)
  Hilbert(level - 1, rotated direction)
  draw connector
  Hilbert(level - 1, direction)
  draw connector
  Hilbert(level - 1, direction)
  draw connector
  Hilbert(level - 1, opposite rotation)
  turn(back)

Recurrence:
  T(n) = 4T(n-1) + O(1) drawing/turn work

Trace trap:
  the four recursive calls are not interchangeable because the orientation changes.`,
  },
  binaryPrint: {
    title: "Recursive binary print order",
    kind: "C recursion",
    note: "Printing before recursion gives reverse bit order; printing after recursion gives normal high-to-low binary.",
    deps: ["recursion"],
    code: `void printBinaryNormal(int n) {
    if (n == 0) return;
    printBinaryNormal(n / 2);
    printf("%d", n % 2);
}

void printBinaryReverse(int n) {
    if (n == 0) return;
    printf("%d", n % 2);
    printBinaryReverse(n / 2);
}`,
  },
  hanoi: {
    title: "Tower of Hanoi with digit pegs",
    kind: "C recursion",
    note: "Move n-1 to auxiliary, move largest, move n-1 to target. If pegs are digits, the printed pair encodes one move.",
    deps: ["recurrences", "binaryPrint"],
    code: `void Hanoi(int n, int A, int B, int C) {
    if (n == 0) return;
    Hanoi(n-1, A, C, B);
    printf("%d%d ", A, B);  // move top disk from peg A to peg B
    Hanoi(n-1, C, B, A);
}`,
  },
  pyramid: {
    title: "Triangle / pyramid recursion",
    kind: "C recursion trace",
    note: "Build a smaller row by summing neighbours, recurse, then print during unwind for top-down output.",
    deps: ["recursion", "cbase"],
    code: `void pyramid(int A[], int n) {
    if (n == 1) {
        printf("%d\\n", A[0]);
        return;
    }
    int B[n - 1];
    for (int i = 0; i < n - 1; i++)
        B[i] = A[i] + A[i + 1];

    pyramid(B, n - 1);  // print smaller row first
    printArray(A, n);   // then current row
}

Trace trap:
  print before recursion -> bottom-up order
  print after recursion  -> top-down pyramid order`,
  },
  maxSubarray: {
    title: "Maximum subarray D&C",
    kind: "C-like pattern",
    note: "Maximum is left, right or crossing middle.",
    deps: ["recurrences", "recursionTree"],
    code: `int maxSubArraySum(int A[], int l, int r) {
    if (l == r) return A[l];
    int m = (l + r) / 2;
    int left = maxSubArraySum(A, l, m);
    int right = maxSubArraySum(A, m+1, r);
    int cross = maxCrossingSum(A, l, m, r);
    return max3(left, right, cross);
}`,
  },
  asymmetricRecursionTree: {
    title: "Asymmetric recursion tree",
    kind: "recurrence analysis",
    note: "Use a recursion tree, not the balanced Master-method reflex.",
    deps: ["recursionTree", "recurrences"],
    code: `T(n) = T(n/10) + T(9n/10) + c n

Level cost:
  each node contributes c * subproblem_size
  subproblem sizes on one level sum to at most n
  therefore each level costs at most c n

Height:
  longest branch repeatedly keeps 9n/10
  n * (9/10)^h <= 1
  h = O(log n)

Total:
  O(n) per level * O(log n) levels = O(n log n)`,
  },
  stack: {
    title: "Stack with array",
    kind: "C data structure",
    note: "LIFO. Key state: top.",
    deps: ["adtRules"],
    code: `#define SIZE 10
int stack[SIZE];
int top = -1;
int isEmpty(void){ return top < 0; }
void push(int x){ if (top < SIZE-1) stack[++top] = x; }
int pop(void){ return isEmpty() ? -99999 : stack[top--]; }`,
  },
  queue: {
    title: "Queue with circular array",
    kind: "C data structure",
    note: "FIFO. Key state: front, rear, size.",
    deps: ["bfs", "khop"],
    code: `#define MAXSIZE 10
int queue[MAXSIZE], front = 0, rear = -1, size = 0;
void enqueue(int x){ rear=(rear+1)%MAXSIZE; queue[rear]=x; size++; }
int dequeue(void){ int x=queue[front]; front=(front+1)%MAXSIZE; size--; return x; }
int isEmpty(void){ return size==0; }`,
  },
  reverseLinked: {
    title: "Reverse linked list",
    kind: "C pattern",
    note: "Save next before changing curr->next.",
    deps: ["linked", "pointers"],
    code: `struct node* reverseLinkedList(struct node* head) {
    struct node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  },
  twoStacksOneArray: {
    title: "Two stacks in one array",
    kind: "C data structure",
    note: "Left stack grows upward, right stack grows downward. Overflow happens exactly when top1 + 1 == top2.",
    deps: ["stack", "arrayDecay"],
    code: `#define N 100
int A[N], top1 = -1, top2 = N;

int full(void) { return top1 + 1 == top2; }
void push1(int x) { if (!full()) A[++top1] = x; }
void push2(int x) { if (!full()) A[--top2] = x; }
int pop1(void) { return top1 < 0 ? -1 : A[top1--]; }
int pop2(void) { return top2 >= N ? -1 : A[top2++]; }`,
  },
  stackTwoQueues: {
    title: "Stack using two queues",
    kind: "ADT pseudocode",
    note: "Push is Θ(1); pop moves n-1 elements to expose the last inserted item.",
    deps: ["queue", "adtRules"],
    code: `push(x):
    enqueue(Q1, x)

pop():
    while size(Q1) > 1:
        enqueue(Q2, dequeue(Q1))
    x = dequeue(Q1)
    swap Q1 and Q2
    return x`,
  },
  stackLinkedList: {
    title: "Stack using linked list",
    kind: "C data structure",
    note: "Push and pop at head are Θ(1).",
    deps: ["stack", "linked"],
    code: `struct node { int value; struct node *next; };
struct node *top = NULL;

void push(int x) {
    struct node *n = malloc(sizeof(struct node));
    n->value = x;
    n->next = top;
    top = n;
}

int pop(void) {
    if (top == NULL) return -1;
    struct node *old = top;
    int x = old->value;
    top = top->next;
    free(old);
    return x;
}`,
  },
  queueLinkedList: {
    title: "Queue using linked list",
    kind: "C data structure",
    note: "Maintain front and rear. When the last node is dequeued, both become NULL.",
    deps: ["queue", "linked"],
    code: `struct node *front = NULL, *rear = NULL;

void enqueue(int x) {
    struct node *n = malloc(sizeof(struct node));
    n->value = x; n->next = NULL;
    if (rear == NULL) front = rear = n;
    else { rear->next = n; rear = n; }
}

int dequeue(void) {
    if (front == NULL) return -1;
    struct node *old = front;
    int x = old->value;
    front = front->next;
    if (front == NULL) rear = NULL;
    free(old);
    return x;
}`,
  },
  linkedInsertDelete: {
    title: "Linked-list insert/delete cases",
    kind: "C patterns",
    note: "Head-changing cases need special handling unless a sentinel, returned head or pointer-to-pointer is used.",
    deps: ["linked", "headChangingAdt"],
    code: `struct node *insertHead(struct node *head, int x) {
    struct node *n = malloc(sizeof(struct node));
    n->value = x; n->next = head;
    return n;
}

void insertAfter(struct node *p, int x) {
    struct node *n = malloc(sizeof(struct node));
    n->value = x; n->next = p->next; p->next = n;
}

struct node *deleteHead(struct node *head) {
    if (head == NULL) return NULL;
    struct node *next = head->next;
    free(head);
    return next;
}`,
  },
  headChangingAdt: {
    title: "Changing an ADT instance",
    kind: "design card",
    note: "Use one of these designs when an operation may change the first node.",
    deps: ["linkedInsertDelete", "pointers"],
    code: `Options:
1. sentinel / dummy-head node:
   operations modify sentinel->next, never the sentinel pointer

2. return the modified head:
   head = insertHead(head, x)

3. pointer-to-pointer:
   void insert(struct node **head, int x)

4. predecessor/guard pointer:
   keep a pointer before the deletion/insertion position`,
  },
  queueTwoStacks: {
    title: "Queue using two stacks",
    kind: "pseudocode",
    note: "Amortized Θ(1) dequeue because each element transfers at most once.",
    deps: ["stack", "amortized"],
    code: `enqueue(x):
    push(B, x)

dequeue():
    if isEmpty(A):
        while !isEmpty(B): push(A, pop(B))
    return pop(A)`,
  },
  reverseEven: {
    title: "reverseEven(Q)",
    kind: "ADT pseudocode",
    note: "Store even values in stack, then rebuild queue, replacing evens by popped values.",
    deps: ["stack", "queue", "adtRules"],
    code: `reverseEven(Q):
    S = initStack()
    n = queueSize(Q)
    repeat n times:
        x = deQueue(Q)
        if x is even: push(S,x)
        enQueue(Q,x)
    repeat n times:
        x = deQueue(Q)
        if x is even: enQueue(Q,pop(S))
        else enQueue(Q,x)`,
  },
  kthLargestStack: {
    title: "k-th largest using only stacks",
    kind: "ADT pseudocode",
    note: "FS24-style restriction task: scan with one auxiliary stack and never index into the stack.",
    deps: ["stack", "adtRules"],
    code: `kthLargest(S, k):
  removed = empty stack

  repeat k times:
    aux = empty stack
    max = pop(S)

    while !isEmpty(S):
      x = pop(S)
      if x > max:
        push(aux, max)
        max = x
      else:
        push(aux, x)

    // max is the next removed maximum
    push(removed, max)

    while !isEmpty(aux):
      push(S, pop(aux))

  return pop(removed)

Allowed operations only:
  push, pop, isEmpty`,
  },
  chaining: {
    title: "Hash insert with chaining",
    kind: "C data structure",
    note: "Array of linked lists. Insert new node at chain head.",
    deps: ["linked", "hashFunction"],
    code: `#define m 100
struct node { int value; struct node *next; };
struct node *HT[m];
int h(int k){ return k % m; }
void HTInsert(int k){
    struct node *n = malloc(sizeof(struct node));
    n->value = k;
    n->next = HT[h(k)];
    HT[h(k)] = n;
}`,
  },
  chainingOrder: {
    title: "Chaining insertion order",
    kind: "exam warning",
    note: "Head insertion is Θ(1) and common in C. Some drawing tasks require tail insertion so the chain order matches insertion order.",
    deps: ["chaining", "linked"],
    code: `Head insertion:
  new->next = HT[h(k)]
  HT[h(k)] = new
  newest element is drawn first

Tail insertion:
  walk to the last node in HT[h(k)]
  last->next = new
  drawing matches insertion order

Search is unchanged.`,
  },
  searchChain: {
    title: "Search in hash chain",
    kind: "C pattern",
    note: "Walk list at HT[h(k)].",
    deps: ["chaining", "linked"],
    code: `struct node* HTSearch(int k) {
    struct node *p = HT[h(k)];
    while (p != NULL && p->value != k) p = p->next;
    return p;
}`,
  },
  loadFactor: {
    title: "Load factor α",
    kind: "hash analysis",
    note: "α = n/m. For chaining it is the expected chain length under simple uniform hashing.",
    deps: ["hashing"],
    code: `alpha = number_of_keys / number_of_slots

Chaining:
  expected chain length is about alpha
  high alpha makes search slower

Resizing / rehashing:
  allocate larger table
  insert all existing keys into the new table`,
  },
  printOverlap: {
    title: "print_overlap(A1,A2,n)",
    kind: "C algorithm",
    note: "Insert A1 into hash table; scan A2 and search chain.",
    deps: ["chaining", "searchChain"],
    code: `void print_overlap(int A1[], int A2[], int n) {
    for (int i = 0; i < n; i++) HTInsert(A1[i]);
    for (int i = 0; i < n; i++) {
        struct node *p = HT[h(A2[i])];
        while (p != NULL && p->value != A2[i]) p = p->next;
        if (p != NULL) printf("%d ", A2[i]);
    }
}`,
  },
  targetSumHash: {
    title: "Target sum with hash table",
    kind: "pseudocode",
    note: "Search complement before inserting current element.",
    deps: ["hashApps"],
    code: `targetSum(A,n,t):
    HT = empty
    for each x in A:
        if search(HT, t-x): return 1
        insert(HT, x)
    return 0`,
  },
  openAddress: {
    title: "Open addressing insert/search",
    kind: "C data structure",
    note: "Probe until empty slot, key, or table exhausted.",
    deps: ["linearProbe", "deleteHash"],
    code: `#define m 7
int h(int k, int i){ return (3*k + i) % m; }
void init(int A[]){ for(int i=0;i<m;i++) A[i]=0; }
void insert(int A[], int key){
    for(int i=0;i<m;i++){
        int s=h(key,i);
        if(A[s]==0){ A[s]=key; return; }
    }
}
int search(int A[], int key){
    for(int i=0;i<m;i++){
        int s=h(key,i);
        if(A[s]==key) return s;
        if(A[s]==0) return -1;
    }
    return -1;
}`,
  },
  quadraticProbe: {
    title: "Quadratic probing",
    kind: "hash trace card",
    note: "Quadratic probing reduces primary clustering, but the chosen table size and coefficients decide whether every slot can be reached.",
    deps: ["openAddress", "hashFunction"],
    code: `Probe formula:
  h(k, i) = (h1(k) + c1*i + c2*i*i) mod m

Trace table columns:
  i | h(k,i) | slot content | action

Exam checks:
  i starts at 0
  stop on key found
  insert on empty slot
  parameters may fail to visit all slots

Proof pattern:
  show that the generated residues are all distinct modulo m
  for the specific m, c1 and c2 in the task.`,
  },
  deleteHash: {
    title: "HTDelete with repair",
    kind: "C-like pattern",
    note: "After deleting in linear probing, reinsert following cluster keys so search invariant remains true.",
    deps: ["openAddress", "linearProbe"],
    code: `int HTDelete(int A[], int k) {
    int pos = search(A, k);
    if (pos == -1) return -1;
    A[pos] = 0;
    int j = (pos + 1) % m;
    while (A[j] != 0) {
        int tmp = A[j];
        A[j] = 0;
        insert(A, tmp);
        j = (j + 1) % m;
    }
    return pos;
}`,
  },
  linearClustering: {
    title: "Linear probing clustering",
    kind: "hash warning",
    note: "Primary clustering forms long occupied runs. Search can stop only when it reaches an empty slot.",
    deps: ["linearProbe"],
    code: `Insert with linear probing:
  collisions extend existing occupied runs
  longer runs cause more future collisions

Search rule:
  continue through occupied slots
  stop at EMPTY because the key would have been inserted before it

Deletion warning:
  setting a middle slot to EMPTY can make later keys unreachable`,
  },
  tombstoneRepair: {
    title: "Tombstone vs reinsertion repair",
    kind: "deletion patterns",
    note: "DEL markers are general open-addressing tools; reinserting the following cluster is a linear-probing repair style.",
    deps: ["deleteHash", "linearProbe"],
    code: `Tombstone style:
  delete slot becomes DEL
  search treats DEL as occupied
  insert may reuse DEL

Linear-probing repair:
  clear deleted slot
  remove and reinsert following cluster keys
  matches many Ex09-style hand repairs`,
  },
  expressionTree: {
    title: "Expression tree traversals",
    kind: "tree pattern",
    note: "Operators are internal nodes and operands are leaves. Infix needs parentheses to preserve structure.",
    deps: ["binaryTree", "treeTraversal"],
    code: `infix(T):
  if T is leaf: print T.value
  else:
    print "("
    infix(T.left)
    print T.operator
    infix(T.right)
    print ")"

postfix(T):
  if T != NULL:
    postfix(T.left)
    postfix(T.right)
    print T.value`,
  },
  reconstructTree: {
    title: "Reconstruct from preorder + inorder",
    kind: "recursive pattern",
    note: "The first preorder item is the root; split inorder around it and recurse on the two ranges.",
    deps: ["treeTraversal", "recursion"],
    code: `Build(preL, preR, inL, inR):
  if preL > preR: return NULL
  root = new node(pre[preL])
  k = index of root.value in inorder[inL..inR]
  leftSize = k - inL
  root.left  = Build(preL+1, preL+leftSize, inL, k-1)
  root.right = Build(preL+leftSize+1, preR, k+1, inR)
  return root`,
  },
  catalanBstShapes: {
    title: "Number of BST shapes",
    kind: "counting card",
    note: "Catalan counts distinct shapes. It does not equal the number of insertion orders.",
    deps: ["bst"],
    code: `C_0 = 1
C_{n+1} = sum C_i * C_{n-i} for i=0..n

n = 5:
  C_5 = 42 distinct BST shapes

Exam distinction:
  same shape can come from several insertion orders`,
  },
  treeTraversal: {
    title: "Preorder / inorder / postorder",
    kind: "C recursion",
    note: "Only position of VisitNode changes.",
    deps: ["binaryTree", "recursion"],
    code: `void inorder(struct TreeNode *p){
    if(p != NULL){ inorder(p->left); visit(p); inorder(p->right); }
}
void preorder(struct TreeNode *p){
    if(p != NULL){ visit(p); preorder(p->left); preorder(p->right); }
}
void postorder(struct TreeNode *p){
    if(p != NULL){ postorder(p->left); postorder(p->right); visit(p); }
}`,
  },
  bstInsert: {
    title: "BST insert",
    kind: "C pattern",
    note: "Use pointer-to-pointer so root can change.",
    deps: ["bst", "pointers"],
    code: `void insert(struct TreeNode **root, int val) {
    if (*root == NULL) {
        *root = malloc(sizeof(struct TreeNode));
        (*root)->val = val; (*root)->left = (*root)->right = NULL;
        return;
    }
    if (val < (*root)->val) insert(&((*root)->left), val);
    else insert(&((*root)->right), val);
}`,
  },
  bstMinMax: {
    title: "BST min / max",
    kind: "C pattern",
    note: "Go left for minimum and right for maximum. Runtime is O(h).",
    deps: ["bst"],
    code: `struct TreeNode *minNode(struct TreeNode *p) {
    if (p == NULL) return NULL;
    while (p->left != NULL) p = p->left;
    return p;
}

struct TreeNode *maxNode(struct TreeNode *p) {
    if (p == NULL) return NULL;
    while (p->right != NULL) p = p->right;
    return p;
}`,
  },
  bstDelete: {
    title: "BST delete cases",
    kind: "C-like pattern",
    note: "Handle leaf, only-left, only-right, root deletion and two-child replacement explicitly.",
    deps: ["bst", "successor", "pointers"],
    code: `delete(root, key):
  find node x and its parent p

case leaf:
  replace x by NULL

case only left child:
  replace x by x.left

case only right child:
  replace x by x.right

case two children:
  pred = maximum node in x.left
  copy pred.value into x
  delete pred from x.left

root deletion:
  same cases, but update the root pointer`,
  },
  printTreeLevels: {
    title: "printTree with levels",
    kind: "tree traversal pattern",
    note: "Print every parent-child edge and annotate with the child depth, i.e. the deeper endpoint level.",
    deps: ["treeTraversal"],
    code: `void printEdges(struct TreeNode *p, int level) {
    if (p == NULL) return;
    if (p->left != NULL) {
        printf("%d -- %d : %d\\n", p->val, p->left->val, level + 1);
        printEdges(p->left, level + 1);
    }
    if (p->right != NULL) {
        printf("%d -- %d : %d\\n", p->val, p->right->val, level + 1);
        printEdges(p->right, level + 1);
    }
}`,
  },
  rotations: {
    title: "AVL rotations",
    kind: "pseudocode",
    note: "Pointer rearrangement plus height updates. The returned node is the new subtree root.",
    deps: ["avl", "pointers"],
    code: `leftRotate(X):
    Y = X->rgt
    Yleft = Y->lft
    Y->lft = X
    X->rgt = Yleft
    update heights of X and Y
    return Y

rightRotate(X):
    Y = X->lft
    Yright = Y->rgt
    Y->rgt = X
    X->lft = Yright
    update heights of X and Y
    return Y`,
  },
  avlCases: {
    title: "AVLrebalance(X,Y,Z)",
    kind: "AVL case table",
    note: "Identify the first unbalanced node X, its taller child Y and taller grandchild Z. Update lower nodes before higher nodes.",
    deps: ["rotations", "avl"],
    code: `LL case:
  return rightRotate(X)

RR case:
  return leftRotate(X)

LR case:
  X.left = leftRotate(Y)
  return rightRotate(X)

RL case:
  X.right = rightRotate(Y)
  return leftRotate(X)

Always reconnect the returned subtree root to X's former parent.`,
  },
  redBlackHistorical: {
    title: "Red-black tree historical warning",
    kind: "low-priority exam note",
    note: "FS23 had a red-black recolouring task. Current coverage should still prioritize AVL unless the live course asks for red-black trees.",
    deps: ["bst", "rotations"],
    code: `Know only the warning-level idea:
  nodes are red or black
  insertion may trigger recolouring
  rotations can appear after recolouring cases
  the root is black
  black-height is preserved

Study priority:
  current tree work = BST operations, traversals, AVL rotations
  red-black = historical FS23 / low priority`,
  },
  lrlp: {
    title: "Largest root-leaf path",
    kind: "C-like recursion",
    note: "Compare best left path and best right path.",
    deps: ["binaryTree", "recursion"],
    code: `int bestPathSum(struct TreeNode *p) {
    if (p == NULL) return -99999;
    if (p->left == NULL && p->right == NULL) return p->val;
    int L = bestPathSum(p->left);
    int R = bestPathSum(p->right);
    return p->val + max(L, R);
}`,
  },
  shortestRootLeaf: {
    title: "Shortest root-leaf distance BFS",
    kind: "pseudocode",
    note: "First leaf dequeued is shortest because BFS expands by levels.",
    deps: ["queue", "bfs"],
    code: `shortestDist(root):
    Q = initQueue()
    root.aux = 0
    enqueue(Q, root)
    while !isEmpty(Q):
        p = dequeue(Q)
        if p.left == NULL and p.right == NULL: return p.aux
        if p.left  != NULL: p.left.aux  = p.aux+1; enqueue(Q,p.left)
        if p.right != NULL: p.right.aux = p.aux+1; enqueue(Q,p.right)`,
  },
  matrixPath: {
    title: "DP helper matrix: longest path",
    kind: "C / DP pattern",
    note: "S[i][j] stores longest valid path ending at (i,j).",
    deps: ["dpTemplate", "matrix"],
    code: `State meaning:
S[i][j] = longest valid path ending at cell (i,j)

int longestPath(int x, int y, int M[x][y]) {
    int S[x][y]; int best = 0;
    for (int i = 0; i < x; i++) {
        for (int j = 0; j < y; j++) {
            S[i][j] = 1;
            if (i>0 && abs(M[i][j]-M[i-1][j]) <= 1) S[i][j] = max(S[i][j], S[i-1][j]+1);
            if (j>0 && abs(M[i][j]-M[i][j-1]) <= 1) S[i][j] = max(S[i][j], S[i][j-1]+1);
            best = max(best, S[i][j]);
        }
    }
    return best;
}`,
  },
  palCuts: {
    title: "Palindrome cuts DP",
    kind: "C-like DP",
    note: "Precompute palindrome matrix, then fill min-cut suffix array from right to left.",
    deps: ["dpTemplate", "palRec"],
    code: `State meaning:
P[i][j] = 1 iff X[i..j] is palindrome
cut[i] = min cuts for suffix X[i..n-1]

// helper_matrix[i][j] = 1 iff X[i..j] is palindrome
// helper_array[i] = min cuts for suffix X[i..n-1]
for (int i = n-1; i >= 0; i--)
  for (int j = i; j < n; j++)
    P[i][j] = (X[i]==X[j]) && (j-i<2 || P[i+1][j-1]);

for (int i = n-1; i >= 0; i--) {
  if (P[i][n-1]) cut[i] = 0;
  else for (int j=i; j<n-1; j++)
    if (P[i][j]) cut[i] = min(cut[i], 1 + cut[j+1]);
}`,
  },
  bigPlus: {
    title: "Biggest plus helper tables",
    kind: "DP pattern",
    note: "Compute four directional counts and combine by minimum arm length.",
    deps: ["dpTemplate", "matrix"],
    code: `State meaning:
top/bottom/left/right[i][j] = consecutive 1s from that direction ending at (i,j)

top[i][j]    = A[i][j] ? 1 + top[i-1][j]    : 0
bottom[i][j] = A[i][j] ? 1 + bottom[i+1][j] : 0
left[i][j]   = A[i][j] ? 1 + left[i][j-1]   : 0
right[i][j]  = A[i][j] ? 1 + right[i][j+1]  : 0
arm = min(top,bottom,left,right)`,
  },
  matrixChain: {
    title: "Matrix-chain multiplication",
    kind: "DP pseudocode",
    note: "Interval DP: choose best split k for Ai..Aj.",
    deps: ["dpTemplate", "solutionReconstruction"],
    code: `State meaning:
M[i][j] = minimum scalar multiplications for Ai..Aj
c[i][j] = split k that achieves M[i][j]

for i = 1 to n: M[i][i] = 0
for length = 2 to n:
  for i = 1 to n-length+1:
    j = i + length - 1
    M[i][j] = infinity
    for k = i to j-1:
      q = M[i][k] + M[k+1][j] + d[i-1]*d[k]*d[j]
      if q < M[i][j]: M[i][j] = q; c[i][j] = k`,
  },
  lcs: {
    title: "Longest common subsequence",
    kind: "DP pseudocode",
    note: "2D DP over prefixes of two strings.",
    deps: ["dpTemplate"],
    code: `State meaning:
L[i][j] = length of LCS of X[0..i-1] and Y[0..j-1]

for i = 0..m: L[i][0] = 0
for j = 0..n: L[0][j] = 0
for i = 1..m:
  for j = 1..n:
    if X[i-1] == Y[j-1]: L[i][j] = L[i-1][j-1] + 1
    else L[i][j] = max(L[i-1][j], L[i][j-1])`,
  },
  lcsReconstruction: {
    title: "LCS reconstruction",
    kind: "DP backtracking",
    note: "Walk backward through the L table to recover one LCS.",
    deps: ["lcs", "solutionReconstruction"],
    code: `State meaning:
L[i][j] = length of LCS of X[0..i-1] and Y[0..j-1]

i = m; j = n; answer = empty stack
while i > 0 and j > 0:
  if X[i-1] == Y[j-1]:
    push(answer, X[i-1])
    i--; j--
  else if L[i-1][j] >= L[i][j-1]:
    i--
  else:
    j--`,
  },
  matrixChainParens: {
    title: "printOptimalParens",
    kind: "DP reconstruction",
    note: "The split table c[i][j] reconstructs the optimal parenthesization.",
    deps: ["matrixChain", "solutionReconstruction"],
    code: `State meaning:
c[i][j] = best split for multiplying Ai..Aj

PrintParens(i,j):
  if i == j: print "A", i
  else:
    print "("
    PrintParens(i, c[i][j])
    PrintParens(c[i][j] + 1, j)
    print ")"`,
  },
  coinChange: {
    title: "Coin change DP",
    kind: "DP pseudocode",
    note: "Greedy can fail; DP tries all last coins and preserves a no-solution marker.",
    deps: ["dpTemplate"],
    code: `State meaning:
C[a] = minimum coins needed for amount a, or infinity if impossible

C[0] = 0
for amount = 1..T:
  C[amount] = infinity
  for coin in coins:
    if amount >= coin:
      C[amount] = min(C[amount], 1 + C[amount-coin])

if C[T] == infinity:
  report no solution`,
  },
  editDistance: {
    title: "Edit distance",
    kind: "DP pseudocode",
    note: "Classic 2D prefix DP with insert/delete/replace transitions.",
    deps: ["dpTemplate", "cStrings"],
    code: `State meaning:
D[i][j] = edit distance between X[0..i-1] and Y[0..j-1]

for i = 0..m: D[i][0] = i
for j = 0..n: D[0][j] = j
for i = 1..m:
  for j = 1..n:
    cost = (X[i-1] == Y[j-1]) ? 0 : 1
    D[i][j] = min(D[i-1][j] + 1,
                  D[i][j-1] + 1,
                  D[i-1][j-1] + cost)`,
  },
  maxProduct: {
    title: "Max product subarray",
    kind: "DP scalar state",
    note: "Track both max and min product ending here because a negative value swaps their roles.",
    deps: ["dpTemplate"],
    code: `State meaning:
maxHere/minHere = max/min product of a subarray ending at i

maxHere = minHere = best = A[0]
for i = 1..n-1:
  if A[i] < 0: swap(maxHere, minHere)
  maxHere = max(A[i], A[i] * maxHere)
  minHere = min(A[i], A[i] * minHere)
  best = max(best, maxHere)`,
  },
  nearestZero: {
    title: "Nearest-zero matrix",
    kind: "DP passes",
    note: "Two or four directional passes propagate Manhattan distance to the nearest zero.",
    deps: ["dpTemplate", "matrix"],
    code: `State meaning:
D[i][j] = best known Manhattan distance from cell (i,j) to a zero

initialize D[i][j] = 0 if A[i][j] == 0 else infinity

top-left to bottom-right:
  D[i][j] = min(D[i][j], 1 + D[i-1][j], 1 + D[i][j-1])

bottom-right to top-left:
  D[i][j] = min(D[i][j], 1 + D[i+1][j], 1 + D[i][j+1])`,
  },
  dpRuntimeMemory: {
    title: "DP runtime / memory",
    kind: "analysis checklist",
    note: "DP analysis is table size times transitions per state, plus helper-table memory.",
    deps: ["dpTemplate"],
    code: `State meaning:
DP[...] = precise subproblem answer

Checklist:
  states = number of DP cells
  transition cost = work to fill one cell
  runtime = states * transition cost
  memory = table cells kept
  answer = which cell/value is returned
  reconstruction needs predecessor/split choices`,
  },
  adjacencyComplexity: {
    title: "Adjacency matrix vs list complexity",
    kind: "graph analysis",
    note: "Choose the representation based on edge lookup, neighbor iteration and graph density.",
    deps: ["adjacency"],
    code: `Adjacency matrix:
  space: Θ(V^2)
  edge lookup (u,v): Θ(1)
  scan neighbors of u: Θ(V)

Adjacency list:
  space: Θ(V+E)
  edge lookup (u,v): Θ(deg(u))
  iterate neighbors of u: Θ(deg(u))`,
  },
  bfs: {
    title: "BFS",
    kind: "pseudocode",
    note: "Queue creates distance layers.",
    deps: ["queue", "graphState"],
    code: `BFS(s):
  s.col = Grey; s.dist = 0; s.pred = NIL
  Q = initQueue(); enqueue(Q,s)
  while !isEmpty(Q):
    u = dequeue(Q)
    for v in u.adj:
      if v.col == White:
        v.col = Grey; v.dist = u.dist + 1; v.pred = u
        enqueue(Q,v)
    u.col = Black`,
  },
  bfsOrderNuance: {
    title: "BFS adjacency-order nuance",
    kind: "trace warning",
    note: "Adjacency order can change the traversal sequence and predecessor tree, but not shortest unweighted distances.",
    deps: ["bfs"],
    code: `If adjacency list order changes:
  dequeue order among same-distance vertices may change
  pred[] / BFS tree may change
  dist[] values do not change

Reason:
  BFS still processes all vertices at distance k before distance k+1`,
  },
  dfs: {
    title: "DFS",
    kind: "pseudocode",
    note: "Recursive traversal with colors. Variants power cycle detection, edge types, topo sort and all paths.",
    deps: ["recursion", "graphState"],
    code: `DFSVisit(u):
  u.col = Grey
  for v in u.adj:
    if v.col == White:
      v.pred = u
      DFSVisit(v)
  u.col = Black`,
  },
  dfsDisconnected: {
    title: "DFS disconnected wrapper",
    kind: "pseudocode",
    note: "Use the wrapper for full graph traversal, otherwise DFS from one source may miss components.",
    deps: ["dfs"],
    code: `DFS(G):
  for each vertex u:
    u.col = White
    u.pred = NIL
  time = 0
  for each vertex u:
    if u.col == White:
      DFSVisit(u)`,
  },
  dfsEdgeCode: {
    title: "DFS edge classification",
    kind: "DFS pseudocode",
    note: "Colors classify many edges during DFS; discovery/finish times separate forward and cross edges after both endpoints finish.",
    deps: ["dfs", "edgeTypes"],
    code: `Inspect edge (u,v):
  if v.col == White:
    tree edge
  else if v.col == Grey:
    back edge
  else:
    // v is Black
    if u.disc < v.disc:
      forward edge
    else:
      cross edge

Back edge to Grey vertex means an active ancestor.`,
  },
  cycle: {
    title: "Cycle detection undirected graph",
    kind: "DFS pseudocode",
    note: "A visited neighbor that is not predecessor indicates cycle.",
    deps: ["dfs", "graphState"],
    code: `DFS-Cycle(u):
  u.col = Grey
  for v in u.adj:
    if v.col == White:
      v.pred = u
      if DFS-Cycle(v): return True
    else if v != u.pred:
      return True
  u.col = Black
  return False`,
  },
  allPaths: {
    title: "All simple paths",
    kind: "DFS backtracking",
    note: "Mark current path, recurse, then unmark on return.",
    deps: ["dfs"],
    code: `AllPaths(u,t):
  mark u as visited
  add u to path
  if u == t: print path
  else:
    for v in u.adj:
      if not visited[v]: AllPaths(v,t)
  remove u from path
  unmark u`,
  },
  allPathsComplexity: {
    title: "All simple paths complexity",
    kind: "analysis warning",
    note: "Backtracking is correct, but the number of simple paths can be exponential.",
    deps: ["allPaths"],
    code: `Visited is path-local:
  mark before recursion
  unmark after recursion

Worst case:
  a dense graph can contain exponentially many simple s-t paths
  enumeration time is at least the output size`,
  },
  khop: {
    title: "k-hop neighbors",
    kind: "BFS-style pseudocode",
    note: "Minimum distance exactly k.",
    deps: ["bfs", "adjacency"],
    code: `kHop(v,k):
  BFS from v and compute dist[]
  for each u:
    if dist[u] == k: print u`,
  },
  topologicalSort: {
    title: "Topological sort",
    kind: "DFS pseudocode",
    note: "Push vertex after finishing DFS; reverse finish order.",
    deps: ["dfs"],
    code: `TopoSort(G):
  L = empty list
  for each vertex u:
    if u.col == White: DFSVisitTopo(u)

DFSVisitTopo(u):
  u.col = Grey
  for v in u.adj:
    if v.col == White: DFSVisitTopo(v)
  u.col = Black
  prepend u to L`,
  },
  relaxation: {
    title: "Relaxation",
    kind: "shortest path mechanism",
    note: "Reusable update step for Bellman-Ford, DAG shortest paths and Dijkstra. Return whether the distance changed.",
    deps: ["sssp"],
    code: `Relax(u, v, w):
    if u.dist == infinity: return false
    if v.dist > u.dist + w(u,v):
        v.dist = u.dist + w(u,v)
        v.pred = u
        return true
    return false`,
  },
  dijkstra: {
    title: "Dijkstra",
    kind: "weighted graph algorithm",
    note: "Nonnegative weights. Call decreaseKey only when Relax actually improves v.dist.",
    deps: ["priorityQueue", "relaxation", "dijkstraAssumptions"],
    code: `Dijkstra(G,s):
  initialize dist = infinity, pred = NIL
  s.dist = 0
  Q = all vertices keyed by dist
  while Q not empty:
    u = extractMin(Q)
    for each edge (u,v):
      if Relax(u,v,w) changed v.dist:
        decreaseKey(Q,v,v.dist)`,
  },
  dijkstraTrace: {
    title: "Dijkstra trace table",
    kind: "weighted graph trace",
    note: "Use this when the task asks how many distance changes happen during relaxation.",
    deps: ["dijkstra", "relaxation", "priorityQueue"],
    code: `Columns:
  extracted vertex
  relaxed edge (u,v)
  old dist[v]
  candidate dist[u] + w(u,v)
  new dist[v]
  pred[v]
  changed?

Rules:
  extracted vertices are final only with nonnegative weights
  unreachable u does not relax outgoing edges
  decreaseKey happens only when changed? = yes`,
  },
  dijkstraAssumptions: {
    title: "Dijkstra assumptions",
    kind: "correctness card",
    note: "Dijkstra finalizes extracted vertices only under nonnegative edge weights.",
    deps: ["dijkstra"],
    code: `Assumptions:
  all edge weights are nonnegative
  extractMin vertex is finalized
  unreachable vertices stay infinity
  a negative edge can break correctness`,
  },
  bellmanFord: {
    title: "Bellman-Ford",
    kind: "weighted graph algorithm",
    note: "Works with negative edges; extra pass detects reachable negative cycles.",
    deps: ["relaxation", "negativeCycle", "bellmanFordDetails"],
    code: `BellmanFord(G,s):
  initialize dist = infinity; s.dist = 0
  repeat |V|-1 times:
    for each edge (u,v):
      Relax(u,v,w)   // skips u.dist == infinity
  for each edge (u,v):
    if u.dist != infinity and v.dist > u.dist + w(u,v): return False
  return True`,
  },
  bellmanFordTrace: {
    title: "Bellman-Ford trace table",
    kind: "weighted graph trace",
    note: "Count every edge attempt by pass; count distance changes only when Relax improves a distance.",
    deps: ["bellmanFord", "relaxation"],
    code: `Columns:
  pass number
  edge (u,v)
  old dist[v]
  candidate dist[u] + w(u,v)
  new dist[v]
  changed?

Trace rules:
  skip update when dist[u] is infinity
  do |V|-1 normal passes
  run one extra pass only to test for a reachable negative cycle`,
  },
  bellmanFordDetails: {
    title: "Bellman-Ford details",
    kind: "weighted graph checklist",
    note: "The negative cycle check is about cycles reachable from the source.",
    deps: ["bellmanFord", "relaxation"],
    code: `Details:
  initialize every dist = infinity and pred = NIL
  set source dist = 0
  relax all edges |V|-1 times
  skip relax if u.dist == infinity
  one extra pass detects a reachable negative cycle`,
  },
  dagSSSP: {
    title: "DAG shortest paths",
    kind: "weighted graph algorithm",
    note: "Topological order allows each edge to be relaxed once.",
    deps: ["topologicalSort", "relaxation"],
    code: `DAG-ShortestPaths(G,s):
  TopoSort(G)
  initialize dist = infinity; s.dist = 0
  for u in topological order:
    for each edge (u,v): Relax(u,v,w)`,
  },
  primJarnik: {
    title: "Prim-Jarnik MST",
    kind: "weighted graph algorithm",
    note: "Same priority queue shape as Dijkstra, but key is cheapest edge into tree, not distance from source.",
    deps: ["priorityQueue", "cutLightEdge"],
    code: `Prim(G,r):
  for each v: v.key = infinity; v.pred = NIL
  r.key = 0
  Q = all vertices keyed by key
  while Q not empty:
    u = extractMin(Q)
    for each edge (u,v):
      if v in Q and w(u,v) < v.key:
        v.pred = u
        v.key = w(u,v)
        decreaseKey(Q,v,v.key)`,
  },
  primTrace: {
    title: "Prim-Jarnik trace table",
    kind: "MST trace",
    note: "Prim uses key as cheapest edge into the growing tree; it is not a shortest-path distance.",
    deps: ["primJarnik", "priorityQueue"],
    code: `Columns:
  extracted vertex
  candidate edge (u,v)
  old key[v]
  edge weight w(u,v)
  new key[v]
  pred[v]
  changed?

Rules:
  only update vertices still outside the tree
  choose extract-min by key
  final MST edges are pred[v] -- v for all non-root vertices`,
  },
  mstAssumptions: {
    title: "MST assumptions",
    kind: "weighted graph checklist",
    note: "MST is an undirected connected-graph concept and minimizes total edge weight, not source distances.",
    deps: ["mst"],
    code: `MST assumptions:
  graph is undirected
  graph is connected
  if disconnected: minimum spanning forest / no single spanning tree
  minimizes total edge weight
  is not a shortest-path tree`,
  },
  kruskal: {
    title: "Kruskal MST",
    kind: "weighted graph algorithm",
    note: "Extra / CLRS / optional unless lecture or prompt emphasizes it.",
    deps: ["mst"],
    code: `Kruskal(G):
  A = empty set
  sort edges by weight
  for each edge (u,v) in increasing weight:
    if Find(u) != Find(v):
      A = A ∪ {(u,v)}
      Union(u,v)
  return A`,
  },
  arbitrageTransform: {
    title: "Arbitrage transform",
    kind: "negative-cycle reduction",
    note: "Products of exchange rates become sums after the -log transform.",
    deps: ["arbitrage", "negativeCycle"],
    code: `edge weight = -log(exchange_rate)

profitable cycle:
  rate1 * rate2 * ... * ratek > 1

after -log:
  sum of edge weights < 0

therefore:
  arbitrage iff negative-weight cycle`,
  },
  backwardRunLength: {
    title: "Backward run-length tracing",
    kind: "C trace table",
    note: "FS24 Q1 pattern: scan from the end, keep current value and count, print a run only when it ends, then print the final run.",
    deps: ["traceOutput", "boundaries"],
    code: `void whatIDo(int A[], int n) {
    int num = A[n - 1];
    int count = 1;

    for (int i = n - 2; i >= 0; i--) {
        if (A[i] == num) {
            count++;
        } else {
            printf("%d %d\\n", num, count);
            num = A[i];
            count = 1;
        }
    }

    printf("%d %d\\n", num, count);
}

Trace columns:
  i | A[i] | num before | count before | print? | num after | count after`,
  },
  edgeCases: {
    title: "Edge-case checklist",
    kind: "exam checklist",
    note: "Use this before finalizing C/pseudocode.",
    deps: [],
    code: `Check:
- n == 0 / n == 1
- NULL pointer / empty list / empty tree
- root deletion / leaf / one child / two children
- first or last array index
- target not found
- hash table full / deleted slot
- graph disconnected / unreachable vertex
- negative edge / negative cycle
- DP base row/column`,
  },
};
