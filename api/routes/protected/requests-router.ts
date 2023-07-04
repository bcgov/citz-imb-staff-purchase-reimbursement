import express from 'express';
import {
  getAllRequests,
  getRequestsByIDIR,
  getRequestByID,
  updateRequestState,
  getFile,
} from '../../controllers/requests-api-controller';

const router = express.Router();

// All requests
router.route('/requests').get(getAllRequests);

// Requests from a single IDIR
router.route('/requests/idir').get(getRequestsByIDIR);

// Request by a specific ID
router.route('/requests/:id').get(getRequestByID).patch(updateRequestState);

// File retrievals
router.route('/requests/:id/files').get(getFile);

export default router;
