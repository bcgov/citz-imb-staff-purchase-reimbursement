import { useEffect, useState } from "react";
import { RequestStates } from "../utils/convertState";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Constants from "../constants/Constants";
import { ReimbursementRequest } from "../interfaces/ReimbursementRequest";
import { Paper, TextField, Select, FormControl, FormLabel, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { normalFont } from "../constants/fonts";
import ItemsPurchasedTable from "../components/custom/tables/ItemsPurchasedTable";
import FileAttachmentTable from "../components/custom/tables/FileAttachmentTable";
import ActionButton from "../components/bcgov/ActionButton";
import { buttonStyles } from "../components/bcgov/ButtonStyles";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const IndividualRequest = () => {
  const [reimbursementRequest, setReimbursementRequest] = useState<ReimbursementRequest | undefined>(undefined);
  const [requestState, setRequestState] = useState<RequestStates>(RequestStates.SUBMITTED);
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const locked = true;
  // TODO: Made this based off the user's keycloak roles
  const isAdmin = true;

  useEffect(() => {
    (async () => {
      try {
        const axiosReqConfig = {
          url: `${Constants.BACKEND_URL}/api/requests/${id}`,
          method: `get`,
        }
        let response = await axios(axiosReqConfig);
        if (response.status === 200) {
          // Populate values with existing record
          const reimbursementRequest: ReimbursementRequest = response.data;
          setReimbursementRequest(reimbursementRequest);
          setRequestState(reimbursementRequest.state);
        }
      } catch (e) {
        console.warn('Record could not be retrieved.');
      }
    })();
  }, []);

  const handleUpdate = async () => {
    try {
      const axiosReqConfig = {
        url: `${Constants.BACKEND_URL}/api/requests/${id}`,
        method: `patch`,
        data: {
          state: requestState
        }
      }
      let response = await axios(axiosReqConfig);
      if (response.status === 200) {
        // Return to home page
        navigate('/');
      }
    } catch (e) {
      console.warn('Record could not be retrieved.');
    }
  }

  const formControlStyle : React.CSSProperties = {
    width: '100%',
    marginBottom: '1em',
    ...normalFont
  }

  return (
    <>
      <Paper sx={{
        padding: '1em',
        marginTop: '75px',
        maxWidth: '1000px'
      }}>
        <form>
          <Grid container spacing={2}>
            {/* ZERO-TH ROW */}
            <Grid container xs={12} sx={{ justifyContent: 'space-between', display: 'flex' }}>
              <Grid xs={12} sm={6}><h4>Request ID: {reimbursementRequest?._id || 'No request found'}</h4></Grid>
              <Grid xs={12} sm={5} alignItems='center' justifyContent={matches ? 'flex-end' : 'flex-start'} style={{  minWidth: '215px', display: 'flex' }}>
                <ActionButton style={{ ...buttonStyles.secondary, marginTop: '0.75em' }} handler={() => {navigate('/')}}>Back</ActionButton>
                {
                  isAdmin
                  ? <ActionButton style={{ ...buttonStyles.primary, marginLeft: '1em', marginTop: '0.75em' }} handler={handleUpdate}>Update</ActionButton>
                  : <></>
                }
              </Grid>
            </Grid>
            {/* FIRST ROW */}
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='requestor'>Requestor</FormLabel>
                <TextField 
                  id='requestor'
                  name='requestor'
                  value={`${reimbursementRequest?.firstName} ${reimbursementRequest?.lastName}`}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='submissionDate'>Submission Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(reimbursementRequest?.submissionDate)}
                    disabled={locked}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
            <FormControl sx={formControlStyle}>
              <FormLabel htmlFor='status'>Status</FormLabel>
              <Select
                id='status'
                name='status'
                value={requestState.toString()}
                defaultValue={requestState.toString()}
                onChange={(e) => {
                  setRequestState(parseInt(e.target.value));
                }}
                disabled={!isAdmin}
              >
                <MenuItem value={RequestStates.SUBMITTED}>Submitted</MenuItem>
                <MenuItem value={RequestStates.INPROGRESS}>In Progress</MenuItem>
                <MenuItem value={RequestStates.DENIED}>Denied</MenuItem>
                <MenuItem value={RequestStates.APPROVED}>Approved</MenuItem>
              </Select>
            </FormControl>          
            </Grid>
            {/* SECOND ROW */}
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='employeeID'>Employee ID</FormLabel>
                <TextField 
                  id='employeeID'
                  name='employeeID'
                  value={reimbursementRequest?.employeeId || ''}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='purchaseDate'>Purchase Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(reimbursementRequest?.purchaseDate)}
                    disabled={locked}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='totalCost'>Total Cost</FormLabel>
                <TextField 
                  id='totalCost'
                  name='totalCost'
                  value={`$ ${reimbursementRequest?.totalCost || ''}`}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            {/* THIRD ROW */}
            <Grid xs={12} md={7}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='itemsPurchased'>Items Purchased</FormLabel>
                <ItemsPurchasedTable data={reimbursementRequest?.itemsPurchased || []} />
              </FormControl>
            </Grid>
            <Grid xs={12} md={5}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='attachReceipts'>Receipts</FormLabel>
                <FileAttachmentTable data={reimbursementRequest?.attachReceipts || []}/>
              </FormControl>
            </Grid>
            {/* FOURTH ROW */}
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='approvalDate'>Approval Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(reimbursementRequest?.approvalDate)}
                    disabled={locked}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={8}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='attachApproval'>Approval Files</FormLabel>
                <FileAttachmentTable data={reimbursementRequest?.attachApproval || []}/>
              </FormControl>
            </Grid>
            {/* FIFTH ROW */}
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='supplierName'>Supplier Name</FormLabel>
                <TextField 
                  id='supplierName'
                  name='supplierName'
                  value={reimbursementRequest?.supplierName || ''}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='supplierPhoneNumber'>Supplier Phone</FormLabel>
                <TextField 
                  id='supplierPhoneNumber'
                  name='supplierPhoneNumber'
                  value={reimbursementRequest?.supplierPhoneNumber || ''}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='supplierEmail'>Supplier Email</FormLabel>
                <TextField 
                  id='supplierEmail'
                  name='supplierEmail'
                  value={reimbursementRequest?.supplierEmail || ''}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            {/* SIXTH ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
              <FormLabel htmlFor='additionalComments'>Additional Comments</FormLabel>
                <TextField
                  id="additionalComments"
                  multiline
                  rows={4}
                  value={reimbursementRequest?.additionalComments || ''}
                  disabled={locked}
                />
              </FormControl> 
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

export default IndividualRequest;
