import {configure} from '@reskript/settings';

export default configure(
    'webpack',
    {
        build: {
            appTitle: 'Source Tokenizer',
            uses: [],
        },
        devServer: {
            port: 8621,
        },
    }
);
