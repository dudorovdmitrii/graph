import { Graph } from "../graph";
import { shiftVertex } from "../helpers";

export class GraphTask5 extends Graph {
  solve(start: number, end: number) {
    console.log("Начальная вершина: ", shiftVertex(start));
    console.log("Конечная вершина: ", shiftVertex(end));

    const distances = new Array(this.length).fill(Number.MAX_SAFE_INTEGER); // массив расстояний до каждой вершины
    distances[start] = 0; // расстояние до начальной вершины равно 0

    const visited = new Array(this.length).fill(false); // массив для отслеживания посещенных вершин

    const path: number[][] = []; // массив для хранения маршрута

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
            path[k] = [currentVertex, k, this.matrix[currentVertex][k]]; // обновляем маршрут до вершины
          }
        }
      }
    }

    // формируем маршрут
    const finalPath = [];
    let current = end;
    while (current !== start) {
      finalPath.unshift(path[current]);
      current = path[current][0];
    }

    return { path: finalPath, distance: distances[end] };
  }
}
