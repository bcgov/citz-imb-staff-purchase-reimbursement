import db from '../db/conn';
import { Collection } from 'mongodb';
import { RequestRecord } from '../controllers/requests-api-controller';
import RequestStates from '../constants/RequestStates';
import cron from 'node-cron';

const thirtyDaysOfMilliseconds = 1000 * 60 * 60 * 24 * 30;
/**
 * @description Deletes files from database if marked as Completed and too old
 */
const removeCompletedFiles = async () => {
  const collection: Collection<RequestRecord> = db.collection<RequestRecord>('requests');
  await collection.updateMany(
    {
      state: RequestStates.COMPLETE,
      submissionDate: { $lt: new Date(Date.now() - thirtyDaysOfMilliseconds).toISOString() },
    },
    {
      $unset: {
        'purchases.$[].fileObj.file': '',
        'approvals.$[].fileObj.file': '',
      },
      'purchases.$[].fileObj.deleted': true,
      'approvals.$[].fileObj.deleted': true,
    },
  );
};

/**
 * @description Deletes entire request record from database if marked as Deleted and too old
 */
const removeDeletedRequests = async () => {
  const collection: Collection<RequestRecord> = db.collection<RequestRecord>('requests');
  await collection.deleteMany({
    state: RequestStates.DELETED,
    submissionDate: { $lt: new Date(Date.now() - thirtyDaysOfMilliseconds).toISOString() },
  });
};

/**
 * @description Schedules the Mongo clean up jobs
 */
export const mongoCleanupHelper = () => {
  // minute, hour, day of month, month, day of week
  const cronSchedule = '* 1 * * 0'; // Runs Sunday at 1am.
  cron.schedule(cronSchedule, () => {
    console.log(`Starting Mongo file cleanup routine at ${new Date().toISOString()}.`);
    removeCompletedFiles();
    removeDeletedRequests();
    console.log(`Mongo file cleanup complete at ${new Date().toISOString()}.`);
  });
};
