import shallowEquals from 'shallowequal';
import {OutputContainerNode, OutputLineOfSyntax, WorkingLineOfTokenPath, WorkingTokenPath} from '../interface.js';
import {last} from '../utils/internal.js';

const areNodesEqual = (x: OutputContainerNode | string | undefined, y: OutputContainerNode): boolean => {
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

const attachNode = (parent: OutputContainerNode, node: OutputContainerNode): OutputContainerNode => {
    const previousSibling = last(parent.children);

    // Try to merge common parent nodes between 2 paths, results in as few nodes as possible.
    if (!areNodesEqual(previousSibling, node)) {
        parent.children.push(node);
    }

    // The leaf text node is not attached yet, type assertion is safe.
    return last(parent.children) as OutputContainerNode;
};

const attachText = (parent: OutputContainerNode, text: string): void => {
    const previousSibling = last(parent.children);

    // Text nodes are always mergeable.
    if (typeof previousSibling === 'string') {
        // eslint-disable-next-line no-param-reassign
        parent.children[parent.children.length - 1] = previousSibling + text;
    }
    else {
        parent.children.push(text);
    }
};

const attachTokenPath = ([parents, text]: WorkingTokenPath, root: OutputContainerNode): void => {
    let parent = root;
    for (const token of parents) {
        const node: OutputContainerNode = {...token, children: []};
        parent = attachNode(parent, node);
    }
    attachText(parent, text);
};

export default (paths: WorkingLineOfTokenPath): OutputLineOfSyntax => {
    const root: OutputContainerNode = {type: 'root', children: []};

    for (const path of paths) {
        attachTokenPath(path, root);
    }

    return root.children;
};
