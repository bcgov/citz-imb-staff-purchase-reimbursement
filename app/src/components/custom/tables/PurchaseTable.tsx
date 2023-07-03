import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Purchase } from '../../../interfaces/Purchase';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';
import FileUpload from '../uploaders/FileUpload';
import { Dispatch, SetStateAction } from 'react';
import { IFile } from '../../../interfaces/IFile';

/**
 * @interface
 * @description Properties passed to the PurchaseTable component.
 * @property {Array<Purchase>}  purchases         - A list of Purchase objects.
 * @property {Dispatch}         setPurchases      - Function to set the purchases list.
 * @property {Array<IFile>}     purchaseFiles     - A list of IFile objects.
 * @property {Dispatch}         setPurchaseFiles  - Function to set purchaseFiles list.
 * @property {boolean}          editable          - Optional: Whether editing should be permitted. Default false.
 */
export interface PurchaseTableProps {
  purchases: Array<Purchase>;
  setPurchases: Dispatch<SetStateAction<Array<Purchase>>>;
  purchaseFiles: Array<IFile>;
  setPurchaseFiles: Dispatch<SetStateAction<Array<IFile>>>;
  editable?: boolean;
}

/**
 * @description A table containing all of the purchases in a reimbursement request.
 * @param {PurchaseTableProps} props Properties passed to PurchaseTable.
 * @returns A React table element.
 */
const PurchaseTable = (props: PurchaseTableProps) => {
  const { purchases, purchaseFiles, setPurchaseFiles, editable } = props;
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
          {purchases.length === 0 || !purchases ? (
            <TableRow>
              <CustomTableCell>No items available.</CustomTableCell>
            </TableRow>
          ) : (
            purchases.map((purchase, index) => (
              <TableRow
                key={purchase.purchaseDate}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary,
                }}
              >
                <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
                <CustomTableCell>{`${purchase.supplier}`}</CustomTableCell>
                <CustomTableCell sx={{ width: '150px' }}>
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </CustomTableCell>
                <CustomTableCell>{`$ ${purchase.cost.toFixed(2)}`}</CustomTableCell>
                <CustomTableCell>
                  <FileUpload
                    disabled={!editable}
                    files={purchaseFiles}
                    setFiles={setPurchaseFiles}
                    source='purchase'
                    {...{ index }}
                  />
                </CustomTableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseTable;
