import { useEffect, useState } from 'react';
import Constants from '../constants/Constants';
import axios from 'axios';
import RequestsTable from '../components/custom/tables/RequestsTable';

const homeStyle = {
  maxWidth: '100%',
  minWidth: '50%',
  width: 'fit-content',
  margin: '2em auto'
}

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
    <div style={homeStyle}>
      <RequestsTable data={data} />
    </div>
  );
}

export default Home;
