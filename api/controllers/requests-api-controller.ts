import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection, WithId, ObjectId, Filter } from 'mongodb';
import RequestStates from '../constants/RequestStates';
import { z } from 'zod';
import { checkForCompleteRequest } from './../helpers/checkForCompleteRequest';
import { getUserInfo } from '../keycloak/utils';

// All functions use requests collection
const collection : Collection<RequestRecord> = db.collection<RequestRecord>('requests');

// Schema to check for document id when coming in as url params
const idSchema = z.string().length(24);

/**
 * @interface
 * @description The expected request stored in the 'requests' collection
 * @property {ObjectId}       _id             - The unique ID of a request record.
 * @property {boolean}        lateEntry       - Supplied by CHEFS. Only important if the CHEFS form has a due date.
 * @property {string}         firstName       - The first name of the requestor.
 * @property {string}         lastName        - The last name of the requestor.
 * @property {number}         employeeId      - The requestor's employee ID.
 * @property {string}         idir            - The requestor's IDIR code.
 * @property {Array}          purchases       - A list of Purchase items.
 * @property {Array}          approvals       -  A list of Approval items.
 * @property {boolean}        submit          - Supplied by CHEFS. True if submitted. Only important if CHEFS stores drafts.
 * @property {string}         submissionDate  - The date of the reimbursement submission.
 * @property {RequestStates}  state           - The current state of the request.
 */
export interface RequestRecord {
  _id: ObjectId,
  lateEntry: boolean,
  firstName: string,
  lastName: string,
  employeeId: number,
  idir: string,
  purchases: Array<object>,
  approvals: Array<object>,
  additionalComments: string,
  submit: boolean,
  submissionDate: string,
  state: RequestStates
}

/**
 * @constant
 * @description Allows for a reduced version of each document to be returned from Mongo. A true or 1 signifies that property will be included.
 */
const minimalProjection = {
  firstName: 1,
  lastName: 1,
  "purchases.cost": 1, // Format for getting specific properties of objects in an array
  "purchases.supplier": 1,
  submissionDate: 1,
  state: 1
}

/**
 * @description Gets all request records. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getAllRequests = async (req: Request, res: Response) => {
  const { minimal, before, after } = req.query;
  const latestPossibleDate = '3000-01-01';
  const earliestPossibleDate = '1970-01-01';
  // Query will filter out by date, but only if provided.
  const findQuery: Filter<RequestRecord> = {
    submissionDate: {
      $gte: after as string || earliestPossibleDate,
      $lt: before as string || latestPossibleDate
    }
  };

  try {
    const cursor = minimal === 'true'
                  ? collection.find(findQuery).sort({submissionDate: -1}).project(minimalProjection)
                  : collection.find(findQuery).sort({submissionDate: -1});
    const records = await cursor.toArray();
    // If there are no records.
    if (records.length === 0) {
      return res.status(404).send('No records found');
    }
    // If records are found.
    if (records){
      return res.status(200).json(records);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
}

/**
 * @description Get any request records matching a specific IDIR GUID. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getRequestsByIDIR = async (req: Request, res: Response) => {
  const { minimal, idir } = req.query;

  // If neither the IDIR matches nor the user is admin, return the 403
  const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
  const idirMatches = userInfo.idir_user_guid === idir;
  const isAdmin = userInfo.client_roles?.includes('admin');
  if (!idirMatches && !isAdmin) return res.status(403).send('Forbidden: User does not match requested IDIR.');

  try {
    const cursor = minimal === 'true'
                  ? collection.find({ idir: { $eq: idir as string }}).sort({submissionDate: -1}).project(minimalProjection)
                  : collection.find({ idir: { $eq: idir as string }}).sort({submissionDate: -1});
    const records = await cursor.toArray();

    // If there are no records.
    if (records.length === 0) {
      return res.status(404).send('No records found');
    }
    
    // If records are found.
    if (records){
      return res.status(200).json(records);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }
}

/**
 * @description Get a single request record by ID. Includes an option to retrieve records with projection.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with array of records or 404 if no records are found.
 */
export const getRequestByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e){
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  try {
    const record : WithId<RequestRecord> = await collection.findOne({ _id: { $eq: new ObjectId(id) } });
    if (!record){
      return res.status(404).send('No record with that ID found.');
    }
    if (record){
      // If neither the IDIR matches nor the user is admin, return the 403      
      const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
      const idirMatches = userInfo.idir_user_guid === record.idir;
      const isAdmin = userInfo.client_roles?.includes('admin');
      if (!idirMatches && !isAdmin) return res.status(403).send('Forbidden: User does not match requested record.');
      return res.status(200).json(record);
    }
  } catch (e) {
    console.warn(e);
    // Error response
    return res.status(400).send('Request could not be processed.');
  }  
}

/**
 * @description Updates the state of a specific request record. Also functions as the soft-delete option.
 * @param {Request}   req Incoming Request
 * @param {Response}  res Outgoing Response
 * @returns {Response}    200 status with a string indicating updated status.
 */
export const updateRequestState = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    employeeId,
    purchases,
    approvals,
    additionalComments,
    state,
    isAdmin
  } = req.body;

  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e){
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  // Establish the id that is used to find document
  const filter = { _id: { $eq: new ObjectId(id) } };

  // Check that state is a valid option
  if ( state < 0 || state >= RequestStates.__LENGTH) return res.status(403).send('An invalid state was requested.');

  // Get previous state of request
  const existingRequest : WithId<RequestRecord> = await collection.findOne(filter);

  if (existingRequest){
    // If neither the IDIR matches nor the user is admin, return the 403
    const userInfo = getUserInfo(req.headers.authorization.split(' ')[1]); // Excludes the 'Bearer' part of token.
    const idirMatches = userInfo.idir_user_guid === existingRequest.idir;
    const isAdmin = userInfo.client_roles?.includes('admin');
    if (!idirMatches && !isAdmin) return res.status(403).send('Forbidden: User does not match requested record.');
  }

  let refinedState = state;

  // If user isn't an admin, take control of the state update
  if (!isAdmin){
    // If request has all required fields and files
    if (checkForCompleteRequest({employeeId, purchases, approvals})){
      // If previous state was Incomplete, change it to Submitted
      if (existingRequest.state == RequestStates.INCOMPLETE){
        refinedState = RequestStates.SUBMITTED;
      }
    } else {
      // Otherwise, submission should be marked as Incomplete
      refinedState = RequestStates.INCOMPLETE;
    }
  } 

  // Create setting object
  let newProperties = {
    approvals: approvals || existingRequest.approvals,
    additionalComments: additionalComments || existingRequest.additionalComments,
    purchases: purchases || existingRequest.purchases,
    employeeId: employeeId || existingRequest.employeeId,
    state: refinedState === undefined || refinedState === null ? existingRequest.state : refinedState,
  }

  // Update the document
  const updateDoc = {
    $set: newProperties,
  };

  try {
    const result = await collection.updateOne(filter, updateDoc);
    // If no records matched that ID
    if (result.matchedCount === 0) return res.status(404).send('No matching record found.');
    // Else, return the updated result
    return res.status(200).send(`Request state updated to ${RequestStates[state]}.`);
  } catch (e) {
    console.warn(e);
    return res.status(400).send('Request could not be processed.');
  }
}
