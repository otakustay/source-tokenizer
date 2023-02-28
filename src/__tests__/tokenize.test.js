import {describe, test, expect} from 'vitest';
import * as refractor from 'refractor';
import {tokenize, controlled} from '../tokenize';

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

describe('controlled', () => {
    const initial = () => controlled('hello\nworld');
    const wrap = type => {
        const wrapPath = ([parents, text]) => [[{type}, ...parents], text];
        return lines => lines.map(paths => paths.map(wrapPath));
    };

    test('without highlight', () => {
        const controller = initial();
        expect(controller).toBeTruthy();
        expect(Array.isArray(controller.toSyntax())).toBe(true);
    });

    test('with highlight', () => {
        const highlight = source => refractor.highlight(source, 'javascript');
        const controller = controlled('const a = 3', highlight);
        expect(Array.isArray(controller.toSyntax())).toBe(true);
    });

    test('enhance', () => {
        const syntax = initial().enhance(wrap('new')).toSyntax();
        expect(syntax[0][0].type).toBe('new');
    });

    test('enhance multiple', () => {
        const syntax = initial().enhance(wrap('old')).enhance(wrap('new')).toSyntax();
        expect(syntax[0][0].type).toBe('new');
        expect(syntax[0][0].children[0].type).toBe('old');
    });

    test('undo', () => {
        const syntax = initial().enhance(wrap('old')).enhance(wrap('new')).undo(1).toSyntax();
        expect(syntax[0][0].type).toBe('old');
        expect(syntax[0][0].children[0]).toBe('hello');
    });

    test('undo out of range', () => {
        const syntax = initial().enhance(wrap('old')).undo(2).toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });

    test('undo initial', () => {
        const syntax = initial().undo(1).toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });

    test('undo minus steps', () => {
        const syntax = initial().enhance(wrap('old')).enhance(wrap('new')).undo(-1).toSyntax();
        expect(syntax[0][0].type).toBe('new');
        expect(syntax[0][0].children[0].type).toBe('old');
    });

    test('reset', () => {
        const syntax = initial().enhance(wrap('old')).enhance(wrap('new')).reset().toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });

    test('reset initial', () => {
        const syntax = initial().reset().toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });

    test('compress', () => {
        const controller = initial().enhance(wrap('old')).enhance(wrap('new')).compress();
        // No cached intermediate enhance results, undo falls to original input
        const syntax = controller.undo(1).toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });

    test('compress initial', () => {
        const syntax = initial().compress().compress().toSyntax();
        expect(syntax[0][0]).toBe('hello');
    });
});
