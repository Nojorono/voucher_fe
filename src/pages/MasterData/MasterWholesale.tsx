import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableAgen from '../../components/Tables/DataTableAgen';
import { stagingURL, signOut } from '../../utils';

const MasterWholesale = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowIds, setSelectedRowIds] = useState<any[]>([]);


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

        fetch(`${stagingURL}/api/wholesales/`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // Filter data untuk hanya menampilkan yang is_active = true
                const filteredData = result.filter((item: any) => item.is_active === true);

                setData(filteredData); // Set data yang sudah difilter
                setLoading(false);

                if (result.code == "token_not_valid") {
                    signOut(navigate);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                // showErrorToast('Error fetching data: ' + error);
                setLoading(false);
            });
    };

    // Ambil data dari API
    useEffect(() => {
        fetchData();
    }, []);


    const handleRowSelected = (selectedRows: any[]) => {
        setSelectedRowIds(selectedRows); // Simpan semua data dari baris yang dipilih ke dalam state
    };

    // Definisikan kolom untuk DataTable
    const columns = [
        {
            name: <div className="text-lg font-bold"> Nama Agen </div>,
            selector: (row: any) => row.name,
            sortable: true,
            cell: (row: any) => <div className="text-sm">{row.name}</div>,
        },
        {
            name: <div className="text-lg font-bold"> Telepon </div>,
            selector: (row: any) => row.phone_number,
            sortable: true,
            cell: (row: any) => <div className="text-sm">{row.phone_number}</div>,
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
            <h1 className="text-xl font-bold mb-5">Master Agen</h1>

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
