import shallowEquals from 'shallowequal';
import {LineOfTokenPath, TokenPath, TreeNode, LineOfSyntax} from '../interface';
import {last} from '../utils/internal';

const areNodesEqual = (x: TreeNode | string | undefined, y: TreeNode): boolean => {
    // All nodes passed to this function are created in place,
    // since we do not have a node reuse mechanism,
    // there is no condition where we can compare reference of them.

    if (!x || typeof x === 'string') {
        return false;
    }

    if (x.type !== y.type) {
        return false;
    }

    return x.type === y.type && shallowEquals(x.properties, y.properties);
};

const attachNode = (parent: TreeNode, node: TreeNode): TreeNode => {
    const previousSibling = last(parent.children);

    // Try to merge common parent nodes between 2 paths, results in as few nodes as possible.
    if (!areNodesEqual(previousSibling, node)) {
        parent.children.push(node);
    }

    // The leaf text node is not attached yet, type assertion is safe.
    return last(parent.children) as TreeNode;
};

const attachText = (parent: TreeNode, text: string): void => {
    const previousSibling = last(parent.children);

    // Text nodes are always mergeable.
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
