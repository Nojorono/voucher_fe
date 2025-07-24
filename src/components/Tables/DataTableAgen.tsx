import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useState, useEffect, useMemo } from 'react';
import Spinner from '../Spinner';
import { stagingURL } from '../../utils';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import ModalFormWholesale from '../Forms/ModalFormWholesale';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import CustomToast, {
  showErrorToast,
  showSuccessToast,
} from '../Toast/CustomToast';

const CustomLoader = () => <Spinner />;

interface DataTableProps {
  columns: TableColumn<any>[];
  data: any[];
  selectableRows?: boolean;
  onRowSelected?: (selectedRows: any[]) => void;
  onRefresh: () => void;
}

// Helper: get children recursively
const getChildren = (
  data: any[],
  parentId: number | null,
  level = 1,
): any[] => {
  return data
    .filter((item) => item.parent === parentId)
    .map((item) => ({
      ...item,
      children: getChildren(data, item.id, level + 1),
      level: item.level ?? level,
    }));
};

const DataTableAgen = memo(
  ({
    columns,
    data,
    selectableRows = true,
    onRowSelected,
    onRefresh,
  }: DataTableProps) => {
    const [pending, setPending] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [method, setMethod] = useState<'POST' | 'PUT'>('POST');
    const [IdUpdate, setIdUpdate] = useState<number | null>(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState<any>({
      id: '',
      name: '',
      phone_number: '',
      address: '',
      city: '',
      pic: '',
      parent: null,
    });

    useEffect(() => {
      const timeout = setTimeout(() => setPending(false), 1000);
      return () => clearTimeout(timeout);
    }, []);

    // Build tree structure for expandable rows
    const treeRows = useMemo(() => getChildren(data, null, 0), [data]);

    const handleRowSelected = (state: any) => {
      onRowSelected?.(state.selectedRows);
    };

    const handleSoftDelete = (row: any) => {
      setRowToDelete(row);
      setOpenDialog(true);
    };

    const confirmSoftDelete = async () => {
      if (!rowToDelete) return;
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${stagingURL}/api/wholesales/${rowToDelete.id}/`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...rowToDelete, is_active: false }),
          },
        );
        if (res.ok) {
          showSuccessToast('Data berhasil dihapus!');
          onRefresh();
        } else {
          showErrorToast('Error delete data');
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Terjadi kesalahan');
      } finally {
        setOpenDialog(false);
      }
    };

    const handleAdd = () => {
      setOpen(true);
      setMethod('POST');
      setIdUpdate(null);
    };

    const postData = async (formData: any) => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${stagingURL}/api/wholesales/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Error posting data');
        showSuccessToast('Data berhasil ditambahkan!');
        onRefresh();
        setOpen(false);
      } catch (error) {
        console.error(error);
        showErrorToast('Gagal menambahkan data');
      }
    };

    const onSubmit = (formData: any, method: string) => {
      if (method === 'POST') postData(formData);
    };

    const handleUpdate = (row: any) => {
      setUpdateData(row);
      setOpenUpdateModal(true);
    };

    const updateDataHandler = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${stagingURL}/api/wholesales/${updateData.id}/`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...updateData, is_active: true }),
          },
        );

        if (res.ok) {
          showSuccessToast('Data berhasil diupdate!');
          setOpenUpdateModal(false);
          onRefresh();
        } else {
          showErrorToast('Gagal update data');
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Terjadi kesalahan saat update');
      }
    };

    // Recursive expandable component
    const ExpandedComponent = ({ data }: { data: any }) => {
      if (!data.children || data.children.length === 0) {
        return (
          <div className="p-2">
            <p className="text-gray-500">Tidak ada Data Sub Agen</p>
          </div>
        );
      }
      return (
        <div className="p-2">
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Level</th>
                <th className="p-2 border">Nama Sub Agen</th>
                <th className="p-2 border">Telepon</th>
                <th className="p-2 border">Kota</th>
                <th className="p-2 border">PIC</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.children.map((child: any) => (
                <tr key={child.id}>
                  <td className="p-2 border">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-[2px] rounded-full shadow">
                      L{child.level}
                    </span>
                  </td>
                  <td className="p-2 border">{child.name}</td>
                  <td className="p-2 border">{child.phone_number}</td>
                  <td className="p-2 border">{child.city}</td>
                  <td className="p-2 border">{child.pic}</td>
                  <td className="p-2 border flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdate(child)}
                        className="bg-blue-500 text-white p-1 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSoftDelete(child)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Recursive expansion for grandchildren */}
          {data.children.map(
            (child: any) =>
              child.children &&
              child.children.length > 0 && (
                <div
                  key={`expand-${child.id}`}
                  className="ml-6 border-l-2 border-gray-200 pl-4 mt-2"
                >
                  <ExpandedComponent data={child} />
                </div>
              ),
          )}
        </div>
      );
    };

    const columnsWithActions: TableColumn<any>[] = [
      ...columns,
      {
        name: 'Action',
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent row click
                handleUpdate(row);
              }}
              className="bg-blue-500 text-white p-2 rounded"
            >
              <FaEdit />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent row click
                handleSoftDelete(row);
              }}
              className="bg-red-500 text-white p-2 rounded"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ];

    const customStylesTable = {
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
          backgroundColor: 'broken-white', // Tailwind gray-100 hex
        },
      },
      cells: {
        style: {
          fontSize: '14px',
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
    };

    return (
      <div>
        <CustomToast />

        <button
          onClick={handleAdd}
          className="mb-4 bg-green-500 text-white py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Tambah Data
        </button>

        <ModalFormWholesale
          open={open}
          handleOpen={() => setOpen(false)}
          onSubmit={onSubmit}
          method={method}
          IdUpdate={IdUpdate}
          wholesales={data}
        />

        <DataTable
          columns={columnsWithActions}
          data={treeRows}
          selectableRows={selectableRows}
          pagination
          progressPending={pending}
          progressComponent={<CustomLoader />}
          onSelectedRowsChange={handleRowSelected}
          customStyles={customStylesTable}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />

        {/* Dialog Konfirmasi Delete */}
        <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
          <DialogHeader>Konfirmasi Hapus</DialogHeader>
          <DialogBody>Apakah Anda yakin ingin menghapus data ini?</DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setOpenDialog(false)}
            >
              Batal
            </Button>
            <Button variant="gradient" onClick={confirmSoftDelete}>
              Ya
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Dialog Update */}
        <Dialog
          open={openUpdateModal}
          handler={() => setOpenUpdateModal(false)}
          size={'xl'}
        >
          <DialogHeader>Update Data</DialogHeader>
          <DialogBody className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {['name', 'phone_number', 'city', 'pic'].map((field) => (
                <div key={field}>
                  <label className="capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    value={updateData[field]}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, [field]: e.target.value })
                    }
                    className="border p-2 w-full"
                  />
                </div>
              ))}
              <label>Alamat</label>
              <textarea
                rows={3}
                value={updateData.address}
                onChange={(e) =>
                  setUpdateData({ ...updateData, address: e.target.value })
                }
                className="border p-2 w-full"
              />
              <label>Parent</label>
              <select
                value={updateData.parent || ''}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    parent: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="border p-2 w-full"
              >
                <option value="">No Parent (Root)</option>
                {data
                  .filter((w) => w.id !== updateData.id)
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {`${'  '.repeat(w.level || 0)}${
                        w.level > 0 ? '└─ ' : ''
                      }${w.name}`}
                    </option>
                  ))}
              </select>
            </div>
          </DialogBody>
          <DialogFooter>
            <div className="flex justify-end mt-8 mb- gap-2">
              <Button
                variant="text"
                color="red"
                onClick={() => setOpenUpdateModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="gradient"
                onClick={updateDataHandler}
                color="green"
              >
                Simpan
              </Button>
            </div>
          </DialogFooter>
        </Dialog>
      </div>
    );
  },
);

