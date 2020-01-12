import {RefractorNode} from 'refractor';

export interface Token {
    [key: string]: any;
    type: string;
}

export interface TreeNode extends Token {
    children: Array<TreeNode | string>;
}

export type SyntaxElement = TreeNode | string;

export type LineOfSyntax = SyntaxElement[];

export type TokenPath = [Token[], string];

export type LineOfTokenPath = TokenPath[];

export type Enhancer = (linesOfPaths: LineOfTokenPath[]) => LineOfTokenPath[];

export interface TokenizeOptions {
    enhancers?: Enhancer[];
    highlight?(source: string): RefractorNode[];
}
