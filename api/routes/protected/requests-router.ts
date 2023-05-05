import express from 'express';
import { getAllRequests, getRequestsByIDIR, getRequestByID, updateRequestState, getRequestsBasic } from '../../controllers/requests-api-controller';

const router = express.Router();

router.route('/requests')
  .get(getAllRequests);

router.route('/requests/:idir')
  .get(getRequestsByIDIR);

router.route('/requests/:id')
  .get(getRequestByID)
  .patch(updateRequestState);

router.route('/requests/basic')
  .get(getRequestsBasic);

export default router;
