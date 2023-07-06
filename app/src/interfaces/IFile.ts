/**
 * @interface
 * @description Interface outlining the IFile object.
 * @property {string}   file - Optional: The base64 encoded version of a file.
 * @property {string}   name - The file name.
 * @property {string}   date - The date the file was uploaded.
 * @property {number}   size - The size of the file in bytes.
 * @property {boolean}  deleted - True if the file has been automatically deleted from database.
 * @property {boolean}  downloaded - True if the file has been previously downloaded.
 * @property {boolean}  removed - True if the file was removed by a user.
 */
export interface IFile {
  file?: string;
  name: string;
  date: string;
  size: number;
  deleted: boolean;
  downloaded: boolean;
  removed: boolean;
}
