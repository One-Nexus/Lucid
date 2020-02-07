import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default function() {
  return {
    entry: {
      'lucid': './src/index.js',
      'lucid.min': './src/index.js'
    },

    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },

    resolve: { 
      extensions: ['.js', '.jsx'] 
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
      'react': 'React',
      'react-dom': 'ReactDOM'
    },

    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: (MODULE) => ~MODULE.indexOf('/node_modules/') && !(~MODULE.indexOf('/@onenexus/')),
        loader: 'babel-loader'
      }]
    },

    node: {
      process: false,
      Buffer: false
    }
  }
}