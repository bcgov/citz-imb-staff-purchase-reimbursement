import { Approval } from '../../../interfaces/Approval';
import { Dispatch, SetStateAction } from "react";

interface ApprovalUploadProps {
  approvals: Array<Approval>,
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>,
  index: number,
  date?: string,
  disabled?: boolean
}

const ApprovalUpload = (props: ApprovalUploadProps) => {
  const { approvals, setApprovals, index, disabled } = props;

  // Converts file to base64 for easy storage
  const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // const fromBase64 = (file: string) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = reject;
  // });

  const handleFilesChange = async (e: any) => {
    console.log(e.target.files[0])
    if (e.target.files[0].size > 10485760){
      // TODO: Replace with error text for user.
      alert('File size is over 10MB and will not be uploaded.');
    } else {
      let tempApprovals = [...approvals];
      tempApprovals[index].file = await toBase64(e.target.files[0]) as string;
      tempApprovals[index].name = e.target.files[0].name;
      tempApprovals[index].size = e.target.files[0].size;
      setApprovals(tempApprovals);
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

export default ApprovalUpload;
