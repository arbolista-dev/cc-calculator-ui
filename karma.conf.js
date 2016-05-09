/*global module require*/

var webpack_config = require('./client/config/webpack/test');

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    files: [
      'test.client.js'
    ],
    basePath: './',
    frameworks: [
      'jasmine'
    ],
    preprocessors: {
      'test.client.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots','progress'],
    webpack: webpack_config,
    webpackMiddleware: {
      // info is too chatty - it obscures test information
      noInfo: true
    }
  });
};
