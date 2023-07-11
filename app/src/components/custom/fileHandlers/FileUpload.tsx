import { Button } from '@mui/material';
import { IFile } from '../../../interfaces/IFile';
import FileLink from './FileLink';
import { Dispatch, SetStateAction, useContext } from 'react';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { ErrorContext, errorStyles } from '../notifications/ErrorWrapper';

/**
 * @interface
 * @description Properties provided to the FileUpload element.
 * @property {Array}    files     - A list of files of type IFile.
 * @property {Dispatch} setFiles  - Sets the list of files.
 * @property {number}   index     - The index of the element in files being used.
 * @property {string}   source    - What the uploader is being used for. Determines ID of delete modal.
 * @property {boolean}  disabled  - Optional: Whether the element is disabled.
 */
interface FileUploadProps {
  files: Array<IFile>;
  setFiles: Dispatch<SetStateAction<Array<IFile>>>;
  index: number;
  disabled?: boolean;
  source: string;
}

/**
 * @description An element that provides options to upload or download files.
 * @param {FileUploadProps} props Properties passed to FileUpload. Follows FileUploadProps interface.
 * @returns A React element. Potentially a file link or upload button depending on file status.
 */
const FileUpload = (props: FileUploadProps) => {
  const { files, setFiles, index, disabled, source } = props;
  const uid = Math.random().toString();

  // Error notification
  const { setErrorState } = useContext(ErrorContext);

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
    // File size must be below 10MB
    const maxFileSize = 10485760;
    if (e.target.files[0].size > maxFileSize) {
      setErrorState({
        text: 'File size is over 10MB and will not be uploaded.',
        open: true,
        style: errorStyles.warning,
      });
    } else {
      const tempFiles = [...files];
      const tempFile: IFile = {
        file: '',
        name: '',
        size: 0,
        date: new Date(Date.now()).toISOString(),
        deleted: false,
        downloaded: false,
        removed: false,
        source,
      };
      const base64File = (await toBase64(e.target.files[0])) as string;
      tempFile.file = base64File;
      tempFile.name = e.target.files[0].name;
      tempFile.size = e.target.files[0].size;
      tempFiles.splice(index, 1, tempFile);
      setFiles(tempFiles);
    }
  };

  if (files[index] && files[index].deleted) {
    return <>{`${files[index].name} was automatically deleted.`}</>;
  } else if (disabled) {
    // Is this element disabled?
    // If file exists already, show link
    if (files[index] && files[index].name && !files[index].removed) {
      return <FileLink {...{ uid, files, setFiles, index, source, disabled }} />;
    } else {
      // Otherwise, give plain text response
      return <>No File Available</>;
    }
  } else {
    // Element is not disabled
    // If file exists already, show link
    if (files[index] && files[index].name && !files[index].removed) {
      return <FileLink {...{ uid, files, setFiles, index, source }} />;
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
