import {FC, useState, useMemo, useCallback} from 'react';
import {highlight} from 'refractor';
import {Checkbox} from 'antd';
import SourceInput from '../SourceInput';
import SyntaxTreeView from '../SyntaxTreeView';
import {tokenize, markWord} from '../../../src';
import {TokenizeOptions} from '../../../types';

const App: FC = () => {
    const [source, setSource] = useState('');
    const [highlightWhiteSpace, setHighlightWhiteSpace] = useState(false);
    const toggleHighlightWhiteSpace = useCallback(e => setHighlightWhiteSpace(e.target.checked), []);
    const [syntax] = useMemo(
        () => {
            if (!source) {
                return [undefined];
            }

            const options: TokenizeOptions = {
                highlight(source) {
                    return highlight(source, 'javascript');
                },
                enhancers: highlightWhiteSpace ? [markWord(' ', 'space')] : [],
            };

            return tokenize(source, options);
        },
        [source, highlightWhiteSpace]
    );

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', padding: 10}}>
            <SourceInput style={{marginBottom: 20}} onSubmit={setSource} />
            <div style={{marginBottom: 20}}>
                <Checkbox checked={highlightWhiteSpace} onChange={toggleHighlightWhiteSpace}>
                    Highlight Spaces
                </Checkbox>
            </div>
            <SyntaxTreeView style={{flex: 1, width: '100%'}} syntax={syntax} />
        </div>
    );
};

export default App;
