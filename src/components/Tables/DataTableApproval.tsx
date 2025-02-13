import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { memo, useMemo, useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { stagingURL, signOut } from '../../utils';
import { photoRetailer } from '../../types/photoRetailer';
import Spinner from '../Spinner'
import CustomToast, { showErrorToast } from '../Toast/CustomToast';

const CustomLoader = () => (
    <Spinner />
);

const DataTableApproval = memo(({ dataPhoto, onUpdate }: { dataPhoto: photoRetailer[]; onUpdate: () => void }) => {
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [pending, setPending] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [filter, setFilter] = useState<[number, number] | null>(null);
    const [selectedData, setSelectedData] = useState<any[]>([]);

    // Fungsi untuk menangani pembaruan data
    const approveData = (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        const API = `${stagingURL}/api/retailers/${id}/verify_photos/`;

        // Kirim request ke backend untuk memperbarui berdasarkan retailer_id
        fetch(API, {
            method: 'POST', // atau metode yang sesuai
            headers: myHeaders,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(result => {
                onUpdate();

                if (result.code === "token_not_valid") {
                    signOut(navigate);
                }
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    const rejectData = (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        const API = `${stagingURL}/api/retailers/${id}/reject_photos/`;

        // Kirim request ke backend untuk memperbarui berdasarkan retailer_id
        fetch(API, {
            method: 'POST', // atau metode yang sesuai
            headers: myHeaders,
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(result => {
                onUpdate();

                if (result.code === "token_not_valid") {
                    signOut(navigate);
                }
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    // Fungsi untuk memperbarui semua ID yang dipilih
    const updateSelectedData = () => {
        if (selectedIds.length === 0) {
            showErrorToast('Tidak ada data yang dipilih!');
            return;
        }

        selectedIds.forEach((id) => {
            const retailer = selectedData.find(data => data.retailer_id === id);
            const retailer_name = retailer?.retailer_name || '';

            if (retailer) {
                if (retailer.is_verified === 0) {
                    approveData(id);
                } else {
                    showErrorToast(`Retailer ${retailer_name} sudah diverifikasi!`);
                }
            } else {
                console.error(`Retailer with ID ${retailer_name} not found in selectedData`);
                showErrorToast(`Retailer with ID ${retailer_name} not found in selectedData`);
            }
        });
    };

    const rejectSelectedData = () => {
        if (selectedIds.length === 0) {
            showErrorToast('Tidak ada data yang dipilih!');
            return;
        }

        selectedIds.forEach((id) => {
            const retailer = selectedData.find(data => data.retailer_id === id);
            const retailer_name = retailer?.retailer_name || '';

            if (retailer) {
                if (retailer.is_verified === 0) {
                    rejectData(id);
                } else {
                    showErrorToast(`Retailer ${retailer_name} sudah diverifikasi!`);
                }
            } else {
                console.error(`Retailer with ID ${retailer_name} not found in selectedData`);
                showErrorToast(`Retailer with ID ${retailer_name} not found in selectedData`);
            }
        });
    };

    // Mengelompokkan data berdasarkan retailer_id
    const groupedData = useMemo(() => {
        return dataPhoto.reduce((acc, retailer) => {
            acc[retailer.retailer_id] = retailer.photos.map(photo => photo.image);
            return acc;
        }, {} as Record<number, string[]>);
    }, [dataPhoto]);

    // Transformasi data untuk DataTable
    const transformedData = useMemo(() => {
        return Object.entries(groupedData).map(([retailer_id, images]) => {

            const retailer = dataPhoto.find(r => r.retailer_id === Number(retailer_id));
            const is_verified = retailer?.photos.every(photo => photo.is_verified) ? 1 : 0;
            const is_approved = retailer?.photos.every(photo => photo.is_approved) ? 1 : 0;
            const is_rejected = retailer?.photos.every(photo => photo.is_rejected) ? 1 : 0;

            let status;
            let statusColor = 'text-black'; // Default color

            if (is_verified === 1 && is_approved === 1) {
                status = 'Verified'; // Ter-verifikasi
                statusColor = 'text-blue-500'; // Biru
            } else if (is_verified === 1 && is_approved === 0 && is_rejected === 1) {
                status = 'Rejected'; // Tidak di-approve
                statusColor = 'text-red-500'; // Merah
            } else if (is_verified === 0) {
                status = 'Not Verified'; // Belum diverifikasi
                statusColor = 'text-black'; // Hitam
            } else {
                status = 'No Status'; // Status tidak terdefinisi
                statusColor = 'text-black'; // Hitam
            }

            return {
                retailer_id: Number(retailer_id),
                retailer_name: retailer?.retailer_name || '',
                retailer_phone_number: retailer?.retailer_phone_number || '',
                wholesale_name: retailer?.wholesale_name || '',
                retailer_address: retailer?.retailer_address || '',
                retailer_voucher_code: retailer?.retailer_voucher_code || '',
                images,
                is_verified,
                status,
                statusColor,
            };
        });
    }, [groupedData, dataPhoto]);

    // Definisi kolom untuk DataTable
    const columns: TableColumn<{
        is_verified: number;
        retailer_id: number;
        retailer_name: string;
        wholesale_name: string;
        retailer_phone_number: string;
        retailer_address: string;
        retailer_voucher_code: string;
        images: string[];
        status: string
    }>[] = useMemo(() => {
        const createColumn = (name: string, selector: (row: any) => any) => ({
            name: name,
            selector,
            sortable: true,
            cell: (row: any) => <span className='text-sm'>{selector(row)}</span>,
        });

        return [
            createColumn('Retailer', (row) => row.retailer_name),
            createColumn('Agen', (row) => row.wholesale_name),
            createColumn('Whatsapp', (row) => row.retailer_phone_number),
            createColumn('Alamat', (row) => row.retailer_address),
            createColumn('Status', (row) => (
                <div
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-2 text-xs ${row.status === 'Verified'
                        ? 'bg-green-100 text-green-700'
                        : row.status === 'Rejected'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-warning text-warning'
                        }`}
                >
                    {row.status}
                </div>
            )),
            {
                name: 'Kode Voucher',
                cell: (row) => (
                    row.is_verified === 1 ? <span style={{ fontSize: '12px' }}>{row.retailer_voucher_code}</span> : null
                ),
                sortable: true,
            },
            {
                name: "Foto POSM",
                cell: (row) => (
                    row.images[0] ? (
                        <img
                            loading="lazy"
                            src={`${stagingURL}${row.images[0]}`}
                            alt="Retailer"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                            onClick={() => {
                                setCurrentImage(`${stagingURL}${row.images[0]}`);
                                setLightboxOpen(true);
                            }}
                        />
                    ) : null
                ),
                sortable: false,
            },
            {
                name: "Foto Tester",
                cell: (row) => (
                    row.images[1] ? (
                        <img
                            loading="lazy"
                            src={`${stagingURL}${row.images[1]}`}
                            alt="Retailer"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                            onClick={() => {
                                setCurrentImage(`${stagingURL}${row.images[1]}`);
                                setLightboxOpen(true);
                            }}
                        />
                    ) : null
                ),
                sortable: false,
            },
            {
                name: "Foto Kode Tester",
                cell: (row: { images: any[]; }) => (
                    row.images[2] ? (
                        <img
                            loading="lazy"
                            src={`${stagingURL}${row.images[2]}`}
                            alt="Retailer"
                            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                            onClick={() => {
                                setCurrentImage(`${stagingURL}${row.images[2]}`);
                                setLightboxOpen(true);
                            }}
                        />
                    ) : null
                ),
                sortable: false,
            },
        ];
    }, [stagingURL]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [transformedData]); // Menambahkan transformedData sebagai dependency

    // Fungsi untuk mengubah filter
    const handleFilterChange = (value: [number, number] | null) => {
        setFilter(value);
    };

    // Transformasi data untuk DataTable dengan filter
    // const filteredData = useMemo(() => {
    //     return transformedData.filter(item => {
    //         if (filter === null) return item.is_verified === 0; 
    //         const [verified] = filter; 

    //         if (verified === 99) return true; 
    //         return item.is_verified === verified; 
    //     });
    // }, [transformedData, filter]);

    const filteredData = useMemo(() => {
        return transformedData.filter(item => {
            if (filter === null) return item.is_verified === 0;
            const [verified] = filter;

            if (verified === 99) return true;
            if (verified === 2) return item.status === 'Rejected';
            return item.is_verified === verified;
        });
    }, [transformedData, filter]);

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

            {/* Filter Buttons */}
            <div className="mb-2">
                <select onChange={(e) => handleFilterChange(e.target.value ? e.target.value.split('&').map(Number) as [number, number] : null)} className="p-2 rounded" defaultValue="0">
                    <option value="99">All</option>
                    <option value="1">Verified</option>
                    <option value="0">Not Verified</option>
                    <option value="2">Rejected</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                selectableRows
                pagination
                progressPending={pending}
                progressComponent={<CustomLoader />}
                customStyles={customStyles}
                onSelectedRowsChange={({ selectedRows }) => {
                    const ids = selectedRows.map((row) => row.retailer_id);
                    setSelectedIds(ids);
                    setSelectedData(selectedRows);
                }}
            />

            {/* Button */}
            <div className="flex justify-end space-x-1 mt-2">
                <button className="flex justify-center rounded bg-red-500 p-2 font-medium text-white hover:bg-red-600"
                    onClick={() => rejectSelectedData()}>
                    Reject
                </button>


                <button className="flex justify-center rounded bg-green-500 p-2 font-medium text-white hover:bg-green-600"
                    onClick={() => updateSelectedData()}>
                    Approve
                </button>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={currentImage ? [{ src: currentImage }] : []}

            />
        </div>
    );
});

export default DataTableApproval;