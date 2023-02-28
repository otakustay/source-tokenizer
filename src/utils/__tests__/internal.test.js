import {describe, test, expect} from 'vitest';
import {last, flatMapPaths} from '../internal';

describe('last', () => {
    test('last element of array', () => {
        expect(last([1, 2, 3])).toBe(3);
    });

    test('undefined if out of range', () => {
        expect(last([])).toBe(undefined);
    });
});

describe('flatMapPaths', () => {
    test('return single path', () => {
        const input = [
            [[{type: 'prefix'}], 'foo'],
            [[{type: 'prefix'}, {type: 'prefix'}], 'bar'],
        ];
        const output = flatMapPaths(input, n => n);
        expect(output).toEqual(input);
    });

    test('return array of paths', () => {
        const input = [
            [[{type: 'prefix'}], 'foo'],
            [[{type: 'prefix'}, {type: 'prefix'}], 'bar'],
        ];
        const output = flatMapPaths(input, n => [n, n]);
        expect(output).toEqual([input[0], input[0], input[1], input[1]]);
    });
});
