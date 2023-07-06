import { useCallback, useEffect, useState } from 'react';
import { RequestStates } from '../utils/convertState';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Constants from '../constants/Constants';
import { ReimbursementRequest } from '../interfaces/ReimbursementRequest';
import { useAuthService } from '../keycloak';
import { IFile } from '../interfaces/IFile';
import { Purchase } from '../interfaces/Purchase';
import { Approval } from '../interfaces/Approval';
import RequestForm from '../components/custom/forms/RequestForm';
import BackButton from '../components/bcgov/BackButton';
import { marginBlock } from '../constants/styles';

/**
 * @description A page showing an individual reimbursement requests and all its fields.
 * @returns A React element
 */
const IndividualRequest = () => {
  // TODO: Consolidate these states into a single state
  const [reimbursementRequest, setReimbursementRequest] = useState<
    ReimbursementRequest | undefined
  >(undefined);
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
  const [showRecord, setShowRecord] = useState<boolean>(true);

  console.log(purchaseFiles);

  // Fired when page is loaded.
  useEffect(() => {
    getReimbursementRequest();
  }, []);

  const tempFile: IFile = {
    file: '',
    name: '',
    size: 0,
    date: new Date(Date.now()).toISOString(),
    deleted: false,
    downloaded: false,
    removed: false,
  };

  // Retrieves a single request's info
  const getReimbursementRequest = useCallback(async () => {
    try {
      const axiosReqConfig = {
        url: `${Constants.BACKEND_URL}/api/requests/${id}`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      };
      const response = await axios(axiosReqConfig);
      if (response.status === 200) {
        // Populate values with existing record
        const reimbursementRequest: ReimbursementRequest = response.data;

        // These arrays need to be as pre-populated, otherwise slice has unexpected behaviour with 0-length lists.
        const purchaseFileArray: Array<IFile> = Array<IFile>(
          reimbursementRequest.purchases.length,
        ).fill(tempFile);
        const approvalFileArray: Array<IFile> = Array<IFile>(
          reimbursementRequest.approvals?.length || 0,
        ).fill(tempFile);

        if (reimbursementRequest.purchases.length > 0) {
          reimbursementRequest.purchases.forEach((purchase, index) => {
            if (purchase.fileObj) {
              purchaseFileArray.splice(index, 0, purchase.fileObj);
            }
          });
        }

        if (reimbursementRequest.approvals) {
          reimbursementRequest.approvals.forEach((approval, index) => {
            if (approval.fileObj) {
              approvalFileArray.splice(index, 0, approval.fileObj);
            }
          });
        }

        // Set new states
        setReimbursementRequest(reimbursementRequest);
        setPurchases(reimbursementRequest.purchases);
        setPurchaseFiles(purchaseFileArray);

        if (reimbursementRequest.approvals) {
          setApprovals(reimbursementRequest.approvals);
          setApprovalFiles(approvalFileArray);
        }

        // Determine locked status of fields. If not admin and the state of request is not INCOMPLETE, lock the fields.
        if (!isAdmin && reimbursementRequest.state !== RequestStates.INCOMPLETE) {
          setLocked(true);
        }
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const { status } = e.response!;
        switch (status) {
          case 401:
            console.warn('User is unauthenticated. Redirecting to login.');
            window.location.reload();
            break;
          case 403:
            console.warn('User is not authorized to view record.');
            // Request was not a success. User didn't get a record back, so don't show the form.
            setShowRecord(false);
            break;
          case 404:
            // Record doesn't exist
            navigate(-1);
            break;
          default:
            console.warn(e);
            break;
        }
      } else {
        console.warn(e);
      }
    }
  }, []);

  // Fired when the record is updated (i.e. User selects UPDATE.)
  const handleUpdate = async () => {
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
          Authorization: `Bearer ${authState.accessToken}`,
        },
        data: {
          ...reimbursementRequest,
          purchases: combinedPurchases,
          approvals: combinedApprovals.filter((approval) => approval.fileObj),
          isAdmin,
        },
      };
      const response = await axios(axiosReqConfig);
      if (response.status === 200) {
        sessionStorage.removeItem('target-page');
        // Return to home page
        navigate(-1);
      }
    } catch (e) {
      console.warn('Record could not be updated.');
    }
  };

  return showRecord ? (
    <RequestForm
      {...{
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
      }}
    />
  ) : (
    <>
      <h1>You do not have access to this record.</h1>
      <p style={marginBlock}>
        If you think you are seeing this by mistake, contact your administrator.
      </p>
      <BackButton />
    </>
  );
};

export default IndividualRequest;
