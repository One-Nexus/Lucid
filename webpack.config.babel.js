import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default function() {
    return {
        entry: {
            'lucid': './src/index.js',
            'lucid.min': './src/index.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].js',
            publicPath: '/',
            libraryTarget: 'commonjs2'
        },

        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    include: /\.min\.js$/,
                    uglifyOptions: {
                        output: {
                            comments: false
                        }
                    }
                })
            ]
        },

        externals: {
            'react': 'react',
            'react-dom': 'react-dom'
        },

        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                resolve: { 
                    extensions: ['.js', '.jsx'] 
                },
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }]
        },

        node: {
            process: false,
            Buffer: false
        },

        stats: { colors: true },

        devtool: false
    }
};