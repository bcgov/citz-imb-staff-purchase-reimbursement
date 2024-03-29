import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { bcgov } from '../../../constants/colours';
import CustomTableCell from './CustomTableCell';
import HeaderCell from './HeaderCell';
import { IFile } from '../../../interfaces/IFile';
import FileUpload from '../fileHandlers/FileUpload';
import { Dispatch, SetStateAction, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { Approval } from '../../../interfaces/Approval';
import DeletePrompt from '../modals/DeletePrompt';

/**
 * @interface
 * @description A date string, because Dayjs doesn't seem to recognise its own properties.
 */
interface $d {
  toISOString(): string;
}

/**
 * @interface
 * @description A Date interface that uses the $d property expected from Dayjs
 */
interface Date extends Dayjs {
  $d: $d;
}

/**
 * @interface
 * @description Properties passed to the ApprovalTable element.
 * @property {Array<Approval>}  approvals         - A list of Approval objects.
 * @property {Dispatch}         setApprovals      - Function to set the approvals list.
 * @property {Array<IFile>}     approvalFiles     - A list of IFile objects.
 * @property {Dispatch}         setApprovalFiles  - Function to set approvalFiles list.
 * @property {boolean}          editable          - Optional: Whether editing should be permitted. Default false.
 */
interface ApprovalTableProps {
  approvals: Array<Approval>;
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>;
  approvalFiles: Array<IFile>;
  setApprovalFiles: Dispatch<SetStateAction<Array<IFile>>>;
  editable?: boolean;
}

/**
 * @description A table of all stored approvals for this request.
 * @param {ApprovalTableProps} props See interface ApprovalTableProps
 * @returns React table element.
 */
const ApprovalTable = (props: ApprovalTableProps) => {
  const { approvals, setApprovals, approvalFiles, setApprovalFiles, editable } = props;
  const deletionIndex = useRef<number>(0); // Used to track which approval to delete.

  /**
   * @description A base for new approvals. Automatically assigned the date at time of creation.
   * @constant
   */
  const newApproval: Approval = {
    approvalDate: dayjs(Date.now()).toISOString(),
  };

  /**
   * @description Removes an approval based on the last tracked index.
   */
  const removeApproval = () => {
    const tempApprovals = [...approvals];
    const tempApprovalFiles = [...approvalFiles];
    tempApprovals.splice(deletionIndex.current, 1);
    tempApprovalFiles.splice(deletionIndex.current, 1);
    setApprovals(tempApprovals);
    setApprovalFiles(tempApprovalFiles);
    const approvalDeletionPrompt: HTMLDialogElement = document.querySelector('#approvalRemove')!;
    approvalDeletionPrompt.close();
  };

  return (
    <TableContainer component={Paper}>
      <DeletePrompt
        id='approvalRemove'
        title='Remove Approval?'
        blurb={[
          'Are you sure you want to remove this approval?',
          'This is not recoverable, except by leaving this request without updating.',
        ]}
        deleteHandler={removeApproval}
      />
      <Table aria-label='approval-files'>
        <TableHead>
          <TableRow>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Approved Date</HeaderCell>
            <HeaderCell>File</HeaderCell>
            {editable ? <HeaderCell>{/* For Remove Button */}</HeaderCell> : <></>}
          </TableRow>
        </TableHead>
        <TableBody>
          {approvals.map((approval, index) => (
            <TableRow
              key={approval.approvalDate}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary,
              }}
            >
              <CustomTableCell sx={{ width: '2em' }}>{index + 1}</CustomTableCell>
              <CustomTableCell sx={{ minWidth: '10em', width: '20%' }}>
                {!editable ? (
                  new Date(approval.approvalDate || Date.now()).toLocaleDateString()
                ) : (
                  <DatePicker
                    value={dayjs(approval.approvalDate)}
                    onChange={(e: unknown) => {
                      const tempApprovals = [...approvals];
                      tempApprovals[index].approvalDate = (e as Date).$d.toISOString();
                      setApprovals(tempApprovals);
                    }}
                  />
                )}
              </CustomTableCell>
              <CustomTableCell>
                <FileUpload
                  disabled={!editable}
                  files={approvalFiles}
                  setFiles={setApprovalFiles}
                  source='approval'
                  {...{ index }}
                />
              </CustomTableCell>
              {editable ? (
                <CustomTableCell sx={{ width: '10em' }}>
                  <Button
                    aria-label='Remove approval'
                    aria-description='Removes this record from the purchase request'
                    onClick={() => {
                      deletionIndex.current = index;
                      const approvalDeletionPrompt: HTMLDialogElement =
                        document.querySelector('#approvalRemove')!;
                      approvalDeletionPrompt.showModal();
                    }}
                    sx={{
                      margin: '1em',
                      color: bcgov.error,
                    }}
                  >
                    Remove
                  </Button>
                </CustomTableCell>
              ) : (
                <></>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editable ? (
        <Button
          aria-label='Add Approval'
          aria-description='Adds a new approval to the request.'
          sx={{
            width: '100%',
            color: bcgov.links,
          }}
          onClick={() => {
            setApprovals([...approvals, newApproval]);
          }}
        >
          Add Approval
        </Button>
      ) : (
        <></>
      )}
    </TableContainer>
  );
};

export default ApprovalTable;
