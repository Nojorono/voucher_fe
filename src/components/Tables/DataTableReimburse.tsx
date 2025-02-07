import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect } from 'react';
import "yet-another-react-lightbox/styles.css";
import Spinner from '../Spinner'
import { stagingURL, signOut } from '../../utils';

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
    const [selectedRow, setSelectedRow] = useState<any>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);


    const columnsWithActions = [
        ...columns,
    ];

    // const postData = () => {
    //     if (!selectedRow || selectedRow.length === 0) {
    //         showErrorToast('No rows selected');
    //         return;
    //     }

    //     const voucherCodes = selectedRow.map((row: any) => row.voucher_code);

    //     const formData = {
    //         voucher_codes: voucherCodes,
    //     };

    //     const token = localStorage.getItem('token');
    //     const myHeaders = new Headers();
    //     myHeaders.append('Authorization', `Bearer ${token}`);
    //     myHeaders.append('Content-Type', 'application/json');

    //     const raw = JSON.stringify(formData);
    //     const requestOptions: RequestInit = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //     };

    //     const url = `${stagingURL}/api/submit_reimburse/`;

    //     fetch(url, requestOptions)
    //         .then((response) => response.json())
    //         .then((result) => {
    //             console.log('res_Post', result[0].status);

    //             if (Array.isArray(result) && result[0]?.error) {
    //                 const errorCodes = result.filter((item: any) => item.error).map((item: any) => item.voucher_code);
    //                 showErrorToast(`${errorCodes.join(', ')} ${result[0].error}`);
    //             } else if (result.error) {
    //                 showErrorToast(result.error);
    //             } else {
    //                 onRefresh();
    //                 setTimeout(() => {
    //                     showSuccessToast(`${result[0].status}`);
    //                 }, 2000);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error posting/updating data:', error);
    //             showErrorToast('Error submitting data');
    //         });
    // };

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
            />

            {/* Button */}
            {/* <div className="flex justify-end space-x-1 mt-2">
                <button className="flex justify-center rounded bg-green-500 p-2 font-medium text-white hover:bg-green-600"
                    onClick={() => postData()}>
                    Submit Reimbursement
                </button>
            </div> */}


        </div>
    );
});

export default DataTableReimburse;