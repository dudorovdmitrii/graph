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
            V: number
        ): number => {
            let min: number = Infinity;
            let minIndex: number = -1;

            for (let i = 0; i < V; i++) {
                if (mstSet[i] == false && key[i] < min) {
                    min = key[i];
                    minIndex = i;
                }
            }

            return minIndex;
        };

        const primMST = (graph: Array<Array<number>>, V: number) => {
            const parent: Array<number> = new Array<number>(V);
            const key: Array<number> = new Array<number>(V);
            const mstSet: Array<boolean> = new Array<boolean>(V);

            // инициализация массивов
            for (let i = 0; i < V; i++) {
                key[i] = Infinity;
                mstSet[i] = false;
            }

            key[0] = 0;
            parent[0] = -1;

            for (let i = 0; i < V - 1; i++) {
                const u = minKey(key, mstSet, V);
                mstSet[u] = true;

                for (let v = 0; v < V; v++) {
                    if (
                        graph[u][v] != 0 &&
                        mstSet[v] == false &&
                        graph[u][v] < key[v]
                    ) {
                        parent[v] = u;
                        key[v] = graph[u][v];
                    }
                }
            }

            let minimumCost = 0;
            for (let i = 1; i < V; i++) {
                tree.push([parent[i], i, graph[i][parent[i]]]);
                minimumCost += graph[i][parent[i]];
            }
            return minimumCost;
        };

        const cost = primMST(this.matrix, this.length);

        return { cost, tree };
    }

    solveByBuravka() {
        const tree: Array<Edge> = [];
        let cost = 0;
        const numVertices = this.length;
        const components = new Array(numVertices).fill(0);

        // Инициализация массива компонент связности.
        for (let i = 0; i < numVertices; ++i) {
            components[i] = i;
        }

        // Пока не останется только одна компонента связности.
        while (new Set(components).size !== 1) {
            const cheapest: Cheapest[] | null = new Array(numVertices).fill(
                null
            );

            // Находим самое дешевое ребро, соединяющее каждую компоненту связности.
            for (let i = 0; i < numVertices; ++i) {
                for (let j = 0; j < numVertices; ++j) {
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
            for (let c = 0; c < numVertices; ++c) {
                if (cheapest[c] !== null) {
                    const { source, target, weight } = cheapest[c];
                    if (components[source] !== components[target]) {
                        tree.push([
                            cheapest[c].source,
                            cheapest[c].target,
                            cheapest[c].weight,
                        ]);
                        cost += weight;
                        const prevComponent = components[target];
                        for (let i = 0; i < numVertices; ++i) {
                            if (components[i] === prevComponent) {
                                components[i] = components[source];
                            }
                        }
                    }
                }
            }
        }

        return { tree, cost };
    }

    solveByKruscal() {
        const g: number[][] = []; // вес - вершина 1 - вершина 2
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.length; j++) {
                if (this.matrix[i][j] != 0) {
                    const cur: number[] = new Array(3).fill(0);
                    cur[0] = this.matrix[i][j];
                    cur[1] = i;
                    cur[2] = j;
                    g.push(cur);
                }
            }
        }

        let cost = 0;
        const tree: Array<Edge> = [];

        g.sort((a, b) => a[0] - b[0]);
        const tree_id: number[] = new Array(this.length)
            .fill(0)
            .map((_, ind) => ind);

        for (let i = 0; i < g.length; i++) {
            let a = g[i][1],
                b = g[i][2],
                l = g[i][0];
            if (tree_id[a] != tree_id[b]) {
                cost += l;
                tree.push([a, b, l]);
                let old_id = tree_id[b];
                let new_id = tree_id[a];
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
