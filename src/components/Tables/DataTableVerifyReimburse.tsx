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
import { FaChevronCircleDown, FaEye, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Lightbox from "yet-another-react-lightbox";



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

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
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

export const detailColumns = [
    {
        name: "Toko",
        selector: (row: any) => row.retailer_name,
        sortable: false,
    },
    {
        name: "Total Harga",
        selector: (row: any) => `${Math.round(row.transactions[0]?.total_price).toLocaleString('id-ID')}`,
        sortable: false,
    },
    {
        name: "Diskon",
        selector: () => "20.000",
        sortable: false,
    },
    {
        name: "Harga Setelah Diskon",
        selector: (row: any) => `${Math.round(row.transactions[0]?.total_price_after_discount).toLocaleString('id-ID')}`,
        sortable: false,
    },
    {
        name: "Items",
        cell: (row: any) => (
            <ul>
                {row.transactions[0]?.details.map((detail: any, index: number) => (
                    <li key={index} className="mt-2">
                        {detail.item_name} <br/>
                        Qty: {Math.round(detail.qty)} <br/>
                        Total: {Math.round(detail.sub_total).toLocaleString('id-ID')}
                    </li>
                ))}
            </ul>
        ),
        sortable: false,
    },
    {
        name: "Bukti Pembayaran",
        cell: (row: any) => {
            const [isLightboxOpen, setIsLightboxOpen] = useState(false);
            return (
                <>
                    <img
                        src={`${stagingURL}${row.transactions[0]?.image}`}
                        alt="Bukti Pembayaran"
                        className="w-20 h-20 object-cover cursor-pointer"
                        onClick={() => setIsLightboxOpen(true)}
                    />
                    {isLightboxOpen && (
                        <Lightbox
                            open={isLightboxOpen}
                            close={() => setIsLightboxOpen(false)}
                            slides={[{ src: `${stagingURL}${row.transactions[0]?.image}` }]}
                        />
                    )}
                </>
            );
        },
        sortable: false,
    },
];

const DetailModal: FC<DetailModalProps> = ({ isOpen, onClose, rowData }) => (
    <Dialog open={isOpen} handler={onClose} size="xl">
        <DialogHeader>Detail Transaksi</DialogHeader>
        <DialogBody>

            <DataTable data={[rowData]} columns={detailColumns} customStyles={customDetailStyles} />
        </DialogBody>
        <DialogFooter>
            <Button variant="text" color="red" onClick={onClose}>
                Close
            </Button>
        </DialogFooter>
    </Dialog>
);

const exportToExcel = (fileName: string, data: any[]) => {
    const modifiedData = data.flatMap((item) => {
        if (item.transactions[0]?.details.length === 0) {
            return [{
                'Toko': item.retailer_name,
                'Reimburse By': item.reimbursed_by,
                'Total Price': Math.round(item.transactions[0]?.total_price).toLocaleString('id-ID'),
                'Total Price After Discount': Math.round(item.transactions[0]?.total_price_after_discount).toLocaleString('id-ID'),
                'Item Name': '',
                'Qty': '',
                'Sub Total': '',
                'Bukti Pembayaran': `${stagingURL}${item.transactions[0]?.image}`
            }];
        }
        return item.transactions[0]?.details.map((detail: any, index: number) => ({
            'Toko': index === 0 ? item.retailer_name : '',
            'Reimburse By': index === 0 ? item.reimbursed_by : '',
            'Total Price': index === 0 ? Math.round(item.transactions[0]?.total_price).toLocaleString('id-ID') : '',
            'Total Price After Discount': index === 0 ? Math.round(item.transactions[0]?.total_price_after_discount).toLocaleString('id-ID') : '',
            'Item Name': detail.item_name,
            'Qty': `${Math.round(detail.qty)}`,
            'Sub Total': `${Math.round(detail.sub_total).toLocaleString('id-ID')}`,
            'Bukti Pembayaran': index === 0 ? `${stagingURL}${item.transactions[0]?.image}` : ''
        }));
    });

    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
};

const customDetailStyles = {
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

const DataTableVerifyReimburse: FC<DataTableProps> = memo(({ columns, data, selectableRows = true, onRefresh }) => {

    const [pending, setPending] = useState(true);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState<any>(null);
    const [newStatus, setNewStatus] = useState<string>('');

    useEffect(() => {
        const timeout = setTimeout(() => setPending(false), 2000);
        return () => clearTimeout(timeout);
    }, []);

    const openStatusModal = (row: any) => {
        setCurrentRow(row);
        setNewStatus(row.status);
        setIsStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setIsStatusModalOpen(false);
        setCurrentRow(null);
        setNewStatus('');
    };

    const openDetailModal = (row: any) => {
        setCurrentRow(row);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setCurrentRow(null);
    };

    const submitStatusChange = async () => {
        if (!currentRow || !newStatus) {
            showErrorToast('Please select a status');
            return;
        }

        if (currentRow.status === 'completed') {
            showErrorToast('Status is already complete and cannot be changed');
            closeStatusModal();
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
                    closeStatusModal();
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
            name: "Transaksi",
            cell: (row: any) => (
                <button onClick={() => openDetailModal(row)} className="bg-gray-300 text-black py-2 px-8 rounded flex items-center mr-2">
                    <FaEye className="mr-2" />
                </button>
            ),
            ignoreRowClick: true,
        },
        {
            name: "Ubah Status",
            cell: (row: any) => (
                <button onClick={() => openStatusModal(row)} className="bg-blue-500 text-white py-2 px-8 rounded flex items-center mr-2">
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

            <div className="flex justify-end items-center mb-4">
                <button
                    className="bg-blue-300 text-white py-1 px-2 rounded flex items-center"
                    onClick={() => exportToExcel('retailer_transaction', data)}
                >
                    <FaFileExcel className="mr-2" />
                    Export to Excel
                </button>
            </div>

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
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                onSubmit={submitStatusChange}
                newStatus={newStatus}
                setNewStatus={setNewStatus}
            />

            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                rowData={currentRow || {}}
            />

        </div>
    );
});

export default DataTableVerifyReimburse;

