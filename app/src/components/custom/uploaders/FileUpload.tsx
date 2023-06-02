import { Button } from '@mui/material';
import { IFile } from '../../../interfaces/IFile';
import { Dispatch, SetStateAction } from "react";
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { bcgov } from '../../../constants/colours';
import { normalFont } from '../../../constants/fonts';

interface FileUploadProps {
  files: Array<IFile>,
  setFiles: Dispatch<SetStateAction<Array<IFile>>>,
  index: number,
  date?: string,
  disabled?: boolean,
}

const FileUpload = (props: FileUploadProps) => {
  const { files, setFiles, index, disabled } = props;
  const uid = Math.random().toString();

  // Converts file to base64 for easy storage
  const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleFilesChange = async (e: any) => {
    if (e.target.files[0].size > 10485760){
      // TODO: Replace with error text for user.
      alert('File size is over 10MB and will not be uploaded.');
    } else {
      const tempFiles = [...files];
      const tempFile = {
        file: '',
        name: '',
        size: 0,
        date: new Date(Date.now()).toISOString()
      }
      tempFile.file = await toBase64(e.target.files[0]) as string;
      tempFile.name = e.target.files[0].name;
      tempFile.size = e.target.files[0].size;
      tempFiles.splice(index, 1, tempFile);
      setFiles(tempFiles);
    }
  };

  // Is this element disabled?
  if (disabled){
    // If file exists already, show link
    if (files[index] && files[index].name && files[index].file){
      return (<a download={files[index].name} href={files[index].file} style={{...normalFont, color: bcgov.links}}>{`${files[index].name}`}</a>);
    } else {
      // Otherwise, give plain text response
      return (<>No File Available</>);
    }
  } else { // Element is not disabled
    // If file exists already, show link
    if (files[index] && files[index].name && files[index].file){
      return (
        <>
          <a download={files[index].name} href={files[index].file} style={{...normalFont, color: bcgov.links}}>{`${files[index].name}`}</a>
          <Button
            onClick={(e) => {
              const tempFiles = [...files];
              tempFiles.splice(index, 1);
              setFiles(tempFiles);
            }}    
            sx={{
              margin: '0 1em',
              padding: 0,
              color: bcgov.error
            }}
          >X</Button>
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
            type="file" 
            accept=".pdf,.PDF" 
            style={{ width: 0 }} 
            onChange={handleFilesChange}
            disabled={disabled}
            id={uid}
          />
        </Button>
      );
    }
  }
}

export default FileUpload;
