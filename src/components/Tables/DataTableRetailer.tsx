import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { memo, useMemo, useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { stagingURL, signOut } from '../../utils';
import { photoRetailer } from '../../types/photoRetailer';
import Spinner from '../Spinner'
import CustomToast, { showErrorToast, showSuccessToast } from '../Toast/CustomToast';

const CustomLoader = () => (
    <Spinner />
);

const DataTableRetailer = memo(({ dataPhoto, onUpdate }: { dataPhoto: photoRetailer[]; onUpdate: () => void }) => {
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [pending, setPending] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [filter, setFilter] = useState<[number, number] | null>(null);

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
            .then(response => response.json())
            .then(result => {
                console.log('Update result:', result.message);
                onUpdate();

                if (result.code == "token_not_valid") {
                    signOut(navigate);
                }
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    // Fungsi untuk memperbarui semua ID yang dipilih
    const updateSelectedData = (flag: number) => {
        selectedIds.forEach((id) => {
            if (flag === 1) {
                approveData(id); 
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
            const is_verified = retailer?.photos.some(photo => photo.is_verified) ? 1 : 0;

            let status;
            let statusColor = 'text-black'; // Default color

            if (is_verified === 0) {
                status = 'Belum Diverifikasi'; // Belum diverifikasi
                statusColor = 'text-black'; // Hitam
            } else if (is_verified === 1) {
                status = 'Sudah Diverifikasi'; // Sudah diverifikasi
                statusColor = 'text-blue-500'; // Biru
            } else {
                status = 'Status Tidak Diketahui'; // Status tidak terdefinisi
                statusColor = 'text-black'; // Hitam
            }

            return {
                retailer_id: Number(retailer_id),
                retailer_name: retailer?.retailer_name || '',
                retailer_phone_number: retailer?.retailer_phone_number || '',
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
        retailer_id: number; retailer_name: string; retailer_phone_number: string;
        retailer_address: string; retailer_voucher_code: string; images: string[]; status: string
    }>[] = useMemo(() => {
        const createColumn = (name: string, selector: (row: any) => any) => ({
            name: <span className="text-lg font-bold">{name}</span>,
            selector,
            sortable: true,
            cell: (row: any) => <span>{selector(row)}</span>,
            style: { fontSize: '15px' },
        });

        return [
            createColumn('Retailer Name', (row) => row.retailer_name),
            createColumn('Phone Number', (row) => row.retailer_phone_number),
            createColumn('Address', (row) => row.retailer_address),
            createColumn('Voucher Code', (row) => row.retailer_voucher_code),
            createColumn('Status', (row) => (
                <span className={row.statusColor}>{row.status}</span>
            )),
            {
                name: <span className="text-lg font-bold">Image</span>,
                cell: (row) => (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {row.images.map((image, index) => (
                            <img
                                key={index}
                                loading="lazy"
                                src={`${stagingURL}${image}`}
                                alt="Retailer"
                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                onClick={() => {
                                    setCurrentImage(`${stagingURL}${image}`);
                                    setLightboxOpen(true);
                                }}
                            />
                        ))}
                    </div>
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
    const filteredData = useMemo(() => {
        return transformedData.filter(item => {
            if (filter === null) return true; // Tampilkan semua
            const [verified] = filter; // Mengambil nilai filter
            return item.is_verified === verified; // Filter berdasarkan is_verified
        });
    }, [transformedData, filter]);

    return (
        <div>
            <CustomToast />

            {/* Filter Buttons */}
            <div className="mb-2">
                <select onChange={(e) => handleFilterChange(e.target.value ? e.target.value.split('&').map(Number) as [number, number] : null)} className="p-2 rounded">
                    <option value="">Semua</option>
                    <option value="1">Sudah Diverifikasi</option>
                    <option value="0">Belum Diverifikasi</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                selectableRows
                pagination
                progressPending={pending}
                progressComponent={<CustomLoader />}
                onSelectedRowsChange={({ selectedRows }) => {
                    const ids = selectedRows.map((row) => row.retailer_id);
                    setSelectedIds(ids);
                }}
            />

            {/* Button */}
            <div className="flex justify-end space-x-1 mt-2">
                <button className="flex justify-center rounded bg-green-500 p-2 font-medium text-white hover:bg-green-600"
                    onClick={() => updateSelectedData(1)}>
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

export default DataTableRetailer;