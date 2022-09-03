/* eslint-disable no-console */
import express, { Application, Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SecurityController from '../security/security.controller';
import SecurityService from '../security/security.service';
import SecurityRoutes from '../security/security.routes';

interface Route {
  router: Router;
}

class App {
  public app: express.Application;

  public router: Router;

  constructor(routes: Route[]) {
    this.app = express();
    this.router = express.Router();
    this.set_config();
    this.initializeRoutes(routes);
  }

  private set_config() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use('/', this.router);
    this.app.use(express.static('static'));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }
}

export default new App([new SecurityRoutes()]).app;
