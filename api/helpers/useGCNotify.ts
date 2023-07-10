import axios from 'axios';
import Templates from '../constants/GCNotifyTemplates';
import Constants from '../constants/Constants';

const contactGCNotify = async (email: string, url: string, template: string) => {
  const { GC_NOTIFY_API_KEY } = process.env;
  const { TESTING } = Constants;
  if (!TESTING) {
    try {
      await axios.post(
        'https://api.notification.canada.ca/v2/notifications/email',
        {
          template_id: template,
          email_address: email,
          personalisation: {
            url,
          },
        },
        {
          headers: {
            Authorization: `ApiKey-v1 ${GC_NOTIFY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
};

/**
 * @description Sends an email notifying the recipient of a new request.
 * @param {string}  email The email address for the recipient mailbox.
 * @param {string}  url  The URL needed to access the new request submission.
 */
export const sendRequestSubmittedNotification = (email: string, url: string) => {
  contactGCNotify(email, url, Templates.NotifyAdminOfUpdate);
};

export const sendIncompleteReminder = (email: string, url: string) => {
  contactGCNotify(email, url, Templates.RemindUserOfIncomplete);
};

export const sendChangeNotification = (email: string, url: string) => {
  contactGCNotify(email, url, Templates.NotifyUserOfChange);
};
