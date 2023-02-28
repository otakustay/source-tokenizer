import {Enhancer, WorkingLineOfTokenPath, WorkingTokenPath} from '../interface.js';
import {flatMapPaths} from '../utils/internal.js';

function markInPaths(word: string, markType: string, replacement: string) {
    return (paths: WorkingLineOfTokenPath) => flatMapPaths(
        paths,
        path => {
            const [parents, text] = path;

            if (!text.includes(word)) {
                return path;
            }

            const segments = text.split(word);

            return segments.reduce(
                (output: WorkingTokenPath[], text: string, i: number) => {
                    // Insert a `replacement` string between every 2 split segments.
                    if (i !== 0) {
                        const path: WorkingTokenPath = [
                            [...parents, {type: 'mark', properties: {markType}}],
                            replacement,
                        ];
                        output.push(path);
                    }

                    if (text) {
                        const path: WorkingTokenPath = [parents, text];
                        output.push(path);
                    }

                    return output;
                },
                []
            );
        }
    );
}

export function markWord(word: string, name: string, replacement: string = word): Enhancer {
    const mark = markInPaths(word, name, replacement);

    return lines => lines.map(mark);
}
