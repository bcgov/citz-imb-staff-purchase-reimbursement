import express from 'express';
import { swaggerRedirect } from '../../controllers/swagger-redirect-controller';

const router = express.Router();

router.route('/')
  .get(swaggerRedirect);

router.route('/api-docs')
  .get(swaggerRedirect);

export default router;
