import {RefractorNode} from 'refractor';
import {TokenizeOptions} from '../../types';

export interface RootNode {
    type: 'root';
    children: RefractorNode[];
}

const createRoot = (children: RefractorNode[]): RootNode => ({children, type: 'root'});

export default (source: string, {highlight}: TokenizeOptions): RootNode => {
    if (highlight) {
        return createRoot(highlight(source));
    }

    return createRoot([{type: 'text', value: source}]);
};
