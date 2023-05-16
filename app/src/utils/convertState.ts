export enum RequestStates {
  DELETED,
  DENIED,
  APPROVED,
  INPROGRESS,
  SUBMITTED,
  __LENGTH
}

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
