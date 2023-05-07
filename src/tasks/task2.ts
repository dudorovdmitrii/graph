import { Graph } from "../graph";
import {
    getStreamOrNull,
    printCommonInfo,
    writeOrPrintMatrix,
    writeOrPrintValue,
} from "../helpers";

interface PrintResult {
    components: number[][];
    componentsStrongLink?: number[][];
}

export class GraphTask2 extends Graph {
    solveNotDirected() {
        const components: number[][] = [];
        const used: boolean[] = new Array(this.length).fill(false);

        for (let i = 0; i < this.length; i++) {
            if (!used[i]) {
                used[i] = true;
                const curList: number[] = [i];
                const q: number[] = [i];
                while (q.length > 0) {
                    const v = q[0];
                    q.shift();
                    for (let j = 0; j < this.length; j++) {
                        if (this.matrix[v][j] !== 0 && !used[j]) {
                            used[j] = true;
                            curList.push(j);
                            q.push(j);
                        }
                    }
                }
                components.push(curList);
            }
        }

        return components;
    }

    solveDirected() {
        const invertedGraph = this.invertGraph();
        const nums = this.getNumbers();
        const components = this.getComponents(invertedGraph, nums);

        return components;
    }

    solve() {
        if (this.infoFlag) {
            this.printInfo();
            return;
        }

        let result: PrintResult = { components: [] };
        if (this.isDirected()) {
            result.componentsStrongLink = this.solveDirected();

            const assosiatedGraph = Array.from({ length: this.length }, () =>
                new Array(this.length).fill(0)
            );
            for (let row = 0; row < this.length; row++) {
                for (let col = 0; col < this.length; col++) {
                    if (this.matrix[row][col] !== 0) {
                        assosiatedGraph[row][col] = this.matrix[row][col];
                        assosiatedGraph[col][row] = this.matrix[row][col];
                    }
                }
            }

            this.matrix = assosiatedGraph;
            result.components = this.solveNotDirected();
        } else {
            result.components = this.solveNotDirected();
        }

        this.printOrWriteResult(result);
    }

    getNumbers(): number[] {
        let current = 1;
        this.length = this.matrix[0].length;
        const nums: number[] = new Array(this.length).fill(0);
        const marked = new Set();

        const dfs = (num: number) => {
            if (marked.has(num)) {
                return;
            }
            marked.add(num);
            for (let i = 0; i < this.length; i++) {
                if (this.matrix[num][i] === 0) {
                    continue;
                }
                if (!marked.has(i)) {
                    nums[num] = current++;
                    dfs(i);
                }
            }
            nums[num] = current++;
        };

        for (let i = 0; i < this.length; i++) {
            dfs(i);
        }

        return nums;
    }

    invertGraph(): number[][] {
        const invertedMatrix: number[][] = Array.from(
            { length: this.length },
            () => new Array(this.length).fill(0)
        );

        for (let row = 0; row < this.length; row++) {
            for (let col = 0; col < this.length; col++) {
                if (this.matrix[row][col] === 1) {
                    invertedMatrix[col][row] = 1;
                }
            }
        }

        return invertedMatrix;
    }

    getComponents(invertedMatrix: number[][], nums: number[]): number[][] {
        const components: number[][] = [];
        const marked = new Set();

        const dfs = (num: number, component: number[]) => {
            if (marked.has(num)) return;

            component.push(num);
            marked.add(num);

            for (let i = 0; i < this.length; i++) {
                if (invertedMatrix[num][i] === 0) continue;
                if (!marked.has(i)) {
                    dfs(i, component);
                }
            }
        };

        const arr = new Array(this.length).fill(null).map((_, ind) => ind);
        const hash: Record<string, number> = {};
        for (let i = 0; i < this.length; i++) {
            hash[i] = nums[i];
        }
        arr.sort((a, b) => hash[b] - hash[a]);

        for (let i = 0; i < this.length; i++) {
            const component: number[] = [];
            dfs(arr[i], component);
            if (component.length > 0) {
                components.push(component);
            }
        }

        return components;
    }

    printInfo() {
        printCommonInfo();
    }

    printOrWriteResult({ components, componentsStrongLink }: PrintResult) {
        const stream = getStreamOrNull(this.outputFlag, this.filePath);

        if (componentsStrongLink) {
            writeOrPrintValue({ value: "Граф - ориентированный", stream });
            writeOrPrintValue({
                value: components.length,
                before: "Количество компонент связности",
                stream,
            });
            writeOrPrintMatrix({
                matrix: components,
                before: "Компоненты связности",
                stream,
                shift: true,
            });
            writeOrPrintValue({
                value: componentsStrongLink.length,
                before: "Количество компонент сильной связности",
                stream,
            });
            writeOrPrintMatrix({
                matrix: componentsStrongLink,
                before: "Компоненты сильной связности",
                stream,
                shift: true,
            });
        } else {
            writeOrPrintValue({ value: "Граф - неориентированный", stream });
            writeOrPrintValue({
                value: components.length,
                before: "Количество компонент связности",
                stream,
            });
            writeOrPrintMatrix({
                matrix: components,
                before: "Компоненты связности",
                stream,
                shift: true,
            });
        }

        if (stream) {
            stream.close();
        }
    }
}
