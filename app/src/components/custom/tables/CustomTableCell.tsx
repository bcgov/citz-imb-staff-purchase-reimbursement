import { TableCell } from '@mui/material';
import { ChildProps } from '../../../interfaces/ChildProps';
import { normalFont } from '../../../constants/fonts';

const CustomTableCell = ({ children, ...props }: ChildProps) => {
  const { sx } = props;
  return (
  <TableCell sx={{
    fontWeight: 400,
    maxWidth: 'fit-content',
    ...props,
    ...normalFont,
    ...sx
  }}>
    {children}
  </TableCell>
  );
};

export default CustomTableCell;
