import { mongoCleanupHelper } from './helpers/mongoCleanup';
import Constants from './constants/Constants';
import app from './express';

const { API_PORT } = Constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) console.log(err);
  console.info(`Server started on port ${API_PORT}.`);
  mongoCleanupHelper();
});
