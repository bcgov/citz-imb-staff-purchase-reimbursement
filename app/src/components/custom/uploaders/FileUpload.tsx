import { Button } from '@mui/material';
import { IFile } from '../../../interfaces/IFile';
import { Dispatch, SetStateAction } from 'react';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { bcgov } from '../../../constants/colours';
import { normalFont } from '../../../constants/fonts';
import DeletePrompt from '../modals/DeletePrompt';

/**
 * @interface
 * @description Properties provided to the FileUpload element.
 * @property {Array}    files     - A list of files of type IFile.
 * @property {Dispatch} setFiles  - Sets the list of files.
 * @property {number}   index     - The index of the element in files being used.
 * @property {string}   date      - Optional: The date the file was uploaded.
 * @property {boolean}  disabled  - Optional: Whether the element is disabled.
 */
interface FileUploadProps {
  files: Array<IFile>;
  setFiles: Dispatch<SetStateAction<Array<IFile>>>;
  index: number;
  date?: string;
  disabled?: boolean;
}

/**
 * @description An element that provides options to upload or download files.
 * @param {FileUploadProps} props Properties passed to FileUpload. Follows FileUploadProps interface.
 * @returns A React element. Potentially a file link or upload button depending on file status.
 */
const FileUpload = (props: FileUploadProps) => {
  const { files, setFiles, index, disabled } = props;
  const uid = Math.random().toString();

  // Converts file to base64 for easy storage
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // When a file is uploaded. Checks size and updates file list.
  const handleFilesChange = async (e: any) => {
    if (e.target.files[0].size > 10485760) {
      // TODO: Replace with error text for user.
      alert('File size is over 10MB and will not be uploaded.');
    } else {
      const tempFiles = [...files];
      const tempFile = {
        file: '',
        name: '',
        size: 0,
        date: new Date(Date.now()).toISOString(),
      };
      tempFile.file = (await toBase64(e.target.files[0])) as string;
      tempFile.name = e.target.files[0].name;
      tempFile.size = e.target.files[0].size;
      tempFiles.splice(index, 1, tempFile);
      setFiles(tempFiles);
    }
  };

  // Is this element disabled?
  if (disabled) {
    // If file exists already, show link
    if (files[index] && files[index].name && files[index].file) {
      return (
        <a
          download={files[index].name}
          href={files[index].file}
          style={{ ...normalFont, color: bcgov.links }}
        >{`${files[index].name}`}</a>
      );
    } else {
      // Otherwise, give plain text response
      return <>No File Available</>;
    }
  } else {
    // Element is not disabled
    // If file exists already, show link
    if (files[index] && files[index].name && files[index].file) {
      return (
        <>
          <a
            download={files[index].name}
            href={files[index].file}
            style={{ ...normalFont, color: bcgov.links }}
          >{`${files[index].name}`}</a>
          <Button
            onClick={() => {
              const deletePrompt: HTMLDialogElement = document.querySelector(
                `#fileDelete${index}`,
              )!;
              deletePrompt.showModal();
            }}
            sx={{
              margin: '0 1em',
              padding: 0,
              color: bcgov.error,
            }}
          >
            X
          </Button>
          <DeletePrompt
            id={`fileDelete${index}`}
            title='Remove File?'
            blurb='Are you sure you want to remove this file?;;This is not recoverable, except by leaving this request without updating.'
            deleteHandler={() => {
              const tempFiles: IFile[] = [...files];
              delete tempFiles[index].file;
              setFiles(tempFiles);
              const deletePrompt: HTMLDialogElement = document.querySelector(
                `#fileDelete${index}`,
              )!;
              deletePrompt.close();
            }}
          />
        </>
      );
    } else {
      // Otherwise show file upload button
      return (
        <Button
          sx={buttonStyles.secondary}
          onClick={() => {
            document.getElementById(uid)!.click();
          }}
        >
          Add File
          <input
            type='file'
            accept='.pdf,.PDF'
            style={{ width: 0 }}
            onChange={handleFilesChange}
            disabled={disabled}
            id={uid}
          />
        </Button>
      );
    }
  }
};

export default FileUpload;
