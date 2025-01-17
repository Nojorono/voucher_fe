// Verification.tsx
import { useEffect, useState } from 'react';
import { stagingURL } from '../utils/API'
import DataTableComponent from '../components/Tables/DataTableComponent';
import { photoRetailer } from '../types/photoRetailer';

const Verification = () => {
  const [dataPhoto, setDataPhoto] = useState<photoRetailer[]>([]);

  const fetchData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan di localStorage');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow' as RequestRedirect,
    };

    fetch(`${stagingURL}/api/list_photos/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setDataPhoto(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <DataTableComponent dataPhoto={dataPhoto} />
    </div>
  );
};

export default Verification;