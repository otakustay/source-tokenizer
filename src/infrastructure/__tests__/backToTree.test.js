import {describe, test, expect} from 'vitest';
import backToTree from '../backToTree';

const nodeToSource = (node, source = '') => {
    if (typeof node === 'string') {
        return source + node;
    }

    return node.children.reduce((source, node) => nodeToSource(node, source), source);
};

const toSource = roots => nodeToSource({type: 'root', children: roots});

describe('backToTree', () => {
    test('multiple path', () => {
        const paths = [
            [
                [{type: 'element', properties: {className: ['keyword']}}],
                'const',
            ],
            [
                [],
                ' ',
            ],
            [
                [{type: 'element', properties: {className: ['identifier']}}],
                'foo',
            ],
        ];
        const roots = backToTree(paths);
        expect(roots.length).toBe(3);
        expect(toSource(roots)).toBe('const foo');
    });

    test('merge token', () => {
        const identifier = {type: 'element', properties: {className: ['identifier']}};
        const paths = [
            [
                [{type: 'element', properties: {className: ['keyword']}}],
                'const',
            ],
            [
                [],
                ' ',
            ],
            [
                [
                    identifier,
                    {type: 'mark', properties: {type: 'special'}},
                ],
                '$',
            ],
            [
                [identifier],
                'foo',
            ],
        ];
        const roots = backToTree(paths);
        expect(roots.length).toBe(3);
        expect(toSource(roots)).toBe('const $foo');
    });

    test('merge text', () => {
        const paths = [
            [
                [{type: 'element', properties: {className: ['keyword']}}],
                'const',
            ],
            [
                [],
                ' ',
            ],
            [
                [],
                'foo',
            ],
        ];
        const roots = backToTree(paths);
        expect(roots.length).toBe(2);
        expect(toSource(roots)).toBe('const foo');
    });

    test('merge fail for type difference', () => {
        const paths = [
            [
                [{type: 'element', properties: {className: ['keyword']}}],
                'const',
            ],
            [
                [],
                ' ',
            ],
            [
                [{type: 'prefix'}],
                '$',
            ],
            [
                [{type: 'element'}],
                'foo',
            ],
        ];
        const roots = backToTree(paths);
        expect(roots.length).toBe(4);
        expect(toSource(roots)).toBe('const $foo');
    });

    test('merge fail for peroperties difference', () => {
        const paths = [
            [
                [{type: 'element', properties: {className: ['keyword']}}],
                'const',
            ],
            [
                [],
                ' ',
            ],
            [
                [{type: 'element', properties: {className: ['prefix']}}],
                '$',
            ],
            [
                [{type: 'element', properties: {className: ['identifier']}}],
                'foo',
            ],
        ];
        const roots = backToTree(paths);
        expect(roots.length).toBe(4);
        expect(toSource(roots)).toBe('const $foo');
    });
});
