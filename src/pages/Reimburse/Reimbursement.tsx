import { useEffect, useState } from 'react';
import DataTableReimburse from '../../components/Tables/DataTableReimburse';
import { stagingURL, signOut } from '../../utils';

const Reimbursement = () => {
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

    fetch(`${stagingURL}/api/list_vouchers/?ws_id=${ws_id}&redeemed=${redeemed}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
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
    setSelectedRowIds(selectedRows);
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
      selector: (row: any) => row.reimburse_status,
      sortable: true,

      cell: (row: any) => (
        <div
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${row.reimburse_status === 'closed'
            ? 'bg-success text-success'
            : row.reimburse_status === 'open'
              ? 'bg-danger text-danger'
              : row.reimburse_status === 'inprogress'
                ? 'bg-warning text-warning'
                : 'text-black'
            }`}
        >
          {row.reimburse_status || 'No Status'}
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
