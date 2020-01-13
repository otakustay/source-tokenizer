import {Enhancer, LineOfTokenPath} from '../../types';
import {sliceTokenPath} from '../utils';

export interface Range {
    [key: string]: any;
    type: string;
    // The `line` is 1 based and `column` is 0 based, both eslint and babel works like this,
    // despiting JavaScript's `Error#stack` has a 1 based column value, we decide to comply with community.
    line: number;
    column: number;
    length: number;
}

interface IndexedRanges {
    [line: number]: Range[];
}

const splitPathToEncloseRange = (paths: LineOfTokenPath, range: Range): LineOfTokenPath => {
    const {column, length} = range;
    const rangeEnd = column + length;
    const [output] = paths.reduce(
        ([output, nodeStart], path) => {
            const nodeEnd = nodeStart + path[1].length;

            if (nodeStart > rangeEnd || nodeEnd < column) {
                output.push(path);
            }
            else {
                // Since a range can span across two or more paths,
                // and a range must be a single element in order to respond user events,
                // we should attach all paths to a range based node.
                //
                // Suppose we have a syntax tree like:
                //
                // ```
                // token1 -> token2 -> text(Hello)
                //        -> token3 -> text(My)
                //                  -> token4 -> text(World)
                // ```
                //
                // And we are slicing it to `Hel(loMyWor)ld`, the result should be:
                //
                // ```
                // token1 -> token2 -> text(Hel)
                //        -> range1 -> token2 -> text(lo)
                //                  -> token3 -> text(My)
                //                            -> token4 -> text(Wor)
                //                  -> token3 -> token4 -> text(ld)
                // ```
                //
                // Someone may think we can wrap only text into range node, as a result:
                //
                // ```
                // token1 -> token2 -> text(Hel)
                //                  -> range1 -> text(lo)
                //        -> token3 -> range1 -> text(My)
                //                  -> token4 -> range1 -> text(Wor)
                //                            -> text(ld)
                // ```
                //
                // Although the output tree seems simpler, there are 3 range nodes in the tree,
                // they cannot consistently respond to events like click or have a hover style,
                // this is **NOT** a correct one.
                const segments = sliceTokenPath(
                    path,
                    column - nodeStart,
                    rangeEnd - nodeStart,
                    ([parents, text]) => {
                        const wrapNode = {type: range.type, properties: range.properties};
                        return [
                            [wrapNode, ...parents],
                            text,
                        ];
                    }
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
    if (!ranges) {
        return paths;
    }

    return ranges.reduce(splitPathToEncloseRange, paths);
};

const pickRanges = (ranges: Range[]): Enhancer => lines => {
    const rangesByLine = ranges.reduce(
        (rangesByLine: IndexedRanges, range: Range) => {
            const ranges = rangesByLine[range.line] || [];
            ranges.push(range);
            rangesByLine[range.line] = ranges;
            return rangesByLine;
        },
        {}
    );
    return lines.map((line, i) => pickRangesFromPath(line, rangesByLine[i + 1]));
};

export default pickRanges;
