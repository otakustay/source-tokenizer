import {useState, useMemo} from 'react';
import {highlight} from 'refractor';
import {controlled, pickRanges, SourceRange} from '@otakustay/source-tokenizer';
import SourceInput from '../SourceInput/index.js';
import SyntaxTreeView from '../SyntaxTreeView/index.js';

const findKeywordRangesInLine = (source: string, keyword: string, start: number = 0): SourceRange[] => {
    const column = source.indexOf(keyword, start);

    if (column < 0) {
        return [];
    }

    const current: SourceRange = {
        type: 'search',
        line: 1,
        column: column,
        length: keyword.length,
    };
    const next = findKeywordRangesInLine(source, keyword, column + keyword.length);
    return [current, ...next];
};

export default function App() {
    const [source, setSource] = useState('');
    const [keyword, setKeyword] = useState('');
    const controllerWithHighlight = useMemo(
        () => {
            if (!source) {
                return null;
            }

            return controlled(source, source => highlight(source, 'javascript')).compress();
        },
        [source]
    );
    const [syntax] = useMemo(
        () => {
            if (!controllerWithHighlight) {
                return [];
            }

            if (!keyword) {
                return controllerWithHighlight.toSyntax();
            }

            const ranges = findKeywordRangesInLine(source, keyword);
            return controllerWithHighlight.enhance(pickRanges(ranges)).toSyntax();
        },
        [controllerWithHighlight, source, keyword]
    );

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', padding: 10}}>
            <SourceInput
                placeholder="Type a single line of source code"
                submitText="Tokenize"
                style={{marginBottom: 20}}
                onSubmit={setSource}
            />
            <SourceInput
                disabled={!source}
                placeholder="Type keyword to search in syntax tree"
                submitText="Highlight"
                style={{marginBottom: 20}}
                onSubmit={setKeyword}
            />
            <SyntaxTreeView style={{flex: 1, width: '100%'}} syntax={syntax} />
        </div>
    );
}
