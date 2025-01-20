// Verification.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stagingURL, signOut } from '../utils'
import DataTableComponent from '../components/Tables/DataTableComponent';
import { photoRetailer } from '../types/photoRetailer';
import Spinner from '../components/Spinner'

const Verification = () => {
  const navigate = useNavigate();
  const [dataPhoto, setDataPhoto] = useState<photoRetailer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token tidak ditemukan di localStorage');
      setLoading(false);
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
        setLoading(false);
        console.log('result', result.code);

        if (result.code == "token_not_valid") {
          signOut(navigate);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk memperbarui data setelah approval/reject
  const handleDataUpdate = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <div>
      {loading ? (
        <Spinner />) : (
        <DataTableComponent dataPhoto={dataPhoto} onUpdate={handleDataUpdate} />
      )}
    </div>
  );
};

export default Verification;