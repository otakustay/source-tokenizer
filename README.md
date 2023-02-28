# source-tokenizer

This is a utility library to tokenize any source code into syntax and manipulate on syntax tree.

Although this library is able to handle any kind of strings, it is highly recommend that only source code is processed.

This is a infrastructure reused between [react-source-view](https://github.com/otakustay/react-source-view) and [react-diff-view](https://github.com/otakustay/react-diff-view), in most case you will not need this library directly.

## Install

With NPM:

```shell
npm install @otakustay/source-tokenizer
```

With Yarn:

```shell
yarn add @otakustay/source-tokenizer
```

## Basic Usage

Use `tokenize` exported function to transform source string into an array containing syntax trees.

```javascript
import {tokenize} from '@otakustay/source-tokenizer';

const linesOfSyntax = tokenize(source);

const dumpNode = (node, indent) => {
    if (typeof node === 'string') {
        console.log(`${'  '.repeat(indent)}- text(${node})`);
        return;
    }

    console.log(`${'  '.repeat(indent)}- node(${node.type})`);
    node.children.forEach(child => dumpNode(child, indent + 1));
};

for (let i = 0; i < linesOfSyntax.length; i++) {
    console.log(`Line ${i + 1}`);
    const tree = linesOfSyntax[i];
    tree.forEach(node => dumpNode(node, 1));
}
```

By inputting `source` as:

```javascript
const a = 3;
console.log(a);
```

It outputs:

```
Line 1
  - text(const a = 3;)
Line 2
  - text(console.log(a);)
```

## Highlight Source Code

There is no actual benefit if we only transform a string into raw syntax trees, we need highlight source code first.

```javascript
import {tokenize} from '@otakustay/ssource-tokenizer';
import {refractor} from 'refractor';

const options = {
    highlight(source) {
        return refractor.highlight(source, 'javascript');
    },
};

const linesOfSyntax = tokenize(source, options);
```

After specifying a more detailed formatter, this time it outputs:

```
Line 1
  - node(keyword)
    - text(const)
  - text( a )
  - node(operator)
    - text(=)
  - text( )
  - node(number)
    - text(3)
  - node(punctuation)
    - text(;)
  - text()
Line 2
  - text()
  - node(console)
    - text(console)
  - node(punctuation)
    - text(.)
  - node(method)
    - text(log)
  - node(punctuation)
    - text(()
  - text(a)
  - node(punctuation)
    - text())
  - node(punctuation)
    - text(;)
```

We get syntax information in this tree.

Unlike native highlight tools like [highlight.js](https://www.npmjs.com/package/highlight.js) or [prismjs](https://www.npmjs.com/package/prismjs), this DOM independent data structure is easy to further manipulate and easy to customize on render.

## Manipulate Syntax

We can pass `enhancers` array to `options`:

```javascript
import {tokenize} from '@otakustay/ssource-tokenizer';

const options = {
    highlight() {
        // ...
    },
    enhancers: [
        someEnhancer,
        anotherEnhancer,
    ],
};

tokenize(source, options);
```

Currently 2 enhancers are natively exported.

### markWord

The `markWord` exported enhancer is able to pick a certain character or word from each token and wrap it inside a custom syntax node:

```typescript
function markWord(word: string, name: string, replacement: string = word): Enhancer;
```

```javascript
import {markWord} from '@otakustay/ssource-tokenizer';

const enhancers = [
    markWord('\t', 'tab', ' '.repeat(4)),
];
```

This example code is to mark all `\t` character and replace it with 4 spaces.

**We don't encourage you to replace a word with another in different length, if so, this enhancer should be placed at the last of others.**

**We can only mark a word inside a single token, if this word spans across multiple tokens, mark can fail.**

### pickRanges

Another utility is `pickRanges` which allows you to specify some range in each line, wrap them into a single custom node.

A `range` object specifies the line number, start column and range length, along with custom data attached via `properties` property:

```javascript
import {pickRanges} from '@otakustay/ssource-tokenizer';

const ranges = [
    {
        line: 1, // this is 1 based
        column: 2, // this is 0 based
        length: 4,
        properties: {
            type: 'reference',
            url: '/docs#foo',
        },
    },
];

const enhancers = [
    pickRanges(ranges),
];
```
