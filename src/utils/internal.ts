import {WorkingTokenPath} from '../interface.js';

export function last<T>(array: T[]): T {
    return array[array.length - 1];
}

type FlatMapIterate = (item: WorkingTokenPath) => WorkingTokenPath | WorkingTokenPath[];

function isTokenPath(item: WorkingTokenPath | WorkingTokenPath[]): item is WorkingTokenPath {
    return typeof item[1] === 'string';
}

// This is a `flatMat` function specifically optimized for `TokenPath` arrays,
// since `TokenPath` is an array itself, when an iteration returns a `TokenPath` instance (`[path, text]`),
// a native `flatMap` will unexpected treat it as an array and concat it to output,
// in this case we can only `return [tokenPath]` even when only a single `TokenPath` is returned,
// many useless arrays are created and a heavier GC pressure is taken.
//
// In this function `TokenPath` instance is detected efficiently and will not be treated as array,
// a simple `return tokenPath` is possible in iteratee functions to boost performance.
export const flatMapPaths = (array: WorkingTokenPath[], iterate: FlatMapIterate): WorkingTokenPath[] => {
    const output: WorkingTokenPath[] = [];
    for (const item of array) {
        const result = iterate(item);
        if (isTokenPath(result)) {
            output.push(result);
        }
        else {
            output.push(...result);
        }
    }
    return output;
};
