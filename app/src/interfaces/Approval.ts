import { IFile } from './IFile';

/**
 * @interface
 * @description Interface outlining Approval object.
 * @property {string} approvalDate  - The date approval was obtained.
 * @property {IFile}  fileObj       - Optional: The file with proof of approval.
 */
export interface Approval {
  approvalDate: string;
  fileObj?: IFile;
}
