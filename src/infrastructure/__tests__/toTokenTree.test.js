import {describe, test, expect} from 'vitest';
import * as refractor from 'refractor';
import toTokenTree from '../toTokenTree';

const highlight = source => refractor.highlight(source, 'javascript');

const toSource = (node, source = '') => {
    if (node.type === 'text') {
        return source + node.value;
    }

    return node.children.reduce((source, node) => toSource(node, source), source);
};

describe('toTokenTree', () => {
    test('transform simple string', () => {
        const text = 'hello';
        const output = toTokenTree(text);
        expect(output).toEqual({type: 'root', children: [{type: 'text', value: text}]});
    });

    test('transform with highlight', () => {
        const text = 'const a = 3;';
        const output = toTokenTree(text, highlight);
        expect(toSource(output)).toBe(text);
    });
});
