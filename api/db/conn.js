import { MongoClient } from 'mongodb';

const { MONGO_USERNAME, MONGO_PASSWORD, HOSTNAME, MONGO_PORT } = process.env;
const client = new MongoClient(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${HOSTNAME}:${MONGO_PORT}`);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

const db = conn.db(process.env.MONGO_DATABASE);

export default db;
