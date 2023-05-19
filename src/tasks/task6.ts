import { Graph } from '../graph';
import { getStreamOrNull, printCommonInfo, shiftVertex, writeOrPrintMatrix } from '../helpers';
import { Edge, Task6Flag } from '../types';

interface PrintResult {
  result: Edge[];
}

export class GraphTask6 extends Graph {
  solve(flag: Task6Flag, start: number) {
    let result: Edge[] = [];

    switch (flag) {
      case '-d': {
        result = this.solveByDijkstra(start);
        break;
      }
      case '-b': {
        result = this.solveByBellmanaFordMur(start);
        break;
      }
      case '-t': {
        result = this.solveBylevit(start);
        break;
      }
    }

    this.printOrWriteResult({ result }, start);
  }

  solveByDijkstra(start: number) {
    const distances = new Array(this.length).fill(Infinity); // массив расстояний до каждой вершины
    distances[start] = 0; // расстояние до начальной вершины равно 0

    const visited = new Array(this.length).fill(false); // массив для отслеживания посещенных вершин

    // цикл по всем вершинам графа
    for (let i = 0; i < this.length; i++) {
      let minDistance = Infinity;
      let currentVertex = -1;

      // ищем ближайшую вершину
      for (let j = 0; j < this.length; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j];
          currentVertex = j;
        }
      }

      if (currentVertex === -1) {
        break;
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
    const result: Edge[] = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start) {
        result.push([start, i, distances[i]]);
      }
    }

    return result;
  }

  solveByBellmanaFordMur(start: number) {
    const distances = new Array(this.length).fill(Infinity); // массив расстояний до каждой вершины
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
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (this.matrix[i][j] !== 0) {
          const distanceToNeighbor = distances[i] + this.matrix[i][j];
          if (distanceToNeighbor < distances[j]) {
            throw new Error('Граф содержит отрицательный цикл');
          }
        }
      }
    }

    // формируем массив пар вершин и расстояний
    const result: Edge[] = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start) {
        result.push([start, i, distances[i]]);
      }
    }

    return result;
  }

  solveBylevit(start: number) {
    const state = new Array(this.length).fill(2); // 0 - в очереди, 1 - на рассмотрении, 2 - не рассмотрена
    const dist = new Array(this.length).fill(Infinity);
    const q = [start];
    state[start] = 0;
    dist[start] = 0;

    while (q.length) {
      const v = q.shift()!;
      state[v] = 1;

      for (let i = 0; i < this.length; i++) {
        // На каждом шаге берем вершину из очереди q переводим ее в рассмотрение
        // Просматриваем все ребра вне очереди, выходящие из этой вершины
        if (this.matrix[v][i] !== 0 && state[i] !== 0) {
          const w = this.matrix[v][i];

          if (dist[v] + w < dist[i]) {
            dist[i] = dist[v] + w;
            if (state[i] === 2) {
              // Не рассмотрена -> в очереди
              q.push(i);
              state[i] = 0;
            } else if (state[i] === 1) {
              // На рассмотрении -> в очереди
              q.unshift(i);
              state[i] = 0;
            }
          }
        }
      }
    }

    const result: Edge[] = [];
    for (let i = 0; i < this.length; i++) {
      if (i !== start) {
        result.push([start, i, dist[i]]);
      }
    }

    return result;
  }

  printInfo() {
    printCommonInfo();
    console.log('-d: алгоритм Дейкстры');
    console.log('-b: алгоритм Беллмана-Форда-Мура');
    console.log('-t: алгоритм Дейкстры');
    console.log('Список параметров:');
    console.log('n=vertex: Начальная вершина');
    console.log('d=vertex: Конечная вершина');
  }

  printOrWriteResult({ result }: PrintResult, start: number) {
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
