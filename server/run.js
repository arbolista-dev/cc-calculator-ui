/*global process __dirname require*/

import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var env_server_path = path.join(__dirname, 'config', process.env.NODE_ENV.toLowerCase(), 'server'),
    env_server_class = require(env_server_path).default,
    server = new env_server_class();

server.run();
