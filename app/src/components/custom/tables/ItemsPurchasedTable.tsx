import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { ItemPurchased } from '../../../interfaces/ItemPurchased';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';

export interface ItemsPurchased {
  data: Array<ItemPurchased>
}

const ItemsPurchasedTable = (props: ItemsPurchased) => {
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label='items-purchased'>
      <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Item Name</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 || !data
          ? <TableRow><CustomTableCell>No items available.</CustomTableCell></TableRow>
          : data.map((item, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell>{`${item}`}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ItemsPurchasedTable;
