import { GraphTask10 } from '.';

enum ColorType {
  red = 'RED',
  blue = 'BLUE',
  any = 'ANY',
}

export class GraphTask11 extends GraphTask10 {
  all() {
    // проверяем граф на двудольность
    const color = new Array(this.length).fill(ColorType.any);
    const q: number[] = [];
    const used = new Array(this.length).fill(false);
    q.push(0);
    used[0] = true;
    color[0] = ColorType.red;
    while (q.length > 0) {
      const v = q.shift();
      for (let i = 0; i < this.length; i++) {
        if (v !== undefined && this.matrix[v][i] != 0) {
          if (color[i] == ColorType.any) {
            q.push(i);
            color[i] = color[v] == ColorType.red ? ColorType.blue : ColorType.red;
          }
          if (color[i] == color[v]) {
            console.log('Граф не двудольный');
            return;
          }
        }
      }
    }
    console.log('OK');
    const matrix: number[][] = Array.from({ length: this.length + 2 }, () =>
      new Array(this.length + 2).fill(0),
    );

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        matrix[i][j] = this.matrix[i][j];
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

    this.matrix = matrix;
    this.length = matrix.length;
    this.fordFalkernson();
  }
}
