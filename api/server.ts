import Constants from './constants/Constants';
import app from './express';
import db from './db/conn';
import { Collection } from 'mongodb';
import { RequestRecord } from './controllers/requests-api-controller';
import RequestStates from './constants/RequestStates';
import cron from 'node-cron';

const { API_PORT } = Constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) console.log(err);
  console.info(`Server started on port ${API_PORT}.`);

  // Deletes files from Mongo if
  // the request has deleted state &&
  // is older than one month
  /**
   * @description Deletes files from Mongo if the request has a DELETED state and is older than one month
   */
  const deleteOldFiles = async () => {
    console.log(`Starting Mongo file cleanup routine at ${new Date().toISOString()}.`);
    const thirtyDaysOfMilliseconds = 1000 * 60 * 60 * 24 * 30;
    const collection: Collection<RequestRecord> = db.collection<RequestRecord>('requests');
    await collection.updateMany(
      {
        state: RequestStates.DELETED,
        submissionDate: { $lt: new Date(Date.now() - thirtyDaysOfMilliseconds).toISOString() },
      },
      {
        $unset: {
          'purchases.$[].fileObj': '',
          'approvals.$[].fileObj': '',
        },
      },
    );
    console.log(`Mongo file cleanup complete at ${new Date().toISOString()}.`);
  };

  // minute, hour, day of month, month, day of week
  const cronSchedule = '* 1 * * 0'; // Runs Sunday at 1am.
  cron.schedule(cronSchedule, () => {
    deleteOldFiles();
  });
});
