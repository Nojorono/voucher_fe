import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect } from 'react';
import "yet-another-react-lightbox/styles.css";
import Spinner from '../Spinner';
import { stagingURL } from '../../utils';
import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { FaChevronCircleDown } from 'react-icons/fa';


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

const DataTableVerifyReimburse = memo(({ columns, data, selectableRows = true, onRowSelected, onRefresh }: DataTableProps) => {
    const [pending, setPending] = useState(true);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState<any>(null);
    const [newStatus, setNewStatus] = useState<string>('');

    const openModal = (row: any) => {
        setCurrentRow(row);
        setNewStatus(row.status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRow(null);
        setNewStatus('');
    };

    const submitStatusChange = () => {
        if (!currentRow || !newStatus) {
            showErrorToast('Please select a status');
            return;
        }

        if (currentRow.status === 'completed') {
            setIsModalOpen(false);

            showErrorToast('Status is already complete and cannot be changed');
            return;
        }

        const idData = currentRow.id;
        const newStatusData = newStatus;

        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');

        const url = `${stagingURL}/api/update_reimburse_status/${idData}/${newStatusData}/`;

        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('Status updated:', result.message);
                showSuccessToast('Status updated successfully');

                if (result.error) {
                    showErrorToast(result.error);
                } else {
                    onRefresh();
                    setTimeout(() => {
                        showSuccessToast(result.message);
                        closeModal();
                    }, 1000);
                }
            })
            .catch((error) => {
                console.error('Error updating status:', error);
                showErrorToast('Error updating status');
            });
    };

    const columnsWithActions = [
        ...columns,
        {
            name: "Ubah Status",
            cell: (row: any) => (
                <button onClick={() => openModal(row)} className="bg-blue-500 text-white py-2 px-8 rounded flex items-center mr-2">
                    <FaChevronCircleDown className="mr-2" />
                    {/* Ubah Status */}
                </button>
            ),
            ignoreRowClick: true,
        }
    ];

    const customStyles = {
        rows: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        headCells: {
            style: {
                fontSize: '15px',
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: 'lightgrey',
            },
        },
        cells: {
            style: {
                fontSize: '12px',
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
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
                    setSelectedRow(selectedRows);
                }}
                customStyles={customStyles}
            />

            <Dialog open={isModalOpen} handler={closeModal}>
                <DialogHeader>Ubah Status</DialogHeader>
                <DialogBody>
                    <select
                        // value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">---Pilih Status---</option>
                        <option value="completed">Completed</option>
                    </select>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="gradient" color="green" onClick={submitStatusChange}>
                        Save
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
});

export default DataTableVerifyReimburse;