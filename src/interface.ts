// Types BEFORE we optimize the data sturcture
export interface InputTextNode {
    type: 'text';
    value: string;
}

export interface InputElementNode {
    type: 'element';
    properties?: Record<string, any>;
    children: Array<InputTextNode | InputElementNode>;
}

export interface InputRootNode {
    type: 'root';
    children: Array<InputTextNode | InputElementNode>;
}

export type InputSourceNode = InputTextNode | InputElementNode | InputRootNode;

export type HighlightSource = (source: string) => InputRootNode;

// Types AFTER we optimize the data structure
export interface WorkingToken {
    type: string;
    properties?: Record<string, any>;
}

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
// We expect a greate performance boost by doing this.
export type WorkingTokenPath = [WorkingToken[], string];

export type WorkingLineOfTokenPath = WorkingTokenPath[];

export type Enhancer = (linesOfPaths: WorkingLineOfTokenPath[]) => WorkingLineOfTokenPath[];

export interface OutputContainerNode {
    type: string;
    properties?: Record<string, any>;
    children: Array<OutputContainerNode | string>;
}

export interface OutputRootNode {
    type: 'root';
    children: Array<OutputContainerNode | string>;
}

export type OutputSyntaxElement = OutputContainerNode | string;

export type OutputLineOfSyntax = OutputSyntaxElement[];

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
    toSyntax(): OutputLineOfSyntax[];
}
