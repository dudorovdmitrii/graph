const startVertex = 1;
export function shiftVertex(index: number) {
  return index + startVertex;
}

// getNumbers(): number[] {
//     let current = 1;
//     this.length = this.matrix[0].length;
//     const nums: number[] = new Array(this.length).fill(0);
//     const marked = new Set();

//     const dfs = (num: number) => {
//       if (marked.has(num)) {
//         return;
//       }
//       marked.add(num);
//       for (let i = 0; i < this.length; i++) {
//         if (this.matrix[num][i] === 0) {
//           continue;
//         }
//         if (!marked.has(i)) {
//           nums[num] = current++;
//           dfs(i);
//         }
//       }
//       nums[num] = current++;
//     };

//     for (let i = 0; i < this.length; i++) {
//       dfs(i);
//     }

//     return nums;
//   }

//   invertGraph(): number[][] {
//     const invertedMatrix: number[][] = Array.from({ length: this.length }, () =>
//       new Array(this.length).fill(0)
//     );

//     for (let row = 0; row < this.length; row++) {
//       for (let col = 0; col < this.length; col++) {
//         if (this.matrix[row][col] === 1) {
//           invertedMatrix[col][row] = 1;
//         }
//       }
//     }

//     return invertedMatrix;
//   }

//   getComponents(invertedMatrix: number[][], nums: number[]): number[][] {
//     const components: number[][] = [];
//     const marked = new Set();

//     const dfs = (num: number, component: number[]) => {
//       if (marked.has(num)) return;

//       component.push(num);
//       marked.add(num);

//       for (let i = 0; i < this.length; i++) {
//         if (invertedMatrix[num][i] === 0) continue;
//         if (!marked.has(i)) {
//           dfs(i, component);
//         }
//       }
//     };

//     const arr = new Array(this.length).fill(null).map((_, ind) => ind);
//     const hash: Record<string, number> = {};
//     for (let i = 0; i < this.length; i++) {
//       hash[i] = nums[i];
//     }
//     arr.sort((a, b) => hash[b] - hash[a]);

//     for (let i = 0; i < this.length; i++) {
//       const component: number[] = [];
//       dfs(arr[i], component);
//       if (component.length > 0) components.push(component);
//     }

//     return components;
//   }
// solveDirected() {
//   const invertedGraph = this.invertGraph();
//   const nums = this.getNumbers();
//   const components = this.getComponents(invertedGraph, nums);

//   return {
//     components,
//   };
// }
