const crossLinks=[
  // C and sorting mechanisms
  ['swap','bubble','swap'],
  ['swap','selection','swap'],
  ['swap','quick','swap'],
  ['swap','heapSort','swap'],
  ['swap','sort3','swap'],
  ['cStrings','palRec','strings'],
  ['cStrings','lcs','indices'],
  ['cStrings','editDistance','indices'],
  ['mallocFree','dynamicArrays','allocation'],
  ['dynamicArrays','linked','array→list'],

  // Hashing and direct addressing
  ['counting','directAddressing','frequency'],
  ['directAddressing','hashing','slot logic'],
  ['linked','chaining','chains'],
  ['chaining','chainingOrder','draw order'],
  ['linearProbe','deleteHash','repair'],
  ['linearProbe','linearClustering','clusters'],

  // ADTs and traversal
  ['stack','dfs','DFS stack'],
  ['queue','bfs','BFS queue'],
  ['queue','khop','layers'],
  ['adtRules','stackSort','restriction'],
  ['adtRules','reverseEven','restriction'],
  ['stack','twoStacksOneArray','shared array'],
  ['queue','stackTwoQueues','simulate'],

  // Trees and heaps
  ['heap','heapSort','basis'],
  ['heapify','heapSort','basis'],
  ['heapify','buildHeap','bottom-up'],
  ['heap','printHeap','edges'],
  ['pointers','linked','basis'],
  ['pointers','bst','tree nodes'],
  ['pointers','rotations','pointers'],
  ['bst','treeTraversal','inorder sorted'],
  ['bst','bstMinMax','left/right'],
  ['bstDelete','successor','2-child case'],
  ['rotations','avl','restore'],
  ['rotations','avlCases','4 cases'],

  // Proof and divide-and-conquer
  ['substitution','maxSubarray','proof'],
  ['master','merge','recurrence'],
  ['invariant','binarySearch','interval'],
  ['invariant','quick','regions'],
  ['invariant','sort3','3 zones'],
  ['merge','mergeHelper','linear step'],
  ['quick','quickPartition','single pivot'],

  // DP
  ['palRec','palCuts','recursion→DP'],
  ['matrix','matrixPath','helper table'],
  ['dpTemplate','matrixChain','interval DP'],
  ['dpTemplate','lcs','2D prefix'],
  ['dpTemplate','coinChange','1D DP'],
  ['dpTemplate','dpRuntimeMemory','cost'],
  ['solutionReconstruction','lcsReconstruction','backtrack'],
  ['solutionReconstruction','matrixChainParens','splits'],

  // Graph mechanisms
  ['matrix','adjacency','matrix repr'],
  ['adjacency','adjacencyComplexity','tradeoff'],
  ['dfs','allPaths','backtrack'],
  ['dfs','cycle','visited'],
  ['dfs','topologicalSort','finish time'],
  ['dfs','dfsEdgeCode','timestamps'],
  ['bfs','bfsOrderNuance','same dist'],
  ['queue','shortestRootLeaf','first leaf'],

  // Weighted graphs
  ['bfs','dijkstra','distance idea'],
  ['topologicalSort','dagSSSP','topo order'],
  ['relaxation','bellmanFord','core'],
  ['relaxation','dijkstra','core'],
  ['relaxation','dagSSSP','core'],
  ['priorityQueue','primJarnik','extract-min'],
  ['priorityQueue','dijkstra','extract-min'],
  ['primJarnik','dijkstra','same queue shape'],
  ['mst','mstAssumptions','assumptions'],
  ['dijkstra','dijkstraAssumptions','nonnegative'],
  ['bellmanFord','bellmanFordDetails','details'],
  ['negativeCycle','bellmanFord','detect'],
  ['arbitrage','negativeCycle','log transform'],
  ['arbitrage','arbitrageTransform','-log(rate)']
];
