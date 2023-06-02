import { IFile } from "./IFile";

export interface Purchase {
  supplier: string,
  purchaseDate: string,
  cost: number,
  fileObj?: IFile
}
