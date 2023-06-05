/**
 * @enum
 * @description The possible states for a reimbursement request.
 */
export enum RequestStates {
  DELETED,
  DENIED,
  APPROVED,
  INPROGRESS,
  SUBMITTED,
  __LENGTH
}

/**
 * @description Converts enum value to string value.
 * @param state A request state enum.
 * @returns A string representation of the state enum.
 */
export const convertStateToStatus = (state: RequestStates) => {
  switch(state){
    case RequestStates.DELETED:
      return 'Deleted';
    case RequestStates.DENIED:
      return 'Denied';
    case RequestStates.APPROVED:
      return 'Approved';
    case RequestStates.INPROGRESS:
      return 'In Progress';
    case RequestStates.SUBMITTED:
      return 'Submitted';
    default:
      return '';
  }
}
