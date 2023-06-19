import { TableCell } from '@mui/material';
import { ChildProps } from '../../../interfaces/ChildProps';
import { normalFont } from '../../../constants/fonts';

/**
 * @description A stylized table cell.
 * @param {ChildProps} props Properties for this element following the ChildProps interface.
 * @returns A React table cell element.
 */
const CustomTableCell = ({ children, ...props }: ChildProps) => {
  const { sx } = props;
  return (
    <TableCell
      sx={{
        fontWeight: 400,
        maxWidth: 'fit-content',
        ...props,
        ...normalFont,
        ...sx,
      }}
    >
      {children}
    </TableCell>
  );
};

export default CustomTableCell;
