/*global require module __dirname*/

var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    preLoaders: [
      {
        test: /\.test\.js$/,
        include: /(client|shared)/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ],
    loaders: [
      {
        test: /^((?!test\.js$).)*\.js$/,
        include: /(client|shared|server)/,
        exclude: /node_modules/,
        loader: 'babel'
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  resolve: {
    alias: {
      api: __dirname + '/../../api/test',
      config: __dirname + '/../../config/test',
      models: __dirname + '/../../models',
      lib: __dirname + '/../../lib',
      shared: __dirname + '/../../../shared'
    }
  }
};
