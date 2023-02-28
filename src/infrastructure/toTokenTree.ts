import {HighlightSource, InputRootNode} from '../interface.js';

export default function toTokenTree(source: string, highlight?: HighlightSource): InputRootNode {
    if (highlight) {
        return highlight(source);
    }

    return {
        type: 'root',
        children: [
            {type: 'text', value: source},
        ],
    };
}
