import 'dotenv/config.js';
import express, { NextFunction, Response } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Constants from './constants/Constants';
import { keycloakInit, middleware as protect } from './keycloak/index';
import openRouter from './routes/open/index';
import protectedRouter from './routes/protected/index';

const app: express.Application = express();
keycloakInit(app);

const { HOSTNAME, API_PORT } = Constants;

// Swagger Configuration
const OPENAPI_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Purchase Reimbursement API',
      version: '1.0.0',
      description: 'Documentation for the Purchase Reimbursement API.',
    },
    servers: [{ url: `http://${HOSTNAME}:${API_PORT}/api` }],
  },
  apis: ['./docs/*.yaml'],
};

// Express Rate Limiter Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev')); // logging middleware
app.use(cors());
app.use(limiter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(OPENAPI_OPTIONS)));

// Routing Open Routes
app.use('/api', openRouter.chefsRouter);
app.use('/api', openRouter.healthRouter);

// Routing Protected Routes
// Allow for removed protection when API testing
const routeProtector: (any | Promise<Response<any, Record<string, any>>>) = `${process.env.TESTING}`.toLowerCase() === 'true' ? (request: Request, response: Response, next: NextFunction) => { next(); } : protect;
// TODO: Remove test route after demo
app.use('/api', routeProtector, protectedRouter.keycloakTest);


export default app;
