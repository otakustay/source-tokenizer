import * as tokenizer from '..';

describe('index', () => {
    test('export tokenize', () => {
        expect(typeof tokenizer.tokenize).toBe('function');
    });

    test('export markWord', () => {
        expect(typeof tokenizer.markWord).toBe('function');
    });

    test('export pickRanges', () => {
        expect(typeof tokenizer.pickRanges).toBe('function');
    });

    test('export sliceTokenPath', () => {
        expect(typeof tokenizer.sliceTokenPath).toBe('function');
    });
});
