import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableReimburse from '../../components/Tables/DataTableReimburse';
import { stagingURL, signOut } from '../../utils';

const Reimbursement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<any[]>([]);


  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const ws_id = localStorage.getItem('ws_id');
    const redeemed = 1;

    if (!token && !ws_id) {
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

    fetch(`${stagingURL}/api/list_vouchers/?ws_id=${ws_id}&redemeed=${redeemed}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('res_Get', result);
        setData(result);
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


  const handleRowSelected = (selectedRows: any[]) => {
    setSelectedRowIds(selectedRows); // Simpan semua data dari baris yang dipilih ke dalam state
  };

  // Definisikan kolom untuk DataTable
  const columns = [
    {
      name: <div className="text-xl font-bold"> Voucher Code </div>,
      selector: (row: any) => row.voucher_code,
      sortable: true,
      cell: (row: any) => <div className="text-lg">{row.voucher_code}</div>,
    },
    {
      name: <div className="text-xl"> Status Reimburse </div>,
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => (
        <div className={`text-lg font-bold ${row.status === 'Approved' ? 'text-green-500' : row.status === 'On Proses' ? 'text-orange-500' : ''}`}>
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

  const dummyData = [
    { voucher_code: 'VC12345', status: 'Belum Ada Status' },
    { voucher_code: 'VC67890', status: 'On Proses' },
    { voucher_code: 'VC54321', status: 'Approved' },
    { voucher_code: 'VC09876', status: 'Belum Ada Status' },
    { voucher_code: 'VC11223', status: 'Approved' },
    { voucher_code: 'VC33445', status: 'Belum Ada Status' },
    { voucher_code: 'VC55667', status: 'On Proses' },
    { voucher_code: 'VC77889', status: 'Approved' },
    { voucher_code: 'VC99000', status: 'Belum Ada Status' },
    { voucher_code: 'VC11122', status: 'Approved' },
    { voucher_code: 'VC33344', status: 'Approved' },
    { voucher_code: 'VC55566', status: 'Belum Ada Status' },
    { voucher_code: 'VC77788', status: 'Approved' },
    { voucher_code: 'VC99900', status: 'Approved' },
    { voucher_code: 'VC12321', status: 'Belum Ada Status' }
  ];


  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Reimbursement</h1>

      <DataTableReimburse
        columns={columns}
        data={data}
        selectableRows={true}
        onRowSelected={handleRowSelected}
        onRefresh={onRefresh}
      />

    </div>
  );
};

export default Reimbursement;
