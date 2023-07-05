import { Button } from '@mui/material';
import { IFile } from '../../../interfaces/IFile';
import { Dispatch, SetStateAction, useRef } from 'react';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { bcgov } from '../../../constants/colours';
import { normalFont } from '../../../constants/fonts';
import DeletePrompt from '../modals/DeletePrompt';
import axios from 'axios';
import Constants from '../../../constants/Constants';
import { useAuthService } from '../../../keycloak';
import { useParams } from 'react-router-dom';

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
  const { id } = useParams();
  const uid = Math.random().toString();
  const fileString = useRef('');
  const { state: authState } = useAuthService();

  // Gets the file from the API and returns the base64 string of the file
  // Assumption: no file for this request will have exactly the same upload date down to the millisecond
  const retrieveFile = async () => {
    const { BACKEND_URL } = Constants;
    const axiosReqConfig = {
      url: `${BACKEND_URL}/api/requests/${id}/files?date=${files[index].date}`,
      method: `get`,
      headers: {
        Authorization: `Bearer ${authState.accessToken}`,
      },
    };
    const file: string = await axios(axiosReqConfig).then((response) => response.data.file);
    return file;
  };

  // If the file isn't already stored, retrieves the file and uses a false anchor link to download
  const downloadFile = async () => {
    if (fileString.current === '') {
      fileString.current = (await retrieveFile()) as unknown as string;
    }
    const tempLink = document.createElement('a');
    tempLink.href = fileString.current;
    tempLink.download = files[index].name;
    tempLink.click();
  };

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
      const tempFile: IFile = {
        file: '',
        name: '',
        size: 0,
        date: new Date(Date.now()).toISOString(),
        deleted: false,
      };
      const base64File = (await toBase64(e.target.files[0])) as string;
      fileString.current = base64File;
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
    if (fileString.current !== 'removed' && files[index] && files[index].name) {
      return (
        <a
          id={uid}
          download={files[index].name}
          href={fileString.current}
          onClick={async (e) => {
            e.preventDefault();
            downloadFile();
          }}
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
    if (fileString.current !== 'removed' && files[index] && files[index].name) {
      return (
        <>
          <a
            id={uid}
            download={files[index].name}
            href={fileString.current}
            onClick={async (e) => {
              e.preventDefault();
              downloadFile();
            }}
            style={{ ...normalFont, color: bcgov.links }}
          >{`${files[index].name}`}</a>
          <Button
            onClick={() => {
              const deletePrompt: HTMLDialogElement = document.querySelector(
                `#fileDelete${source}${index}`,
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
            id={`fileDelete${source}${index}`}
            title='Remove File?'
            blurb={[
              'Are you sure you want to remove this file?',
              'This is not recoverable, except by leaving this request without updating.',
            ]}
            deleteHandler={() => {
              const tempFiles: IFile[] = [...files];
              delete tempFiles[index].file;
              fileString.current = 'removed';
              setFiles(tempFiles);
              const deletePrompt: HTMLDialogElement = document.querySelector(
                `#fileDelete${source}${index}`,
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
