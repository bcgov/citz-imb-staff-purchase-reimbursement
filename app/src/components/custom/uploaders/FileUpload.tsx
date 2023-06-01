import { IFile } from '../../../interfaces/IFile';
import { Dispatch, SetStateAction } from "react";

interface FileUploadProps {
  files: Array<IFile>,
  setFiles: Dispatch<SetStateAction<Array<IFile>>>,
  index: number,
  date?: string,
  disabled?: boolean
}

const FileUpload = (props: FileUploadProps) => {
  const { files, setFiles, index, disabled } = props;

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
      let tempApprovals = [...files];
      tempApprovals[index].file = await toBase64(e.target.files[0]) as string;
      tempApprovals[index].name = e.target.files[0].name;
      tempApprovals[index].size = e.target.files[0].size;
      setFiles(tempApprovals);
    }
  };

  return (
      <input 
        type="file" 
        accept=".pdf,.PDF" 
        style={{ width: '100%'}} 
        onChange={handleFilesChange}
        id={`approvalUpload${index}`}
        name={`approvalUpload${index}`}
        disabled={disabled}
      />
  );
}

export default FileUpload;
