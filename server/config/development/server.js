/* global console*/
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: ["error", { allow: ["info"] }] */


import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import logger from 'morgan';
import express from 'express';

import config from './../../../client/config/webpack/development';

const APP_PORT = 3000;

class Server {

  constructor() {
    const server = this;
    server.dev_server = new WebpackDevServer(webpack(config), {
      contentBase: './../../../client/build/development',
      publicPath: '/assets/',
      stats: { colors: true },
    });

    server.app = server.dev_server.app;
  }

  config() {
    const server = this;
    const app = server.app;

    // serve public static files.
    app.use('/assets', express.static(`${__dirname}/../../assets`));
    app.use('/assets/font-awesome', express.static(`${__dirname}/../../../node_modules/font-awesome`));

    app.use(logger('dev'));

    // view engine set up
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/../../views`);

    app.get('*', (_req, res) => {
      res.set('Content-Type', 'text/html');
      res.render('index', {});
    });
  }


  run() {
    const server = this;
    server.config();

    server.dev_server.listen(APP_PORT, () => {
      console.info(`App is now running on http://localhost:${APP_PORT}`);
    });
  }

}

export default Server;
