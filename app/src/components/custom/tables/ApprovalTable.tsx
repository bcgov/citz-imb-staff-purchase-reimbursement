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

interface $d {
  toISOString(): string;
}

interface Date extends Dayjs {
  $d: $d
}

interface ApprovalTableProps {
  approvals: Array<IFile>,
  setApprovals: Dispatch<SetStateAction<Array<IFile>>>
  editable?: boolean
}

const ApprovalTable = (props: ApprovalTableProps) => {
  const { approvals, setApprovals, editable } = props;

  const newApproval : IFile = {
    date: dayjs(Date.now()).toISOString(),
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
                  ? new Date(approval.date || Date.now()).toLocaleDateString() 
                  : <DatePicker 
                      value={dayjs(approval.date)}
                      onChange={(e: unknown) => {
                        const tempApprovals = [...approvals];
                        tempApprovals[index].date = (e as Date).$d.toISOString();
                        setApprovals(tempApprovals);
                      }}
                    />
                }
              </CustomTableCell>
              <CustomTableCell>
                <FileUpload 
                  date={approval.date} 
                  disabled={!editable}
                  files={approvals}
                  setFiles={setApprovals}
                  {...{ index }}
                />
              </CustomTableCell>
              { editable
                ? <CustomTableCell 
                    sx={{ display: 'flex' }}
                  >
                    <Button
                      onClick={(e) => {
                        const tempApprovals = [...approvals];
                        tempApprovals.splice(tempApprovals.findIndex(approval => approval.name === tempApprovals[index].name), 1);
                        setApprovals(tempApprovals);
                      }}    
                      sx={{
                        position: 'absolute',
                        right: 0,
                        marginRight: '1em'
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
              width: '100%'
            }} 
            onClick={() => { setApprovals([...approvals, newApproval ]) }} 
          >Add Approval</Button>
        : <></>
      }
    </TableContainer>
  );
}

export default ApprovalTable;
