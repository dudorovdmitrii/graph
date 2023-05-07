import { Graph } from "../graph";
import { shiftVertex } from "../helpers";

interface PrintResult {
  tree: Array<[number, number, number]>;
  cost: number;
}

// Программа, находящая остовное дерево графа. Для орграфа находится
// остовное дерево соотнесённого графа. Результатом является список рёбер
// графа, входящих в остовное дерево и суммарный вес дерева.

export class GraphTask4 extends Graph {
  solveByPrim() {
    const tree: number[][] = [];

    const minKey = (
      key: Array<number>,
      mstSet: Array<boolean>,
      V: number
    ): number => {
      let min: number = Infinity;
      let minIndex: number = -1;

      for (let i = 0; i < V; i++) {
        if (mstSet[i] == false && key[i] < min) {
          min = key[i];
          minIndex = i;
        }
      }

      return minIndex;
    };

    const primMST = (graph: Array<Array<number>>, V: number) => {
      const parent: Array<number> = new Array<number>(V);
      const key: Array<number> = new Array<number>(V);
      const mstSet: Array<boolean> = new Array<boolean>(V);

      // инициализация массивов
      for (let i = 0; i < V; i++) {
        key[i] = Infinity;
        mstSet[i] = false;
      }

      key[0] = 0;
      parent[0] = -1;

      for (let i = 0; i < V - 1; i++) {
        const u = minKey(key, mstSet, V);
        mstSet[u] = true;

        for (let v = 0; v < V; v++) {
          if (graph[u][v] != 0 && mstSet[v] == false && graph[u][v] < key[v]) {
            parent[v] = u;
            key[v] = graph[u][v];
          }
        }
      }

      let minimumCost = 0;
      for (let i = 1; i < V; i++) {
        console.log(`${parent[i]} - ${i} \t ${graph[i][parent[i]]}`);
        minimumCost += graph[i][parent[i]];
      }
      console.log(`Minimum Cost Spanning Tree: ${minimumCost}`);
    };

    primMST(this.matrix, this.length);
  }

  solveByKruscal() {
    const g: number[][] = []; // вес - вершина 1 - вершина 2
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (this.matrix[i][j] != 0) {
          const cur: number[] = new Array(3).fill(0);
          cur[0] = this.matrix[i][j];
          cur[1] = i;
          cur[2] = j;
          g.push(cur);
        }
      }
    }

    let cost = 0;
    const tree: [number, number, number][] = [];

    g.sort((a, b) => a[0] - b[0]);
    const tree_id: number[] = new Array(this.length)
      .fill(0)
      .map((_, ind) => ind);

    for (let i = 0; i < g.length; i++) {
      let a = g[i][1],
        b = g[i][2],
        l = g[i][0];
      if (tree_id[a] != tree_id[b]) {
        cost += l;
        tree.push([a, b, l]);
        let old_id = tree_id[b];
        let new_id = tree_id[a];
        for (let j = 0; j < this.length; ++j) {
          if (tree_id[j] == old_id) {
            tree_id[j] = new_id;
          }
        }
      }
    }
    return { tree, cost };
  }

  printResult({ tree, cost }: PrintResult) {
    console.log("Minimum spanning tree: ", cost);
    console.log(
      tree.map(([from, to, weight]) => [
        shiftVertex(from),
        shiftVertex(to),
        weight,
      ])
    );
  }
}
