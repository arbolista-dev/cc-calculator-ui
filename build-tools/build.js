/*eslint-env node*/
/*global console*/

import yargs from 'yargs';
import webpack from 'webpack';
import path from 'path';

import FsHelper from './fs_helper';
import ViewCompiler from './view_compiler';

process.env.NODE_ENV = yargs.argv.env || 'development';

export default function build(options, done){
  // build assets/app.js and assets/style.css with webpack
  let config = require(__dirname + `/../client/config/webpack/${process.env.NODE_ENV}`);
  webpack(config, function(err, _stats) {
    if (err){
      console.error('=== Error building webpack config ===')
      console.error(err);
      return done();
    }

    if (process.env.NODE_ENV === 'design') copyDesignApp(done);
  });
}
