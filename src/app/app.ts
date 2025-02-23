import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import SecurityRoutes from '../security/security.routes';
import RegistrationRoutes from '../registration/registration.routes';
import UserSettingsRoutes from '../user/settings/userSettings.routes';
import UserInformationRoutes from '../user/information/userInformation.routes';
import NotificationsRoutes from '../user/settings/notifications/notifications.routes';
import cookieParser from 'cookie-parser';
import LoginRoutes from '../login/login.routes';
import { staticPath } from '../config';

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
    this.app.use(cookieParser());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.static(staticPath));
    this.app.use(
      fileUpload({
        limits: {
          fileSize: 2000000,
        },
        abortOnLimit: true,
      })
    );
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }
}

export default new App([
  new SecurityRoutes(),
  new RegistrationRoutes(),
  new NotificationsRoutes(),
  new UserSettingsRoutes(),
  new UserInformationRoutes(),
  new LoginRoutes(),
]).app;
