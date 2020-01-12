import {TokenizeOptions, Enhancer, LineOfSyntax} from '../types';
import toTokenTree from './infrastructure/toTokenTree';
import normalizeToLines from './infrastructure/normalizeToLines';
import backToTree from './infrastructure/backToTree';

export const tokenize = (source: string, options: TokenizeOptions = {}): LineOfSyntax[] => {
    const {enhancers = []} = options;
    const tree = toTokenTree(source, options);
    const lines = normalizeToLines(tree);
    const enhance: Enhancer = lines => enhancers.reduce((lines, enhance) => enhance(lines), lines);
    const enhancedLines = enhance(lines);
    return enhancedLines.map(backToTree);
};

export {default as markWord} from './enhancers/markWord';
export {default as pickRanges} from './enhancers/pickRanges';
export {sliceTokenPath} from './utils';
