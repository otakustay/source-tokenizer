import deepEquals from 'fast-deep-equal';
import {LineOfTokenPath, TokenPath, TreeNode, LineOfSyntax} from '../../types';
import {last} from '../utils';

const areNodesEqual = (x: TreeNode | string | undefined, y: TreeNode): boolean => {
    if (!x || typeof x === 'string') {
        return false;
    }

    if (x.type !== y.type) {
        return false;
    }

    // TODO: 理论上，如果不展开`properties`的话，这里的性能可以提高很多
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);

    if (xKeys.length !== yKeys.length) {
        return false;
    }

    for (const key of xKeys) {
        if (key === 'children') {
            continue;
        }

        if (!y.hasOwnProperty(key) || !deepEquals(x[key], y[key])) {
            return false;
        }
    }

    return true;
};

const attachNode = (parent: TreeNode, node: TreeNode): TreeNode => {
    const previousSibling = last(parent.children);

    // 在这里尽可能将节点合并起来，而不是单纯地重建一个很复杂的树
    if (!areNodesEqual(previousSibling, node)) {
        parent.children.push(node);
    }

    // 执行到这里肯定还没把叶子上的文本内容挂上去，所以类型是安全的
    return last(parent.children) as TreeNode;
};

const attachText = (parent: TreeNode, text: string): void => {
    const previousSibling = last(parent.children);

    // 文本节点一定能合并
    if (typeof previousSibling === 'string') {
        parent.children[parent.children.length - 1] = previousSibling + text;
    }
    else {
        parent.children.push(text);
    }
};

const attachTokenPath = ([parents, text]: TokenPath, root: TreeNode): void => {
    let parent = root;
    for (const token of parents) {
        const node: TreeNode = {...token, children: []};
        parent = attachNode(parent, node);
    }
    attachText(parent, text);
};

export default (paths: LineOfTokenPath): LineOfSyntax => {
    const root: TreeNode = {type: 'root', children: []};

    for (const path of paths) {
        attachTokenPath(path, root);
    }

    return root.children;
};
