import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SecurityRoutes from '../security/security.routes';
import RegistrationRoutes from '../registration/registration.routes';
import UserSettingsRoutes from '../user/settings/userSetting.routes';
import UserInformationRoutes from '../user/information/userInformation.routes';
import NotificationsRoutes from '../user/settings/notifications/notifications.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json';

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
    this.app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
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
]).app;