export default DataTableAgen;

// import DataTable, { TableColumn } from 'react-data-table-component';
// import { memo, useState, useEffect } from 'react';
// import "yet-another-react-lightbox/styles.css";
// import Spinner from '../Spinner'
// import { stagingURL } from '../../utils';
// import {
//     Button,
//     Dialog,
//     DialogHeader,
//     DialogBody,
//     DialogFooter,
// } from "@material-tailwind/react";
// import ModalFormWholesale from '../Forms/ModalFormWholesale';
// import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
// import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';

// const CustomLoader = () => (
//     <Spinner />
// );

// interface DataTableProps {
//     columns: TableColumn<any>[];
//     data: any[];
//     selectableRows?: boolean;
//     onRowSelected?: (selectedRows: any[]) => void;
//     onRefresh: () => void;
// }

// const DataTableAgen = memo(({ columns, data, selectableRows = true, onRowSelected, onRefresh }: DataTableProps) => {

//     console.log('DataTableAgen component mounted', data);

//     const [pending, setPending] = useState(true);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [rowToDelete, setRowToDelete] = useState<any>(null);
//     const [open, setOpen] = useState(false);
//     const [method, setMethod] = useState('POST');
//     const [IdUpdate, setIdUpdate] = useState(null);
//     const [openUpdateModal, setOpenUpdateModal] = useState(false);
//     const [updateData, setUpdateData] = useState({ id: '', name: '', phone_number: '', address: '', city: '', pic: '', parent: null as number | null });
//     const [allWholesales, setAllWholesales] = useState<any[]>([]);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setPending(false);
//         }, 2000);
//         return () => clearTimeout(timeout);
//     }, []);

