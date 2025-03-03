import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect } from 'react';
import "yet-another-react-lightbox/styles.css";
import Spinner from '../Spinner'
import { stagingURL, signOut } from '../../utils';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import ModalFormWholesale from '../Forms/ModalFormWholesale';
import { FaPowerOff, FaPlus, FaEdit } from 'react-icons/fa';
import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';
import { useNavigate } from 'react-router-dom';

const CustomLoader = () => (
    <Spinner />
);

interface DataTableProps {
    columns: TableColumn<any>[];
    data: any[];
    selectableRows?: boolean;
    onRowSelected?: (selectedRows: any[]) => void;
    onRefresh: () => void;
}

const DataTableUser = memo(({ columns, data, selectableRows = true, onRowSelected, onRefresh }: DataTableProps) => {
    const navigate = useNavigate();

    const [pending, setPending] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [method, setMethod] = useState('POST');
    const [IdUpdate, setIdUpdate] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState({ id: '', username: '', email: '' });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const handleRowSelected = (state: any) => {
        if (onRowSelected) {
            onRowSelected(state.selectedRows);
        }
    };

    const columnsWithActions = [
        ...columns,
        {
            name: "Action",
            cell: (row: any) => (
                <div className="flex items-center">
                    <button onClick={() => handleSoftDelete(row)} className="bg-red-500 text-white py-2 px-4 rounded flex justify-center items-center mr-2">
                        <FaPowerOff />
                    </button>
                    <button onClick={() => handleUpdate(row)} className="bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center">
                        <FaEdit />
                    </button>
                </div>
            ),
        },
    ];

    const handleSoftDelete = (row: any) => {
        setRowToDelete(row);
        setOpenDialog(true);
    };

    const confirmSoftDelete = () => {
        if (rowToDelete) {
            const token = localStorage.getItem('token');
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);
            myHeaders.append('Content-Type', 'application/json');

            const requestOptions: RequestInit = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({
                    is_active: false
                }),
            };

            fetch(`${stagingURL}/api/user/update/${rowToDelete.id}/`, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        onRefresh();
                        setTimeout(() => {
                            showSuccessToast('Data berhasil dihapus!');
                        }, 2000);
                    } else {
                        showErrorToast('Error delete data');
                    }
                })
                .catch((error) => {
                    console.error('Error delete data for ID:', rowToDelete.id, error);
                });

            setOpenDialog(false);
        }
    };

    const handleAdd = () => {
        navigate('/user_register');
    };

    const postData = (formData: any) => {

        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');

        const requestOptions: RequestInit = {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(formData),
        };

        const url = `${stagingURL}/api/wholesales/`;

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setOpen(false);
                onRefresh();
            })
            .catch((error) => {
                console.error('Error posting/updating data:', error);
            });
    };

    const onSubmit = (formData: any, method: string) => {
        if (method == "POST") {
            postData(formData)
        }
    };

    const handleUpdate = (row: any) => {
        setUpdateData({ id: row.id, username: row.username, email: row.email });
        setOpenUpdateModal(true);
    };

    const updateDataHandler = () => {
        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');

        console.log('updateData.username', updateData.username);
        console.log('updateData.username', updateData.username);

        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({
                // username: updateData.username,
                email: updateData.email,
            }),
        };

        fetch(`${stagingURL}/api/user/update/${updateData.id}/`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    setOpenUpdateModal(false);
                    onRefresh()
                    setTimeout(() => {
                        showSuccessToast('Data berhasil diupdate!');
                    }, 1000);
                } else {
                    showErrorToast('Error updating data')
                }
            })
            .catch((error) => {
                console.error('Error updating data for ID:', updateData.id, error);
            });
    };

    const customStyles = {
        rows: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: 'lightgrey',
            },
        },
        cells: {
            style: {
                fontSize: '15px',
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    return (
        <div>
            <CustomToast />

            <button onClick={handleAdd} className="mb-4 bg-green-500 text-white py-2 px-4 rounded flex items-center">
                <FaPlus className="mr-2" />
                Tambah User
            </button>

            <ModalFormWholesale open={open} handleOpen={() => setOpen(false)} onSubmit={onSubmit} method={method} IdUpdate={IdUpdate} />

            <DataTable
                columns={columnsWithActions}
                data={data}
                selectableRows={selectableRows}
                pagination
                progressPending={pending}
                progressComponent={<CustomLoader />}
                onSelectedRowsChange={handleRowSelected}
                customStyles={customStyles}
            />

            <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
                <DialogHeader>Konfirmasi</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menonaktifkan user ini?
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenDialog(false)}>
                        Batal
                    </Button>
                    <Button variant="gradient" onClick={confirmSoftDelete}>
                        Ya
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openUpdateModal} handler={() => setOpenUpdateModal(false)}>
                <DialogHeader>Update Data</DialogHeader>
                <DialogBody>

                    <div className='mt-2'>
                        <label>Email</label>
                        <input
                            value={updateData.email}
                            onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                            placeholder="Email"
                            className="border p-2 w-full mt-2"
                            type="tel"
                            inputMode="numeric"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpenUpdateModal(false)}>
                        Batal
                    </Button>
                    <Button variant="gradient" onClick={updateDataHandler} color="green">
                        Simpan
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
});

export default DataTableUser;