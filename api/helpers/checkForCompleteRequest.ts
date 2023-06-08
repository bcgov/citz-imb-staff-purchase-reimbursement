import { Approval } from "./../interfaces/Approval";
import { Purchase } from "./../interfaces/Purchase";

/**
 * @interface
 * @description The data that must be checked when a request is updated.
 * @param {number}          employeeId  - The employee ID of the requestor.
 * @param {Array<Purchase>} purchases   - The purchases in the request.
 * @param {Array<Approval>} approvals   - The approvals in the request.
 */
interface RequestUpdateData {
  employeeId: number,
  purchases: Array<Purchase>,
  approvals: Array<Approval>
}

/**
 * @description Checks for possible missing fields or files in the update data of a request.
 * @param {RequestUpdateData} requestData The update data.
 * @returns {boolean} True if all data is present. False if anything is missing.
 */
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
