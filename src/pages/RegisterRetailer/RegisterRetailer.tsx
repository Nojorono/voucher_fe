import React, { useState, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import FormRegister from '../../components/Forms/FormRegister/FormRegisterRetailer';
import { stagingURL } from '../../utils/API';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import Spinner from '../../components/Spinner';
import { BG3 } from '../../images/sample/index';

interface IFormInput {
    ws_name: string;
    username: string;
    phone_number: string;
    address: string;
    photos: FileList;
    photo_remarks: string[];
    provinsi: Selection;
    kota: Selection;
    kecamatan: Selection;
    kelurahan: Selection;
}

const RegisterRetailer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [reachLimit, setReachLimit] = useState(false);

    useEffect(() => {
        checkLimit()
    }, [])

    // Check limit
    const checkLimit = async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${stagingURL}/api/current-count/?id=1`, requestOptions);
            const result = await response.json();

            if (result.message === "Voucher limit reached") {
                setReachLimit(true)
            };

        } catch (error) {
            console.error(error);
            showErrorToast('Failed to check limit.');
            throw error;
        }
    };

    // POST REGISTER
    const postRetailerData = async (data: IFormInput) => {
        setLoading(true);
        
        try {
            const formData = new FormData();

            // Validate photo size
            if (data.photos) {
                const validPhotos: File[] = [];
                console.log('data.photos', data.photos);

                for (let i = 0; i < data.photos.length; i++) {
                    const photo = data.photos[i];
                    const remark = i === 0 ? 'Foto Stiker POSM' : i === 1 ? 'Foto Tester' : 'Foto Kode Tester';
                    if (photo.size > 300 * 1024) { // 300KB
                        showErrorToast(`(${remark}) ${photo.name} melebihi ukuran maksimal 300KB. Silakan unggah ulang.`);
                        setLoading(false);
                        return;
                    } else {
                        validPhotos.push(photo);
                    }
                }
                data.photos = validPhotos as unknown as FileList;
            }

            // Map form fields to FormData
            const formFields = {
                ws_name: data.ws_name,
                name: data.username,
                phone_number: data.phone_number,
                address: data.address,
                provinsi: data.provinsi,
                kota: data.kota,
                kecamatan: data.kecamatan,
                kelurahan: data.kelurahan,
            };

            // Add form fields to FormData
            for (const [key, value] of Object.entries(formFields)) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, value as string);
                }
            }

            // Add photos and corresponding remarks to FormData
            if (data.photos) {
                Array.from(data.photos).forEach((photo, index) => {
                    formData.append(`photos`, photo); // Tambahkan foto ke dalam FormData
                    const remark = index === 0 ? 'Foto Stiker POSM' : index === 1 ? 'Foto Tester' : 'Foto Kode Tester';
                    formData.append(`photo_remarks`, remark);
                });
            }

            // Make API request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                showErrorToast('Request timeout!');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }, 20000); // 20 seconds timeout

            try {
                const response = await fetch(`${stagingURL}/api/retailer_register_upload/`, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const result = await response.json();
                    if (response.status === 400) {
                        if (Array.isArray(result.non_field_errors) && result.non_field_errors.length > 0) {
                            showErrorToast(result.non_field_errors.join(', '));
                        } else {
                            showErrorToast('Terjadi kesalahan saat mengirim data.');
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const result = await response.json();
                showSuccessToast(`berhasil mendaftar sebagai retailer.`);
                setTimeout(() => {
                    setLoading(false);
                }, 2000);

                return result;
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        console.error('Request was aborted due to timeout.');
                    } else {
                        console.error(`Error: ${error.message}`);
                        showErrorToast(`Error: ${error.message}`);
                    }
                } else {
                    console.error('An unknown error occurred.');
                    showErrorToast('An unknown error occurred.');
                }
                setLoading(false);
                throw error;
            }

        } catch (error) {
            console.error(`Error: ${(error as Error).message}`);
            showErrorToast(`Error: ${(error as Error).message}`);
            setLoading(false);
            throw error;
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        await postRetailerData(data);
    };

    const fields: { name: keyof IFormInput; label: string; required: boolean; type?: string }[] = [
        { name: 'ws_name', label: 'Nama Agen', required: true, type: 'select' },
        { name: 'username', label: 'Nama Toko/Pemilik', required: true },
        { name: 'phone_number', label: 'Nomor Whatsapp', required: true },
        { name: 'address', label: 'Alamat', required: true },
        { name: 'provinsi', label: 'Provinsi', required: true, type: 'select' },
        { name: 'kota', label: 'Kota', required: true, type: 'select' },
        { name: 'kecamatan', label: 'Kecamatan', required: true, type: 'select' },
        { name: 'kelurahan', label: 'Kelurahan', required: true, type: 'select' },
        { name: 'photos', label: 'Upload Foto', required: true, type: 'file' },
    ];

    return (
        <div className="rounded-sm" style={{ backgroundImage: `url(${BG3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex flex-wrap items-center justify-center">
                <CustomToast />
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <Spinner />
                    </div>
                ) : reachLimit ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="flex justify-center items-center h-screen bg-transparent">
                            <h2 className="text-4xl font-bold mb-10 text-white text-center">Promo RYO Sudah Berakhir</h2>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full p-10">
                            <div className="p-10">
                                <h2 className="text-4xl font-bold mb-10 text-white text-center">Pendaftaran Retailer</h2>

                                <FormRegister<IFormInput>
                                    onSubmit={onSubmit}
                                    fields={fields}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterRetailer;