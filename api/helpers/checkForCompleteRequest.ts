import { Approval } from "./../interfaces/Approval";
import { Purchase } from "./../interfaces/Purchase";

interface RequestUpdateData {
  employeeId: number,
  purchases: Array<Purchase>,
  approvals: Array<Approval>
}

export const checkForCompleteRequest = (requestData: RequestUpdateData) => {
  // Are required fields blank?
  if (!requestData.employeeId) return false;

  // Do all purchases have a file?
  const purchasesHaveFiles = requestData.purchases.every((purchase: Purchase) => purchase.fileObj)
  if (!purchasesHaveFiles) return false;

  // Does at least one approval exist?
  if (requestData.approvals.length === 0) return false;

  // Does each approval have a file?
  const approvalsHaveFiles = requestData.approvals.every((approval: Approval) => approval.fileObj)
  if (!approvalsHaveFiles) return false;

  return true;
}
