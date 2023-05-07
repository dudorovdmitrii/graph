import { WriteStream } from "fs";

export type InputFlag = "-e" | "-m" | "-l" | null;

export type Task4Flag = "-s" | "-b" | "-p" | "-k" | undefined;

export type NullableWriteStream = WriteStream | null;

export type LaunchData = {
    inputFlag: InputFlag;
    outputFlag: boolean;
    infoFlag: boolean;
    task: string;
    test: string;
};

export type WriteOrPrintMatrix = {
    matrix: number[][];
    before?: string;
    stream?: WriteStream | null;
    shift?: boolean;
};

export type WriteOrPrintArray = {
    array: number[];
    before?: string;
    stream?: WriteStream | null;
    shift?: boolean;
};

export type WriteOrPrintValue = {
    value: any;
    before?: string;
    stream?: WriteStream | null;
};

export type WriteMatrix = {
    stream: WriteStream;
    matrix: number[][];
    before?: string;
    shift?: boolean;
};

export type WriteArray = {
    stream: WriteStream;
    array: number[];
    before?: string;
    shift?: boolean;
};

export type WriteValue = {
    stream: WriteStream;
    value: any;
    before?: string;
};

export type WriteBefore = {
    stream: WriteStream;
    before?: string;
    contentNextLine?: boolean;
};

export type PrintMatrix = {
    matrix: number[][];
    before?: string;
    shift?: boolean;
};

export type PrintValue = {
    value: any;
    before?: string;
};

export type PrintArray = {
    array: number[];
    before?: string;
    shift?: boolean;
};

export type Edge = [number, number, number];