import {
  GraphTask1,
  GraphTask10,
  GraphTask11,
  GraphTask2,
  GraphTask3,
  GraphTask4,
  GraphTask5,
  GraphTask6,
  GraphTask7,
  GraphTask9,
} from "./tasks";

const inputFlags = ["m", "l", "e"];

function getLaunchData() {
  let inputFlag, outputFlag, infoFlag;

  let i = 2;
  while (process.argv[i]) {
    const arg = process.argv[i];
    if (inputFlags.includes(arg)) {
      if (inputFlag) {
        throw new Error();
      }
    }
  }
}

export function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Не указан путь до файла!");
  }
  const filePathParts = filePath.split("/");

  if (filePathParts.length === 1) {
    throw new Error("Не указано название или директория файла!");
  }
  const dir = filePathParts[0];

  switch (dir) {
    case "task1": {
      const graph = new GraphTask1(filePath);
      const result = graph.floydWarshall();
      graph.printResult(result);
      break;
    }
    case "task2": {
      const graph = new GraphTask2(filePath);
      const result = graph.solve();
      graph.printResult(result);
      break;
    }
    case "task3": {
      const graph = new GraphTask3(filePath);
      const result = graph.findBridgesAndArticulationPoints();
      graph.printResult(result);
      break;
    }
    case "task4": {
      const graph = new GraphTask4(filePath);
      const result = graph.solveByKruscal();
      graph.printResult(result);
      break;
    }
    case "task5": {
      const graph = new GraphTask5(filePath);
      const result = graph.solve(4, 3);
      break;
    }
    case "task6": {
      const graph = new GraphTask6(filePath);
      const result = graph.solveBylevit();
      console.log(result);
      break;
    }
    case "task7": {
      const graph = new GraphTask7(filePath);
      graph.johnsonDistance();
      break;
    }
    case "task9": {
      const graph = new GraphTask9(filePath);
      graph.hamiltonianPath();
      break;
    }
    case "task10": {
      const graph = new GraphTask10(filePath);
      graph.fordFalkernson();
      break;
    }
    case "task11": {
      const graph = new GraphTask11(filePath);
      graph.all();
      break;
    }
    default:
      throw new Error(`Директории ${dir} не существует!`);
  }
}

main();
