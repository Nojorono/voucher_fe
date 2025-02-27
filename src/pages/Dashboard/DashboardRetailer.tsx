import React, { useEffect, useState, useMemo } from 'react';
import DataTableRetailer from '../../components/Tables/DataTableRetailer';
import { stagingURL } from '../../utils/';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';

interface RetailerData {
  agen_name: string;
  voucher_status: string;
  retailer_name: string;
  phone_number: string;
  address: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  voucher_code: string;
}

const DashboardRetailer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RetailerData[]>([]);
  const [voucherStatusFilter, setVoucherStatusFilter] = useState<string>('');

  const statusClasses: { [key: string]: string } = useMemo(() => ({
    'REJECTED': 'bg-red text-white',
    'PENDING': 'bg-white text-black',
    'RECEIVING': 'bg-yellow-300 text-yellow-800',
    'REDEEMED': 'bg-blue-500 text-white',
    'WAITING REIMBURSE': 'bg-purple-500 text-white',
    'REIMBURSE COMPLETED': 'bg-green-300 text-white',
    'REIMBURSE PAID': 'bg-green-800 text-white',
  }), []);

  const statusMapping: { [key: string]: string } = {
    'WAITING REIMBURSE': 'WAITING',
    'REIMBURSE COMPLETED': 'COMPLETED',
    'REIMBURSE PAID': 'PAID',
  };


  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Data tidak ditemukan di localStorage');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${stagingURL}/api/report/list_retailers/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
     
      console.log('result', result);
      

      const filteredData = result.filter((item: RetailerData) => item.voucher_status !== null);
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (voucherStatusFilter) {
      return data.filter((item) => item.voucher_status === voucherStatusFilter);
    }
    return data;
  }, [data, voucherStatusFilter]);


  const columns = useMemo(() => {
    return [
      {
        name: 'Voucher Status',
        selector: (row: RetailerData) => row.voucher_status,
        sortable: true,
        cell: (row: RetailerData) => {
          const transformedStatus = statusMapping[row.voucher_status] || row.voucher_status;
          return (
            <div
              className={`inline-flex rounded-full py-1 px-3 ${statusClasses[row.voucher_status] || 'bg-gray-200 text-gray-800'}`}
              style={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              {transformedStatus}
            </div>
          );
        }
      },
      {
        name: 'Agen',
        selector: (row: RetailerData) => row.agen_name,
        sortable: true,
      },
      {
        name: 'Toko',
        selector: (row: RetailerData) => row.retailer_name,
        sortable: true,
      },
      {
        name: 'Whatsapp',
        selector: (row: RetailerData) => row.phone_number,
        sortable: true,
      },
      {
        name: 'Alamat',
        selector: (row: RetailerData) => row.address,
        sortable: true,
      },
      {
        name: 'Provinsi',
        selector: (row: RetailerData) => row.provinsi,
        sortable: true,
      },
      {
        name: 'Kota',
        selector: (row: RetailerData) => row.kota,
        sortable: true,
      },
      {
        name: 'Kecamatan',
        selector: (row: RetailerData) => row.kecamatan,
        sortable: true,
      },
      {
        name: 'Kelurahan',
        selector: (row: RetailerData) => row.kelurahan,
        sortable: true,
      },
      {
        name: 'Kode Voucher',
        selector: (row: RetailerData) => row.voucher_code,
        sortable: true,
      },
    ];
  }, [statusClasses]);

  const exportToExcel = (fileName: string) => {
    const modifiedData = filteredData.map((item) => ({
      'Agen': item.agen_name,
      'Voucher Status': item.voucher_status,
      'Toko': item.retailer_name,
      'WhatsApp': item.phone_number,
      'Alamat': item.address,
      'Provinsi': item.provinsi,
      'Kota': item.kota,
      'Kecamatan': item.kecamatan,
      'Kelurahan': item.kelurahan,
      'Kode Voucher': item.voucher_code,
    }));

    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Add footnote
    const footnote = [
      [''],
      ['Voucher Status :'],
      ['PENDING: menunggu verifikasi photo retailer oleh Admin'],
      ['RECEIVED: photo retailer sudah diverifikasi, dan retailer mendapatkan nomor voucher'],
      ['REDEEMED: voucher sudah digunakan oleh retailer'],
      ['WAITING PAYMENT: reimbursement agen sedang di proses'],
      ['PAYMENT COMPLETED: reimbursement sudah dibayar'],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, footnote, { origin: -1 });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-lg font-bold mb-5">Report All Retailers & Vouchers</h1>

      <div className="col-span-12 flex items-center justify-between mb-4">
        
        <select
          value={voucherStatusFilter}
          onChange={(e) => setVoucherStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="RECEIVED">RECEIVED</option>
          <option value="REDEEMED">REDEEMED</option>
          <option value="WAITING REIMBURSE">WAITING REIMBURSE</option>
          <option value="REIMBURSE COMPLETED">REIMBURSE COMPLETED</option>
          <option value="REIMBURSE PAID">REIMBURSE PAID</option>
        </select>

        <button
          onClick={() => exportToExcel('report_retailers')}
          className="bg-blue-300 text-white py-1 px-2 rounded flex items-center"
        >
          <FaFileExcel className="mr-2" />
          Export to Excel
        </button>
      </div>

      <DataTableRetailer columns={columns} data={filteredData} selectableRows={false} />
    </>
  );
};

export default DashboardRetailer;
