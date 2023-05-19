import { getLaunchData, printCommonInfo } from './helpers';
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
} from './tasks';
import { Task4Flag, Task6Flag } from './types';

export function main() {
  const data = getLaunchData();
  const { task, test, infoFlag } = data;

  if (!task && infoFlag) {
    printCommonInfo();
    return;
  }

  if (test === '') {
    throw new Error('Не указан номер теста!');
  }

  switch (task) {
    case '1': {
      const graph = new GraphTask1(data);
      graph.solve();
      break;
    }
    case '2': {
      const graph = new GraphTask2(data);
      graph.solve();
      break;
    }
    case '3': {
      const graph = new GraphTask3(data);
      graph.solve();
      break;
    }
    case '4': {
      const graph = new GraphTask4(data);
      const flags = ['-s', '-b', '-p', '-k'];
      let flag: Task4Flag;
      for (const arg of process.argv) {
        if (flags.includes(arg)) {
          flag = arg as Task4Flag;
        }
      }
      graph.solve(flag);
      break;
    }
    case '5': {
      const graph = new GraphTask5(data);
      let start: number | undefined = undefined,
        end: number | undefined = undefined;
      for (const arg of process.argv) {
        if (arg.startsWith('n=')) {
          start = parseInt(arg.slice(2));
        }
        if (arg.startsWith('d=')) {
          end = parseInt(arg.slice(2));
        }
      }

      if (start !== undefined && end !== undefined) {
        graph.solve(start - 1, end - 1);
      } else if (infoFlag) {
        graph.printInfo();
      }
      break;
    }
    case '6': {
      const graph = new GraphTask6(data);
      const flags = ['-d', '-b', '-t'];
      let start: number | undefined = undefined;
      let flag: Task6Flag;
      for (const arg of process.argv) {
        if (arg.startsWith('n=')) {
          start = parseInt(arg.slice(2));
        }
        if (flags.includes(arg)) {
          flag = arg as Task6Flag;
        }
      }
      if (start !== undefined) {
        graph.solve(flag, start - 1);
      } else if (infoFlag) {
        graph.printInfo();
      }
      break;
    }
    case '7': {
      const graph = new GraphTask7(data);
      graph.solve();
      break;
    }
    case '9': {
      const graph = new GraphTask9(data);
      graph.solve();
      break;
    }
    case '10': {
      const graph = new GraphTask10(data);
      graph.fordFalkernson();
      break;
    }
    case '11': {
      const graph = new GraphTask11(data);
      graph.solve();
      break;
    }
    default:
      throw new Error(`Такого задания не существует!`);
  }
}

main();
