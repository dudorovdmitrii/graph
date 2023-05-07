import { Graph } from "../graph";
import {
    getStreamOrNull,
    printCommonInfo,
    shiftVertex,
    writeOrPrintMatrix,
    writeOrPrintValue,
} from "../helpers";

interface PrintResult {
    path: number[][];
    distance: number;
}

export class GraphTask5 extends Graph {
    solve(start: number, end: number) {
        if (this.infoFlag) {
            this.printInfo();
            return;
        }

        const result = this.solveByDijkstra(start, end);
        this.printOrWriteResult(result, start, end);
    }

    solveByDijkstra(start: number, end: number) {
        const distances: number[] = new Array(this.length).fill(
            Number.MAX_SAFE_INTEGER
        ); // массив расстояний до каждой вершины
        distances[start] = 0; // расстояние до начальной вершины равно 0

        const visited = new Array(this.length).fill(false); // массив для отслеживания посещенных вершин

        const path: number[][] = []; // массив для хранения маршрута

        // цикл по всем вершинам графа
        for (let i = 0; i < this.length; i++) {
            let minDistance = Number.MAX_SAFE_INTEGER;
            let currentVertex = -1;

            // ищем ближайшую вершину
            for (let j = 0; j < this.length; j++) {
                if (!visited[j] && distances[j] < minDistance) {
                    minDistance = distances[j];
                    currentVertex = j;
                }
            }

            // помечаем выбранную вершину как посещенную
            visited[currentVertex] = true;

            // обновляем расстояния до соседних вершин через текущую
            for (let k = 0; k < this.length; k++) {
                const edgeWeight = this.matrix[currentVertex][k];
                if (edgeWeight > 0) {
                    const distanceToNeighbor =
                        distances[currentVertex] + edgeWeight;
                    if (distanceToNeighbor < distances[k]) {
                        distances[k] = distanceToNeighbor;
                        path[k] = [
                            currentVertex,
                            k,
                            this.matrix[currentVertex][k],
                        ]; // обновляем маршрут до вершины
                    }
                }
            }
        }

        // формируем маршрут
        const finalPath: number[][] = [];
        let current = end;
        while (current !== start) {
            finalPath.unshift(path[current]);
            current = path[current][0];
        }

        return { path: finalPath, distance: distances[end] };
    }

    printInfo() {
        printCommonInfo();
        console.log("Список параметров:");
        console.log("n=vertex: Начальная вершина");
        console.log("d=vertex: Конечная вершина");
    }

    printOrWriteResult(
        { distance, path }: PrintResult,
        start: number,
        end: number
    ) {
        const stream = getStreamOrNull(this.outputFlag, this.filePath);

        writeOrPrintValue({
            value: distance,
            before: `Shortest path between ${start} and ${end} vertexes`,
            stream,
        });
        writeOrPrintMatrix({
            matrix: path.map(([start, end, weight]) => [
                shiftVertex(start),
                shiftVertex(end),
                weight,
            ]),
            before: "Path",
            stream,
        });

        if (stream) {
            stream.close();
        }
    }
}
