import {LineOfTokenPath, Enhancer, TokenPath} from '../interface.js';
import {flatMapPaths} from '../utils/internal.js';

const markInPaths = (word: string, markType: string, replacement: string) => (paths: LineOfTokenPath) => flatMapPaths(
    paths,
    path => {
        const [parents, text] = path;

        if (!text.includes(word)) {
            return path;
        }

        const segments = text.split(word);

        return segments.reduce(
            (output: TokenPath[], text: string, i: number) => {
                // Insert a `replacement` string between every 2 split segments.
                if (i !== 0) {
                    const path: TokenPath = [
                        [...parents, {type: 'mark', properties: {markType}}],
                        replacement,
                    ];
                    output.push(path);
                }

                if (text) {
                    const path: TokenPath = [parents, text];
                    output.push(path);
                }

                return output;
            },
            []
        );
    }
);

export const markWord = (word: string, name: string, replacement: string = word): Enhancer => {
    const mark = markInPaths(word, name, replacement);

    return lines => lines.map(mark);
};
