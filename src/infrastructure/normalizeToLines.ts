import {
    InputElementNode,
    InputRootNode,
    InputSourceNode,
    WorkingLineOfTokenPath,
    WorkingToken,
    WorkingTokenPath,
} from '../interface.js';
import {last} from '../utils/internal.js';

function treeToPathList(node: InputSourceNode, output: WorkingTokenPath[] = [], path: WorkingToken[] = []) {
    const putNodeWithChildren = (node: Omit<InputElementNode, 'children'>, children: InputSourceNode[]): void => {
        path.push(node);
        for (const child of children) {
            treeToPathList(child, output, path);
        }
        path.pop();
    };

    if (node.type === 'element') {
        // Have tried to cache immutable token object by className, no obvious performance improvements,
        // since element node have a constant set of properties, we can simply construct corresponding token like this.
        const nodeToUse = {
            type: node.type,
            properties: node.properties, // There is only a `className` property inside
        };
        putNodeWithChildren(nodeToUse, node.children);
    } else if (node.type === 'text') {
        // Here `path` is a mutable stack, to create a new path we need to clone it,
        // however we **DON'T** clone each node for performance considerations, they **MUST** be immutable.
        output.push([path.slice(), node.value]);
    } else {
        for (const child of node.children) {
            treeToPathList(child, output, path);
        }
    }

    return output;
}

const splitPathToLines = (path: WorkingTokenPath): WorkingTokenPath[] => {
    const [parents, text] = path;

    if (!text.includes('\n')) {
        return [path];
    }

    const linesOfText = text.split('\n');
    return linesOfText.map(line => [parents, line]);
};

const splitByLineBreak = (paths: WorkingTokenPath[]): WorkingLineOfTokenPath[] =>
    paths.reduce(
        (lines: WorkingTokenPath[][], path: WorkingTokenPath) => {
            // The last path of previous iteration should be on the same line of current iteration,
            // therefore we should merge these 2 paths into a single line.
            const currentLine = last(lines);
            const [currentRemaining, ...nextLines] = splitPathToLines(path);
            return [
                ...lines.slice(0, -1), // Elements of previous lines.
                [...currentLine, currentRemaining], // Combine elements to form current line.
                ...nextLines.map(path => [path]), // Elements of next lines.
            ];
        },
        [[]]
    );

export default function normalizeToLines(tree: InputRootNode): WorkingLineOfTokenPath[] {
    const paths = treeToPathList(tree);
    const linesOfPaths = splitByLineBreak(paths);
    return linesOfPaths;
}
