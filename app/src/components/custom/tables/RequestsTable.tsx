import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import HeaderCell from './HeaderCell';
import CustomTableCell from './CustomTableCell';
import { ReimbursementRequest } from '../../../interfaces/ReimbursementRequest';
import { convertStateToStatus } from '../../../utils/convertState';
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
            {/* <HeaderCell>Items Purchased</HeaderCell> */}
            {/* <HeaderCell>Total</HeaderCell> */}
            <HeaderCell>Submission Date</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 || !data
          ? <TableRow><CustomTableCell>No requests available.</CustomTableCell></TableRow>
          : data.map((row, index) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell>{`${row.firstName} ${row.lastName}`}</CustomTableCell>
              {/* <CustomTableCell>{row.itemsPurchased.map(item => item.itemName).join('; ')}</CustomTableCell> */}
              {/* <CustomTableCell>{`$${row.totalCost.toFixed(2)}`}</CustomTableCell> */}
              <CustomTableCell>{new Date(row.submissionDate).toLocaleDateString()}</CustomTableCell>
              <CustomTableCell>{convertStateToStatus(row.state)}</CustomTableCell>
              <CustomTableCell><LinkButton link={`/request/${row._id}`} style={buttonStyles.primary}>More</LinkButton></CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RequestsTable;
