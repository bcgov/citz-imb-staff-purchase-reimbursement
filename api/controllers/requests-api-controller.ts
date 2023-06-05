import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection, WithId, ObjectId } from 'mongodb';
import RequestStates from '../constants/RequestStates';
import { z } from 'zod';

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
 * @param req Incoming Request
 * @param res Outgoing Response
 * @returns 200 status with array of records or 404 if no records are found.
 */
export const getAllRequests = async (req: Request, res: Response) => {
  const { minimal } = req.query;
  try {
    // TODO: Is there a more memory-efficient solution? Like only returning the first X records?
    const cursor = minimal === 'true'
                  ? collection.find().sort({submissionDate: -1}).project(minimalProjection)
                  : collection.find().sort({submissionDate: -1});
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
 * @param req Incoming Request
 * @param res Outgoing Response
 * @returns 200 status with array of records or 404 if no records are found.
 */
export const getRequestsByIDIR = async (req: Request, res: Response) => {
  const { minimal, idir } = req.query;
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
 * @param req Incoming Request
 * @param res Outgoing Response
 * @returns 200 status with array of records or 404 if no records are found.
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
 * @param req Incoming Request
 * @param res Outgoing Response
 * @returns 200 status with a string indicating updated status.
 */
export const updateRequestState = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    employeeId,
    purchases,
    approvals,
    additionalComments,
    state 
  } = req.body;

  // If ID doesn't match schema, return a 400
  try {
    idSchema.parse(id);
  } catch (e){
    return res.status(400).send('ID was malformed. Cannot complete request.');
  }

  // Check that state is a valid option
  if ( state < 0 || state >= RequestStates.__LENGTH) return res.status(403).send('An invalid state was requested.');
  // Establish that id is used to find document
  const filter = { _id: { $eq: new ObjectId(id) } };
  // Update the document
  const updateDoc = {
    $set: {
      approvals: approvals,
      additionalComments: additionalComments,
      purchases: purchases,
      employeeId: employeeId,
      state: state,
    },
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
