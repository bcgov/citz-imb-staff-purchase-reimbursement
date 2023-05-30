import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';
import { Approval } from '../../../interfaces/Approval';
import ApprovalUpload from '../uploaders/ApprovalUpload';
import { useState } from 'react';

export interface Approvals {
  data: Array<Approval>
}

const ApprovalTable = (props: Approvals) => {
  const [approvals, setApprovals] = useState<Array<Approval>>([]);
  const { data } = props;
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
          {data.length === 0 || !data
          ? <TableRow><CustomTableCell>No attachments available.</CustomTableCell></TableRow>
          : data.map((item, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell sx={{ width: '150px' }}>{new Date(item.date).toLocaleDateString()}</CustomTableCell>
              {item.name ? <CustomTableCell><a href={item.path}>{item.name}</a></CustomTableCell> : <ApprovalUpload {...{ approvals, setApprovals, index }}/>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApprovalTable;
