/* global process __dirname require*/
/* eslint import/no-dynamic-require: 0 */


import path from 'path';
import { argv } from 'yargs';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development' && !argv.production_api) {
  process.env.API_BASE_URL = 'http://localhost:8082';
  process.env.APP_ID = '748881798637990';
} else {
  process.env.API_BASE_URL = 'https://calculator.coolclimatenetwork.net';
  process.env.APP_ID = '256022044874141';
}

const envServerPath = path.join(__dirname, 'config', process.env.NODE_ENV.toLowerCase(), 'server');
const EnvServerClass = require(envServerPath).default;

const server = new EnvServerClass();

server.run();
