/* eslint-disable no-console */
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SecurityRoutes from '../security/security.routes';
import RegistrationRoutes from '../registration/registration.routes';
import NotificationsRoutes from '../user/settings/notifications/notifications.route';
import UserSettingsRoutes from '../user/settings/userSetting.routes';

interface Route {
  router: Router;
}

class App {
  public app: express.Application;

  constructor(routes: Route[]) {
    this.app = express();
    this.set_config();
    this.initializeRoutes(routes);
  }

  private set_config() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.static('static'));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }
}

export default new App([new SecurityRoutes(), new RegistrationRoutes(), new UserSettingsRoutes()]).app;
