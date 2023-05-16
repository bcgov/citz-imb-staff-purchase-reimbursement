export interface ReimbursementRequest {
  _id: string,
  firstName: string,
  lastName: string,
  idir: string,
  employeeId: number,
  itemsPurchased: Array<string>,
  totalCost: number,
  purchaseDate: string,
  attachReceipts: Array<object>,
  approvalDate: string,
  attachApproval: Array<object>,
  supplierName?: string,
  supplierEmail?: string,
  supplierPhoneNumber?: string,
  additionalComments?: string,
  submissionDate: string,
  state: number
}
