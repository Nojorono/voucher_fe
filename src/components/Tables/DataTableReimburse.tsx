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