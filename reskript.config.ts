import {configure} from '@reskript/settings';

export default configure(
    'webpack',
    {
        build: {
            uses: [],
        },
        devServer: {
            port: 8621,
        },
    }
);
