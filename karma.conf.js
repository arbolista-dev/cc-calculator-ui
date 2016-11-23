/* global module require*/

const webpack_config = require('./client/config/webpack/test');


const PREPROCESSORS = ['babel', 'webpack', 'sourcemap'];

module.exports = function (config) {
  config.set({
    browsers: ['Firefox'],
    basePath: './',
    babelPreprocessor: {
      options: {
        presets: ['es2015', 'react'],
      },
    },
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'client/**/*.test.js',
      'shared/**/*.test.js',
    ],
    frameworks: [
      'jasmine',
    ],
    reporters: ['dots', 'progress'],
    webpack: webpack_config,
    webpackMiddleware: {
      // info is too chatty - it obscures test information
      noInfo: true,
      stats: {
        chunks: false,
      },
    },
    preprocessors: {
      'client/**/*.test.js': PREPROCESSORS,
      'shared/**/*.test.js': PREPROCESSORS,
    },
    customLaunchers: {
      ChromeSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
  });
};
