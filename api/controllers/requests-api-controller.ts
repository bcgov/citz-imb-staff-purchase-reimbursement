import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection } from 'mongodb';
import RequestStates from '../constants/RequestStates';

// All functions use requests collection
const collection : Collection = db.collection('requests');

// Get all request records
export const getAllRequests = async (req: Request, res: Response) => {
  // TODO: Is there a more memory-efficient solution?
  const cursor = collection.find();
  const records = await cursor.toArray();
  // If there are no records.
  if (records.length === 0) {
    return res.status(404).send('No records found');
  }
  // If records are found.
  if (records){
    return res.status(200).json(records);
  }
  // Error response
  return res.status(400).send('Request could not be processed.');
}

// Get any request records matching a specific IDIR GUID
export const getRequestsByIDIR = async (req: Request, res: Response) => {

}

// Get a single request record by ID
export const getRequestByID = async (req: Request, res: Response) => {

}

// Gets all request records, but only the basic information of each
export const getRequestsBasic = async (req: Request, res: Response) => {

}

// Update the state of a specific request record
// Also functions as the soft-delete option
export const updateRequestState = async (req: Request, res: Response) => {
  
}
