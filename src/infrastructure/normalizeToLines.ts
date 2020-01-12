import {RefractorNode} from 'refractor';
import {Token, TokenPath, LineOfTokenPath} from '../../types';
import {last} from '../utils';
import {RootNode} from './toTokenTree';

const treeToPathList = (node: RootNode | RefractorNode, output: TokenPath[] = [], path: Token[] = []): TokenPath[] => {
    const putNodeWithChildren = (node: Token, children: RefractorNode[]): void => {
        path.push(node);
        for (const child of children) {
            treeToPathList(child, output, path);
        }
        path.pop();
    };

    if (node.type === 'root') {
        // TODO: 研究一下`root`不放进去能不能跑
        const {children, ...nodeToUse} = node;
        putNodeWithChildren(nodeToUse, children);
    }
    else if (node.type === 'element') {
        const {children, properties, tagName, ...nodeToUse} = node;
        putNodeWithChildren({...nodeToUse, ...properties}, children);
    }
    else {
        // `path`中第一个肯定是`root`，这个东西是没用的需要丢掉
        output.push([path.slice(1), node.value]);
    }

    return output;
};

const splitPathToLines = (path: TokenPath): TokenPath[] => {
    const [parents, text] = path;

    if (!text.includes('\n')) {
        return [path];
    }

    const linesOfText = text.split('\n');
    return linesOfText.map(line => [parents, line]);
};

const splitByLineBreak = (paths: TokenPath[]): LineOfTokenPath[] => paths.reduce(
    (lines: TokenPath[][], path: TokenPath) => {
        // 此处的核心是上一轮按行拆分完的最后一条路径，和这一轮的第一条路径是在同一行的，所以要合并起来
        const currentLine = last(lines);
        const [currentRemaining, ...nextLines] = splitPathToLines(path);
        return [
            ...lines.slice(0, -1), // 前面几行的内容
            [...currentLine, currentRemaining], // // 上一轮的最后部分和这一轮的第一部分合并
            ...nextLines.map(path => [path]), // 后续行的内容
        ];
    },
    [[]]
);

export default (tree: RootNode): LineOfTokenPath[] => {
    const paths = treeToPathList(tree);
    const linesOfPaths = splitByLineBreak(paths);
    return linesOfPaths;
};
