import React, { useState, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import FormRegister from '../../components/Forms/FormRegister/FormRegisterRetailer';
import { stagingURL } from '../../utils/API';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import Spinner from '../../components/Spinner';
import { BG3, banner1, banner2 } from '../../images/sample/index';

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

    const postRetailerData = async (data: IFormInput) => {
        setLoading(true);

        try {
            const formData = new FormData();

            // Validate and add photos to FormData
            const validPhotos: File[] = [];
            Array.from(data.photos).forEach((photo, index) => {
                const remark = ['Foto Stiker POSM', 'Foto Tester', 'Foto Kode Tester'][index] || 'Foto Lainnya';
                if (photo.size > 600 * 1024) {
                    showErrorToast(`(${remark}) ${photo.name} melebihi ukuran maksimal 300KB. Silakan unggah ulang.`);
                    setLoading(false);
                    return;
                }

                validPhotos.push(photo);
                formData.append('photos', photo);
                formData.append('photo_remarks', remark);
            });

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

            Object.entries(formFields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            const response = await fetch(`${stagingURL}/api/retailer_register_upload/`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                console.log('res_fail', result);
                showErrorToast('Failed to register retailer.');
            } else {
                console.log('res_success', result);
                showSuccessToast('Retailer registered successfully.');
            }

            setLoading(false);
            return result;

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
        <>
            <CustomToast />
            <div className="rounded-sm" style={{ backgroundImage: `url(${BG3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="flex flex-wrap items-center justify-center">
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
            {window.innerWidth >= 768 ? (
                <img src={banner1} className="object-cover w-full h-auto md:w-full" />
            ) : (
                <img src={banner2} className="object-cover w-full h-auto md:w-full" />
            )}

        </>

    );
};

export default RegisterRetailer;