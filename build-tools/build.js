/*eslint-env node*/
/*global console*/

import { argv } from 'yargs';
import webpack from 'webpack';
import path from 'path';

import FsHelper from './fs_helper';
import ViewCompiler from './view_compiler';

process.env.NODE_ENV = argv.env || 'development';

if (argv.local_api){
  process.env.API_BASE_URL = 'http://localhost:8082'
} else {
  process.env.API_BASE_URL = 'http://api.coolclimatenetwork.net'
}

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
