/**
 * @interface
 * @description Interface outlining the IFile object.
 * @property {string}   file - Optional: The base64 encoded version of a file.
 * @property {string}   name - The file name.
 * @property {string}   date - The date the file was uploaded.
 * @property {number}   size - The size of the file in bytes.
 * @property {boolean}  deleted - True if the file has been automatically deleted.
 */
export interface IFile {
  file?: string;
  name: string;
  date: string;
  size: number;
  deleted: boolean;
}
