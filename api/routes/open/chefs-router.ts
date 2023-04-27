import express from 'express';
import { submitRequestHandler } from '../../controllers/chefs-api-controller';

const router = express.Router();

// CHEFS endpoints
router.route('/requests')
  .post(submitRequestHandler);

export default router;
