/**
 * @interface
 * @description Interface outlining the IFile object.
 * @property {string} file - Optional: The base64 encoded version of a file.
 * @property {string} name - Optional: The file name.
 * @property {string} date - Optional: The date the file was uploaded.
 * @property {string} size - Optional: The size of the file in bytes.
 */
export interface IFile {
  file?: string,
  name?: string,
  date?: string,
  size?: number
}

