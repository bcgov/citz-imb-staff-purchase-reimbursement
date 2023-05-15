import { useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';
import { headerFont } from '../constants/fonts';

const Home = () => {
  const [data, setData] = useState([]);
  const { BACKEND_URL } = Constants;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/requests?minimal=true`)
        setData(data);
      } catch (e) {
        console.warn('Server could not be reached.');
      }
    })();
  }, []);

  return (
    <>
      <h2 style={headerFont}>Reimbursement Requests</h2>
      <RequestsTable data={data} />
    </>
  );
}

export default Home;
