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

const app = express();

// Swagger Configuration
const OPENAPI_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Purchase Reimbursement API',
      version: '1.0.0',
      description: 'Documentation for the Purchase Reimbursement API.',
    },
    servers: [{ url: `http://${Constants.HOSTNAME}:${Constants.PORT}` }],
  },
  apis: ['./docs/*.yaml'],
};

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev')); // logging middleware
app.use(cors());
app.use(rateLimit());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(OPENAPI_OPTIONS)));

// Routing
app.use('/api', apiRouter);

export default app;
