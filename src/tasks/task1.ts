import { Graph } from "../graph";
import {
    getStreamOrNull,
    printCommonInfo,
    writeOrPrintArray,
    writeOrPrintMatrix,
    writeOrPrintValue,
} from "../helpers";

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
    solve() {
        if (this.infoFlag) {
            this.printInfo();
            return;
        } else {
            const result = this.floydWarshall();
            this.printOrWriteResult(result);
        }
    }
    floydWarshall() {
        const shortestPaths = Array.from({ length: this.length }, () =>
            new Array(this.length).fill(Infinity)
        );

        for (let row = 0; row < this.length; row++) {
            for (let col = 0; col < this.length; col++) {
                if (this.matrix[row][col] !== 0 || row === col) {
                    shortestPaths[row][col] = this.matrix[row][col];
                }
            }
        }

        // Вычисление кратчайших расстояний между всеми парами вершин
        for (let k = 0; k < this.length; k++) {
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < this.length; j++) {
                    if (
                        shortestPaths[i][j] >
                        shortestPaths[i][k] + shortestPaths[k][j]
                    ) {
                        shortestPaths[i][j] =
                            shortestPaths[i][k] + shortestPaths[k][j];
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

    printInfo() {
        printCommonInfo();
    }

    printOrWriteResult({
        degrees,
        shortestPaths,
        eccentricities,
        diameter,
        radius,
        centralVertexes,
        peripheralVertexes,
    }: PrintResult) {
        const stream = getStreamOrNull(this.outputFlag, this.filePath);

        writeOrPrintArray({
            stream,
            array: degrees,
            before: "deg",
        });
        writeOrPrintMatrix({
            stream,
            matrix: shortestPaths,
            before: "Distancies",
        });
        writeOrPrintArray({
            stream,
            array: eccentricities,
            before: "Eccentricity",
        });
        writeOrPrintValue({ stream, value: diameter, before: "D" });
        writeOrPrintValue({ stream, value: radius, before: "R" });
        writeOrPrintArray({
            stream,
            array: centralVertexes,
            before: "Z",
            shift: true,
        });
        writeOrPrintArray({
            stream,
            array: peripheralVertexes,
            before: "P",
            shift: true,
        });

        if (stream) {
            stream.close();
        }
    }
}
