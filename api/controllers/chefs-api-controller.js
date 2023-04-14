import db from '../db/conn.js';

const submitRequestHandler = async (req, res) => {
  // TODO: Determine how incoming requests will be validated.
  // Add current timestamp to request
  let newPurchaseRequest = { ...req.body.data, submissionDate: new Date().toISOString() }
  const collection = db.collection('requests');
  const response = await collection.insertOne(newPurchaseRequest);
  // If insertedID exists, the insert was successful!
  if (response.insertedId) {
    return res.status(201).json({ ...newPurchaseRequest, _id: response.insertedId });
  }
  // TODO: Adjust error responses after request validation has been implemented. 
  return res.status(400).send('Reimbursement request was not successful.');
}

export { submitRequestHandler };
