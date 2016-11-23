/* global require module __dirname*/

const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel',
      }, {
        test: /\.json$/,
        loader: 'json',
      }, {
        test: /\.rt\.html$/,
        loader: 'react-templates-loader?targetVersion=0.14.0',
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      d3: 'd3',
    }),
    new webpack.DefinePlugin({
      APP_ID: `"${process.env.APP_ID || '651280398386350'}"`,
      JS_ENV: JSON.stringify('client'),
    }),
  ],
  resolve: {
    alias: {
      api: `${__dirname}/../../api/test`,
      config: `${__dirname}/../../config/test`,
      models: `${__dirname}/../../models`,
      lib: `${__dirname}/../../lib`,
      shared: `${__dirname}/../../../shared`,
    },
  },
};
