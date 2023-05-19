import { Graph } from '../graph';
import { getStreamOrNull, printCommonInfo, shiftVertex, writeOrPrintMatrix } from '../helpers';

interface PrintResult {
  result: number[][];
}

export class GraphTask7 extends Graph {
  solve() {
    if (this.infoFlag) {
      this.printInfo();
      return;
    }
    const result = this.johnsonDistance();
    this.printOrWriteResult({ result });
  }

  johnsonDistance() {
    const h = Array(this.length).fill(0);

    const infinityMatrix: number[][] = Array.from({ length: this.length }, () =>
      new Array(this.length).fill(Infinity),
    );

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (this.matrix[i][j] !== 0) {
          infinityMatrix[i][j] = this.matrix[i][j];
        }
      }
    }

    // Алгоритм Беллмана-Форда-Мура
    for (let k = 0; k < this.length; k++) {
      let changed = false;
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.length; j++) {
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
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (infinityMatrix[i][j] !== Infinity) {
          infinityMatrix[i][j] += h[i] - h[j];
        }
      }
    }

    // Step 3: Run Dijkstra's algorithm for each pair of vertices
    const distances: number[][] = [];
    for (let s = 0; s < this.length; s++) {
      const dist = Array(this.length).fill(Infinity);
      dist[s] = 0;

      const visited = Array(this.length).fill(false);
      visited[s] = true;

      let u = s;
      for (let i = 0; i < this.length - 1; i++) {
        for (let v = 0; v < this.length; v++) {
          if (!visited[v] && infinityMatrix[u][v] < Infinity) {
            const alt = dist[u] + infinityMatrix[u][v];
            if (alt < dist[v]) {
              dist[v] = alt;
            }
          }
        }

        let minDist = Infinity;
        for (let v = 0; v < this.length; v++) {
          if (!visited[v] && dist[v] < minDist) {
            minDist = dist[v];
            u = v;
          }
        }

        visited[u] = true;
      }

      // Step 4: Adjust distances to original weights
      for (let i = 0; i < this.length; i++) {
        if (dist[i] !== Infinity) {
          distances.push([s, i, dist[i] - h[s] + h[i]]);
        }
      }
    }

    return distances.filter((arr) => arr[0] !== arr[1]);
  }

  printInfo() {
    printCommonInfo();
  }

  printOrWriteResult({ result }: PrintResult) {
    const stream = getStreamOrNull(this.outputFlag, this.filePath);

    writeOrPrintMatrix({
      matrix: result.map(([v1, v2, weight]) => [shiftVertex(v1), shiftVertex(v2), weight]),
      before: 'Shortest paths lengths',
      stream,
    });

    if (stream) {
      stream.close();
    }
  }
}
