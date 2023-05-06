import express from 'express';
import { getAllRequests, getRequestsByIDIR, getRequestByID, updateRequestState } from '../../controllers/requests-api-controller';

const router = express.Router();

router.route('/requests')
  .get(getAllRequests);

router.route('/requests/idir')
  .get(getRequestsByIDIR);

router.route('/requests/:id')
  .get(getRequestByID)
  .patch(updateRequestState);

export default router;
