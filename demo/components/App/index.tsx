import {FC, useState, useMemo} from 'react';
import {highlight} from 'refractor';
import SourceInput from '../SourceInput';
import SyntaxTreeView from '../SyntaxTreeView';
import {tokenize, pickRanges} from '../../../src';
import {TokenizeOptions, SourceRange} from '../../../types';

const findKeywordRangesInLine = (source: string, keyword: string, start: number = 0): SourceRange[] => {
    const column = source.indexOf(keyword, start);

    if (column < 0) {
        return [];
    }

    const current: SourceRange = {
        type: 'keyword',
        line: 1,
        column: column,
        length: keyword.length,
    };
    const next = findKeywordRangesInLine(source, keyword, column + keyword.length);
    return [current, ...next];
};

const App: FC = () => {
    const [source, setSource] = useState('');
    const [keyword, setKeyword] = useState('');
    const ranges = useMemo(
        () => {
            if (!keyword) {
                return [];
            }

            return findKeywordRangesInLine(source, keyword);
        },
        [source, keyword]
    );
    const [syntax] = useMemo(
        () => {
            if (!source) {
                return [undefined];
            }

            const options: TokenizeOptions = {
                highlight(source) {
                    return highlight(source, 'javascript');
                },
                enhancers: [
                    pickRanges(ranges),
                ],
            };

            return tokenize(source, options);
        },
        [source, ranges]
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
};

export default App;
