/**
 * @description Contains template IDs for GC Notify templates, stored online.
 * @constant
 */
const Templates = {
  NotifyAdminOfUpdate: '36c9ab59-c467-4393-bab8-c334f364d0d0', // When a user updates a record from Incomplete to Submitted, notify an admin
  RemindUserOfIncomplete: '602b7c71-31b1-45ee-935a-bf177bda89bc', // When request has been incomplete for more than a week, notify the requestor
  NotifyUserOfChange: 'd3ea3626-7182-4577-8f9d-2f277c7fd015', // When an admin changes a record to Incomplete or Complete, notify the requestor
};

export default Templates;
