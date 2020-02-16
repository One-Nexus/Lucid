import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default () => ({
  entry: {
    'lucid': './src/index.js',
    'lucid.min': './src/index.js'
  },

  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },

  externals: {
    'react': 'react',
    'react-dom' : 'reactDOM'
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
});