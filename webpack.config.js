const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [{
      test: /\.json$/,
      include: path.join(__dirname, 'node_modules', 'pixi.js'),
      loader: 'json',
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }],
  },
}
