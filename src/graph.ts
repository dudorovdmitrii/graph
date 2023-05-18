import fs from 'fs';
import path from 'path';
import { LaunchData } from './types';
import { getFilePath } from './helpers';

export abstract class Graph {
  matrix: number[][] = [];
  length: number = 0;
  filePath: string;
  outputFlag: boolean = false;
  infoFlag: Boolean = false;

  constructor(data: LaunchData) {
    const { task, test, inputFlag, outputFlag, infoFlag } = data;

    this.filePath = getFilePath(task, test, inputFlag);
    this.outputFlag = outputFlag;
    this.infoFlag = infoFlag;

    let file;
    try {
      file = this.readFile();
    } catch {
      throw new Error('Такого файла не существует!');
    }

    switch (inputFlag) {
      case '-m': {
        this.fillGraphFromAdjancecyMatrix(file);
        break;
      }
      case '-e': {
        this.fillGraphFromListOfEdges(file);
        break;
      }
      case '-l': {
        this.fillGraphFromListOfAdjacency(file);
        break;
      }
      default: {
        this.fillGraphFromAdjancecyMatrix(file);
        break;
      }
    }

    this.length = this.matrix.length;
  }

  readFile() {
    return fs.readFileSync(path.resolve('tests', this.filePath), 'utf-8');
  }

  fillGraphFromAdjancecyMatrix(file: string) {
    this.matrix = file
      .trim()
      .split('\n')
      .map((str) => str.trim())
      .map((row) => row.split(' ').map((str) => parseInt(str)));
  }

  fillGraphFromListOfAdjacency(file: string) {
    const listOfAdjacency = file
      .trim()
      .split('\n')
      .map((str) => str.trim())
      .map((row) => row.split(' ').map((str) => parseInt(str)));

    let max = 0;
    for (const vertexes of listOfAdjacency) {
      for (const vertex of vertexes) {
        max = Math.max(max, vertex);
      }
    }

    this.matrix = Array.from({ length: max }, () => new Array(max).fill(0));

    for (let start = 0; start < listOfAdjacency.length; start++) {
      for (const end of listOfAdjacency[start]) {
        this.matrix[start][end - 1] = 1;
      }
    }
  }

  fillGraphFromListOfEdges(file: string) {
    const edges = file
      .trim()
      .split('\n')
      .map((str) => str.trim())
      .map((row) => row.split(' ').map((str) => parseInt(str)));

    let max = 0;
    for (const [start, end] of edges) {
      max = Math.max(max, start, end);
    }

    this.matrix = Array.from({ length: max }, () => new Array(max).fill(0));

    for (const [start, end, weight] of edges) {
      this.matrix[start - 1][end - 1] = weight ?? 1;
    }
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

  getСorrelatedGraph() {
    const result = Array.from({ length: this.length }, () => new Array(this.length).fill(0));

    for (let row = 0; row < this.length; row++) {
      for (let col = 0; col < this.length; col++) {
        if (this.matrix[row][col] !== 0) {
          result[row][col] = this.matrix[row][col];
          result[col][row] = this.matrix[row][col];
        }
      }
    }

    return result;
  }

  adjacencyMatrix() {
    const result: number[][] = Array.from({ length: this.length }, () =>
      new Array(this.length).fill(0),
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
    return Object.keys(hash).map((key) => key.split('-').map((str) => parseInt(str)));
  }
}
