/**
 * @enum
 * @description The possible states for a reimbursement request.
 */
export enum RequestStates {
  DELETED,
  INCOMPLETE,
  COMPLETE,
  INPROGRESS,
  SUBMITTED,
  __LENGTH
}

/**
 * @description Converts enum value to string value.
 * @param {RequestStates} state A request state enum.
 * @returns A string representation of the state enum.
 */
export const convertStateToStatus = (state: RequestStates) => {
  switch(state){
    case RequestStates.DELETED:
      return 'Deleted';
    case RequestStates.INCOMPLETE:
      return 'Incomplete';
    case RequestStates.COMPLETE:
      return 'Complete';
    case RequestStates.INPROGRESS:
      return 'In Progress';
    case RequestStates.SUBMITTED:
      return 'Submitted';
    default:
      return '';
  }
}
