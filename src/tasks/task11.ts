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

// abstract class Task11 {
//   static all({required Graph graph, required bool fileOutput}) {
//     // проверяем граф на двудольность
//     List<ColorType> color = List.filled(graph.size, ColorType.any);
//     Queue<int> q = Queue();
//     List<bool> used = List.filled(graph.size, false);
//     q.add(0);
//     used[0] = true;
//     color[0] = ColorType.red;
//     while (q.isNotEmpty) {
//       int v = q.removeFirst();
//       for (int i = 0; i < graph.size; i++) {
//         if (graph.matrix[v][i] != 0) {
//           if (color[i] == ColorType.any) {
//             q.add(i);
//             color[i] =
//                 color[v] == ColorType.red ? ColorType.blue : ColorType.red;
//           }
//           if (color[i] == color[v]) {
//             print("Граф не двудольный");
//             return;
//           }
//         }
//       }
//     }
//     print("Граф двудольный");
//     List<List<int>> matrix = List.generate(
//         graph.size + 2, (index) => List.generate(graph.size + 2, (i) => 0));
//     for (int i = 0; i < graph.size; i++) {
//       for (int j = 0; j < graph.size; j++) {
//         if (color[i] == ColorType.red &&
//             color[j] == ColorType.blue &&
//             graph.matrix[i][j] == 1) {
//           matrix[i][j] = graph.matrix[i][j];
//           matrix[j][i] = -graph.matrix[j][i];
//         }
//       }
//     }
//     for (int i = 0; i < graph.size; i++) {
//       if (color[i] == ColorType.red) {
//         matrix[graph.size][i] = 1;
//       }
//     }
//     for (int i = 0; i < graph.size; i++) {
//       if (color[i] == ColorType.blue) {
//         matrix[i][graph.size + 1] = 1;
//       }
//     }

//     // Форд-Фалкерсон
//     Graph graph11 = Graph.byMatrix(matrix: matrix);

//     int n = graph11.size;
//     int s = 0;
//     int t = 0;
//     List<List<int>> stream =
//         List.generate(n, (index) => List.generate(n, (i) => 0));
//     List<List<int>> result =
//         List.generate(n, (index) => List.generate(n, (i) => 0));
//     int stop = 0;
//     for (var i = 0; i < n; i++) {
//       if (graph11.adjacencyList(i).isEmpty) {
//         stop++;
//         t = i;
//       }
//       if (graph11.incomingList(i).isEmpty) {
//         stop++;
//         s = i;
//       }
//     }
//     if (stop != 2) {
//       return;
//     }
//     bool flag = true;
//     while (flag) {
//       for (var i = 0; i < n; i++) {
//         for (var j = 0; j < n; j++) {
//           result[i][j] = graph11.matrix[i][j] - stream[i][j];
//         }
//       }
//       Queue<int> q = Queue<int>();
//       List<int> p = List.generate(n, (index) => 0);
//       p[s] = s;
//       q.add(s);
//       List<bool> used = List.generate(n, (index) => false);
//       used[s] = true;
//       while (q.isNotEmpty) {
//         int v = q.removeFirst();
//         for (int i = 0; i < n; i++) {
//           if (result[v][i] != 0 && !used[i]) {
//             p[i] = v;
//             used[i] = true;
//             q.add(i);
//             if (used[t]) {
//               q.clear();
//               break;
//             }
//           }
//         }
//       }
//       if (used[t]) {
//         int curvertex = t;
//         int min = 1000000000;
//         while (curvertex != s) {
//           if (min > result[p[curvertex]][curvertex]) {
//             min = result[p[curvertex]][curvertex];
//           }
//           curvertex = p[curvertex];
//         }
//         curvertex = t;
//         while (curvertex != s) {
//           stream[p[curvertex]][curvertex] += min;
//           stream[curvertex][p[curvertex]] -= min;
//           curvertex = p[curvertex];
//         }
//       } else {
//         flag = false;
//       }
//     }
//     print('Паросочетания:');
//     for (int i = 0; i < n - 2; i++) {
//       for (int j = 0; j < n - 2; j++) {
//         if (stream[i][j] > 0) {
//           print('[$i,$j]=${stream[i][j]}');
//         }
//       }
//     }
//   }
// }
