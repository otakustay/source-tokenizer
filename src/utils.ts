import {TokenPath} from '../types';

export const last = <T>(array: T[]) => array[array.length - 1];

type FlatMapIterate<T> = (item: T) => T | T[];

const isTokenPath = (item: TokenPath | TokenPath[]): item is TokenPath => typeof item[1] === 'string';

// 这个函数是一个优化后的`flatMap`，专门为`TokenPath`类型做了性能优化，
// 因为`TokenPath`本来就是个数组，所以普通的`flatMap`要识别它就必须通过`return [tokenPath]`包一层数组，
// 这种在遍历过程中不断包数组的形式很容易造成大量的对象生成开销，以及GC的开销，
// 所以这个函数用更高效的方法检测了类型，使得可以直接`return tokenPath`返回而避免额外的数组对象。
export const flatMapPaths = (array: TokenPath[], iterate: FlatMapIterate<TokenPath>): TokenPath[] => {
    const output: TokenPath[] = [];
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

type Transform = (path: TokenPath) => TokenPath;

export const sliceTokenPath = (path: TokenPath, start: number, end: number, transform?: Transform): TokenPath[] => {
    const [parents, text] = path;

    if (end <= 0 || start >= text.length) {
        return [path];
    }

    const output: TokenPath[] = [];
    const split = (start: number, end?: number): TokenPath => {
        const slicedText = text.slice(start, end);
        return [parents, slicedText];
    };

    if (start > 0) {
        const head = split(0, start);
        output.push(head);
    }

    const body = split(Math.max(start, 0), end);
    output.push(transform ? transform(body) : body);

    if (end < text.length) {
        const tail = split(end);
        output.push(tail);
    }

    return output;
};
