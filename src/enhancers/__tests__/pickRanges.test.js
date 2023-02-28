import {describe, test, expect} from 'vitest';
import {pickRanges} from '../pickRanges';

describe('pickRanges', () => {
    const syntax = [
        [
            [[{type: 'prefix'}, {type: 'content'}], 'hello'],
            [[], ' '],
            [[{type: 'postfix'}, {type: 'content'}], 'world'],
        ],
    ];

    test('no range', () => {
        const output = pickRanges([])(syntax);
        expect(output).toEqual(syntax);
    });

    test('single range', () => {
        const range = {type: 'pick', line: 1, column: 2, length: 2};
        const output = pickRanges([range])(syntax);
        expect(output[0]).toEqual(
            [
                [
                    [
                        {type: 'prefix'},
                        {type: 'content'},
                    ],
                    'he',
                ],
                [
                    [
                        {type: 'pick'},
                        {type: 'prefix'},
                        {type: 'content'},
                    ],
                    'll',
                ],
                [
                    [
                        {type: 'prefix'},
                        {type: 'content'},
                    ],
                    'o',
                ],
                [[], ' '],
                [[{type: 'postfix'}, {type: 'content'}], 'world'],
            ]
        );
    });

});
