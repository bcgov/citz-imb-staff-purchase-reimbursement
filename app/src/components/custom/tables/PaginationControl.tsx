import { SetStateAction, Dispatch } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from "@mui/icons-material";

interface PaginationControlProps {
  controlObject: PaginationControlObject
  setControlObject: Dispatch<SetStateAction<PaginationControlObject>>
}

export interface PaginationControlObject {
  currentPage: number,
  totalRecords: number,
  rowsPerPage: number
}

const PaginationControl = (props: PaginationControlProps) => {
  const {
    controlObject,
    setControlObject
  } = props;
  const totalPages = Math.ceil(controlObject.totalRecords / controlObject.rowsPerPage);

  // First record to show is: the number of rows per page * the previous page number, then the next record (+1)
  // or first record if on the first page
  const firstRecord = controlObject.currentPage === 1 ? 1 : controlObject.rowsPerPage * (controlObject.currentPage - 1) + 1;
  // Last record to show is the first record + the number of rows per page - 1
  // or the total number of records if on the last page
  const lastRecord = controlObject.currentPage === totalPages ? controlObject.totalRecords : firstRecord + controlObject.rowsPerPage - 1;

  const goToFirstPage = (e: any) => {
    setControlObject({
      ...controlObject,
      currentPage: 1
    });
  }

  const goToPreviousPage = (e: any) => {
    setControlObject({
      ...controlObject,
      currentPage: controlObject.currentPage - 1
    });
  }

  const goToNextPage = (e: any) => {
    setControlObject({
      ...controlObject,
      currentPage: controlObject.currentPage + 1
    });
  }

  const goToLastPage = (e: any) => {
    setControlObject({
      ...controlObject,
      currentPage: totalPages
    });
  }

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: 'fit-content',
        position: 'relative',
        float: 'right',
        alignItems: 'center',
        marginTop: '0.5em'
      }}>
        <span>Rows per page:</span>
        <Select
          defaultValue={30}
          size="small"
          sx={{
            margin: '0 1em'
          }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
        </Select>
        <IconButton onClick={goToFirstPage} disabled={controlObject.currentPage === 1}><FirstPage/></IconButton>
        <IconButton onClick={goToFirstPage} disabled={controlObject.currentPage === 1}><NavigateBefore/></IconButton>
        <span style={{ margin: '0 1em' }}>{`Record ${firstRecord} - ${lastRecord} of ${controlObject.totalRecords}`}</span>
        <IconButton onClick={goToLastPage} disabled={controlObject.currentPage === totalPages}><NavigateNext/></IconButton>
        <IconButton onClick={goToLastPage} disabled={controlObject.currentPage === totalPages}><LastPage/></IconButton>
      </div>
    </>
  );
}

export default PaginationControl;
