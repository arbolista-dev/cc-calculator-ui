/* global console*/
/* eslint global-require: "warn"*/
/* eslint import/no-dynamic-require: "warn"*/

import { argv } from 'yargs';
import webpack from 'webpack';

process.env.NODE_ENV = argv.env || 'development';
if (process.env.BUILD_ENV === 'development') {
  process.env.APP_ID = '748881798637990';
} else if (process.env.BUILD_ENV === 'staging') {
  process.env.APP_ID = '727303084145021';
} else {
  process.env.APP_ID = '651280398386350';
}

if (argv.local_api) {
  process.env.API_BASE_URL = 'http://localhost:8082';
} else {
  // This assumes a proxy intercept requests and divert to cc-user-api app.
  process.env.API_BASE_URL = 'https://calculator.coolclimatenetwork.net';
}

export default function build(options, done) {
    // build assets/app.js and assets/style.css with webpack
  const config = require(`${__dirname}/../client/config/webpack/${process.env.NODE_ENV}`);
  webpack(config, (err) => {
    if (err) {
      console.error('=== Error building webpack config ===');
      console.error(err);
    }
    return done();
  });
}
