import db from '../db/conn';
import { Request, Response } from 'express';
import { Collection } from 'mongodb';

// Extend the request to include data object from CHEFS
interface ChefsRequest extends Request{
  body: Request['body'] & {
    data: object;
  }
}

const submitRequestHandler = async (req: ChefsRequest, res: Response) => {
  // TODO: Determine how incoming requests will be validated.
  // Add current timestamp to request
  const newPurchaseRequest = { ...req.body.data, submissionDate: new Date().toISOString() }
  const collection : Collection = db.collection('requests');
  const response = await collection.insertOne(newPurchaseRequest);
  // If insertedID exists, the insert was successful!
  if (response.insertedId) {
    return res.status(201).json({ ...newPurchaseRequest, _id: response.insertedId });
  }
  // TODO: Adjust error responses after request validation has been implemented.
  return res.status(400).send('Reimbursement request was not successful.');
}

export { submitRequestHandler };
