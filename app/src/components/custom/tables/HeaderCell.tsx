import { TableCell } from '@mui/material';
import { ChildProps } from '../../../interfaces/ChildProps';
import { normalFont } from '../../../constants/fonts';

/**
 * @description A stylized table header cell.
 * @param {ChildProps} props Properties for this element following the ChildProps interface.
 * @returns A React table header cell element.
 */
const HeaderCell = ({ children }: ChildProps) => (
  <TableCell
    sx={{
      fontWeight: 600,
      ...normalFont,
    }}
  >
    {children}
  </TableCell>
);

export default HeaderCell;
