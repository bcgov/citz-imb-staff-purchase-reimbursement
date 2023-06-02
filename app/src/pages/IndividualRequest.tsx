import { useEffect, useState } from "react";
import { RequestStates } from "../utils/convertState";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Constants from "../constants/Constants";
import { ReimbursementRequest } from "../interfaces/ReimbursementRequest";
import { Paper, TextField, Select, FormControl, FormLabel, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { normalFont } from "../constants/fonts";
import PurchaseTable from "../components/custom/tables/PurchaseTable";
import ActionButton from "../components/bcgov/ActionButton";
import { buttonStyles } from "../components/bcgov/ButtonStyles";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuthService } from "../keycloak";
import ApprovalTable from "../components/custom/tables/ApprovalTable";
import { IFile } from "../interfaces/IFile";
import { Purchase } from "../interfaces/Purchase";
import { Approval } from "../interfaces/Approval";

const IndividualRequest = () => {
  const [reimbursementRequest, setReimbursementRequest] = useState<ReimbursementRequest | undefined>(undefined);
  const [requestState, setRequestState] = useState<RequestStates>(RequestStates.SUBMITTED);
  const [approvalFiles, setApprovalFiles] = useState<Array<IFile>>([]);
  const [approvals, setApprovals] = useState<Array<Approval>>([]);
  const [purchaseFiles, setPurchaseFiles] = useState<Array<IFile>>([]);
  const [purchases, setPurchases] = useState<Array<Purchase>>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { state: authState } = useAuthService();

  // TODO: Make this based off the user's keycloak roles
  const isAdmin = true;
  const locked = false;

  useEffect(() => {
    (async () => {
      try {
        const axiosReqConfig = {
          url: `${Constants.BACKEND_URL}/api/requests/${id}`,
          method: `get`,
          headers: {
            Authorization : `Bearer ${authState.accessToken}`
          }
        }
        let response = await axios(axiosReqConfig);
        if (response.status === 200) {
          
          // Populate values with existing record
          const reimbursementRequest: ReimbursementRequest = response.data;
          const purchaseFileArray : Array<IFile> = [];
          const approvalFileArray : Array<IFile> = [];
          if (reimbursementRequest.purchases.length > 0){
            reimbursementRequest.purchases.forEach((purchase, index) => {
              if (purchase.fileObj){
                purchaseFileArray.splice(index, 0, purchase.fileObj);
              }
            });
          }

          if (reimbursementRequest.approvals){
            reimbursementRequest.approvals.forEach((approval, index) => {
              if (approval.fileObj){
                approvalFileArray.splice(index, 0, approval.fileObj);
              }
            });
          }

          setReimbursementRequest(reimbursementRequest);
          setRequestState(reimbursementRequest.state);
          setPurchases(reimbursementRequest.purchases);
          setPurchaseFiles(purchaseFileArray);
          
          if (reimbursementRequest.approvals){
            setApprovals(reimbursementRequest.approvals);
            setApprovalFiles(approvalFileArray)
          }
        }
      } catch (e) {
        console.warn('Record could not be retrieved.');
      }
    })();
  }, []);

  const handleUpdate = async () => {
    // TODO: If approvals or purchases don't change, don't send back that info

    // Apply purchaseFiles to purchases
    const combinedPurchases = [...purchases];
    combinedPurchases.forEach((purchase, index) => {
      combinedPurchases[index].fileObj = purchaseFiles[index];
    });

    // Apply approvalFiles to approvals
    const combinedApprovals = [...approvals];
    combinedApprovals.forEach((approval, index) => {
      combinedApprovals[index].fileObj = approvalFiles[index];
    });

    try {
      const axiosReqConfig = {
        url: `${Constants.BACKEND_URL}/api/requests/${id}`,
        method: `patch`,
        headers: {
          Authorization : `Bearer ${authState.accessToken}`
        },
        data: {
          ...reimbursementRequest,
          purchases: combinedPurchases,
          approvals: combinedApprovals,
          state: requestState
        }
      }
      let response = await axios(axiosReqConfig);
      if (response.status === 200) {
        // Return to home page
        navigate('/');
      }
    } catch (e) {
      console.warn('Record could not be updated.');
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
        margin: '10px auto',
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
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='submissionDate'>Submission Date</FormLabel>
                  <DatePicker
                    value={dayjs(reimbursementRequest?.submissionDate)}
                    disabled={locked}
                  />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
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
                disabled={locked}
              >
                <MenuItem value={RequestStates.SUBMITTED}>Submitted</MenuItem>
                <MenuItem value={RequestStates.INPROGRESS}>In Progress</MenuItem>
                <MenuItem value={RequestStates.DENIED}>Denied</MenuItem>
                <MenuItem value={RequestStates.APPROVED}>Approved</MenuItem>
              </Select>
            </FormControl>          
            </Grid>

            {/* SECOND ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='purchases'>Purchases</FormLabel>
                <PurchaseTable editable={!locked} {...{ purchases, setPurchases, purchaseFiles, setPurchaseFiles }}/>
              </FormControl>
            </Grid>

            {/* THIRD ROW */}
            <Grid xs={12}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='approvals'>Approval Files</FormLabel>
                <ApprovalTable editable={!locked} {...{ approvals, setApprovals, approvalFiles, setApprovalFiles }}/>
              </FormControl>
            </Grid>

            {/* FOURTH ROW */}
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
