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
import RequestForm from "../components/custom/forms/RequestForm";

/**
 * @description A page showing an individual reimbursement requests and all its fields.
 * @returns A React element
 */
const IndividualRequest = () => {
  // TODO: Consolidate these states into a single state
  const [reimbursementRequest, setReimbursementRequest] = useState<ReimbursementRequest | undefined>(undefined);
  const [approvalFiles, setApprovalFiles] = useState<Array<IFile>>([]);
  const [approvals, setApprovals] = useState<Array<Approval>>([]);
  const [purchaseFiles, setPurchaseFiles] = useState<Array<IFile>>([]);
  const [purchases, setPurchases] = useState<Array<Purchase>>([]);
  const { id } = useParams();
  const { state: authState } = useAuthService();
  const navigate = useNavigate();

  // Page permissions
  const isAdmin = authState.userInfo.client_roles?.includes('admin') || false;
  const [locked, setLocked] = useState<boolean>(false);

  // Fired when page is loaded. 
  useEffect(() => {
    getReimbursementRequest();
  }, []);

  // Retrieves a single request's info
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

  return (
    <RequestForm {...{
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
      setApprovalFiles
    }}/>
  );
}

export default IndividualRequest;
