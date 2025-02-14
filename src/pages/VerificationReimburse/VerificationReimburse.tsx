import { useEffect, useState, useCallback } from 'react';
import DataTableVerifyReimburse from '../../components/Tables/DataTableVerifyReimburse';
import { stagingURL } from '../../utils';

const VerificationReimburse = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Data tidak ditemukan di localStorage');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${stagingURL}/api/list_reimburse/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        redirect: "follow"
      });

      const result = await response.json();      
      const filteredData = result.filter((item: any) => item.status !== null);
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRowSelected = (selectedRows: any[]) => {
    console.log(selectedRows);
  };

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

  return (
    <div>
      <h1 className="text-lg font-bold mb-5">Reimburse Verification</h1>
      <DataTableVerifyReimburse
        columns={columns}
        data={data}
        selectableRows={false}
        onRowSelected={handleRowSelected}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default VerificationReimburse;
