import {
    TokenizeOptions,
    HighlightSource,
    Enhancer,
    TokenizeController,
    WorkingLineOfTokenPath,
    OutputLineOfSyntax,
} from './interface.js';
import {last} from './utils/internal.js';
import toTokenTree from './infrastructure/toTokenTree.js';
import normalizeToLines from './infrastructure/normalizeToLines.js';
import backToTree from './infrastructure/backToTree.js';

export const tokenize = (source: string, options: TokenizeOptions = {}): OutputLineOfSyntax[] => {
    const {highlight, enhancers = []} = options;
    const tree = toTokenTree(source, highlight);
    const lines = normalizeToLines(tree);
    const enhance: Enhancer = lines => enhancers.reduce((lines, enhance) => enhance(lines), lines);
    const enhancedLines = enhance(lines);
    return enhancedLines.map(backToTree);
};

function createController(input: WorkingLineOfTokenPath[], stack: WorkingLineOfTokenPath[][]): TokenizeController {
    const controller: TokenizeController = {
        enhance(enhancer) {
            const current = stack.length ? last(stack) : input;
            const newStack = [...stack, enhancer(current)];
            return createController(input, newStack);
        },
        undo(steps) {
            if (steps <= 0) {
                return controller;
            }

            return createController(input, stack.slice(0, -steps));
        },
        reset() {
            if (!stack.length) {
                return controller;
            }

            return createController(input, []);
        },
        compress() {
            if (!stack.length) {
                return controller;
            }

            return createController(input, [last(stack)]);
        },
        toSyntax() {
            const current = stack.length ? last(stack) : input;
            return current.map(backToTree);
        },
    };
    return controller;
}

export const controlled = (source: string, highlight?: HighlightSource): TokenizeController => {
    const tree = toTokenTree(source, highlight);
    const lines = normalizeToLines(tree);
    return createController(lines, []);
};
