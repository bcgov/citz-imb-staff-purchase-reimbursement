import express from 'express';
import { healthCheck } from '../controllers/health-api-controller.js';

const router = express.Router();

// Health-check endpoints
router.route('/health')
    .get(healthCheck);

export default router;
