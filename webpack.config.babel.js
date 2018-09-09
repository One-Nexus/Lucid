import path from 'path';

export default function() {
    return {
        entry: {
            'lucid': './src/index.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].js',
            publicPath: '/',
            libraryTarget: 'commonjs2'
        },

        target: 'node',

        externals: {
            'react': 'react',
            'react-dom': 'react-dom',
            'prop-types': 'prop-types'
        },

        module: {
            loaders: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            }]
        },

        stats: { colors: true },

        devtool: false
    }
};