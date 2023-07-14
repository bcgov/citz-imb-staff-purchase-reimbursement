import {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  MouseEvent,
  CSSProperties,
  useRef,
} from 'react';
import { RequestStates, convertStateToStatus } from '../../../helpers/convertState';
import { useNavigate } from 'react-router-dom';
import { ReimbursementRequest } from '../../../interfaces/ReimbursementRequest';
import {
  Paper,
  TextField,
  Select,
  FormControl,
  FormLabel,
  MenuItem,
  Menu,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { normalFont } from '../../../constants/fonts';
import PurchaseTable from '../tables/PurchaseTable';
import ActionButton from '../../bcgov/ActionButton';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ApprovalTable from '../tables/ApprovalTable';
import { IFile } from '../../../interfaces/IFile';
import { Purchase } from '../../../interfaces/Purchase';
import { Approval } from '../../../interfaces/Approval';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import Constants from '../../../constants/Constants';
import { useAuthService } from '../../../keycloak';
import BackButton from '../../bcgov/BackButton';
import DeletePrompt from '../modals/DeletePrompt';
import { ErrorContext, errorStyles } from '../notifications/ErrorWrapper';
import { getAllFiles } from '../../../helpers/fileDownloadAll';
import GeneralPrompt from '../modals/GeneralPrompt';

/**
 * @interface
 * @property {boolean}                          locked                  - Whether the form should be considered locked.
 * @property {boolean}                          isAdmin                 - Whether the user has an admin role.
 * @property {() => Promise<void>}              handleUpdate            - Event handler for when form is submitted.
 * @property {ReimbursementRequest | undefined} reimbursementRequest    - The request viewed in this form.
 * @property {Dispatch}                         setReimbursementRequest - State setter for reimbursement request.
 * @property {Array<Purchase>}                  purchases               - A list of Purchase objects.
 * @property {Dispatch}                         setPurchases            - Function to set the purchases list.
 * @property {Array<IFile>}                     purchaseFiles           - A list of IFile objects.
 * @property {Dispatch}                         setPurchaseFiles        - Function to set purchaseFiles list.
 * @property {Array<Approval>}                  approvals               - A list of Approval objects.
 * @property {Dispatch}                         setApprovals            - Function to set the approvals list.
 * @property {Array<IFile>}                     approvalFiles           - A list of IFile objects.
 * @property {Dispatch}                         setApprovalFiles        - Function to set approvalFiles list.
 */
interface RequestFormProps {
  locked: boolean;
  isAdmin: boolean;
  handleUpdate: () => Promise<void>;
  reimbursementRequest: ReimbursementRequest | undefined;
  setReimbursementRequest: Dispatch<SetStateAction<ReimbursementRequest | undefined>>;
  purchases: Array<Purchase>;
  setPurchases: Dispatch<SetStateAction<Array<Purchase>>>;
  purchaseFiles: Array<IFile>;
  setPurchaseFiles: Dispatch<SetStateAction<Array<IFile>>>;
  approvals: Array<Approval>;
  setApprovals: Dispatch<SetStateAction<Array<Approval>>>;
  approvalFiles: Array<IFile>;
  setApprovalFiles: Dispatch<SetStateAction<Array<IFile>>>;
}

/**
 * @description                     - The form portion showing an individual request.
 * @param {RequestFormProps} props  - The properties passed to the Request Form.
 * @returns                         - A React form element.
 */
const RequestForm = (props: RequestFormProps) => {
  const {
    locked,
    isAdmin,
    handleUpdate,
    reimbursementRequest,
    setReimbursementRequest,
    purchases,
    setPurchases,
    purchaseFiles,
    setPurchaseFiles,
    approvals,
    setApprovals,
    approvalFiles,
    setApprovalFiles,
  } = props;

  const { state: authState } = useAuthService();

  // Bypass state for modal popups. Used to know which popups have already been dismissed.
  const defaultModalBypassState = {
    incomplete: isAdmin, // Because admins always bypass this
    unsaved: !isAdmin, // Because only admins care about this
  };
  const modalBypassState = useRef(defaultModalBypassState);

  // Controls for menu dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Error notification
  const { setErrorState } = useContext(ErrorContext);

  const handleDelete = async () => {
    try {
      const axiosReqConfig = {
        url: `${Constants.BACKEND_URL}/api/requests/${reimbursementRequest?._id}`,
        method: `patch`,
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
        data: {
          state: RequestStates.DELETED,
          isAdmin,
        },
      };
      const response = await axios(axiosReqConfig);
      if (response.status === 200) {
        sessionStorage.removeItem('target-page');
        setErrorState({
          text: 'Request Deleted.',
          open: true,
          style: errorStyles.success,
        });
        // Return to home page
        navigate(-1);
      }
    } catch (e) {
      console.warn(e);
      setErrorState({
        text: 'Deletion Unsuccessful.',
        open: true,
        style: errorStyles.error,
      });
    }
  };

  // Opens dialog elements based on id
  const openDialog = (id: string) => {
    const dialog: HTMLDialogElement = document.querySelector(`#${id}`)!;
    dialog.showModal();
  };

  // Checks if few required fields are populated
  const allRequiredInfoIsHere = () =>
    reimbursementRequest?.employeeId && approvals && approvals.length !== 0;

  // Checks if all elements have files.
  const allFilesAdded = () => {
    // Are both types of lists here?
    if (!approvals || !purchases) return false;

    // Remove any temporary or removed files
    const actualApprovalFiles = approvalFiles.filter(
      (file) => file.source !== 'temp' && !file.removed,
    );
    const actualPurchaseFiles = purchaseFiles.filter(
      (file) => file.source !== 'temp' && !file.removed,
    );

    // Do lists have all file objects?
    const allApprovalsHaveFiles = approvals.length === actualApprovalFiles.length;
    const allPurchasesHaveFiles = purchases.length === actualPurchaseFiles.length;

    return allApprovalsHaveFiles && allPurchasesHaveFiles;
  };

  // Are all files saved?
  const allFilesSaved = () => {
    // Remove any temporary or removed files
    const actualApprovalFiles = approvalFiles.filter(
      (file) => file.source !== 'temp' && !file.removed,
    );
    const actualPurchaseFiles = purchaseFiles.filter(
      (file) => file.source !== 'temp' && !file.removed,
    );

    // Check the downloaded property of each file
    return [...actualApprovalFiles, ...actualPurchaseFiles].every((file) => file.downloaded);
  };

  // When the update button is selected.
  const onUpdate = () => {
    if (!modalBypassState.current.incomplete && !(allRequiredInfoIsHere() && allFilesAdded())) {
      // Is all info filled in?
      openDialog('incompletePrompt');
    } else if (!modalBypassState.current.unsaved && !allFilesSaved()) {
      // Have all files been saved?
      openDialog('unsavedPrompt');
    } else {
      handleUpdate();
    }
  };

  // Marks all files in a list of Purchases or Approvals as downloaded
  const markAllFilesAsDownloaded = (list: IFile[]) =>
    list.map((file: IFile) => {
      const tempFile = { ...file };
      tempFile.downloaded = true;
      return tempFile;
    });

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const navigate = useNavigate();

  // General styling for form elements.
  const formControlStyle: CSSProperties = {
    width: '100%',
    marginBottom: '1em',
    ...normalFont,
  };

  return (
    <>
      {/* Modals Exist Here */}
      <DeletePrompt
        deleteHandler={handleDelete}
        title='Delete Request?'
        blurb={[
          'Are you sure you want to delete this request?',
          'This action will hide the request from the requestor and may only be undone by an administrator.',
        ]}
        id='deletePrompt'
      />
      <GeneralPrompt
        handler={() => {
          const dialog: HTMLDialogElement = document.querySelector(`#incompletePrompt`)!;
          dialog.close();
          modalBypassState.current = { ...modalBypassState.current, incomplete: true };
          onUpdate();
        }}
        title='Incomplete Request'
        blurb={[
          'This record is incomplete.',
          'It may be missing necessary information, such as attached files.',
          'Updating now will keep the status as Incomplete.',
          'Do you wish to continue?',
        ]}
        id='incompletePrompt'
      />
      <GeneralPrompt
        handler={() => {
          const dialog: HTMLDialogElement = document.querySelector(`#unsavedPrompt`)!;
          dialog.close();
          modalBypassState.current = { ...modalBypassState.current, unsaved: true };
          onUpdate();
        }}
        title='Unsaved Files'
        blurb={[
          'Not all files have been downloaded.',
          'Requests marked as Deleted or Complete may lose these files after 30 days.',
          'Download files and save them elsewhere to avoid file loss.',
        ]}
        id='unsavedPrompt'
      />
      {/* Start Actual Form */}
      <Paper
        sx={{
          padding: '1em',
          margin: '10px auto',
          maxWidth: '1000px',
        }}
      >
        <form>
          <Grid container spacing={2}>
            {/* ZERO-TH ROW */}
            <Grid container xs={12} sx={{ justifyContent: 'space-between', display: 'flex' }}>
              <Grid xs={12} sm={6}>
                <h4>Request ID: {reimbursementRequest?._id || 'No request found'}</h4>
              </Grid>
              <Grid
                xs={12}
                sm={5}
                alignItems='center'
                justifyContent={matches ? 'flex-end' : 'flex-start'}
                style={{ minWidth: '215px', display: 'flex' }}
              >
                <BackButton />
                <ActionButton
                  style={{ ...buttonStyles.primary, marginLeft: '1em' }}
                  handler={onUpdate}
                  ariaDescription='Updates the record with the info currently displayed.'
                >
                  Update
                </ActionButton>
                {isAdmin ? (
                  <>
                    <IconButton
                      onClick={handleClick}
                      size='small'
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      aria-label='More Options'
                    >
                      <MoreVertIcon fontSize='large' />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      id='account-menu'
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem
                        onClick={() => {
                          try {
                            getAllFiles(reimbursementRequest?._id || '', authState.accessToken);
                            setPurchaseFiles(markAllFilesAsDownloaded(purchaseFiles));
                            setApprovalFiles(markAllFilesAsDownloaded(approvalFiles));
                          } catch (e: any) {
                            setErrorState({
                              text: 'File could not be retrieved.',
                              open: true,
                              style: errorStyles.error,
                            });
                          }
                        }}
                      >
                        Download All Files
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate(`/user/${reimbursementRequest?.idir}`);
                        }}
                      >
                        View User&apos;s Requests
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          openDialog('deletePrompt');
                        }}
                      >
                        Delete Request
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            {/* FIRST ROW */}
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='requestor'>Requestor</FormLabel>
                <TextField
                  id='requestor'
                  name='requestor'
                  value={`${reimbursementRequest?.firstName} ${reimbursementRequest?.lastName}`}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='employeeID'>Employee ID</FormLabel>
                <TextField
                  id='employeeID'
                  name='employeeID'
                  value={reimbursementRequest?.employeeId || ''}
                  onChange={(e) => {
                    setReimbursementRequest({
                      ...reimbursementRequest,
                      employeeId: parseInt(e.target.value, 10),
                    } as ReimbursementRequest);
                  }}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='submissionDate'>Submission Date</FormLabel>
                <DatePicker value={dayjs(reimbursementRequest?.submissionDate)} disabled />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='status'>Status</FormLabel>
                <Select
                  id='status'
                  name='status'
                  value={reimbursementRequest?.state.toString() || ''}
                  defaultValue={reimbursementRequest?.state.toString() || ''}
                  onChange={(e) => {
                    setReimbursementRequest({
                      ...reimbursementRequest,
                      state: parseInt(e.target.value, 10),
                    } as ReimbursementRequest);
                  }}
                  disabled={!isAdmin}
                >
                  <MenuItem value={RequestStates.SUBMITTED}>
                    {convertStateToStatus(RequestStates.SUBMITTED)}
                  </MenuItem>
                  <MenuItem value={RequestStates.INPROGRESS}>
                    {convertStateToStatus(RequestStates.INPROGRESS)}
                  </MenuItem>
                  <MenuItem value={RequestStates.INCOMPLETE}>
                    {convertStateToStatus(RequestStates.INCOMPLETE)}
                  </MenuItem>
                  <MenuItem value={RequestStates.COMPLETE}>
                    {convertStateToStatus(RequestStates.COMPLETE)}
                  </MenuItem>
                  {reimbursementRequest?.state === RequestStates.DELETED ? (
                    <MenuItem value={RequestStates.DELETED}>
                      {convertStateToStatus(RequestStates.DELETED)}
                    </MenuItem>
                  ) : (
                    []
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* SECOND ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='purchases'>Purchases</FormLabel>
                <PurchaseTable
                  editable={!locked}
                  {...{ purchases, setPurchases, purchaseFiles, setPurchaseFiles }}
                />
              </FormControl>
            </Grid>

            {/* THIRD ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='approvals'>Approval Files</FormLabel>
                <ApprovalTable
                  editable={!locked}
                  {...{ approvals, setApprovals, approvalFiles, setApprovalFiles }}
                />
              </FormControl>
            </Grid>

            {/* FOURTH ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='additionalComments'>Additional Comments</FormLabel>
                <TextField
                  id='additionalComments'
                  multiline
                  rows={4}
                  value={reimbursementRequest?.additionalComments || ''}
                  onChange={(e) => {
                    setReimbursementRequest({
                      ...reimbursementRequest,
                      additionalComments: e.target.value,
                    } as ReimbursementRequest);
                  }}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default RequestForm;
