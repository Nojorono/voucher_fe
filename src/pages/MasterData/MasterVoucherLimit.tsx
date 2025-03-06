import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTableVoucherLimit from '../../components/Tables/DataTableVoucherLimit';
import { stagingURL, signOut } from '../../utils';

const MasterVoucherLimit = () => {
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

        fetch(`${stagingURL}/api/voucherlimit/1/`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoading(false);
                console.log('result', result);
                setData(Array.isArray(result) ? result : [result]);
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
            name: "Project",
            selector: (row: any) => row.description,
            sortable: true,
            cell: (row: any) => row.description,
        },
        {
            name: "Limit Voucher",
            selector: (row: any) => row.limit,
            sortable: false,
            cell: (row: any) => row.limit,
        },
        {
            name: "Verified Voucher Count",
            selector: (row: any) => row.current_count,
            sortable: true,
            cell: (row: any) => row.current_count,
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
            <h1 className="text-lg font-bold mb-5">Master Voucher Limit</h1>

            <DataTableVoucherLimit
                columns={columns}
                data={data}
                selectableRows={false}
                onRefresh={onRefresh}
            />
        </div>
    );
};

export default MasterVoucherLimit;
