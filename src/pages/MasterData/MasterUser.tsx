import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableUser from '../../components/Tables/DataTableUser';
import { stagingURL, signOut } from '../../utils';

const MasterUser = () => {
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

        fetch(`${stagingURL}/api/user/`, requestOptions)
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
            name: <div className="text-xl font-bold"> Username </div>,
            selector: (row: any) => row.username,
            sortable: true,
            cell: (row: any) => <div className="text-lg">{row.username}</div>,
        },
        {
            name: <div className="text-xl font-bold"> Email </div>,
            selector: (row: any) => row.email,
            sortable: false,
            cell: (row: any) => <div className="text-lg">{row.email}</div>,
        },
        {
            name: <div className="text-xl font-bold"> Agen </div>,
            selector: (row: any) => row.wholesale_name,
            sortable: true,
            cell: (row: any) => <div className="text-lg">{row.wholesale_name}</div>,
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
            <h1 className="text-2xl font-bold mb-5">Master User</h1>

            <DataTableUser
                columns={columns}
                data={data}
                selectableRows={false}
                onRowSelected={handleRowSelected}
                onRefresh={onRefresh}
            />
        </div>
    );
};

export default MasterUser;
