import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection, WithId, ObjectId } from 'mongodb';
import RequestStates from '../constants/RequestStates';

// All functions use requests collection
const collection : Collection<RequestRecord> = db.collection<RequestRecord>('requests');

// The record expected from the requests collection
export interface RequestRecord {
  _id: ObjectId,
  lateEntry: boolean,
  firstName: string,
  lastName: string,
  employeeId: number,
  idir: string,
  itemsPurchased: Array<string>,
  totalCost: number,
  purchaseDate: string,
  attachReceipts: Array<object>,
  approvalDate: string,
  attachApproval: Array<object>,
  submit: boolean,
  submissionDate: string,
  state: RequestStates
}

// Allows for a reduced version of each document to be returned from Mongo
const minimalProjection = {
  firstName: 1,
  lastName: 1,
  itemsPurchased: 1,
  totalCost: 1,
  purchaseDate: 1,
  submissionDate: 1,
  state: 1
}

// Get all request records
export const getAllRequests = async (req: Request, res: Response) => {
  const { minimal } = req.body;
  try {
    // TODO: Is there a more memory-efficient solution? Like only returning the first X records?
    const cursor = minimal === true
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

// Get any request records matching a specific IDIR GUID
export const getRequestsByIDIR = async (req: Request, res: Response) => {
  const { minimal } = req.body;
  try {
    const cursor = minimal === true
                  ? collection.find({ idir: { $eq: req.body.idir }}).sort({submissionDate: -1}).project(minimalProjection)
                  : collection.find({ idir: { $eq: req.body.idir }}).sort({submissionDate: -1});
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

// Get a single request record by ID
export const getRequestByID = async (req: Request, res: Response) => {
  const { id } = req.params;
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

// Update the state of a specific request record
// Also functions as the soft-delete option
export const updateRequestState = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { state } = req.body;
  // Check that state is a valid option
  if ( state < 0 || state >= RequestStates.__LENGTH) return res.status(403).send('An invalid state was requested.');
  // Establish that id is used to find document
  const filter = { _id: { $eq: new ObjectId(id) } };
  // Update its state
  const updateDoc = {
    $set: {
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
