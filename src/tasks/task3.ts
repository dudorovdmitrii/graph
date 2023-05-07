import { Graph } from "../graph";
import {
    getStreamOrNull,
    printCommonInfo,
    shiftVertex,
    writeOrPrintArray,
    writeOrPrintMatrix,
    writeOrPrintValue,
} from "../helpers";

interface PrintResult {
    bridges: number[][];
    articulationPoints: number[];
}

export class GraphTask3 extends Graph {
    solve() {
        if (this.infoFlag) {
            this.printInfo();
        }
        const result = this.findBridgesAndArticulationPoints();
        this.printOrWriteResult(result);
    }

    printInfo() {
        printCommonInfo();
    }

    getNotOrientedMatrix(): number[][] {
        const length = this.matrix.length;
        const result = Array.from({ length: length }, () =>
            new Array(length).fill(0)
        );
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (this.matrix[i][j] == 1) {
                    result[j][i] = 1;
                    result[i][j] = 1;
                }
            }
        }
        return result;
    }

    findBridgesAndArticulationPoints() {
        const bridges: number[][] = [];
        const adjacencyMatrix = this.getNotOrientedMatrix();
        const n = adjacencyMatrix.length; // количество вершин в графе
        const visited = new Array(n).fill(false); // список посещенных вершин
        const tin = new Array(n).fill(0); // список времен входа в вершину в процессе обхода в глубину
        const low = new Array(n).fill(0); // список наименьших времен входа в вершину, которые могут быть достигнуты из данной вершины
        const parent = new Array(n).fill(-1); // список родительских вершин в дереве обхода в глубину
        const isArticulationPoint = new Array(n).fill(false); // список, хранящий информацию о том, является ли вершина точкой сочленения
        let timer = 0; // счетчик времени входа в вершину

        const dfs = (v: number) => {
            visited[v] = true;
            tin[v] = low[v] = timer++; // время захода самой вершины
            let childrenCount = 0;

            for (let i = 0; i < n; i++) {
                if (adjacencyMatrix[v][i] != 0) {
                    // если вершина смежная
                    if (!visited[i]) {
                        // если вершина не была посещена
                        parent[i] = v;
                        childrenCount++;

                        dfs(i);
                        low[v] = Math.min(low[v], low[i]); // Минимальное значение времени захода для смежной вершины

                        if (parent[v] == -1 && childrenCount > 1) {
                            // Если корневая вершина и имеет больше одного потомка, то она является точкой сочленения
                            isArticulationPoint[v] = true;
                        }
                        if (parent[v] != -1 && low[i] >= tin[v]) {
                            // Если вершина не корневая и существует потомок u такой, что нельзя пройти в другую часть графа
                            // без прохождения через вершину v, то v - точка сочленения
                            isArticulationPoint[v] = true;
                        }
                        if (low[i] > tin[v]) {
                            // Если из потомка i нет ребра в предка v
                            bridges.push([v, i]);
                        }
                    } else if (i != parent[v]) {
                        low[v] = Math.min(low[v], tin[i]); // Время захода для непосредственных сыновей v
                    }
                }
            }
        };

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i);
            }
        }

        const articulationPoints: number[] = [];
        for (let i = 0; i < n; i++) {
            if (isArticulationPoint[i]) {
                articulationPoints.push(i);
            }
        }

        return {
            bridges,
            articulationPoints,
        };
    }

    printOrWriteResult({ bridges, articulationPoints }: PrintResult) {
        const stream = getStreamOrNull(this.outputFlag, this.filePath);

        writeOrPrintMatrix({
            matrix: bridges,
            before: "Bridges",
            stream,
            shift: true,
        });
        writeOrPrintArray({
            array: articulationPoints,
            before: "Cut vertices",
            stream,
            shift: true,
        });

        if (stream) {
            stream.close();
        }
    }
}
