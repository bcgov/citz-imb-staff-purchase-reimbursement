import express from 'express';
import { submitRequestHandler } from '../controllers/chefs-api-controller.js';
import { healthCheck } from '../controllers/health-api-controller.js';

const router = express.Router();

// Health-check endpoints
router.route('/health')
    .get(healthCheck);

// CHEFS endpoints
router.route('/requests')
    .post(submitRequestHandler);

export default router;
