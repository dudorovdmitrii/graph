import { Graph } from "../graph";
import {
    getStreamOrNull,
    printCommonInfo,
    shiftVertex,
    writeOrPrintMatrix,
    writeOrPrintValue,
} from "../helpers";
import { Edge, Task4Flag } from "../types";

interface PrintResult {
    tree: Array<Edge>;
    cost: number;
    algorithm: "k" | "p" | "b";
}

type Cheapest = {
    source: number;
    target: number;
    weight: number;
};

export class GraphTask4 extends Graph {
    solve(flag: Task4Flag) {
        if (this.infoFlag) {
            this.printInfo();
            return;
        }
        let results: PrintResult[] = [];
        const time: number[] = [];

        if (this.isDirected()) {
            this.matrix = this.getСorrelatedGraph();
        }

        switch (flag) {
            case "-k": {
                results.push({ ...this.solveByKruscal(), algorithm: "k" });
                break;
            }
            case "-p": {
                results.push({ ...this.solveByPrim(), algorithm: "p" });
                break;
            }
            case "-b": {
                results.push({ ...this.solveByBuravka(), algorithm: "b" });
                break;
            }
            case "-s": {
                const dateBeforeKruscal = Date.now();
                const resultKruscal = this.solveByKruscal();
                time.push(Date.now() - dateBeforeKruscal);
                results.push({ ...resultKruscal, algorithm: "k" });

                const dateBeforePrim = Date.now();
                const resultPrim = this.solveByKruscal();
                this.solveByPrim();
                results.push({ ...resultPrim, algorithm: "p" });
                time.push(Date.now() - dateBeforePrim);

                break;
            }
        }

        this.printOrWriteResult(results, time);
    }

    printInfo() {
        printCommonInfo();
        console.log("-k: алгоритм Крускала");
        console.log("-p: алгоритм Прима");
        console.log("-b: алгоритм Борувки");
        console.log("-s: расчёт производится тремя алгоритмами поочерёдно");
    }

    solveByPrim() {
        const tree: Array<Edge> = [];

        const minKey = (
            key: Array<number>,
            mstSet: Array<boolean>,
            length: number
        ): number => {
            let min: number = Infinity;
            let minIndex: number = -1;

            for (let i = 0; i < length; i++) {
                if (mstSet[i] == false && key[i] < min) {
                    min = key[i];
                    minIndex = i;
                }
            }

            return minIndex;
        };

        const primMST = () => {
            const parent: Array<number> = new Array<number>(this.length);
            const key: Array<number> = new Array<number>(this.length).fill(Infinity);
            const mstSet: Array<boolean> = new Array<boolean>(this.length).fill(false);

            key[0] = 0;
            parent[0] = -1;

            for (let i = 0; i < this.length - 1; i++) {
                // Находится не посещенная вершина с ребром минимального веса
                const u = minKey(key, mstSet, this.length);
                mstSet[u] = true;

                // Всем смежным непосещенным вершинам обновляется ребро минимального веса
                for (let v = 0; v < this.length; v++) {
                    if (
                        this.matrix[u][v] != 0 &&
                        mstSet[v] == false &&
                        this.matrix[u][v] < key[v]
                    ) {
                        parent[v] = u;
                        key[v] = this.matrix[u][v];
                    }
                }
            }
            // После этого цикла найден массив key - минимальный вес ребра,
            // по которому можно прийти в вершину

            let minimumCost = 0;
            for (let i = 1; i < this.length; i++) {
                tree.push([parent[i], i, key[i]]);
                minimumCost += key[i];
            }
            return minimumCost;
        };

        const cost = primMST();

        return { cost, tree };
    }

