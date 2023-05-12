import { TableCell } from '@mui/material';
import { ChildProps } from '../../../interfaces/ChildProps';
import { normalFont } from '../../../constants/fonts';

const RequestTableCell = ({ children, ...props }: ChildProps) => (
  <TableCell sx={{
    fontWeight: 400,
    ...props,
    ...normalFont
  }}>
    {children}
  </TableCell>
);

export default RequestTableCell;
