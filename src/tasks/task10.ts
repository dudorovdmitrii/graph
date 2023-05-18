import { Graph } from '../graph';

export class GraphTask10 extends Graph {
  fordFalkernson(): void {
    const n = this.length;
    let s = 0;
    let t = 0;
    const stream = Array.from({ length: n }, () => new Array(n).fill(0));
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
    console.log('0');
    if (stop != 2) {
      return;
    }
    let flag = true;

    /////
    console.log('1');
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
      console.log('adsdfd');
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
        let min = 1000000000;
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
    ////

    console.log('Поток');
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (stream[i][j] > 0) {
          console.log(`[${i},${j}]=${stream[i][j]}`);
        }
      }
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stream[s][i];
    }
    console.log(`Величина потока: ${sum}`);
  }
}
