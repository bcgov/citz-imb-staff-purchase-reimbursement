/**
 * @constant
 * @enum
 * @description Defines possible states for reimbursement requests.
 */
enum RequestStates {
  DELETED,
  DENIED,
  APPROVED,
  INPROGRESS,
  SUBMITTED,
  __LENGTH
}

export default RequestStates;
