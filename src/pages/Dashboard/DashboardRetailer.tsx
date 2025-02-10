// import { useEffect, useState } from 'react';
// import DataTableRetailer from '../../components/Tables/DataTableRetailer'
// import { stagingURL } from '../../utils/';
// import React from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import { FaFileExcel } from 'react-icons/fa';


// const DashboardRetailer: React.FC = () => {

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<any[]>([]);

//   const fetchData = () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');

//     if (!token) {
//       console.error('Data tidak ditemukan di localStorage');
//       setLoading(false);
//       return;
//     }

//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);
//     myHeaders.append("Content-Type", "application/json");

//     const requestOptions: RequestInit = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow"
//     };

//     fetch(`${stagingURL}/api/report/list_retailers/`, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {

//         const filteredData = result.filter((item: any) => item.status !== null);
//         setData(filteredData);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = [
//     {
//       name: 'Voucher Status',
//       selector: (row: any) => row.voucher_status,
//       sortable: true,
//       cell: (row: any) => row.voucher_status,
//     },
//     {
//       name: "Agen",
//       selector: (row: any) => row.agen_name,
//       sortable: true,
//       cell: (row: any) => row.agen_name,
//     },
//     {
//       name: "Toko",
//       selector: (row: any) => row.retailer_name,
//       sortable: true,
//       cell: (row: any) => row.retailer_name,
//     },
//     {
//       name: "WhatsApp",
//       selector: (row: any) => row.phone_number,
//       sortable: true,
//       cell: (row: any) => row.phone_number,
//     },
//     {
//       name: "Alamat",
//       selector: (row: any) => row.address,
//       sortable: true,
//       cell: (row: any) => row.address,
//     },
//     {
//       name: "Provinsi",
//       selector: (row: any) => row.provinsi,
//       sortable: true,
//       cell: (row: any) => row.provinsi
//     },
//     {
//       name: "Kota",
//       selector: (row: any) => row.kota,
//       sortable: true,
//       cell: (row: any) => row.kota,
//     },
//     {
//       name: "Kecamatan",
//       selector: (row: any) => row.kecamatan,
//       sortable: true,
//       cell: (row: any) => row.kecamatan,
//     },
//     {
//       name: "Kelurahan",
//       selector: (row: any) => row.kelurahan,
//       sortable: true,
//       cell: (row: any) => row.kelurahan,
//     },
//     {
//       name: 'Kode Voucher',
//       selector: (row: any) => row.voucher_code,
//       sortable: true,
//       cell: (row: any) => row.voucher_code,
//     },

//   ];

//   const exportToExcel = (fileName: string) => {
//     const modifiedData = data.map((item) => {
//       const {
//         agen_name,
//         voucher_status,
//         retailer_name,
//         phone_number,
//         address,
//         provinsi,
//         kota,
//         kecamatan,
//         kelurahan,
//         voucher_code,
//       } = item;

//       return {
//         "Agen": agen_name,
//         "Voucher Status": voucher_status,
//         "Toko": retailer_name,
//         "WhatsApp": phone_number,
//         "Alamat": address,
//         "Provinsi": provinsi,
//         "Kota": kota,
//         "Kecamatan": kecamatan,
//         "Kelurahan": kelurahan,
//         "Kode Voucher": voucher_code
//       };
//     });

//     // Step 2: Create the Excel sheet from the modified data
//     const worksheet = XLSX.utils.json_to_sheet(modifiedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     // Step 3: Write the workbook to a buffer and save the file
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, `${fileName}.xlsx`);

//   }


//   return (
//     <>
//       <div className="">
//         <div className="col-span-12">

//           <button onClick={() => exportToExcel("report_retailers")} className="mb-4 bg-blue-300 text-white py-1 px-2 rounded flex items-center">
//             <FaFileExcel className="mr-2" />
//             Export to Excel
//           </button>

//           <DataTableRetailer
//             columns={columns}
//             data={data}
//             selectableRows={false}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardRetailer;



import { useEffect, useState } from 'react';
import DataTableRetailer from '../../components/Tables/DataTableRetailer';
import { stagingURL } from '../../utils/';
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';

