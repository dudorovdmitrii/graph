import { Graph } from '../graph';

export class GraphTask9 extends Graph {
  solve() {
    const result = this.hamiltonianPath();
    console.log(result);
  }

  hamiltonianPath(): number[] | null {
    // Инициализация переменных
    const path: number[] = [];
    // Помечаем первую вершину
    path.push(0);
    // Вызываем рекурсивную функцию для поиска пути
    if (!this.hamiltonianPathUtil(path, 1)) {
      // Если путь не найден, возвращаем null
      return null;
    }
    // Возвращаем путь
    return path;
  }

  hamiltonianPathUtil(path: number[], pos: number): boolean {
    if (pos === this.length) {
      // Все вершины посещены, проверяем наличие ребра между последней и первой вершинами
      if (this.matrix[path[pos - 1]][path[0]] === 1) {
        return true;
      } else {
        return false;
      }
    }
    for (let v = 1; v < this.length; v++) {
      if (this.isSafe(path, pos, v)) {
        path[pos] = v;
        if (this.hamiltonianPathUtil(path, pos + 1)) {
          return true;
        }
        path[pos] = -1;
      }
    }
    return false;
  }

  isSafe(path: number[], pos: number, v: number): boolean {
    if (this.matrix[path[pos - 1]][v] === 0) {
      // Нет ребра между последней вершиной и текущей
      return false;
    }
    for (let i = 0; i < pos; i++) {
      if (path[i] === v) {
        // Вершина уже была посещена
        return false;
      }
    }
    return true;
  }
}
