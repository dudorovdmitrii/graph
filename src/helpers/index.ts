import path from 'path';
import fs from 'fs';
import {
  InputFlag,
  NullableWriteStream,
  PrintArray,
  PrintMatrix,
  PrintValue,
  WriteArray,
  WriteBefore,
  WriteMatrix,
  WriteOrPrintArray,
  WriteOrPrintMatrix,
  WriteOrPrintValue,
  WriteValue,
} from '../types';

export const resultDir = 'results';

const startVertex = 1;
export function shiftVertex(index: number) {
  return index + startVertex;
}

export function getStreamOrNull(outputFlag: boolean, filePath: string): NullableWriteStream {
  return outputFlag ? fs.createWriteStream(path.resolve(resultDir, filePath)) : null;
}

export function printCommonInfo() {
  console.log('Автор работы: Дудоров Дмитрий');
  console.log('Группа: М30-210Б-21');
  console.log('Список ключей:');
  console.log('-e: Ввод графа через список ребер');
  console.log('-m: Ввод графа через матрицу смежности');
  console.log('-l: Ввод графа через список смежности');
  console.log('-o: Вывод результата в файл');
}

export function getLaunchData() {
  const inputFlags = ['-m', '-l', '-e'];

  let inputFlag: InputFlag = null;
  let outputFlag = false,
    infoFlag = false;
  let task = '',
    test = '';

  let i = 2;
  while (process.argv[i]) {
    const arg = process.argv[i];
    if (inputFlags.includes(arg)) {
      if (inputFlag) {
        throw new Error('Указано больше одного способа ввода данных!');
      }
      inputFlag = arg as InputFlag;
    }
    if (arg === '-o') {
      outputFlag = true;
    }
    if (arg === '-h') {
      infoFlag = true;
      break;
    }
    if (arg.startsWith('task')) {
      const [_, taskNumber] = arg.split('=');
      task = taskNumber;
    }
    if (arg.startsWith('test')) {
      const [_, testNumber] = arg.split('=');
      test = testNumber;
    }

    i++;
  }

  return {
    inputFlag,
    outputFlag,
    infoFlag,
    task,
    test,
  };
}

export function getFilePath(task: string, test: string, inputFlag: InputFlag) {
  const testWithZeros = parseInt(test) > 9 ? '0' + test : '00' + test;

  switch (inputFlag) {
    case '-m': {
      return `task${task}/matrix_t${task}_${testWithZeros}.txt`;
    }
    case '-e': {
      return `task${task}/list_of_edges_t${task}_${testWithZeros}.txt`;
    }
    case '-l': {
      return `task${task}/list_of_adjacency_t${task}_${testWithZeros}.txt`;
    }
    default: {
      return `task${task}/matrix_t${task}_${testWithZeros}.txt`;
    }
  }
}

function writeBefore(props: WriteBefore) {
  const { stream, before, contentNextLine } = props;
  if (before) {
    stream.write(before + ': ');

    if (contentNextLine) {
      stream.write('\n');
    }
  }
}

function normalizeArray(array: number[], shift: boolean | undefined) {
  return shift ? array.map((vertex) => shiftVertex(vertex)) : array;
}

export function writeMatrix(props: WriteMatrix) {
  const { stream, matrix, before, shift } = props;

  writeBefore({ stream, before, contentNextLine: true });
  stream.write('[');
  stream.write('\n');
  for (const row of matrix) {
    const normalizedRow = normalizeArray(row, shift);
    stream.write(' [');
    stream.write(normalizedRow.toString());
    stream.write(']');
    stream.write('\n');
  }
  stream.write(']');
  stream.write('\n');
}

export function writeArray(props: WriteArray) {
  const { before, stream, array, shift } = props;

  const normalizedArray = normalizeArray(array, shift);

  writeBefore({ stream, before });
  stream.write('[');
  stream.write(normalizedArray.toString());
  stream.write(']');
  stream.write('\n');
}

export function writeValue(props: WriteValue) {
  const { stream, value, before } = props;

  writeBefore({ stream, before });
  stream.write(value.toString());
  stream.write('\n');
}

export function printMatrix(props: PrintMatrix) {
  const { matrix, before, shift } = props;

  if (before) {
    console.log(before + ': ');
  }

  for (const row of matrix) {
    const normalizedRow = normalizeArray(row, shift);
    console.log(normalizedRow);
  }
}

export function printValue(props: PrintValue) {
  const { before, value } = props;

  if (before) {
    console.log(before + ': ', value);
  } else {
    console.log(value);
  }
}

export function printArray(props: PrintArray) {
  const { before, array, shift } = props;

  const normalizedArray = normalizeArray(array, shift);

  if (before) {
    console.log(before + ': ', normalizedArray);
  } else {
    console.log(normalizedArray);
  }
}

export function writeOrPrintMatrix(props: WriteOrPrintMatrix) {
  const { matrix, before, stream, shift } = props;

  if (!stream) {
    printMatrix({ matrix, before, shift });
  } else {
    writeMatrix({ stream, matrix, before, shift });
  }
}

export function writeOrPrintArray(props: WriteOrPrintArray) {
  const { array, before, stream, shift } = props;

  if (!stream) {
    printArray({ array, before, shift });
  } else {
    writeArray({ stream, array, before, shift });
  }
}

export function writeOrPrintValue(props: WriteOrPrintValue) {
  const { value, before, stream } = props;

  if (!stream) {
    printValue({ value, before });
  } else {
    writeValue({ stream, value, before });
  }
}
