import express from 'express';
import { postTest } from '../controllers/chefs-api-controller.js';
import { healthCheck } from '../controllers/health-api-controller.js';
const router = express.Router();

// Health-check endpoints
router.route('/health')
    .get(healthCheck);

// CHEFS endpoints
router.route('/chefs')
    .post(postTest);

export default router;
