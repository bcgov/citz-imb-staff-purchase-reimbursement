import { Approval } from "./Approval";
import { Purchase } from "./Purchase";

/**
 * @interface
 * @description The expected request stored in the 'requests' collection
 * @property {ObjectId}       _id                 - The unique ID of a request record.
 * @property {string}         firstName           - The first name of the requestor.
 * @property {string}         lastName            - The last name of the requestor.
 * @property {number}         employeeId          - The requestor's employee ID.
 * @property {string}         idir                - The requestor's IDIR code.
 * @property {Array}          purchases           - A list of Purchase items.
 * @property {Array}          approvals           - A list of Approval items.
 * @property {string}         submissionDate      - The date of the reimbursement submission.
 * @property {RequestStates}  state               - The current state of the request.
 * @property {string}         additionalComments  - Optional: Comments attached to request.
 */
export interface ReimbursementRequest {
  _id: string,
  firstName: string,
  lastName: string,
  idir: string,
  employeeId: number,
  purchases: Array<Purchase>,
  additionalComments?: string,
  submissionDate: string,
  state: number,
  approvals?: Array<Approval>
}
