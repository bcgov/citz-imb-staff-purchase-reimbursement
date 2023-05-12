// Used to seed local MongoDB containers for testing and development.

db = new Mongo().getDB('purchase-db');

db.createUser({
  user: "purchase-admin",
  pwd: "purchase-admin",
  roles: [{ role: 'readWrite', db: 'purchase-db' }],
});

db.createCollection("requests", { capped: false });
