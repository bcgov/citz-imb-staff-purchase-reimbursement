import express from 'express';
import { healthCheck } from '../../controllers/health-api-controller.js';

const router = express.Router();

router.route('/keycloakTest')
  .get(healthCheck);

export default router;
