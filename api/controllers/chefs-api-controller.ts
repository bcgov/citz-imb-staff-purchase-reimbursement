import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection } from 'mongodb';
import chefRequestSchema from '../schemas/chefRequestSchema';
import RequestStates from '../constants/RequestStates';
import { sendNewRequestNotification } from '../helpers/useGCNotify';
import Constants from '../constants/Constants';

/**
 * @interface
 * @description Extend the request to include data object from CHEFS
 * @property {object} data - The data object that contains info from CHEFS submission.
 */
interface ChefsRequest extends Request{
  body: Request['body'] & {
    data: object;
  },
}

/**
 * 
 * @param obj Any JS object
 * @returns The same object stripped of blank keys.
 * @description Removes keys with a blank string.
 */
const removeBlankKeys = (obj: object) => {
  Object.keys(obj).forEach((key: keyof object) => {
    if (obj[key] === '') delete obj[key];
  });
  return obj;
}

/**
 * @description Takes requests from the CHEFS service and submits them to the database.
 * @param req The incoming CHEFS request
 * @param res The outgoing response
 * @returns Response with status code and either text or JSON data
 */
const submitRequestHandler = async (req: ChefsRequest, res: Response) => {
  const { GC_NOTIFY_ADMIN_EMAIL } = process.env;
  const { TESTING, FRONTEND_URL } = Constants;
  
  let requestData = { ...req.body };
  try {
    // Remove properties that may be blank. Otherwise the validation does not pass for optional fields.
    requestData = removeBlankKeys(requestData);
    // Validate incoming data
    chefRequestSchema.parse(requestData);
  } catch (e) {
    if (e.issues) console.warn(e.issues);
    return res.status(400).send('Request has invalid or missing properties.');
  }
  
  // Add current timestamp and state to request
  const newPurchaseRequest = { 
    ...requestData, 
    submissionDate: new Date().toISOString(), 
    state: RequestStates.SUBMITTED 
  };
  // Insert request into collection
  const collection : Collection = db.collection('requests');
  const response = await collection.insertOne(newPurchaseRequest);
  // If insertedID exists, the insert was successful!
  if (response.insertedId) {
    if (!TESTING){
      sendNewRequestNotification(GC_NOTIFY_ADMIN_EMAIL, `${FRONTEND_URL}/request/${response.insertedId}`);
    }
    return res.status(201).json({ ...newPurchaseRequest, _id: response.insertedId });
  }
  // Generic error response
  return res.status(400).send('Reimbursement request was not successful.');
}

export { submitRequestHandler };
