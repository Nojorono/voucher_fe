import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableAgen from '../../components/Tables/DataTableAgen';
import { stagingURL, signOut } from '../../utils';

interface WholesaleData {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  city: string;
  pic: string;
  is_active: boolean;
  parent: number | null;
  parent_name: string | null;
  project: number | null;
  project_name: string | null;
  children_count: number;
  level: number;
  is_root: boolean;
  is_leaf: boolean;
  created_at: string;
  updated_at: string;
}

// Fungsi untuk mengurutkan data secara hierarki
const sortHierarchicalData = (data: WholesaleData[]): WholesaleData[] => {
  const result: WholesaleData[] = [];

  // Ambil semua root items (parent = null) dan urutkan berdasarkan nama
  const rootItems = data
    .filter((item) => item.parent === null)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Fungsi rekursif untuk menambahkan parent dan children-nya
  const addItemWithChildren = (item: WholesaleData) => {
    result.push(item);

    // Ambil semua children dari item ini dan urutkan berdasarkan nama
    const children = data
      .filter((child) => child.parent === item.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Tambahkan setiap child dan children-nya secara rekursif
    children.forEach((child) => {
      addItemWithChildren(child);
    });
  };

  // Proses semua root items
  rootItems.forEach((rootItem) => {
    addItemWithChildren(rootItem);
  });

  return result;
};

const MasterWholesale = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<WholesaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHierarchy, setShowHierarchy] = useState(false);

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

    // Fetch data with hierarchy support
    fetch(`${stagingURL}/api/wholesales/`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // Filter data untuk hanya menampilkan yang is_active = true
        const filteredData = result.filter(
          (item: any) => item.is_active === true,
        );

        // // Check if items have hierarchy fields
        // if (filteredData.length > 0) {
        //     const sample = filteredData[0];
        // }

        // Sort data untuk menampilkan parent diikuti dengan child-nya
        const sortedData = sortHierarchicalData(filteredData);

        setData(sortedData);
        setLoading(false);

        if (result.code == 'token_not_valid') {
          signOut(navigate);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  // Ambil data dari API
  useEffect(() => {
    fetchData();
  }, []);

  const handleRowSelected = (_selectedRows: any[]) => {
    // Function is kept for compatibility with DataTableAgen
  };

  // Definisikan kolom untuk DataTable
  const columns = [
    {
      name: '',
      selector: () => '',
      width: '40px',
      cell: () => <div />,
    },
    {
      name: 'Level',
      selector: (row: WholesaleData) => row.level,
      sortable: true,
      width: '80px',
      cell: (row: WholesaleData) => (
        <div className="flex justify-center">
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-[2px] rounded-full shadow">
            L{row.level}
          </span>
        </div>
      ),
    },
    {
      name: 'Nama Agen',
      selector: (row: WholesaleData) => row.name,
      sortable: true,
      cell: (row: WholesaleData) => (
        <div
          className="flex items-center text-sm font-medium text-gray-800"
          style={{ marginLeft: `${row.level * 16}px` }}
        >
          {row.level > 0 && <span className="text-gray-400 mr-1">└─</span>}
          {row.name}
        </div>
      ),
    },
    {
      name: 'Sub Agen',
      selector: (row: WholesaleData) => row.children_count,
      sortable: true,
      width: '100px',
      cell: (row: WholesaleData) => (
        <div className="text-center">
          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-[2px] rounded-full">
            {row.children_count}
          </span>
        </div>
      ),
    },
    {
      name: 'PIC',
      selector: (row: WholesaleData) => row.pic || '-',
      sortable: true,
      cell: (row: WholesaleData) =>
        row.pic ? (
          <span className="text-sm font-medium text-gray-800">{row.pic}</span>
        ) : (
          <span className="text-sm italic text-gray-400">Belum ada</span>
        ),
    },
    {
      name: 'Project',
      selector: (row: WholesaleData) => row.project_name || '-',
      sortable: true,
      width: '150px',
      cell: (row: WholesaleData) =>
        row.project_name ? (
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {row.project_name}
          </span>
        ) : (
          <span className="text-xs italic text-gray-400">Belum dipilih</span>
        ),
    },
    {
      name: 'Telepon',
      selector: (row: WholesaleData) => row.phone_number,
      sortable: true,
      cell: (row: WholesaleData) => (
        <span className="text-sm text-gray-700">{row.phone_number}</span>
      ),
    },
    {
      name: 'Kota',
      selector: (row: WholesaleData) => row.city,
      sortable: true,
      cell: (row: WholesaleData) => (
        <span className="text-sm text-gray-700">{row.city}</span>
      ),
    },
    {
      name: 'Alamat',
      selector: (row: WholesaleData) => row.address,
      sortable: true,
      cell: (row: WholesaleData) => {
        const truncated =
          row.address.length > 15
            ? row.address.slice(0, 15) + '...'
            : row.address;

        return (
          <span
            className="text-sm text-gray-600"
            title={row.address} // Menampilkan full address saat hover
          >
            {truncated}
          </span>
        );
      },
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
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-bold">Master Agen (Hierarchy)</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHierarchy(!showHierarchy)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {showHierarchy ? 'Hide' : 'Show'} Hierarchy
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">Hierarchy Legend:</h3>
        <div className="text-sm text-blue-700">
          <p>• L0, L1, L2... = Hierarchy Level</p>
          <p>• L0 = Parent Agen</p>
          <p>• L1 = Sub Agen dari Parent Agen</p>
          <p>• L2 = Sub Agen dari Sub Agen</p>
          {/* <p>• Root = Top-level wholesale (no parent)</p> */}
          {/* <p>• Sub Agen = Number of Sub Agen</p> */}
          <p>• Indentation shows hierarchy structure</p>
        </div>
      </div>

      <DataTableAgen
        columns={columns}
        data={data}
        selectableRows={false}
        onRowSelected={handleRowSelected}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default MasterWholesale;
