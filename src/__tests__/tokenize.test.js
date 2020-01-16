import * as refractor from 'refractor';
import {tokenize} from '../tokenize';

describe('tokenize', () => {
    test('tokenize without options', () => {
        expect(tokenize('hello world')).toBeTruthy();
    });

    test('tokenize with empty options', () => {
        expect(tokenize('hello world', {})).toBeTruthy();
    });

    test('tokenize with highlight', () => {
        const options = {
            highlight(source) {
                return refractor.highlight(source, 'javascript');
            },
        };
        expect(tokenize('hello world', options)).toBeTruthy();
    });

    test('tokenize with enhance', () => {
        const options = {
            enhancers: [
                c => c,
            ],
        };
        expect(tokenize('hello world', options)).toBeTruthy();
    });
});
