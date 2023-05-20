import { GraphTask10 } from '.';
import { Graph } from '../graph';
import { getStreamOrNull, printCommonInfo, writeOrPrintMatrix } from '../helpers';

enum ColorType {
  red = 'RED',
  blue = 'BLUE',
  any = 'ANY',
}

interface PrintResult {
  result: number[][];
}

// Вершина ориентированного графа называется истоком,
// если в нее не входит ни одно ребро
// и стоком, если из нее не выходит ни одного ребра.

// Бесконтурный орграф с одним источником и одним стоком называется сетью.

// Дуги сети нагружены неотрицательными числами C(u, v),
// где C(u, v) называется пропускной способностью дуги {u, v}.

// ∀{u, v} ∈ E : 0 ≤ f(u, v) ≤ C(u, v), т. е. поток через дугу неотрицателен и не
// превосходит пропускной способности дуги;

export class GraphTask11 extends Graph {
  fordFalkernson() {
    const n = this.length;
    let s = 0;
    let t = 0;
    const stream: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const result = Array.from({ length: n }, () => new Array(n).fill(0));
    let stop = 0;

    for (let i = 0; i < n; i++) {
      if (this.adjacencyList(i).length === 0) {
        stop++;
        t = i;
      }
      if (this.incomingList(i).length === 0) {
        stop++;
        s = i;
      }
    }
    if (stop != 2) {
      return;
    }
    let flag = true;

    // Пока есть путь в конечную вершину
    while (flag) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          // Вычисляем новый поток на основе предыдущего
          result[i][j] = this.matrix[i][j] - stream[i][j];
        }
      }
      let q: number[] = [];
      const p: number[] = new Array(n).fill(0);
      p[s] = s;
      q.push(s);
      const used: boolean[] = new Array(n).fill(false);
      used[s] = true;
      while (q.length !== 0) {
        const v = q.shift();
        for (let i = 0; i < n; i++) {
          if (v !== undefined && result[v][i] !== 0 && !used[i]) {
            p[i] = v;
            used[i] = true;
            q.push(i);
            if (used[t]) {
              q = [];
              break;
            }
          }
        }
      }
      if (used[t]) {
        let curvertex = t;
        let min = Infinity;
        // Находим минимальный вес ребра в пути
        while (curvertex != s) {
          if (min > result[p[curvertex]][curvertex]) {
            min = result[p[curvertex]][curvertex];
          }
          curvertex = p[curvertex];
        }
        curvertex = t;
        // Обновляем веса прямых и обратных ребер
        // после проталкивания потока
        while (curvertex != s) {
          stream[p[curvertex]][curvertex] += min;
          stream[curvertex][p[curvertex]] -= min;
          curvertex = p[curvertex];
        }
      } else {
        flag = false;
      }
    }

    return stream;
  }

  solveByKun() {
    const result: number[][] = [];
    const color: ColorType[] = new Array(this.length).fill(ColorType.any);
    const q: number[] = [];
    const used: boolean[] = new Array(this.length).fill(false);

    // Раскрашиваем первую вершину и добавляем ее в очередь
    q.push(0);
    used[0] = true;
    color[0] = ColorType.red;

    // Проверяем граф на двудольность
    while (q.length > 0) {
      const v = q.shift()!;
      for (let i = 0; i < this.length; i++) {
        // Проходим по смежным вершинам
        if (this.matrix[v][i] != 0) {
          // Раскрашиваем найденную нераскрашенную вершину в противоположный цвет текущей
          if (color[i] === ColorType.any) {
            q.push(i);
            color[i] = color[v] === ColorType.red ? ColorType.blue : ColorType.red;
          }
          if (color[i] == color[v]) {
            throw new Error('Граф не двудольный');
          }
        }
      }
    }

    const matrix: number[][] = Array.from({ length: this.length + 2 }, () =>
      new Array(this.length + 2).fill(0),
    );

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (color[i] == ColorType.red && color[j] == ColorType.blue && this.matrix[i][j] == 1) {
          matrix[i][j] = this.matrix[i][j];
          matrix[j][i] = -this.matrix[j][i];
        }
      }
    }
    for (let i = 0; i < this.length; i++) {
      if (color[i] == ColorType.red) {
        matrix[this.length][i] = 1;
      }
    }
    for (let i = 0; i < this.length; i++) {
      if (color[i] == ColorType.blue) {
        matrix[i][this.length + 1] = 1;
      }
    }

    // Форд-Фалкерсон
    this.matrix = matrix;
    this.length = matrix.length;
    const stream = this.fordFalkernson();

    if (!stream) {
      throw new Error('Паросочетания не найдены');
    }

    for (let i = 0; i < this.length - 2; i++) {
      for (let j = 0; j < this.length - 2; j++) {
        if (stream[i][j] > 0) {
          result.push([i, j]);
        }
      }
    }

    return result;
  }

  solve() {
    if (this.infoFlag) {
      this.printInfo();
      return;
    }

    if (this.isDirected()) {
      this.matrix = this.getСorrelatedGraph();
    }

    const result = this.solveByKun();
    this.printOrWriteResult({ result });
  }

  printInfo() {
    printCommonInfo();
  }

  printOrWriteResult({ result }: PrintResult) {
    const stream = getStreamOrNull(this.outputFlag, this.filePath);

    writeOrPrintMatrix({
      stream,
      matrix: result,
      before: 'Matching',
      shift: true,
    });

    if (stream) {
      stream.close();
    }
  }
}
