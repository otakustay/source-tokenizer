/* istanbul ignore file */
import {RefractorNode} from 'refractor';

export interface Token {
    type: string;
    properties?: {[key: string]: any};
}

export interface TreeNode extends Token {
    children: Array<TreeNode | string>;
}

export type SyntaxElement = TreeNode | string;

export type LineOfSyntax = SyntaxElement[];

// This is a dedicated data structure for representing "a path of tokens", in which:
//
// - the leaf node is always a text node
// - almost all manipulations to syntax tree is done via non-leaf nodes
//
// For example, when we want to wrap text inside a custom syntax, if we have a simple array of nodes, it is:
//
// ```javascript
// const previous = path.slice(0, -1);
// const text = path[path.length - 1];
// const newPath = [...previous, customNode, text];
// ```
//
// The `slice` call is performance unfriendly, and this can happen thousands of times within a tokenization.
//
// In this case, we extract the text to a single element, leaving all parent nodes in the first place of tuple,
// so we can wrap text inside a custom node more efficiently:
//
// ```javascript
// const [parents, text] = path;
// const newPath = [[...parents, customNode], text];
// ```
//
// We suppose by doing this can greatly optimize performance.
export type TokenPath = [Token[], string];

export type LineOfTokenPath = TokenPath[];

export type HighlightSource = (source: string) => RefractorNode[];

export type Enhancer = (linesOfPaths: LineOfTokenPath[]) => LineOfTokenPath[];

export interface TokenizeOptions {
    highlight?: HighlightSource;
    enhancers?: Enhancer[];
}

export interface SourceRange {
    type: string;
    // The `line` is 1 based and `column` is 0 based, both eslint and babel works like this,
    // despiting JavaScript's `Error#stack` has a 1 based column value, we decide to comply with community.
    line: number;
    column: number;
    length: number;
    properties?: {[key: string]: any};
}

export interface TokenizeController {
    enhance(enhancer: Enhancer): TokenizeController;
    undo(steps: number): TokenizeController;
    reset(): TokenizeController;
    compress(): TokenizeController;
    toSyntax(): LineOfSyntax[];
}
