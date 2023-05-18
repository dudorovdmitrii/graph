import { Graph } from '../graph';

export class GraphTask9 extends Graph {
  hamiltonianPath() {
    let n = this.length; // количество вершин в графе
    // инициализация списка ребер и списка посещенных вершин
    const path = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);
    path[0] = 0;
    visited[0] = true;
    // рекурсивный поиск гамильтонова пути
    let found = this._hamiltonianPathUtil(path, visited, 1);
    // если гамильтонов путь найден, возвращаем список ребер пути
    // иначе возвращаем пустой список
    if (found) {
      console.log(path);
    } else {
      console.log('Путь не найден');
    }
  }

  _hamiltonianPathUtil(path: number[], visited: boolean[], pos: number) {
    const n = this.length;
    // если все вершины посещены, гамильтонов путь найден
    if (pos == n) {
      return true;
    }
    // перебираем все вершины, которые могут следовать за последней вершиной в текущем пути
    for (let i = 0; i < n; i++) {
      if (this.matrix[path[pos - 1]][i] > 0 && !visited[i]) {
        path[pos] = i;
        visited[i] = true;
        if (this._hamiltonianPathUtil(path, visited, pos + 1)) {
          return true;
        }
        visited[i] = false;
      }
    }
    // если гамильтонов путь не найден, возвращаем false
    return false;
  }
}
