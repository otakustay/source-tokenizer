import {RefractorNode} from 'refractor';
import {HighlightSource} from '../interface';

export interface RootNode {
    type: 'root';
    children: RefractorNode[];
}

const createRoot = (children: RefractorNode[]): RootNode => ({children, type: 'root'});

export default (source: string, highlight?: HighlightSource): RootNode => {
    if (highlight) {
        return createRoot(highlight(source));
    }

    return createRoot([{type: 'text', value: source}]);
};
