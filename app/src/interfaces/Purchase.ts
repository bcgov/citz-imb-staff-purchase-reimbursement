import { IFile } from "./IFile";

/**
 * @interface
 * @description Interface outlining Purchase object.
 * @property {string} supplier      - The supplier of the purchase (e.g. a business or person).
 * @property {string} purchaseDate  - The date of the purchase.
 * @property {number} cost          - The dollar value of the purchase.
 * @property {IFile}  fileObj       - Optional: The file showing proof of purchase (receipt).
 */
export interface Purchase {
  supplier: string,
  purchaseDate: string,
  cost: number,
  fileObj?: IFile
}
