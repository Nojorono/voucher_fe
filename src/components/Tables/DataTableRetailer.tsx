import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect } from 'react';
import Spinner from '../Spinner';

const CustomLoader = () => (
  <Spinner />
);

interface DataTableProps {
  columns: TableColumn<any>[];
  data: any[];
  selectableRows?: boolean;
}

const DataTableRetailer = memo(({ columns, data, selectableRows = true, }: DataTableProps) => {
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const columnsWithActions = [
    ...columns,
  ];

  const customStyles = {
    rows: {
      // style: {
      //   minHeight: '72px',
      //   '&:nth-of-type(odd)': {
      //     backgroundColor: '#f3f3f3',
      //   },
      // },
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
    <div className="overflow-x-auto">
      <DataTable
        columns={columnsWithActions}
        data={data}
        selectableRows={selectableRows}
        pagination
        progressPending={pending}
        progressComponent={<CustomLoader />}
        customStyles={customStyles}
      />
    </div>
  );
});

export default DataTableRetailer;
