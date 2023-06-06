import express from 'express';
import { getAllRequests, getRequestsByIDIR, getRequestByID, updateRequestState } from '../../controllers/requests-api-controller';

const router = express.Router();

// All requests
router.route('/requests')
  .get(getAllRequests);

// Requests from a single IDIR
router.route('/requests/idir')
  .get(getRequestsByIDIR);

// Request by a specific ID
router.route('/requests/:id')
  .get(getRequestByID)
  .patch(updateRequestState);

export default router;
