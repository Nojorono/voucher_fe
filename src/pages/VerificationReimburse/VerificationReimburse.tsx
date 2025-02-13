import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableVerifyReimburse from '../../components/Tables/DataTableVerifyReimburse';
import { stagingURL, signOut } from '../../utils';

const VerificationReimburse = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<any[]>([]);


  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Data tidak ditemukan di localStorage');
      setLoading(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${stagingURL}/api/list_reimburse/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('Data fetched:', result);

        const filteredData = result.filter((item: any) => item.status !== null);
        setData(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleRowSelected = (selectedRows: any[]) => {
    setSelectedRowIds(selectedRows); // Simpan semua data dari baris yang dipilih ke dalam state
  };

  // Definisikan kolom untuk DataTable
  const columns = [
    {
      name: "Kode Voucher",
      selector: (row: any) => row.voucher_code,
      sortable: true,
      cell: (row: any) => <div className="text-sm">{row.voucher_code}</div>,
    },
    {
      name: "Toko",
      selector: (row: any) => row.retailer_name,
      sortable: true,
      cell: (row: any) => <div className="text-sm">{row.retailer_name}</div>,
    },
    {
      name: "Agen",
      selector: (row: any) => row.wholesaler_name,
      sortable: true,
      cell: (row: any) => <div className="text-sm">{row.wholesaler_name}</div>,
    },
    {
      name: "Tanggal Reimburse",
      selector: (row: any) => row.reimbursed_at,
      sortable: true,
      cell: (row: any) => {
        const date = new Date(row.reimbursed_at);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return <div className="text-sm">{formattedDate}</div>;
      },
    },
    {
      name: "Status Reimburse",
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => (
        <div
        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${row.status === 'completed'
          ? 'bg-success text-success'
          : row.status === 'open'
            ? 'bg-danger text-danger'
            : row.status === 'waiting'
              ? 'bg-warning text-warning'
              : 'text-black'
          }`}
        >
          {row.status}
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  const onRefresh = () => {
    fetchData();
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-5">Reimburse Verification</h1>

      <DataTableVerifyReimburse
        columns={columns}
        data={data}
        selectableRows={false}
        onRowSelected={handleRowSelected}
        onRefresh={onRefresh}
      />

    </div>
  );
};

export default VerificationReimburse;
