/**
 * @constant
 * @enum
 * @description Defines possible states for reimbursement requests.
 */
enum RequestStates {
  DELETED,
  INCOMPLETE,
  COMPLETE,
  INPROGRESS,
  SUBMITTED,
  __LENGTH
}

export default RequestStates;
