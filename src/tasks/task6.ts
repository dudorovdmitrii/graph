import { Graph } from "../graph";

export class GraphTask6 extends Graph {
  solveByDijkstra() {
    const start = 9;

    const distances = new Array(this.length).fill(Number.MAX_SAFE_INTEGER); // массив расстояний до каждой вершины
    distances[start] = 0; // расстояние до начальной вершины равно 0

    const visited = new Array(this.length).fill(false); // массив для отслеживания посещенных вершин

    // цикл по всем вершинам графа
    for (let i = 0; i < this.length; i++) {
      let minDistance = Number.MAX_SAFE_INTEGER;
      let currentVertex = -1;

      // ищем ближайшую вершину
      for (let j = 0; j < this.length; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j];
          currentVertex = j;
        }
      }

      // помечаем выбранную вершину как посещенную
      visited[currentVertex] = true;

      // обновляем расстояния до соседних вершин через текущую
      for (let k = 0; k < this.length; k++) {
        const edgeWeight = this.matrix[currentVertex][k];
        if (edgeWeight > 0) {
          const distanceToNeighbor = distances[currentVertex] + edgeWeight;
          if (distanceToNeighbor < distances[k]) {
            distances[k] = distanceToNeighbor;
          }
        }
      }
    }

    // формируем массив пар вершин и расстояний
    const result: [number, number][] = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start) {
        result.push([start, i], distances[i]);
      }
    }

    return result;
  }

  solveByBellmanaFordMur() {
    const start = 2;

    const distances = new Array(this.length).fill(Number.MAX_SAFE_INTEGER); // массив расстояний до каждой вершины
    distances[start] = 0; // расстояние до начальной вершины равно 0

    // цикл по всем вершинам графа
    for (let i = 0; i < this.length - 1; i++) {
      // проходимся по всем ребрам графа и обновляем расстояния до соседних вершин
      for (let j = 0; j < this.length; j++) {
        for (let k = 0; k < this.length; k++) {
          if (this.matrix[j][k] !== 0) {
            const distanceToNeighbor = distances[j] + this.matrix[j][k];
            if (distanceToNeighbor < distances[k]) {
              distances[k] = distanceToNeighbor;
            }
          }
        }
      }
    }

    // проверка наличия отрицательных циклов в графе
    for (let j = 0; j < this.length; j++) {
      for (let k = 0; k < this.length; k++) {
        if (this.matrix[j][k] !== 0) {
          const distanceToNeighbor = distances[j] + this.matrix[j][k];
          if (distanceToNeighbor < distances[k]) {
            throw new Error("Граф содержит отрицательный цикл");
          }
        }
      }
    }

    // формируем массив пар вершин и расстояний
    const result: [number, number][] = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start) {
        result.push([start, i], distances[i]);
      }
    }

    return result;
  }

  solveBylevit() {
    const start = 9;
    const INF = Number.MAX_SAFE_INTEGER;
    const state = new Array(this.length).fill(2); // 0 - в очереди, 1 - на размышление, 2 - не рассмотрена
    const dist = new Array(this.length).fill(INF);
    const q = [start];
    state[start] = 0;
    dist[start] = 0;

    while (q.length) {
      const v = q.shift()!;
      state[v] = 1;

      for (let u = 0; u < this.length; u++) {
        if (this.matrix[v][u] && state[u] !== 0) {
          const w = this.matrix[v][u];
          if (dist[v] + w < dist[u]) {
            dist[u] = dist[v] + w;
            if (state[u] === 2) {
              q.push(u);
              state[u] = 0;
            } else if (state[u] === 1) {
              q.unshift(u);
              state[u] = 0;
            }
          }
        }
      }
    }

    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start && dist[i] !== INF) {
        result.push([start, i, dist[i]]);
      }
    }

    return result;
  }
}
