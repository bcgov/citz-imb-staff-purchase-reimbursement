import './App.css'
import NavigationBar from './components/bcgov/NavigationBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';
import RequestsTable from './components/custom/tables/RequestsTable';
import { normalFont } from './constants/fonts';
import HeaderCell from './components/custom/tables/HeaderCell';
import { ReimbursementRequest } from './interfaces/ReimbursementRequest';

const App = () => {
  const data : ReimbursementRequest= {
    firstName: "Joe",
    lastName: "Smith",
    employeeId: 123456,
    idir: "W0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0",
    itemsPurchased: [
      "Toothpaste",
      "Oranges"
    ],
    totalCost: 34.55,
    purchaseDate: "2023-05-01T00:00:00-07:00",
    attachReceipts: [
      {
        storage: "chefs",
        url: "/app/api/v1/files/fd667f16-bd58-416d-bf74-2011a53361a8",
        size: 9234,
        data: {
          id: "fd667f16-bd58-416d-bf74-2011a53361a8"
        },
        originalName: "myfile.pdf"
      }
    ],
    approvalDate: "2023-05-01T00:00:00-07:00",
    attachApproval: [
      {
        storage: "chefs",
        url: "/app/api/v1/files/fd667f16-bd58-416d-bf74-2011a53361a8",
        size: 9234,
        data: {
          id: "fd667f16-bd58-416d-bf74-2011a53361a8"
        },
        originalName: "myfile.pdf"
      }
    ],
    supplierName: "Walmart",
    supplierPhoneNumber: "(234) 234-2345",
    supplierEmail: "joesmith@gmail.com",
    additionalComments: "Have a good day!",
    submissionDate: "2023-04-25T16:51:31.929Z",
    state: 0,
    _id: "64480513a30c8be7b83d9593"
  };
  return (
    <BrowserRouter>
      <div style={{...normalFont}} className='App'>
        <NavigationBar />
        <Routes>
          <Route index element={<RequestsTable data={[data, data, data]}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
