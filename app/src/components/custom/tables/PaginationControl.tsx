import { SetStateAction, Dispatch } from 'react';
import { IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from '@mui/icons-material';

/**
 * @interface
 * @description Properties passed to the PaginationControl component.
 * @property {PaginationControlObject} controlObject An object with properties that affect pagination.
 * @property {Dispatch<SetStateAction<PaginationControlObject>>} setControlObject The setter for controlObject.
 */
interface PaginationControlProps {
  controlObject: PaginationControlObject;
  setControlObject: Dispatch<SetStateAction<PaginationControlObject>>;
}

/**
 * @interface
 * @description The object that controls behaviour of pagination.
 * @property {number} currentPage The current page viewable by the user.
 * @property {number} totalRecords The total number of records in the data set.
 * @property {number} rowsPerPage The number of rows displayed on each page.
 */
export interface PaginationControlObject {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
}

/**
 * @description A component that displays pagination information and handles page changes for tables.
 * @param {PaginationControlProps} props The properties pass to the component.
 * @returns {PaginationControl} A React component.
 */
const PaginationControl = (props: PaginationControlProps) => {
  const { controlObject, setControlObject } = props;
  const totalPages = Math.ceil(controlObject.totalRecords / controlObject.rowsPerPage); // Have to round up
  const noRecords = controlObject.totalRecords === 0;

  // First record to show is: the number of rows per page * the previous page number, then the next record (+1)
  // or first record if on the first page
  const firstRecord =
    controlObject.currentPage === 1
      ? 1
      : controlObject.rowsPerPage * (controlObject.currentPage - 1) + 1;
  // Last record to show is the first record + the number of rows per page - 1
  // or the total number of records if on the last page
  const lastRecord =
    controlObject.currentPage === totalPages
      ? controlObject.totalRecords
      : firstRecord + controlObject.rowsPerPage - 1;

  // Sets the current page to 1
  const goToFirstPage = () => {
    setControlObject({
      ...controlObject,
      currentPage: 1,
    });
  };

  // Sets the current page to the previous page
  const goToPreviousPage = () => {
    setControlObject({
      ...controlObject,
      currentPage: controlObject.currentPage - 1,
    });
  };

  // Sets the current page to the next page
  const goToNextPage = () => {
    setControlObject({
      ...controlObject,
      currentPage: controlObject.currentPage + 1,
    });
  };

  // Sets the current page to the last page
  const goToLastPage = () => {
    setControlObject({
      ...controlObject,
      currentPage: totalPages,
    });
  };

  // Updates the number of rows displayed per page
  const updateRowsPerPage = (e: any) => {
    setControlObject({
      ...controlObject,
      rowsPerPage: e.target.value,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: 'fit-content',
        position: 'relative',
        float: 'right',
        alignItems: 'center',
        marginTop: '0.5em',
      }}
    >
      <span>Rows per page:</span>
      <Select
        defaultValue={30}
        size='small'
        aria-label='Rows per page selector'
        aria-description='Changes the rows displayed per page on the table.'
        sx={{
          margin: '0 1em',
        }}
        onChange={updateRowsPerPage}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value={1000}>1000</MenuItem>
      </Select>

      <IconButton
        onClick={goToFirstPage}
        disabled={controlObject.currentPage === 1 || noRecords}
        aria-label='Go to first table page.'
      >
        <Tooltip title='First Page'>
          <FirstPage />
        </Tooltip>
      </IconButton>

      <IconButton
        onClick={goToPreviousPage}
        disabled={controlObject.currentPage === 1 || noRecords}
        aria-label='Go to previous table page.'
      >
        <Tooltip title='Previous Page'>
          <NavigateBefore />
        </Tooltip>
      </IconButton>

      {noRecords ? (
        <span style={{ margin: '0 1em' }}>0 records</span>
      ) : (
        <span
          style={{ margin: '0 1em' }}
        >{`Record ${firstRecord} - ${lastRecord} of ${controlObject.totalRecords}`}</span>
      )}

      <IconButton
        onClick={goToNextPage}
        disabled={controlObject.currentPage === totalPages || noRecords}
        aria-label='Go to next table page.'
      >
        <Tooltip title='Next Page'>
          <NavigateNext />
        </Tooltip>
      </IconButton>

      <IconButton
        onClick={goToLastPage}
        disabled={controlObject.currentPage === totalPages || noRecords}
        aria-label='Go to last table page.'
      >
        <Tooltip title='Last Page'>
          <LastPage />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default PaginationControl;
