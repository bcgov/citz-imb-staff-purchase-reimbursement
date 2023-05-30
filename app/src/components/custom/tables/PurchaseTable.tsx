import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Purchase } from '../../../interfaces/Purchase';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';

export interface ItemsPurchased {
  data: Array<Purchase>
}

const PurchaseTable = (props: ItemsPurchased) => {
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label='items-purchased'>
      <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Supplier</HeaderCell>
            <HeaderCell>Purchase Date</HeaderCell>
            <HeaderCell>Cost</HeaderCell>
            <HeaderCell>Receipt</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 || !data
          ? <TableRow><CustomTableCell>No items available.</CustomTableCell></TableRow>
          : data.map((purchase, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell>{`${purchase.supplier}`}</CustomTableCell>
              <CustomTableCell sx={{ width: '150px' }}>{new Date(purchase.purchaseDate).toLocaleDateString()}</CustomTableCell>
              <CustomTableCell>{`$ ${purchase.cost.toFixed(2)}`}</CustomTableCell>
              <CustomTableCell><a href={purchase.filePath}>{`${purchase.fileName  || 'Receipt Needed'}`}</a></CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PurchaseTable;
