import { MongoClient } from 'mongodb';

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_SERVICE, MONGO_DATABASE, CONTAINERIZED } = process.env;

// Changing where to look for Mongo
const MONGO_HOSTNAME = !!CONTAINERIZED ? MONGO_SERVICE : 'localhost';

// Create connection client
const client = new MongoClient(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`);

// Attempt connection
let conn;
try {
  conn = await client.connect();
  console.log(`MongoDB connected on port ${MONGO_PORT}.`)
} catch (e) {
  console.error(`Error connecting to MongoDB. \nDetails: ${e}`);
}

// Select database to use
const db = conn.db(MONGO_DATABASE);

export default db;
