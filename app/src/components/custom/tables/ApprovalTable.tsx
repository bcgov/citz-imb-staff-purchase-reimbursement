import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';
import { IFile } from '../../../interfaces/IFile';
import FileUpload from '../uploaders/FileUpload';
import { Dispatch, SetStateAction } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { Approval } from '../../../interfaces/Approval';

interface $d {
  toISOString(): string;
}

interface Date extends Dayjs {
  $d: $d
}

interface ApprovalTableProps {
  approvals: Array<Approval>,
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>,
  approvalFiles: Array<IFile>,
  setApprovalFiles: Dispatch<SetStateAction<Array<IFile>>>,
  editable?: boolean
}

const ApprovalTable = (props: ApprovalTableProps) => {
  const { approvals, setApprovals, approvalFiles, setApprovalFiles, editable } = props;
  
  const newApproval : Approval = {
    approvalDate: dayjs(Date.now()).toISOString(),
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label='approval-files'>
      <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Approved Date</HeaderCell>
            <HeaderCell>File</HeaderCell>
            { editable
              ? <HeaderCell>{/* For Remove Button */}</HeaderCell>
              : <></>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          { approvals.map((approval, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell sx={{ width: '150px' }}>
                {
                !editable
                  ? new Date(approval.approvalDate || Date.now()).toLocaleDateString() 
                  : <DatePicker 
                      value={dayjs(approval.approvalDate)}
                      onChange={(e: unknown) => {
                        const tempApprovals = [...approvals];
                        tempApprovals[index].approvalDate = (e as Date).$d.toISOString();
                        setApprovals(tempApprovals);
                      }}
                    />
                }
              </CustomTableCell>
              <CustomTableCell>
                <FileUpload 
                  disabled={!editable}
                  files={approvalFiles}
                  setFiles={setApprovalFiles}
                  {...{ index }}
                />
              </CustomTableCell>
              { editable
                ? <CustomTableCell sx={{ width: '80px' }}>
                    <Button
                      onClick={(e) => {
                        // TODO: Double check with user that they want to delete the entry
                        const tempApprovals = [...approvals];
                        const tempApprovalFiles = [...approvalFiles];
                        tempApprovals.splice(index, 1);
                        tempApprovalFiles.splice(index, 1);
                        setApprovals(tempApprovals);
                        setApprovalFiles(tempApprovalFiles);
                      }}    
                      sx={{
                        margin: '1em',
                        color: bcgov.error
                      }}
                    >Remove</Button>
                  </CustomTableCell>
                : <></>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      { editable
        ? <Button 
            sx={{
              width: '100%',
              color: bcgov.links
            }} 
            onClick={() => { setApprovals([...approvals, newApproval ]) }} 
          >
            Add Approval
          </Button>
        : <></>
      }
    </TableContainer>
  );
}

export default ApprovalTable;