//     // Fetch all wholesales for parent selection
//     useEffect(() => {
//         setAllWholesales(data);
//     }, [data]);

//     const handleRowSelected = (state: any) => {
//         if (onRowSelected) {
//             onRowSelected(state.selectedRows);
//         }
//     };

//     const columnsWithActions = [
//         ...columns,
//         {
//             name: "Action",
//             cell: (row: any) => (
//                 <div className="flex items-center">
//                     <button onClick={() => handleSoftDelete(row)} className="bg-red-500 text-white py-2 px-4 rounded flex items-center justify-center mr-2">
//                         <FaTrash />
//                     </button>
//                     <button onClick={() => handleUpdate(row)} className="bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center">
//                         <FaEdit />
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     const handleSoftDelete = (row: any) => {
//         setRowToDelete(row);
//         setOpenDialog(true);
//     };

//     const confirmSoftDelete = () => {
//         if (rowToDelete) {
//             const token = localStorage.getItem('token');
//             const myHeaders = new Headers();
//             myHeaders.append('Authorization', `Bearer ${token}`);
//             myHeaders.append('Content-Type', 'application/json');

//             const requestOptions: RequestInit = {
//                 method: 'PUT',
//                 headers: myHeaders,
//                 body: JSON.stringify({
//                     name: rowToDelete.name,
//                     phone_number: rowToDelete.phone_number,
//                     is_active: false
//                 }),
//             };

//             fetch(`${stagingURL}/api/wholesales/${rowToDelete.id}/`, requestOptions)
//                 .then((response) => {
//                     if (response.ok) {
//                         onRefresh();
//                         setTimeout(() => {
//                             showSuccessToast('Data berhasil dihapus!');
//                         }, 1000);
//                     } else {
//                         showErrorToast('Error delete data');
//                     }
//                 })
//                 .catch((error) => {
//                     console.error('Error delete data for ID:', rowToDelete.id, error);
//                 });

//             setOpenDialog(false);
//         }
//     };

//     const handleAdd = () => {
//         setOpen(true);
//         setMethod('POST');
//         setIdUpdate(null);
//     };

//     const postData = (formData: any) => {
//         const token = localStorage.getItem('token');
//         const myHeaders = new Headers();
//         myHeaders.append('Authorization', `Bearer ${token}`);
//         myHeaders.append('Content-Type', 'application/json');

//         const requestOptions: RequestInit = {
//             method: 'POST',
//             headers: myHeaders,
//             body: JSON.stringify(formData),
//         };

//         const url = `${stagingURL}/api/wholesales/`;

//         fetch(url, requestOptions)
//             .then((response) => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     return response.json().then((errorData) => {
//                         console.error('Error posting/updating data:', errorData);
//                         throw new Error('Error posting/updating data');
//                     });
//                 }
//             })
//             // .then((data) => {
//             //     setOpen(false);
//             //     onRefresh();
//             //     setTimeout(() => {
//             //         showSuccessToast('Data berhasil ditambahkan!');
//             //     }, 2000);
//             // })
//             .catch((error) => {
//                 console.error('Error posting/updating data:', error);
//                 showErrorToast(`Error posting/updating data ${error}`,);
//             });
//     };

//     const onSubmit = (formData: any, method: string) => {
//         if (method == "POST") {
//             postData(formData)
//         }
//     };

//     const handleUpdate = (row: any) => {
//         setUpdateData({
//             id: row.id,
//             name: row.name,
//             phone_number: row.phone_number,
//             city: row.city,
//             address: row.address || '',
//             pic: row.pic || '',
//             parent: row.parent || null
//         });
//         setOpenUpdateModal(true);
//     };

//     const updateDataHandler = () => {
//         const token = localStorage.getItem('token');
//         const myHeaders = new Headers();
//         myHeaders.append('Authorization', `Bearer ${token}`);
//         myHeaders.append('Content-Type', 'application/json');

//         const requestOptions: RequestInit = {
//             method: 'PUT',
//             headers: myHeaders,
//             body: JSON.stringify({
//                 name: updateData.name,
//                 phone_number: updateData.phone_number,
//                 city: updateData.city,
//                 address: updateData.address,
//                 pic: updateData.pic,
//                 parent: updateData.parent,
//                 is_active: true // Atur sesuai kebutuhan
//             }),
//         };

//         fetch(`${stagingURL}/api/wholesales/${updateData.id}/`, requestOptions)
//             .then((response) => {
//                 if (response.ok) {
//                     setOpenUpdateModal(false);
//                     onRefresh()
//                     setTimeout(() => {
//                         showSuccessToast('Data berhasil diupdate!');
//                     }, 1000);
//                 } else {
//                     showErrorToast('Error updating data')
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error updating data for ID:', updateData.id, error);
//             });
//     };

//     const customStyles = {
//         rows: {
//             style: {
//                 paddingLeft: '8px',
//                 paddingRight: '8px',
//             },
//         },
//         headCells: {
//             style: {
//                 fontSize: '16px',
//                 paddingLeft: '8px',
//                 paddingRight: '8px',
//                 backgroundColor: 'lightgrey',
//             },
//         },
//         cells: {
//             style: {
//                 fontSize: '14px',
//                 paddingLeft: '8px',
//                 paddingRight: '8px',
//             },
//         },
//     };

//     return (
//         <div>
//             <CustomToast />

//             <button onClick={handleAdd} className="mb-4 bg-green-500 text-white py-2 px-4 rounded flex items-center">
//                 <FaPlus className="mr-2" />
//                 Tambah Data
//             </button>

//             <ModalFormWholesale
//                 open={open}
//                 handleOpen={() => setOpen(false)}
//                 onSubmit={onSubmit}
//                 method={method}
//                 IdUpdate={IdUpdate}
//                 wholesales={allWholesales}
//             />

//             <DataTable
//                 columns={columnsWithActions}
//                 data={data}
//                 selectableRows={selectableRows}
//                 pagination
//                 progressPending={pending}
//                 progressComponent={<CustomLoader />}
//                 onSelectedRowsChange={handleRowSelected}
//                 customStyles={customStyles}
//             />

//             <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
//                 <DialogHeader>Konfirmasi Hapus</DialogHeader>
//                 <DialogBody>
//                     Apakah Anda yakin ingin menghapus data ini?
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="red" onClick={() => setOpenDialog(false)}>
//                         Batal
//                     </Button>
//                     <Button variant="gradient" onClick={confirmSoftDelete}>
//                         Ya
//                     </Button>
//                 </DialogFooter>
//             </Dialog>

//             <Dialog open={openUpdateModal} handler={() => setOpenUpdateModal(false)}>
//                 <DialogHeader>Update Data</DialogHeader>
//                 <DialogBody>
//                     <div>
//                         <label>Nama Agen</label>
//                         <input
//                             type="text"
//                             value={updateData.name}
//                             onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
//                             placeholder="Nama"
//                             className="border p-2 w-full"
//                         />
//                     </div>

//                     <div className='mt-2'>
//                         <label>Nomor Telepon</label>
//                         <input
//                             value={updateData.phone_number}
//                             onChange={(e) => setUpdateData({ ...updateData, phone_number: e.target.value })}
//                             placeholder="Nomor Telepon"
//                             className="border p-2 w-full mt-2"
//                             type="tel"
//                             inputMode="numeric"
//                         />
//                     </div>

//                     <div className='mt-2'>
//                         <label>Kota</label>
//                         <input
//                             type="text"
//                             value={updateData.city}
//                             onChange={(e) => setUpdateData({ ...updateData, city: e.target.value })}
//                             placeholder="Masukan Kota"
//                             className="border p-2 w-full"
//                         />
//                     </div>

//                     <div className='mt-2'>
//                         <label>Alamat</label>
//                         <textarea
//                             value={updateData.address}
//                             onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
//                             placeholder="Masukan alamat"
//                             className="border p-2 w-full" rows={4}
//                         />
//                     </div>

//                     <div className='mt-2'>
//                         <label>PIC (Person In Charge)</label>
//                         <input
//                             type="text"
//                             value={updateData.pic}
//                             onChange={(e) => setUpdateData({ ...updateData, pic: e.target.value })}
//                             placeholder="Enter PIC name"
//                             className="border p-2 w-full"
//                         />
//                     </div>

//                     <div className='mt-2'>
//                         <label>Parent</label>
//                         <select
//                             value={updateData.parent || ''}
//                             onChange={(e) => setUpdateData({ ...updateData, parent: e.target.value ? parseInt(e.target.value) : null })}
//                             className="border p-2 w-full"
//                         >
//                             <option value="">No Parent (Root)</option>
//                             {allWholesales.filter(w => w.id !== updateData.id).map((wholesale) => (
//                                 <option key={wholesale.id} value={wholesale.id}>
//                                     {'  '.repeat(wholesale.level || 0)}
//                                     {wholesale.level > 0 ? '└─ ' : ''}
//                                     {wholesale.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="red" onClick={() => setOpenUpdateModal(false)}>
//                         Batal
//                     </Button>
//                     <Button variant="gradient" onClick={updateDataHandler} color="green">
//                         Simpan
//                     </Button>
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// });

// export default DataTableAgen;
