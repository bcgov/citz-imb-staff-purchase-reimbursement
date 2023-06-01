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
import { Approval } from '../../../interfaces/Approval';
import ApprovalUpload from '../uploaders/ApprovalUpload';
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
  approvals: Array<Approval>,
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>
  editable?: boolean
}

const ApprovalTable = (props: ApprovalTableProps) => {
  const { approvals, setApprovals, editable } = props;

  const newApproval : Approval = {
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
          </TableRow>
        </TableHead>
        <TableBody>
          { approvals.map((item, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell sx={{ width: '150px' }}>
                {
                !editable
                  ? new Date(item.date || Date.now()).toLocaleDateString() 
                  : <DatePicker 
                      value={dayjs(item.date)}
                      onChange={(e: unknown) => {
                        const tempApprovals = [...approvals];
                        tempApprovals[index].date = (e as Date).$d.toISOString();
                        setApprovals(tempApprovals);
                      }}
                    />
                }
              </CustomTableCell>
              <CustomTableCell>
              {
              !editable
                ? <a download={`approval${index}`} href={item.file}>{item.name!}</a> 
                : <ApprovalUpload date={item.date} disabled={!editable} {...{ approvals, setApprovals, index }}/>
              }
              </CustomTableCell>
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
