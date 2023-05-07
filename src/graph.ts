import fs from "fs";
import path from "path";

export abstract class Graph {
  matrix: number[][] = [];
  length: number = 0;

  constructor(public filePath: string) {
    this.filePath = filePath;

    let file;
    try {
      file = this.readFile();
    } catch {
      throw new Error("Такого файла не существует!");
    }
    this.fillGraph(file);
    this.length = this.matrix.length;
  }

  readFile() {
    return fs.readFileSync(path.resolve("tests", this.filePath), "utf-8");
  }

  fillGraph(file: string) {
    this.matrix = file
      .trim()
      .split("\n")
      .map((str) => str.trim())
      .map((row) => row.split(" ").map((str) => parseInt(str)));
  }

  weight(v1: number, v2: number) {
    return Math.max(this.matrix[v1][v2], this.matrix[v2][v1]);
  }

  isEdge(v1: number, v2: number) {
    if (this.matrix[v1][v2] > 0 || this.matrix[v2][v1] > 0) {
      return true;
    }
    return false;
  }

  incomingList(v: number) {
    const result = [];
    for (let row = 0; row < this.length; row++) {
      // if (row !== v && this.matrix[row][v] !== 0) {
      if (this.matrix[row][v] !== 0) {
        result.push(row);
      }
    }

    return result;
  }

  isDirected() {
    for (let row = 0; row < this.length; row++) {
      for (let col = 0; col < this.length; col++) {
        if (this.matrix[row][col] !== this.matrix[col][row]) {
          return true;
        }
      }
    }
    return false;
  }

  adjacencyMatrix() {
    const result: number[][] = Array.from({ length: this.length }, () =>
      new Array(this.length).fill(0)
    );
    for (let row = 0; row < this.length; row++) {
      for (let col = 0; col < this.length; col++) {
        result[row][col] = this.matrix[row][col] > 0 ? 1 : 0;
      }
    }
    return result;
  }

  adjacencyList(v: number) {
    const result: number[] = [];
    for (let row = 0; row < this.length; row++) {
      if (this.matrix[v][row] !== 0) {
        result.push(row);
      }
    }
    return result;
  }

  listOfEdges(v?: number): number[][] {
    const isDirected = this.isDirected();
    const hash: Record<string, boolean> = {};

    for (let row = 0; row < this.length; row++) {
      for (let col = 0; col < this.length; col++) {
        if (v !== undefined && row !== v && col !== v) {
          continue;
        }
        if (this.matrix[row][col]) {
          if (!isDirected && hash[`${col}-${row}`]) {
            continue;
          }
          hash[`${row}-${col}`] = true;
        }
      }
    }
    return Object.keys(hash).map((key) =>
      key.split("-").map((str) => parseInt(str))
    );
  }
}
