import normalizeToLines from '../normalizeToLines';

const expectPathEquals = ([parents, text], hint, source) => {
    expect(text).toBe(source);
    expect(parents.map(n => n.type)).toEqual(hint);
};

describe('normalizeToLines', () => {
    test('single line of text', () => {
        const root = {
            type: 'root',
            children: [
                {type: 'text', value: 'hello'},
            ],
        };
        const output = normalizeToLines(root);
        expect(output.length).toBe(1);
        expect(output[0]).toEqual([[[], 'hello']]);
    });

    test('multiple lines of text', () => {
        const root = {
            type: 'root',
            children: [
                {type: 'text', value: 'hello\nworld'},
            ],
        };
        const output = normalizeToLines(root);
        expect(output.length).toBe(2);
        expect(output[0]).toEqual([[[], 'hello']]);
        expect(output[1]).toEqual([[[], 'world']]);
    });

    test('line break under token', () => {
        const root = {
            type: 'root',
            children: [
                {
                    type: 'element',
                    children: [
                        {type: 'text', value: 'hello\nworld'},
                    ],
                },
            ],
        };
        const output = normalizeToLines(root);
        expect(output.length).toBe(2);
        expect(output[0].length).toBe(1);
        expect(output[1].length).toBe(1);
        expectPathEquals(output[0][0], ['element'], 'hello');
        expectPathEquals(output[1][0], ['element'], 'world');
    });
});
