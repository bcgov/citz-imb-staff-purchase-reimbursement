import FileUpload from "react-mui-fileuploader";
import { Approval } from '../../../interfaces/Approval';
import { Dispatch, SetStateAction } from "react";

interface ApprovalUploadProps {
  approvals: Array<Approval>,
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>,
  index: number
}

const ApprovalUpload = (props: ApprovalUploadProps) => {
  const { approvals, setApprovals, index } = props;
  const handleFilesChange = (files: any[]) => {
    console.log(files);
    // let tempApprovals = [...approvals];
    // const newApproval = {

    // }
    //setApprovals([ ...approvals, newApproval ])
  };

  return (
      <FileUpload
        multiFile={false}
        onFilesChange={handleFilesChange}
        onContextReady={(context) => {}}
      />
  );
}

export default ApprovalUpload;
