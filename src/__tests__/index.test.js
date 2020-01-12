import * as refractor from 'refractor';
import * as tokenizer from '..';

describe('index', () => {
    test('export tokenize', () => {
        expect(typeof tokenizer.tokenize).toBe('function');
    });

    test('tokenize without options', () => {
        expect(tokenizer.tokenize('hello world')).toBeTruthy();
    });

    test('tokenize with empty options', () => {
        expect(tokenizer.tokenize('hello world', {})).toBeTruthy();
    });

    test('tokenize with highlight', () => {
        const options = {
            highlight(source) {
                return refractor.highlight(source, 'javascript');
            },
        };
        expect(tokenizer.tokenize('hello world', options)).toBeTruthy();
    });

    test('tokenize with enhance', () => {
        const options = {
            enhancers: [
                c => c,
            ],
        };
        expect(tokenizer.tokenize('hello world', options)).toBeTruthy();
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
