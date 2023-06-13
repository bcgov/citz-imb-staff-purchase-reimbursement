import { 
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import HeaderCell from './HeaderCell';
import CustomTableCell from './CustomTableCell';
import { ReimbursementRequest } from '../../../interfaces/ReimbursementRequest';
import { RequestStates, convertStateToStatus } from '../../../utils/convertState';
import { bcgov } from '../../../constants/colours';
import LinkButton from '../../bcgov/LinkButton';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { useEffect, useRef, useState } from 'react';
import { useAuthService } from '../../../keycloak';
import { Symbols } from '../searchFields/CurrencyComparer';
// Date Picker 
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import CurrencyComparer from '../searchFields/CurrencyComparer';

/**
 * @interface
 * @description Properties passed to the RequestsTable component.
 * @property {Array} data - An array of ReimbursementRequests. See the ReimbursementRequest interface.
 */
interface RequestTableProps {
  data: Array<ReimbursementRequest>
}

/**
 * @description A table containing a series of reimbursement requests.
 * @param {RequestTableProps} props Properties passed to RequestsTable. 
 * @returns A React table element.
 */
const RequestsTable = (props: RequestTableProps) => {
  const [data, setData] = useState<Array<ReimbursementRequest>>(props.data);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [dataManipulator, setDataManipulator] = useState<Record<string, any>>({
    requestor: {
      filter: '',
      sort: 0
    },
    suppliers: {
      filter: '',
      sort: 0
    },
    cost: {
      filter: {
        symbol: Symbols.GT,
        value: ''
      },
      sort: 0
    },
    submissionDate: {
      filter: {
        startDate: undefined,
        endDate: undefined
      },
      sort: 0
    }, 
    status: {
      filter: undefined,
      sort: 0
    }
  });
  const costSymbol = useRef('>=');
  const { state: authState } = useAuthService();
  const isAdmin = authState.userInfo.client_roles?.includes('admin');

  useEffect(() => {
    const newData = filterData(props.data) || props.data;
    setData(newData);
  }, [props.data, dataManipulator, showDeleted]);

  const filterData = (data: Array<ReimbursementRequest>) => {
    // If every filter is default, return data as is.
    if (dataManipulator.requestor.filter === '' &&
        dataManipulator.suppliers.filter === '' &&
        dataManipulator.submissionDate.filter === undefined &&
        dataManipulator.status.filter === undefined){
          return data;
        }

    let filteredData: Array<ReimbursementRequest> = data.filter(request => {
      // Remove deleted entries
      if (!showDeleted && request.state === RequestStates.DELETED){
        return false;
      }

      // Check if requestor matches
      const requestorMatch = () => {
        if (
          request.firstName.toLowerCase().includes(dataManipulator.requestor.filter.toLowerCase()) ||
          request.lastName.toLowerCase().includes(dataManipulator.requestor.filter.toLowerCase())){
          return true;
        }
        return false;
      }

      // Check if any suppliers match
      const suppliersMatch = () => {
        if (
          request.purchases.some(purchase => purchase.supplier.toLowerCase().includes(dataManipulator.suppliers.filter.toLowerCase()))){
          return true;
        }
        return false;
      }

      // Check if the currency value matches the filter
      const costMatch = () => {
        const costValue: string = dataManipulator.cost.filter.value;
        const costSymbol: Symbols = dataManipulator.cost.filter.symbol;
        if (costValue === '') return true; // Always include if no value
        if (!parseFloat(costValue)) return true; // Always return if it's NaN. (Junk entered in filter)

        const costValueInt = parseFloat(costValue);
       
        if (costSymbol === Symbols.GT){
           // If comparing for greater than
          if (parseFloat(request.purchases.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2)) >= costValueInt) return true;
          else return false;
        } else if (costSymbol === Symbols.LT){
           // If comparing for less than
          if (parseFloat(request.purchases.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2)) <= costValueInt) return true;
          else return false;
        }
        return false;
      }

      // Check if date falls on or between the start and end date selected
      // Dates from the date picker are in UTC, but so are the submissionDates.
      const dateMatch = () => {
        const startDate = dataManipulator.submissionDate.filter.startDate;
        const endDate = dataManipulator.submissionDate.filter.endDate;
        const recordDate = new Date(request.submissionDate).getTime();
        if (!startDate && !endDate) return true;
        if (
          startDate && 
          endDate &&
          recordDate >= startDate &&
          recordDate <= endDate){
            return true;
        }
        return false;
      }

      // Decide if this record is included in filter
      if (requestorMatch() && suppliersMatch() && costMatch() && dateMatch()) return true;

      // If not matching any of the above, don't include
      return false;
    });
    return filteredData;
  };

  const updateCostFilter = (e: any) => {
    const regex = /^[0-9\.]*$/;
    if (regex.test(e.target.value)){
      setDataManipulator({
        ...dataManipulator,
        cost: {
          ...dataManipulator.cost,
          filter: {
            ...dataManipulator.cost.filter,
            value: e.target.value
          }
        }
      });
    }
  }

  const changeSymbol = () => {
    const symbolDiv = document.getElementById('symbol');
    if (symbolDiv){
      if (dataManipulator.cost.filter.symbol === Symbols.GT){
        setDataManipulator({
          ...dataManipulator,
          cost: {
            ...dataManipulator.cost,
            filter: {
              ...dataManipulator.cost.filter,
              symbol: Symbols.LT
            }
          }
        });
        symbolDiv.innerHTML = '<=';
      } else {
        setDataManipulator({
          ...dataManipulator,
          cost: {
            ...dataManipulator.cost,
            filter: {
              ...dataManipulator.cost.filter,
              symbol: Symbols.GT
            }
          }
        });
        symbolDiv.innerHTML = '>=';
      }
    }
  }

  const updateManipulator = (e: any) => {
    let tempManipulator = { ...dataManipulator };
    tempManipulator[e.target.id].filter = e.target.value;
    setDataManipulator(tempManipulator);
  }

  const filterStyle = {
    display: 'block',
    maxWidth: '14em',
    marginTop: '5px'
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <HeaderCell>
              Requestor Name
              <TextField 
                id='requestor'
                variant='standard' 
                sx={{
                  ...filterStyle
                }}
                value={dataManipulator.requestor.filter}
                onChange={updateManipulator}
              />
            </HeaderCell>
            <HeaderCell>
              Suppliers
              <TextField 
                id='suppliers'
                variant='standard' 
                sx={{
                  ...filterStyle
                }}
                onChange={updateManipulator}
              />
            </HeaderCell>
            <HeaderCell>
              Total Cost
              <CurrencyComparer 
                sx={{...filterStyle}}
                onChange={updateCostFilter}
                {...{changeSymbol}}
              />
            </HeaderCell>
            <HeaderCell>
              Submission Date
              <DateRangePicker
                id='submissionDate'
                editable={false}
                placeholder='Select Range'
                style={{
                  ...filterStyle
                }}
                onClean={(e) => {
                  if (e){
                    let tempManipulator = { ...dataManipulator };
                    tempManipulator.submissionDate.filter.startDate = undefined; // From the beginning of this day
                    tempManipulator.submissionDate.filter.endDate = undefined; // To the end of this day
                    setDataManipulator(tempManipulator);
                  }
                }}
                onChange={(e) => {
                  if (e){
                    let tempManipulator = { ...dataManipulator };
                    tempManipulator.submissionDate.filter.startDate = new Date(e[0]).setHours(0,0,0,0); // From the beginning of this day
                    tempManipulator.submissionDate.filter.endDate = new Date(e[1]).setHours(23,59,59,0); // To the end of this day
                    setDataManipulator(tempManipulator);
                  }
                }}
              />
            </HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { !data || data.length === 0
          ? <TableRow><CustomTableCell>No requests available.</CustomTableCell></TableRow>
          : data.map((row, index) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: index % 2 === 0 ? bcgov.white : bcgov.backgroundSecondary }}
            >
              <CustomTableCell>{`${row.firstName} ${row.lastName}`}</CustomTableCell>
              <CustomTableCell><span style={{whiteSpace: 'pre-line'}}>{row.purchases.map(purchase => purchase.supplier).join(',\n')}</span></CustomTableCell>
              <CustomTableCell>{`$${row.purchases.reduce((total, purchase) => total + purchase.cost, 0).toFixed(2)}`}</CustomTableCell>
              <CustomTableCell>{new Date(row.submissionDate).toLocaleDateString()}</CustomTableCell>
              <CustomTableCell>{convertStateToStatus(row.state)}</CustomTableCell>
              <CustomTableCell><LinkButton link={`/request/${row._id}`} style={buttonStyles.primary}>More</LinkButton></CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RequestsTable;
