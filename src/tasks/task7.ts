import { Graph } from '../graph';

export class GraphTask7 extends Graph {
  johnsonDistance() {
    const n = this.length;
    const h = Array(n).fill(0);

    const infinityMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(Infinity));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (this.matrix[i][j] !== 0) {
          infinityMatrix[i][j] = this.matrix[i][j];
        }
      }
    }

    // Step 1: Run Bellman-Ford algorithm
    for (let k = 0; k < n; k++) {
      let changed = false;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (infinityMatrix[i][j] !== Infinity && h[i] + infinityMatrix[i][j] < h[j]) {
            h[j] = h[i] + infinityMatrix[i][j];
            changed = true;
          }
        }
      }
      if (!changed) break;
    }

    // Проверка наличия отрицательных циклов в графе
    for (let j = 0; j < this.length; j++) {
      for (let k = 0; k < this.length; k++) {
        if (this.matrix[j][k] !== 0) {
          const distanceToNeighbor = h[j] + this.matrix[j][k];
          if (distanceToNeighbor < h[k]) {
            throw new Error('Граф содержит отрицательный цикл');
          }
        }
      }
    }

    // Step 2: Recalculate graph weights to be non-negative
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (infinityMatrix[i][j] !== Infinity) {
          infinityMatrix[i][j] += h[i] - h[j];
        }
      }
    }

    // Step 3: Run Dijkstra's algorithm for each pair of vertices
    const distances: number[][] = [];
    for (let s = 0; s < n; s++) {
      const dist = Array(n).fill(Infinity);
      dist[s] = 0;

      const visited = Array(n).fill(false);
      visited[s] = true;

      let u = s;
      for (let i = 0; i < n - 1; i++) {
        for (let v = 0; v < n; v++) {
          if (!visited[v] && infinityMatrix[u][v] < Infinity) {
            const alt = dist[u] + infinityMatrix[u][v];
            if (alt < dist[v]) {
              dist[v] = alt;
            }
          }
        }

        let minDist = Infinity;
        for (let v = 0; v < n; v++) {
          if (!visited[v] && dist[v] < minDist) {
            minDist = dist[v];
            u = v;
          }
        }

        visited[u] = true;
      }

      // Step 4: Adjust distances to original weights
      for (let i = 0; i < n; i++) {
        if (dist[i] !== Infinity) {
          distances.push([s, i, dist[i] - h[s] + h[i]]);
        }
      }
    }

    console.log(distances.filter((arr) => arr[0] !== arr[1]));
  }
}
