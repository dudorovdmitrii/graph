import { Graph } from "../graph";
import { shiftVertex } from "../helpers";

interface PrintResult {
  degrees: number[];
  shortestPaths: number[][];
  eccentricities: number[];
  diameter: number;
  radius: number;
  centralVertexes: number[];
  peripheralVertexes: number[];
}

export class GraphTask1 extends Graph {
  floydWarshall() {
    // Копирование матрицы весов
    const shortestPaths: number[][] = this.matrix.map((row) => row.slice());

    // Вычисление кратчайших расстояний между всеми парами вершин
    for (let k = 0; k < this.length; k++) {
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.length; j++) {
          if (i === j) {
            continue;
          }
          if (shortestPaths[i][k] === 0 || shortestPaths[k][j] === 0) {
            continue;
          }
          if (
            shortestPaths[i][j] > shortestPaths[i][k] + shortestPaths[k][j] ||
            shortestPaths[i][j] === 0
          ) {
            shortestPaths[i][j] = shortestPaths[i][k] + shortestPaths[k][j];
          }
        }
      }
    }

    // Вычисление степеней вершин
    const degrees: number[] = [];
    for (let i = 0; i < this.length; i++) {
      let degree = 0;
      for (let j = 0; j < this.length; j++) {
        if (this.matrix[i][j] !== 0) {
          degree++;
        }
      }
      degrees.push(degree);
    }

    // Вычисление эксентриситетов, диаметра и радиуса графа
    const eccentricities: number[] = [];
    let radius = Infinity;
    let diameter = 0;

    for (let row = 0; row < this.length; row++) {
      eccentricities.push(Math.max(...shortestPaths[row]));
      diameter = Math.max(diameter, eccentricities[row]);
      radius = Math.min(radius, eccentricities[row]);
    }

    // Вычисление множества центральных и периферийных вершин
    const centralVertexes: number[] = [];
    const peripheralVertexes: number[] = [];

    for (let i = 0; i < this.length; i++) {
      let maxDistance = Math.max(...shortestPaths[i]);
      if (maxDistance === radius) {
        centralVertexes.push(i);
      }
      if (maxDistance == diameter) {
        peripheralVertexes.push(i);
      }
    }

    return {
      degrees,
      shortestPaths,
      eccentricities,
      diameter,
      radius,
      centralVertexes,
      peripheralVertexes,
    };
  }

  printResult({
    degrees,
    shortestPaths,
    eccentricities,
    diameter,
    radius,
    centralVertexes,
    peripheralVertexes,
  }: PrintResult) {
    console.log("deg = ", degrees);
    console.log("Distancies:");
    for (const row of shortestPaths) {
      console.log(row);
    }
    console.log("Eccentricity:");
    console.log(eccentricities);
    console.log("D = ", diameter);
    console.log("R = ", radius);
    console.log(
      "Z = ",
      centralVertexes.map((vertex) => shiftVertex(vertex))
    );
    console.log(
      "P = ",
      peripheralVertexes.map((vertex) => shiftVertex(vertex))
    );
  }
}
