import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import oauthRouter from './routes';

// The token and user properties are not a part of the Request object by default.
declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: object;
    }
  }
}

export interface IKeycloakUser {
  idir_user_guid?: string;
  identity_provider?: string;
  idir_username?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  display_name?: string;
  family_name?: string;
  client_roles?: string[];
}

export interface IKeycloakInitOptions {
  afterUserLogin?: (userInfo: IKeycloakUser) => void;
}

export { default as middleware } from './middleware';

export const keycloakInit = (app: Application, options?: IKeycloakInitOptions) => {
  /**
   * Middleware for parsing request bodies.
   * @module body-parser
   * @property {Function} urlencodedParser - Middleware for parsing URL-encoded data from the request body.
   * @property {Function} jsonParser - Middleware for parsing JSON data from the request body.
   */
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  /**
   * Sets the default view engine for the application to EJS (Embedded JavaScript).
   *
   * The `view engine` setting is used by Express to automatically render views
   * with the specified engine. By setting it to EJS, you can use EJS templates
   * to generate HTML output in your application.
   */
  app.set('view engine', 'ejs');

  // Allows for use of req.cookies
  app.use(cookieParser());

  // Routes defined in ./routes.js file.
  app.use('/oauth', oauthRouter(options));
};
