import { Graph } from '../graph';
import {
  getStreamOrNull,
  printCommonInfo,
  shiftVertex,
  writeOrPrintMatrix,
  writeOrPrintValue,
} from '../helpers';

interface PrintResult {
  result: number[][];
  sum: number;
  start: number;
  end: number;
}

export class GraphTask10 extends Graph {
  solve() {
    if (this.infoFlag) {
      this.printInfo();
      return;
    }

    const result = this.fordFalkernson();
    if (result) {
      this.printOrWriteResult(result);
    }
  }
  fordFalkernson() {
    const answer: number[][] = [];
    const n = this.length;
    let s = 0;
    let t = 0;
    const stream = Array.from({ length: n }, () => new Array(n).fill(0));
    const result: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
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

    while (flag) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
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
        while (curvertex != s) {
          if (min > result[p[curvertex]][curvertex]) {
            min = result[p[curvertex]][curvertex];
          }
          curvertex = p[curvertex];
        }
        curvertex = t;
        while (curvertex != s) {
          stream[p[curvertex]][curvertex] += min;
          stream[curvertex][p[curvertex]] -= min;
          curvertex = p[curvertex];
        }
      } else {
        flag = false;
      }
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (stream[i][j] > 0) {
          answer.push([i, j, stream[i][j]]);
        }
      }
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stream[s][i];
    }

    return { result: answer, sum, start: s, end: t };
  }

  printInfo() {
    printCommonInfo();
  }

  printOrWriteResult({ result, sum, start, end }: PrintResult) {
    const stream = getStreamOrNull(this.outputFlag, this.filePath);

    writeOrPrintValue({
      stream,
      value: sum,
      before: `maximum flow from ${shiftVertex(start)} to ${shiftVertex(end)}`,
    });

    writeOrPrintMatrix({
      stream,
      matrix: result.map(([start, end, weight]) => [shiftVertex(start), shiftVertex(end), weight]),
    });

    if (stream) {
      stream.close();
    }
  }
}
