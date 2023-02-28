import {WorkingTokenPath} from '../interface.js';

type Transform = (path: WorkingTokenPath) => WorkingTokenPath;

export function sliceTokenPath(path: WorkingTokenPath, start: number, end: number, transform?: Transform) {
    const [parents, text] = path;

    if (end <= 0 || start >= text.length) {
        return [path];
    }

    const output: WorkingTokenPath[] = [];
    const split = (start: number, end?: number): WorkingTokenPath => {
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
}
