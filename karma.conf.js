/* global module require*/

const webpack_config = require('./client/config/webpack/test');


const PREPROCESSORS = ['babel', 'webpack', 'sourcemap'];

module.exports = (config) => {
  config.set({
    browsers: ['Firefox', 'ChromeSandbox'],
    basePath: './',
    babelPreprocessor: {
      options: {
        presets: ['es2015', 'react'],
      },
    },
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
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
