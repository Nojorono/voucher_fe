import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect, FC } from 'react';
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

const CustomLoader = () => <Spinner />;

interface DataTableProps {
    columns: TableColumn<any>[];
    data: any[];
    selectableRows?: boolean;
    onRowSelected?: (selectedRows: any[]) => void;
    onRefresh: () => void;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    newStatus: string;
    setNewStatus: (status: string) => void;
}

const StatusModal: FC<ModalProps> = ({ isOpen, onClose, onSubmit, newStatus, setNewStatus }) => (
    <Dialog open={isOpen} handler={onClose}>
        <DialogHeader>Ubah Status</DialogHeader>
        <DialogBody>
            <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            >
                <option value="">---Pilih Status---</option>
                <option value="completed">Completed</option>
            </select>
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={onClose}>
                Cancel
            </Button>
            <Button variant="gradient" color="green" onClick={onSubmit}>
                Save
            </Button>
        </DialogFooter>
    </Dialog>
);

const DataTableVerifyReimburse: FC<DataTableProps> = memo(({ columns, data, selectableRows = true, onRefresh }) => {
    const [pending, setPending] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState<any>(null);
    const [newStatus, setNewStatus] = useState<string>('');

    useEffect(() => {
        const timeout = setTimeout(() => setPending(false), 2000);
        return () => clearTimeout(timeout);
    }, []);

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

    const submitStatusChange = async () => {
        if (!currentRow || !newStatus) {
            showErrorToast('Please select a status');
            return;
        }

        if (currentRow.status === 'completed') {
            showErrorToast('Status is already complete and cannot be changed');
            closeModal();
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${stagingURL}/api/update_reimburse_status/${currentRow.id}/${newStatus}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if (result.error) {
                showErrorToast(result.error);
            } else {
                showSuccessToast('Status updated successfully');
                onRefresh();
                setTimeout(() => {
                    showSuccessToast(result.message);
                    closeModal();
                }, 1000);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showErrorToast('Error updating status');
        }
    };

    const columnsWithActions = [
        ...columns,
        {
            name: "Ubah Status",
            cell: (row: any) => (
                <button onClick={() => openModal(row)} className="bg-blue-500 text-white py-2 px-8 rounded flex items-center mr-2">
                    <FaChevronCircleDown className="mr-2" />
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
                onSelectedRowsChange={({ selectedRows }) => console.log(selectedRows)}
                customStyles={customStyles}
            />
            <StatusModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={submitStatusChange}
                newStatus={newStatus}
                setNewStatus={setNewStatus}
            />
        </div>
    );
});

export default DataTableVerifyReimburse;
