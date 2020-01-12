import markWord from '../markWord';

describe('markWord', () => {
    const syntax = [
        [
            [[{type: 'prefix'}, {type: 'content'}], 'hello'],
            [[], ' '],
            [[{type: 'postfix'}, {type: 'content'}], 'world'],
        ],
    ];

    test('no match', () => {
        const output = markWord('$', 'special')(syntax);
        expect(output).toEqual(syntax);
    });

    test('match entire path', () => {
        const output = markWord('hello', 'special')(syntax);
        expect(output[0].length).toBe(3);
        expect(output[0][0]).toEqual(
            [
                [
                    {type: 'prefix'},
                    {type: 'content'},
                    {type: 'mark', markType: 'special'},
                ],
                'hello',
            ]
        );
        expect(output[0][1]).toEqual(syntax[0][1]);
        expect(output[0][2]).toEqual(syntax[0][2]);
    });

    test('match partial path', () => {
        const output = markWord('hel', 'special')(syntax);
        expect(output[0].length).toBe(4);
        expect(output[0][0]).toEqual(
            [
                [
                    {type: 'prefix'},
                    {type: 'content'},
                    {type: 'mark', markType: 'special'},
                ],
                'hel',
            ]
        );
        expect(output[0][1]).toEqual(
            [
                [
                    {type: 'prefix'},
                    {type: 'content'},
                ],
                'lo',
            ]
        );
        expect(output[0][2]).toEqual(syntax[0][1]);
        expect(output[0][3]).toEqual(syntax[0][2]);
    });

    test('multiple match', () => {
        const output = markWord('o', 'special')(syntax);
        expect(output[0]).toEqual(
            [
                [
                    [
                        {type: 'prefix'},
                        {type: 'content'},
                    ],
                    'hell',
                ],
                [
                    [
                        {type: 'prefix'},
                        {type: 'content'},
                        {type: 'mark', markType: 'special'},
                    ],
                    'o',
                ],
                [
                    [],
                    ' ',
                ],
                [
                    [
                        {type: 'postfix'},
                        {type: 'content'},
                    ],
                    'w',
                ],
                [
                    [
                        {type: 'postfix'},
                        {type: 'content'},
                        {type: 'mark', markType: 'special'},
                    ],
                    'o',
                ],
                [
                    [
                        {type: 'postfix'},
                        {type: 'content'},
                    ],
                    'rld',
                ],
            ]
        );
    });
});
