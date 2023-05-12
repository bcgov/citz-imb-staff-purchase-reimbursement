import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HeaderCell from './HeaderCell';
import RequestTableCell from './RequestTableCell';
import { ReimbursementRequest } from '../../../interfaces/ReimbursementRequest';
import { convertStateToStatus } from '../../../utils/convertStateToStatus';
import { bcgov } from '../../../constants/colours';

interface RequestTableProps {
  data: Array<ReimbursementRequest>
}

const RequestsTable = (props: RequestTableProps) => {
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <HeaderCell>Requestor Name</HeaderCell>
            <HeaderCell>Items Purchased</HeaderCell>
            <HeaderCell>Total</HeaderCell>
            <HeaderCell>Purchase Date</HeaderCell>
            <HeaderCell>Submission Date</HeaderCell>
            <HeaderCell>Status</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0
          ? <h3 style={{ padding: '1em' }}>Waiting for data...</h3>
          : data.map((row, index) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <RequestTableCell>{`${row.firstName} ${row.lastName}`}</RequestTableCell>
              <RequestTableCell>{row.itemsPurchased.join('; ')}</RequestTableCell>
              <RequestTableCell>{`$${row.totalCost}`}</RequestTableCell>
              <RequestTableCell>{new Date(row.purchaseDate).toLocaleDateString()}</RequestTableCell>
              <RequestTableCell>{new Date(row.submissionDate).toLocaleDateString()}</RequestTableCell>
              <RequestTableCell>{convertStateToStatus(row.state)}</RequestTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RequestsTable;
