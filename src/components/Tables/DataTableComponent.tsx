import DataTable, { TableColumn } from 'react-data-table-component';
import { memo, useMemo, useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { stagingURL } from '../../utils/API';
import { photoRetailer } from '../../types/photoRetailer';

const DataTableComponent = memo(({ dataPhoto }: { dataPhoto: photoRetailer[] }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    // Fungsi untuk menangani pembaruan data
    const updateData = (id: number) => {
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
                console.log('Update result:', result);
            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    };

    // Fungsi untuk memperbarui semua ID yang dipilih
    const updateSelectedData = () => {
        selectedIds.forEach((id) => {
            updateData(id); // Hanya mengirim retailer_id
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
            return {
                retailer_id: Number(retailer_id),
                retailer_name: retailer?.retailer_name,
                retailer_phone_number: retailer?.retailer_phone_number,
                retailer_address: retailer?.retailer_address,
                images,
            };
        });
    }, [groupedData, dataPhoto]);

    // Definisi kolom untuk DataTable
    const columns: TableColumn<{ retailer_id: number; retailer_name: string; retailer_phone_number: string; retailer_address: string; images: string[] }>[] = useMemo(() => {
        const createColumn = (name: string, selector: (row: any) => any) => ({
            name: <span className="text-lg font-bold">{name}</span>,
            selector,
            sortable: true,
            cell: (row: any) => <span>{selector(row)}</span>,
            style: { fontSize: '15px' },
        });

        return [
            createColumn('Retailer Id', (row) => row.retailer_id),
            createColumn('Retailer Name', (row) => row.retailer_name),
            createColumn('Phone Number', (row) => row.retailer_phone_number),
            createColumn('Address', (row) => row.retailer_address),
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
            setRows(transformedData as any); // Menggunakan type assertion untuk mengatasi error type
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [transformedData]); // Menambahkan transformedData sebagai dependency

    return (
        <div>
            <DataTable
                columns={columns}
                data={rows}
                selectableRows
                pagination
                progressPending={pending}
                onSelectedRowsChange={({ selectedRows }) => {
                    const ids = selectedRows.map((row) => row.retailer_id);
                    setSelectedIds(ids);
                }}
            />
            <div className="flex justify-end space-x-1 mt-2">
                <button className="flex justify-center rounded bg-green-500 p-2 font-medium text-white hover:bg-green-600"
                    onClick={() => updateSelectedData()}>
                    Approve
                </button>

                <button className="flex justify-center rounded bg-red-500 p-2 font-medium text-white hover:bg-red-600"
                    onClick={() => updateSelectedData()}>
                    Reject
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

export default DataTableComponent;