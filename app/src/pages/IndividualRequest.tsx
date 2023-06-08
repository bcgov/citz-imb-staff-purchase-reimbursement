import { useCallback, useEffect, useState } from "react";
import { RequestStates, convertStateToStatus } from "../utils/convertState";
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

/**
 * @description A page showing an individual reimbursement requests and all its fields.
 * @returns A React element
 */
const IndividualRequest = () => {
  const [reimbursementRequest, setReimbursementRequest] = useState<ReimbursementRequest | undefined>(undefined);
  const [approvalFiles, setApprovalFiles] = useState<Array<IFile>>([]);
  const [approvals, setApprovals] = useState<Array<Approval>>([]);
  const [purchaseFiles, setPurchaseFiles] = useState<Array<IFile>>([]);
  const [purchases, setPurchases] = useState<Array<Purchase>>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { state: authState } = useAuthService();

  // Page permissions
  const isAdmin = authState.userInfo.client_roles?.includes('admin') || false;
  const [locked, setLocked] = useState<boolean>(false);

  // Fired when page is loaded. 
  useEffect(() => {
    getReimbursementRequest();
  }, []);

  const getReimbursementRequest = useCallback(async () => {
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

        // Set new states
        setReimbursementRequest(reimbursementRequest);
        setPurchases(reimbursementRequest.purchases);
        setPurchaseFiles(purchaseFileArray);
        
        if (reimbursementRequest.approvals){
          setApprovals(reimbursementRequest.approvals);
          setApprovalFiles(approvalFileArray)
        }

        // Determine locked status of fields. If not admin and the state of request is not INCOMPLETE, lock the fields.
        if (!isAdmin && reimbursementRequest.state !== RequestStates.INCOMPLETE){
          setLocked(true);
        }
      }
    } catch (e) {
      console.warn('Record could not be retrieved.');
    }
  }, []);

  // Fired when the record is updated (i.e. User selects UPDATE.)
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
          isAdmin: isAdmin
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

  // General styling for form elements.
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
                <ActionButton style={{ ...buttonStyles.primary, marginLeft: '1em', marginTop: '0.75em' }} handler={handleUpdate}>Update</ActionButton>
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
                  disabled={true}
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
                    setReimbursementRequest({...reimbursementRequest, employeeId: parseInt(e.target.value)} as ReimbursementRequest)
                  }}
                  disabled={locked}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={formControlStyle}>
                <FormLabel htmlFor='submissionDate'>Submission Date</FormLabel>
                  <DatePicker
                    value={dayjs(reimbursementRequest?.submissionDate)}
                    disabled={true}
                  />
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
                  setReimbursementRequest({...reimbursementRequest, state: parseInt(e.target.value)} as ReimbursementRequest)
                }}
                disabled={!isAdmin}
              >
                <MenuItem value={RequestStates.SUBMITTED}>{convertStateToStatus(RequestStates.SUBMITTED)}</MenuItem>
                <MenuItem value={RequestStates.INPROGRESS}>{convertStateToStatus(RequestStates.INPROGRESS)}</MenuItem>
                <MenuItem value={RequestStates.INCOMPLETE}>{convertStateToStatus(RequestStates.INCOMPLETE)}</MenuItem>
                <MenuItem value={RequestStates.COMPLETE}>{convertStateToStatus(RequestStates.COMPLETE)}</MenuItem>
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
                  onChange={(e) => {
                    setReimbursementRequest({...reimbursementRequest, additionalComments: e.target.value} as ReimbursementRequest)
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
}

export default IndividualRequest;
