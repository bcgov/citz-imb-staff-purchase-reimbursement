import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';
import { AttachedFile } from '../../../interfaces/AttachedFile';

export interface FileAttachments {
  data: Array<AttachedFile>
}

const FileAttachmentTable = (props: FileAttachments) => {
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label='items-purchased'>
      <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>File Name</HeaderCell>
            <HeaderCell>Size</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 || !data
          ? <TableRow><CustomTableCell>No attachments available.</CustomTableCell></TableRow>
          : data.map((file, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell sx={{ width: '40px' }}>{index + 1}</CustomTableCell>
              <CustomTableCell>{file.originalName}</CustomTableCell>
              <CustomTableCell sx={{ width: '100px' }}>{`${ file.size / 100 }KB`}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FileAttachmentTable;
