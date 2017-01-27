/* global console*/
/* eslint no-console: ["error", { allow: ["info"] }] */

import express from 'express';
import favicon from 'serve-favicon';

const APP_PORT = process.env.PORT || 3000;

class Server {

  constructor() {
    const server = this;

    server.app = express();
  }

  config() {
    const server = this;
    const app = server.app;

    app.use('/assets', express.static(`${__dirname}/../../../build/production/assets`));
    app.use('/assets/font-awesome', express.static(`${__dirname}/../../../node_modules/font-awesome`));
    app.use(favicon(`${__dirname}/../../assets/favicon.ico`));

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

    server.app.listen(APP_PORT, () => {
      console.info(`Production app is now running on http://localhost:${APP_PORT}`);
    });
  }

}

export default Server;
