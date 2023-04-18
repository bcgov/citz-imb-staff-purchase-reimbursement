import 'dotenv/config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from './routes/api-router.js';
import rateLimit from 'express-rate-limit';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Constants from './constants/Constants.js';
import { keycloakInit } from './keycloak/index.js';
import { middleware as protect } from './keycloak/index.js';

// TODO: delete after test
import { healthCheck } from './controllers/health-api-controller.js';

const app = express();
keycloakInit(app);

// Swagger Configuration
const OPENAPI_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Purchase Reimbursement API',
      version: '1.0.0',
      description: 'Documentation for the Purchase Reimbursement API.',
    },
    servers: [{ url: `http://${Constants.HOSTNAME}:${Constants.PORT}/api` }],
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

// Keycloak test

// Protected Endpoints
const keycloakRouter = express.Router();

keycloakRouter.route('/test')
  .get(healthCheck);

app.use('/keycloak', protect, keycloakRouter);

// Routing
app.use('/api', apiRouter);

export default app;
