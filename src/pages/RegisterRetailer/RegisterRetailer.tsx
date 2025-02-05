import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import FormRegister from '../../components/Forms/FormRegister/FormRegisterRetailer';
import { stagingURL } from '../../utils/API'
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner'


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

    // const [voucherCode, setVoucherCode] = useState('');
    const [loading, setLoading] = useState(false);

    const postRetailerData = async (data: IFormInput) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // console.log('data form', data);
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
                    formData.append(`photo_remarks`, remark); // Tambahkan remark ke dalam FormData
                });
            }

            // // Log FormData
            // formData.forEach((value, key) => {
            //     console.log(`${key}:`, value);
            // });

            // console.log('formData', formData);

            // Make API request
            const response = await fetch(`${stagingURL}/api/retailer_register_upload/`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const result = await response.json();
                if (response.status === 400) {
                    // Cek apakah ada non_field_errors dan pastikan itu adalah array
                    if (Array.isArray(result.non_field_errors) && result.non_field_errors.length > 0) {
                        showErrorToast(result.non_field_errors.join(', '));
                    } else {
                        showErrorToast('Terjadi kesalahan saat mengirim data.');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const result = await response.json();
            // showSuccessToast(`${result.message}, berhasil mendaftar sebagai retailer.`);
            showSuccessToast(`berhasil mendaftar sebagai retailer.`);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
            return result;

        } catch (error) {
            console.error(`Error: ${(error as Error).message}`);
            showErrorToast(`Error: ${(error as Error).message}`);
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
        <div className="rounded-sm border">
            <div className="flex flex-wrap items-center">

                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="py-17.5 px-26 text-center">
                        <span className="mt-15 inline-block"><RocketLaunchIcon className="h-100 w-100 text-white-500" /></span>
                    </div>
                </div>

                <CustomToast />

                {loading ? (
                    <Spinner />) : (
                    <>
                        <div className="w-full xl:w-1/2 p-10">
                            <div className="p-10">


                                <h2 className="text-2xl font-bold mb-5">Pendaftaran Retailer</h2>
                                <FormRegister<IFormInput>
                                    onSubmit={onSubmit}
                                    fields={fields}
                                />
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div >
    );
};

export default RegisterRetailer;