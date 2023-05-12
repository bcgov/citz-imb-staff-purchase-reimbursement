import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import HeaderCell from './HeaderCell';
import RequestTableCell from './RequestTableCell';
import { ReimbursementRequest } from '../../../interfaces/ReimbursementRequest';
import { convertStateToStatus } from '../../../utils/convertStateToStatus';
import { bcgov } from '../../../constants/colours';
import LinkButton from '../../bcgov/LinkButton';
import { buttonStyles } from '../../bcgov/ButtonStyles';

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
            <HeaderCell></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 || !data
          ? <h4 style={{ padding: '1em' }}>No records available.</h4>
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
              <RequestTableCell><LinkButton link='/' style={buttonStyles.primary}>Edit</LinkButton></RequestTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RequestsTable;
