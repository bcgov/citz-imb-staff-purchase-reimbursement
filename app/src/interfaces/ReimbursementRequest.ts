import { Approval } from "./Approval";
import { Purchase } from "./Purchase";

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
  attachApproval?: Array<Approval>
}
