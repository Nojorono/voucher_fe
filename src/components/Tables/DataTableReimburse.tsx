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
import { FaTrash, FaPlus, FaEdit, FaDonate } from 'react-icons/fa';
import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';

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

const DataTableReimburse = memo(({ columns, data, selectableRows = true, onRowSelected, onRefresh }: DataTableProps) => {
    const [pending, setPending] = useState(true);
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


    const columnsWithActions = [
        ...columns,
        {
            name: <div className="text-xl font-bold"> Action </div>,
            cell: (row: any) => (
                <div className="flex items-center">
                    {row.status === "Belum Ada Status" && (
                        <button onClick={() => onSubmit(row)} className="bg-green-500 text-white py-2 px-4 rounded flex items-center mr-2">
                            <FaDonate className="mr-2" />
                            Ajukan Reimburse
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const handleOpen = () => setOpen(!open);

    const handleConfirm = (row: any) => {
        setOpen(false);
        // postData(row);
        alert('Reimburse berhasil diajukan');
    };

    const renderDialog = () => (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Confirm Action</DialogHeader>
            <DialogBody divider>
                Are you sure you want to submit this reimbursement?
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleOpen}>
                    No
                </Button>
                <Button variant="gradient" color="green" onClick={() => handleConfirm(selectedRow)}>
                    Yes
                </Button>
            </DialogFooter>
        </Dialog>
    );

    const [selectedRow, setSelectedRow] = useState<any>(null);

    const onSubmit = (row: any) => {
        setSelectedRow(row);
        setOpen(true);
    };

    return (
        <div>
            <CustomToast />
            {renderDialog()}
            <DataTable
                columns={columnsWithActions}
                data={data}
                selectableRows={selectableRows}
                pagination
                progressPending={pending}
                progressComponent={<CustomLoader />}
                onSelectedRowsChange={({ selectedRows }) => {
                    console.log('selectedRows', selectedRows);
                }}
            />
        </div>
    );


    const postData = (data: any) => {
        console.log('data', data);

        // const token = localStorage.getItem('token');
        // const myHeaders = new Headers();
        // myHeaders.append('Authorization', `Bearer ${token}`);
        // myHeaders.append('Content-Type', 'application/json');

        // const requestOptions: RequestInit = {
        //     method: method,
        //     headers: myHeaders,
        //     body: JSON.stringify(formData),
        // };

        // const url = `${stagingURL}/api/wholesales/`;

        // fetch(url, requestOptions)
        //     .then((response) => response.json())
        //     .then((result) => {
        //         console.log('res_Post', result);
        //         setOpen(false);
        //         onRefresh();
        //     })
        //     .catch((error) => {
        //         console.error('Error posting/updating data:', error);
        //     });
    };

    return (
        <div>
            <CustomToast />

            <DataTable
                columns={columnsWithActions}
                data={data}
                selectableRows={selectableRows}
                pagination
                progressPending={pending}
                progressComponent={<CustomLoader />}
                onSelectedRowsChange={({ selectedRows }) => {
                    console.log('selectedRows', selectedRows);
                }}
            />


        </div>
    );
});

export default DataTableReimburse;