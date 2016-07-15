/*global process __dirname require*/

import path from 'path';
import { argv } from 'yargs';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (argv.local_api){
  process.env.API_BASE_URL = 'http://localhost:8082'
} else {
  process.env.API_BASE_URL = 'http://api.coolclimatenetwork.net'
}

var env_server_path = path.join(__dirname, 'config', process.env.NODE_ENV.toLowerCase(), 'server'),
    env_server_class = require(env_server_path).default,
    server = new env_server_class();

server.run();