const DashboardRetailer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]); // Added filteredData state
  const [voucherStatusFilter, setVoucherStatusFilter] = useState<string>(''); // State for the selected voucher status

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Data tidak ditemukan di localStorage');
      setLoading(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${stagingURL}/api/report/list_retailers/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const filteredData = result.filter((item: any) => item.status !== null);
        setData(filteredData);
        setFilteredData(filteredData); // Initially set filtered data to the whole dataset
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

  const columns = [
    {
      name: 'Voucher Status',
      selector: (row: any) => row.voucher_status,
      sortable: true,
      // cell: (row: any) => row.voucher_status,

      cell: (row: any) => {
        // Transform the status text as needed
        const transformedStatus = row.voucher_status === 'PAYMENT COMPLETED'
          ? 'COMPLETED'
          : row.voucher_status === 'WAITING PAYMENT'
            ? 'WAITING'
            : row.voucher_status;

        return (
          <div
            className={`inline-flex rounded-full py-1 px-3 ${row.voucher_status === 'PENDING'
              ? 'bg-white text-black'
              : row.voucher_status === 'RECEIVING'
                ? 'bg-yellow-300 text-yellow-800'
                : row.voucher_status === 'REDEEMED'
                  ? 'bg-blue-500 text-white'
                  : row.voucher_status === 'WAITING PAYMENT'
                    ? 'bg-purple-500 text-white'
                    : row.voucher_status === 'PAYMENT COMPLETED'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-800'
              }`}
            style={{ fontSize: '10px', fontWeight: 'bold' }}
          >
            {transformedStatus}
          </div>
        );
      }


    },
    {
      name: 'Agen',
      selector: (row: any) => row.agen_name,
      sortable: true,
      cell: (row: any) => row.agen_name,
    },
    {
      name: 'Toko',
      selector: (row: any) => row.retailer_name,
      sortable: true,
      cell: (row: any) => row.retailer_name,
    },
    {
      name: 'WhatsApp',
      selector: (row: any) => row.phone_number,
      sortable: true,
      cell: (row: any) => row.phone_number,
    },
    {
      name: 'Alamat',
      selector: (row: any) => row.address,
      sortable: true,
      cell: (row: any) => row.address,
    },
    {
      name: 'Provinsi',
      selector: (row: any) => row.provinsi,
      sortable: true,
      cell: (row: any) => row.provinsi,
    },
    {
      name: 'Kota',
      selector: (row: any) => row.kota,
      sortable: true,
      cell: (row: any) => row.kota,
    },
    {
      name: 'Kecamatan',
      selector: (row: any) => row.kecamatan,
      sortable: true,
      cell: (row: any) => row.kecamatan,
    },
    {
      name: 'Kelurahan',
      selector: (row: any) => row.kelurahan,
      sortable: true,
      cell: (row: any) => row.kelurahan,
    },
    {
      name: 'Kode Voucher',
      selector: (row: any) => row.voucher_code,
      sortable: true,
      cell: (row: any) => row.voucher_code,
    },
  ];

  const exportToExcel = (fileName: string) => {
    const modifiedData = filteredData.map((item) => {
      const {
        agen_name,
        voucher_status,
        retailer_name,
        phone_number,
        address,
        provinsi,
        kota,
        kecamatan,
        kelurahan,
        voucher_code,
      } = item;

      return {
        'Agen': agen_name,
        'Voucher Status': voucher_status,
        'Toko': retailer_name,
        'WhatsApp': phone_number,
        'Alamat': address,
        'Provinsi': provinsi,
        'Kota': kota,
        'Kecamatan': kecamatan,
        'Kelurahan': kelurahan,
        'Kode Voucher': voucher_code,
      };
    });

    // Step 2: Create the Excel sheet from the modified data
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Step 3: Write the workbook to a buffer and save the file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleVoucherStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    setVoucherStatusFilter(selectedStatus);

    // Filter data based on the selected voucher status
    if (selectedStatus) {
      const filtered = data.filter((item: any) => item.voucher_status === selectedStatus);
      setFilteredData(filtered);
    } else {
      // Reset to original data if no filter is selected
      setFilteredData(data);
    }
  };

  return (
    <>
      <div className="col-span-12 flex items-center justify-between mb-4"> {/* Flexbox container for alignment */}
        {/* Dropdown for selecting voucher status */}
        <select
          value={voucherStatusFilter}
          onChange={handleVoucherStatusChange}
          className="px-3 py-2 border rounded"
        >
          <option value="">Al Status</option>
          <option value="PENDING">PENDING</option>
          <option value="RECEIVING">RECEIVING</option>
          <option value="REDEEMED">REDEEMED</option>
          <option value="WAITING PAYMENT">WAITING PAYMENT</option>
          <option value="PAYMENT COMPLETED">PAYMENT COMPLETED</option>
        </select>

        {/* Export button */}
        <button
          onClick={() => exportToExcel('report_retailers')}
          className="bg-blue-300 text-white py-1 px-2 rounded flex items-center"
        >
          <FaFileExcel className="mr-2" />
          Export to Excel
        </button>
      </div>


      {/* Data table */}
      <DataTableRetailer columns={columns} data={filteredData} selectableRows={false} />
    </>
  );
};

export default DashboardRetailer;

