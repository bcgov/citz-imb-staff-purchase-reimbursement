import express from 'express';
import { swaggerRedirect } from '../../controllers/swagger-redirect-controller';

const router = express.Router();

// Redirect from root
router.route('/')
  .get(swaggerRedirect);

// Redirect from api-docs
router.route('/api-docs')
  .get(swaggerRedirect);

export default router;
