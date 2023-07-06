import { Button, Tooltip } from '@mui/material';
import { IFile } from '../../../interfaces/IFile';
import { Dispatch, SetStateAction } from 'react';
import { bcgov } from '../../../constants/colours';
import { normalFont } from '../../../constants/fonts';
import DeletePrompt from '../modals/DeletePrompt';
import axios from 'axios';
import Constants from '../../../constants/Constants';
import { useAuthService } from '../../../keycloak';
import { useParams } from 'react-router-dom';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';

interface FileLinkProps {
  uid: string;
  files: IFile[];
  setFiles: Dispatch<SetStateAction<Array<IFile>>>;
  index: number;
  source: string;
  disabled?: boolean;
}
const FileLink = (props: FileLinkProps) => {
  const { uid, files, setFiles, index, source, disabled } = props;
  const { state: authState } = useAuthService();
  const { id } = useParams();
  const { BACKEND_URL } = Constants;

  // Gets the file from the API and returns the base64 string of the file
  // Assumption: no file for this request will have exactly the same upload date down to the millisecond
  const retrieveFile = async () => {
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
    const tempLink = document.createElement('a');
    tempLink.href = (await retrieveFile()) as unknown as string;
    tempLink.download = files[index].name;
    tempLink.click();

    // Mark file as downloaded
    const tempFiles = [...files];
    tempFiles[index].downloaded = true;
    setFiles(tempFiles);
  };

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        border: `solid 1px ${bcgov.component}`,
        borderRadius: '5px',
        width: 'fit-content',
        padding: '0.9em',
        backgroundColor: bcgov.white,
      }}
    >
      <a
        id={uid}
        download={files[index].name}
        href='/'
        onClick={async (e) => {
          e.preventDefault();
          downloadFile();
        }}
        style={{ ...normalFont, color: bcgov.links, marginRight: '1em' }}
      >{`${files[index].name}`}</a>
      {files[index].downloaded ? (
        <Tooltip title='Previously Downloaded'>
          <DownloadDoneIcon
            fontSize='medium'
            sx={{
              color: bcgov.success,
            }}
          />
        </Tooltip>
      ) : (
        <></>
      )}
      {!disabled ? (
        <>
          <Tooltip title='Remove File'>
            <Button
              onClick={() => {
                const deletePrompt: HTMLDialogElement = document.querySelector(
                  `#fileDelete${source}${index}`,
                )!;
                deletePrompt.showModal();
              }}
              sx={{
                padding: 0,
                color: bcgov.error,
                marginLeft: '1em',
              }}
            >
              X
            </Button>
          </Tooltip>

          <DeletePrompt
            id={`fileDelete${source}${index}`}
            title='Remove File?'
            blurb={[
              'Are you sure you want to remove this file?',
              'This is not recoverable, except by leaving this request without updating.',
            ]}
            deleteHandler={() => {
              const tempFiles: IFile[] = [...files];
              tempFiles[index].removed = true;
              delete tempFiles[index].file;
              setFiles(tempFiles);
              const deletePrompt: HTMLDialogElement = document.querySelector(
                `#fileDelete${source}${index}`,
              )!;
              deletePrompt.close();
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FileLink;
