import {Enhancer, LineOfTokenPath} from '../../types';
import {sliceTokenPath} from '../utils';

export interface Range {
    [key: string]: any;
    type: string;
    lineNmber: number;
    // TODO: 这个东西到底应该1开始还是0开始？
    start: number;
    length: number;
}

interface IndexedRanges {
    [line: number]: Range[];
}

const splitPathToEncloseRange = (paths: LineOfTokenPath, range: Range): LineOfTokenPath => {
    const {start, length} = range;
    const rangeEnd = start + length;
    const [output] = paths.reduce(
        ([output, nodeStart], path) => {
            const nodeEnd = nodeStart + path[1].length;

            if (nodeStart > rangeEnd || nodeEnd < start) {
                output.push(path);
            }
            else {
                const segments = sliceTokenPath(
                    path,
                    start - nodeStart,
                    rangeEnd - nodeStart,
                    // TODO: 这个节点应该插在最上面还是最下面？
                    ([parents, text]) => [[range, ...parents], text]
                );
                output.push(...segments);
            }

            return [output, nodeEnd];
        },
        [[], 0] as [LineOfTokenPath, number]
    );

    return output;
};

const pickRangesFromPath = (paths: LineOfTokenPath, ranges: Range[]): LineOfTokenPath => {
    if (!ranges.length) {
        return paths;
    }

    return ranges.reduce(splitPathToEncloseRange, paths);
};

const pickRanges = (ranges: Range[]): Enhancer => lines => {
    const rangesByLine = ranges.reduce(
        (rangesByLine, range) => {
            const ranges = rangesByLine[range.lineNmber] || [];
            ranges.push(range);
            rangesByLine[range.lineNmber] = ranges;
            return rangesByLine;
        },
        {} as IndexedRanges
    );
    return lines.map((line, i) => pickRangesFromPath(line, rangesByLine[i + 1]));
};

export default pickRanges;
