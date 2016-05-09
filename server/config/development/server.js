/*global console*/

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import logger from 'morgan';
import express from 'express';

import config from './../../../client/config/webpack/development';

const APP_PORT = 3000;

class Server {

  constructor(){
    var server = this;
    server.dev_server = new WebpackDevServer(webpack(config), {
      contentBase: './../build/development',
      publicPath: '/assets/',
      stats: {colors: true}
    });

    server.app = server.dev_server.app;
  }

  config() {
    var server = this,
        app = server.app;

    // serve public static files.
    app.use('/', express.static(__dirname + '/../../../build/development/' + process.env.NODE_ENV.toLowerCase()));
    app.use('/assets', express.static(__dirname + '/../../assets'));

    app.use(logger('dev'));

    // view engine set up
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../../views');

    app.get('*', (_req, res, _next)=>{
      res.set('Content-Type', 'text/html');
      res.render('index', {});
    });
  }


  run(){
    var server = this;
    server.config();

    server.dev_server.listen(APP_PORT, () => {
      console.info(`App is now running on http://localhost:${APP_PORT}`);
    });
  }

}

export default Server;
