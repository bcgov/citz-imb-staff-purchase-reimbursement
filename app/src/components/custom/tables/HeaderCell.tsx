import { TableCell } from '@mui/material';
import { ChildProps } from '../../../interfaces/ChildProps';
import { normalFont } from '../../../constants/fonts';

const HeaderCell = ({ children }: ChildProps) => (
  <TableCell sx={{
    fontWeight: 600,
    ...normalFont
  }}>
    {children}
  </TableCell>
);

export default HeaderCell;
