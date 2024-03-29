import {describe, test, expect} from 'vitest';
import {sliceTokenPath} from '../slice';

describe('sliceTokenPath', () => {
    const path = [
        [
            {type: 'prefix'},
            {type: 'content'},
        ],
        'hello world',
    ];

    test('at head', () => {
        const output = sliceTokenPath(path, 0, 5);
        expect(output.length).toBe(2);
        expect(output[0][1]).toBe('hello');
        expect(output[1][1]).toBe(' world');
    });

    test('at tail', () => {
        const output = sliceTokenPath(path, 6, 11);
        expect(output.length).toBe(2);
        expect(output[0][1]).toBe('hello ');
        expect(output[1][1]).toBe('world');
    });

    test('at middle', () => {
        const output = sliceTokenPath(path, 5, 6);
        expect(output.length).toBe(3);
        expect(output[0][1]).toBe('hello');
        expect(output[1][1]).toBe(' ');
        expect(output[2][1]).toBe('world');
    });

    test('end out of range', () => {
        const output = sliceTokenPath(path, 6, 20);
        expect(output.length).toBe(2);
        expect(output[0][1]).toBe('hello ');
        expect(output[1][1]).toBe('world');
    });

    test('negative end', () => {
        const output = sliceTokenPath(path, 0, -1);
        expect(output.length).toBe(1);
        expect(output[0]).toEqual(path);
    });

    test('out of range start', () => {
        const output = sliceTokenPath(path, 20, 30);
        expect(output.length).toBe(1);
        expect(output[0]).toEqual(path);
    });

    test('with transform', () => {
        const output = sliceTokenPath(path, 5, 6, ([parents, text]) => [[...parents, {type: 'slice'}], text]);
        expect(output[1]).toEqual([[{type: 'prefix'}, {type: 'content'}, {type: 'slice'}], ' ']);
    });
});
