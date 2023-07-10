import db from '../db/conn';
import { Collection, WithId } from 'mongodb';
import { RequestRecord } from '../controllers/requests-api-controller';
import RequestStates from '../constants/RequestStates';
import cron from 'node-cron';
import { IDIRUser, getIDIRUser } from './useCssApi';
import { sendIncompleteReminder } from './useGCNotify';
import Constants from '../constants/Constants';

const { FRONTEND_URL } = Constants;

/**
 * @description Finds and returns all request records marked as Incomplete.
 * @returns {RequestRecord[]} An array of Request Records that have Incomplete status.
 */
const findIncompleteRequests: () => Promise<WithId<RequestRecord>[]> = () => {
  const collection: Collection<RequestRecord> = db.collection<RequestRecord>('requests');
  return collection
    .find({
      state: RequestStates.INCOMPLETE,
    })
    .toArray();
};

/**
 * @description Sends reminders to the email of each record.
 * @param {RequestRecord[]} requests An array of Request Records.
 */
const sendReminders = (requests: RequestRecord[]) => {
  requests.forEach((request) => {
    getIDIRUser(request.idir).then((users: IDIRUser[]) => {
      if (users) {
        sendIncompleteReminder(users.at(0).email, `${FRONTEND_URL}/request/${request._id}`);
      }
    });
  });
};

/**
 * @description Schedules the Incomplete mailing task
 */
export const sendIncompleteReminders = () => {
  // minute, hour, day of month, month, day of week
  const cronSchedule = '* 2 * * 0'; // Runs Sunday at 2am.
  cron.schedule(cronSchedule, async () => {
    console.log(`Starting Incomplete reminder routine at ${new Date().toISOString()}.`);
    const incompleteRequests = await findIncompleteRequests();
    sendReminders(incompleteRequests);
    console.log(`Incomplete reminder routine complete at ${new Date().toISOString()}.`);
  });
};
