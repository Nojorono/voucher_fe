import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect } from 'react';
import { FaPowerOff, FaEdit } from 'react-icons/fa';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { stagingURL, signOut } from '../../utils';
import Spinner from '../Spinner';
import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';


const CustomLoader = () => (
  <Spinner />
);

interface DataTableProps {
  columns: TableColumn<any>[];
  data: any[];
  selectableRows?: boolean;
  onRefresh: () => void;
}

const DataTableVoucherLimit = memo(({ columns, data, selectableRows = true, onRefresh }: DataTableProps) => {
  const [pending, setPending] = useState(true);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ id: '', limit: '' });



  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // const handleDelete = (row: any) => {
  //   // Implement delete logic here
  //   console.log('Delete row:', row);
  //   onRefresh();
  // };


  const handleUpdate = (row: any) => {
    setUpdateData({ id: row.id, limit: row.limit });
    setOpenUpdateModal(true);
  };

  const columnsWithActions = [
    ...columns,
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex items-center">
          {/* <button onClick={() => handleDelete(row)} className="bg-red-500 text-white py-2 px-4 rounded flex justify-center items-center mr-2">
            <FaPowerOff />
          </button> */}
          <button onClick={() => handleUpdate(row)} className="bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center">
            <FaEdit />
          </button>
        </div>
      ),
    },
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

  const updateDataHandler = () => {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    console.log('ID', updateData.id);
    console.log('Limit', updateData.limit);

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        limit: updateData.limit,
      }),
    };

    fetch(`${stagingURL}/api/voucherlimit/${updateData.id}/`, requestOptions)
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


  return (
    <div className="overflow-x-auto">

      <CustomToast />

      <DataTable
        columns={columnsWithActions}
        data={data}
        selectableRows={selectableRows}
        pagination
        progressPending={pending}
        progressComponent={<CustomLoader />}
        customStyles={customStyles}
      />

      <Dialog open={openUpdateModal} handler={() => setOpenUpdateModal(false)}>
        <DialogHeader>Update Data</DialogHeader>
        <DialogBody>

          <div className='mt-2'>
            <label>Limit</label>
            <input
              value={updateData.limit}
              onChange={(e) => setUpdateData({ ...updateData, limit: e.target.value })}
              placeholder="Email"
              className="border p-2 w-full mt-2"
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

export default DataTableVoucherLimit;
