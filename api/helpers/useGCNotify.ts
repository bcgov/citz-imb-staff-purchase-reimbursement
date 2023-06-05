import axios from "axios";
import Templates from "../constants/GCNotifyTemplates";

/**
 * @description Sends an email notifying the recipient of a new request.
 * @param email The email address for the recipient mailbox.
 * @param link The URL needed to access the new request submission.
 */
export const sendNewRequestNotification = async (email: string, link: string) => {
  const { GC_NOTIFY_API_KEY } = process.env;
  try {
    await axios.post('https://api.notification.canada.ca/v2/notifications/email', {
      template_id: Templates.NewRequestNotification,
      email_address: email,
      personalisation: {
        url: link
      }
    }, {
      headers: {
        "Authorization": `ApiKey-v1 ${GC_NOTIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.log(e);
  }
}
