'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'public'),
  entry: './stylesheets/style.scss',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'style.css'
  },

  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'autoprefixer', 'sass')
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('style.css')
  ]
};
