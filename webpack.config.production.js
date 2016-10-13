const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
  debug: true,
  devtool: 'source-map',
  noInfo: true,
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  entry: [
    path.resolve(__dirname, './public/index'),
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        babelrc: false,
        query: {
          plugins: [
            'transform-react-remove-prop-types'
          ],
          presets: ['react', 'latest', 'stage-0'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: 'url?name=[name].[ext]',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[ext]',
      },
      {
        test: /\.ttf(\?v=\d+.\d+.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[ext]',
      },
      {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss!sass?sourceMap'),
      },
    ],
  },
  postcss: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'IE > 10'],
    }),
  ],
  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      isDev: process.env.NODE_ENV === 'development',
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
