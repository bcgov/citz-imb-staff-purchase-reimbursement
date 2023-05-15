import { FileAttachments } from "../components/custom/tables/FileAttachmentTable";
import { ItemsPurchased } from "../components/custom/tables/ItemsPurchasedTable";
import { ItemPurchased } from "./ItemPurchased";
import { AttachedFile } from './AttachedFile';

export interface ReimbursementRequest {
  _id: string,
  firstName: string,
  lastName: string,
  idir: string,
  employeeId: number,
  itemsPurchased: Array<ItemPurchased>,
  totalCost: number,
  purchaseDate: string,
  attachReceipts: Array<AttachedFile>,
  approvalDate: string,
  attachApproval: Array<AttachedFile>,
  supplierName?: string,
  supplierEmail?: string,
  supplierPhoneNumber?: string,
  additionalComments?: string,
  submissionDate: string,
  state: number
}