    solveByBuravka() {
        const tree: Array<Edge> = [];
        let cost = 0;
        const components = new Array(this.length).fill(0);

        // Инициализация массива компонент связности, для каждой вершины уникальная компонента связности
        for (let i = 0; i < this.length; ++i) {
            components[i] = i;
        }

        // Пока не останется только одна компонента связности.
        while (new Set(components).size !== 1) {
            const cheapest: Cheapest[] | null = new Array(this.length).fill(
                null
            );

            // Находим минимальное ребро, соединяющее каждую компоненту связности.
            for (let i = 0; i < this.length; ++i) {
                for (let j = 0; j < this.length; ++j) {
                    if (this.matrix[i][j] !== 0) {
                        const component1 = components[i];
                        const component2 = components[j];
                        if (component1 !== component2) {
                            if (
                                cheapest[component1] === null ||
                                this.matrix[i][j] < cheapest[component1].weight
                            ) {
                                cheapest[component1] = {
                                    source: i,
                                    target: j,
                                    weight: this.matrix[i][j],
                                };
                            }
                            if (
                                cheapest[component2] === null ||
                                this.matrix[i][j] < cheapest[component2].weight
                            ) {
                                cheapest[component2] = {
                                    source: i,
                                    target: j,
                                    weight: this.matrix[i][j],
                                };
                            }
                        }
                    }
                }
            }

            // Добавляем найденные ребра в остовное дерево и объединяем компоненты связности.
            for (let i = 0; i < this.length; ++i) {
                if (cheapest[i] !== null) {
                    const { source, target, weight } = cheapest[i];
                    if (components[source] !== components[target]) {
                        tree.push([
                            cheapest[i].source,
                            cheapest[i].target,
                            cheapest[i].weight,
                        ]);
                        cost += weight;
                        const prevComponent = components[target];
                        for (let j = 0; j < this.length; ++j) {
                            if (components[j] === prevComponent) {
                                components[j] = components[source];
                            }
                        }
                    }
                }
            }
        }

        return { tree, cost };
    }

    solveByKruscal() {
        const edges: number[][] = []; // вес - вершина 1 - вершина 2

        // Составляем массив ребер
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.length; j++) {
                if (this.matrix[i][j] != 0) {
                    const cur: number[] = new Array(3).fill(0);
                    cur[0] = this.matrix[i][j];
                    cur[1] = i;
                    cur[2] = j;
                    edges.push(cur);
                }
            }
        }

        let cost = 0;
        const tree: Array<Edge> = [];

        // Сортируем ребра по неубывнию по их весам
        edges.sort((a, b) => a[0] - b[0]);

        // Массив для отслеживания пройденных вершин
        const tree_id: number[] = new Array(this.length)
            .fill(0)
            .map((_, ind) => ind);

        for (let i = 0; i < edges.length; i++) {
            let v1 = edges[i][1],
                v2 = edges[i][2],
                weight = edges[i][0];

            // Добавляем i-ое ребро в наш подграф только в том случае, 
            // если данное ребро соединяет две разные компоненты связности, 
            // одним из которых является наш подграф. 
            // То есть, на каждом шаге добавляется минимальное по весу ребро, 
            // один конец которого содержится в нашем подграфе, а другой - еще нет.
            if (tree_id[v1] != tree_id[v2]) {
                cost += weight;
                tree.push([v1, v2, weight]);

                let old_id = tree_id[v2];
                let new_id = tree_id[v1];
                for (let j = 0; j < this.length; ++j) {
                    if (tree_id[j] == old_id) {
                        tree_id[j] = new_id;
                    }
                }
            }
        }
        return { tree, cost };
    }

    printOrWriteResult(results: PrintResult[], time: number[]) {
        const stream = getStreamOrNull(this.outputFlag, this.filePath);

        for (let i = 0; i < results.length; i++) {
            const { tree, cost, algorithm } = results[i];
            writeOrPrintValue({
                value: algorithm,
                before: "Algorithm",
                stream,
            });
            writeOrPrintMatrix({
                matrix: tree.map(([from, to, weight]) => [
                    shiftVertex(from),
                    shiftVertex(to),
                    weight,
                ]),
                before: "Minimum spanning tree",
                stream,
            });
            writeOrPrintValue({
                value: cost,
                before: "Weight of spanning tree",
                stream,
            });

            if (time.length) {
                writeOrPrintValue({
                    value: time[i],
                    before: "Time",
                    stream,
                });
            }
        }

        if (stream) {
            stream.close();
        }
    }
}
