import React, { useState, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import FormRegister from '../../components/Forms/FormRegister/FormRegisterRetailer';
import { stagingURL } from '../../utils/API';
import CustomToast, {
    showErrorToast,
    showSuccessToast,
} from '../../components/Toast/CustomToast';
import Spinner from '../../components/Spinner';
import { BG3, banner1, banner2 } from '../../images/sample/index';
import Swal from 'sweetalert2';
import { decryptWsId, isValidEncryptedWsId } from '../../utils/encryption';
import { FILE_UPLOAD_API } from '../../utils/API';
import axios from 'axios';

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

interface Wholesale {
    id: number;
    name: string;
}

const RegisterRetailer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [reachLimit, setReachLimit] = useState(false);
    const [defaultWholesale, setDefaultWholesale] = useState<Wholesale | null>(
        null,
    );
    const [encryptionError, setEncryptionError] = useState(false);

    useEffect(() => {
        // Get encrypted token from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const encryptedToken = urlParams.get('token');

        if (encryptedToken) {
            // Validate encrypted token
            if (!isValidEncryptedWsId(encryptedToken)) {
                console.error('Invalid encrypted token');
                setEncryptionError(true);
                return;
            }

            // Decrypt the token to get ws_id
            const wsId = decryptWsId(encryptedToken);

            if (wsId) {
                fetchWholesaleData(wsId);
            } else {
                console.error('Failed to decrypt token');
                setEncryptionError(true);
            }
        }

        // Check limit
        const checkLimit = async () => {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow' as RequestRedirect,
            };

            try {
                const response = await fetch(
                    `${stagingURL}/api/current-count/?id=1`,
                    requestOptions,
                );
                const result = await response.json();

                if (result.message === 'Voucher limit reached') {
                    setReachLimit(true);
                }
            } catch (error) {
                console.error(error);
                console.log('Failed to check limit.');
                throw error;
            }
        };

        checkLimit();
    }, []);

    const fetchWholesaleData = async (wsId: string) => {
        try {
            const response = await fetch(`${stagingURL}/api/wholesales/${wsId}/`);
            if (response.ok) {
                const wholesaleData = await response.json();
                setDefaultWholesale({
                    id: wholesaleData.id,
                    name: wholesaleData.name,
                });
            }
        } catch (error) {
            console.error('Error fetching wholesale data:', error);
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data, event) => {
        await postRetailerData(data, event);
    };

    const postRetailerData = async (
        data: IFormInput,
        event?: React.BaseSyntheticEvent,
    ) => {
        showSuccessToast('Mohon tunggu, sedang mengunggah data...');
        setTimeout(() => {
            setLoading(true);
        }, 1000);

        try {
            const formData = new FormData();

            // Validate and add photos to FormData
            const validPhotos: File[] = [];
            Array.from(data.photos).forEach((photo, index) => {
                const remark =
                    ['Foto Pack/Slop Display', 'Foto Tester', 'Foto Kode Tester'][
                    index
                    ] || 'Foto Lainnya';
                if (photo.size > 600 * 1024) {
                    showErrorToast(
                        `(${remark}) ${photo.name} melebihi ukuran maksimal 300KB. Silakan unggah ulang.`,
                    );
                    setLoading(false);
                    return;
                }

                validPhotos.push(photo);
                formData.append('photos', photo);
                formData.append('photo_remarks', remark);
            });

            // Map form fields to FormData
            const formFields = {
                ws_name: data.ws_name || defaultWholesale?.name || '',
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

            // ✅ Correct Axios configuration
            const response = await FILE_UPLOAD_API.post(
                '/api/retailer_register_upload/',
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        // Don't set Content-Type for FormData, let axios handle it
                    },
                    timeout: 90000, // 90 seconds timeout
                    withCredentials: false, // CORS setting
                    // ✅ Axios abort signal
                    signal: AbortSignal.timeout(90000), // Modern approach
                }
            );

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Response data:', response.data);

            if (response.status === 200 && response.data.message === 'Retailer registered successfully') {
                setLoading(false);
                setTimeout(() => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Registrasi berhasil!',
                        text: 'Terima kasih telah mendaftar.',
                    });
                    event?.target.reset();
                }, 1000);
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);

            if (axios.isAxiosError(error)) {
                console.error('Axios error details:');
                console.error('Status:', error.response?.status);
                console.error('Data:', error.response?.data);
                console.error('Headers:', error.response?.headers);

                // Handle specific error responses
                if (error.response?.status === 403) {
                    console.error('403 Forbidden - Check ALB/Security configuration');
                }

                const errorMessage = error.response?.data?.non_field_errors?.join(' ')
                    || error.response?.data?.message
                    || error.message;

                setLoading(false);
                setTimeout(() => {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Registrasi gagal!',
                        text: errorMessage,
                    });
                }, 1000);
            } else {
                // Handle non-axios errors (network, timeout, etc.)
                console.error('Non-axios error:', error);
                setLoading(false);
                setTimeout(() => {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Connection Error!',
                        text: `Error: ${(error as Error).message}`,
                    });
                }, 1000);
            }
        }
    };

    //   const postRetailerData = async (
    //     data: IFormInput,
    //     event?: React.BaseSyntheticEvent,
    //   ) => {
    //     showSuccessToast('Mohon tunggu, sedang mengunggah data...');
    //     setTimeout(() => {
    //       setLoading(true);
    //     }, 1000);

    //     try {
    //       const formData = new FormData();

    //       // Validate and add photos to FormData
    //       const validPhotos: File[] = [];
    //       Array.from(data.photos).forEach((photo, index) => {
    //         const remark =
    //           ['Foto Pack/Slop Display', 'Foto Tester', 'Foto Kode Tester'][
    //             index
    //           ] || 'Foto Lainnya';
    //         if (photo.size > 600 * 1024) {
    //           showErrorToast(
    //             `(${remark}) ${photo.name} melebihi ukuran maksimal 300KB. Silakan unggah ulang.`,
    //           );
    //           setLoading(false);
    //           return;
    //         }

    //         validPhotos.push(photo);
    //         formData.append('photos', photo);
    //         formData.append('photo_remarks', remark);
    //       });

    //       // Map form fields to FormData
    //       const formFields = {
    //         ws_name: data.ws_name || defaultWholesale?.name || '',
    //         name: data.username,
    //         phone_number: data.phone_number,
    //         address: data.address,
    //         provinsi: data.provinsi,
    //         kota: data.kota,
    //         kecamatan: data.kecamatan,
    //         kelurahan: data.kelurahan,
    //       };

    //       Object.entries(formFields).forEach(([key, value]) => {
    //         formData.append(key, value as string);
    //       });

    //       const controller = new AbortController();
    //       const timeoutId = setTimeout(() => controller.abort(), 90000);

    //       const response = await fetch(
    //         `${stagingURL}/api/retailer_register_upload/`,
    //         {
    //           method: 'POST',
    //           body: formData,
    //           signal: controller.signal,
    //           redirect: 'follow',
    //           headers: {
    //             'Accept': 'application/json',
    //             'Origin': window.location.origin, 
    //           },
    //           mode: 'cors',
    //           credentials: 'omit',
    //         },
    //       );
    //       clearTimeout(timeoutId);

    //       console.log('Response status:', response.status);
    //       console.log('Response headers:', response.headers);

    //       const result = await response.json();
    //       console.log('Response data:', result);

    //       if (response.ok && result.message == 'Retailer registered successfully') {
    //         setLoading(false);
    //         setTimeout(() => {
    //           Swal.fire({
    //             position: 'center',
    //             icon: 'success',
    //             title: 'Registrasi berhasil!',
    //             text: 'Terima kasih telah mendaftar.',
    //           });
    //           event?.target.reset();
    //           return;
    //         }, 1000);
    //       } else {
    //         if (result.non_field_errors) {
    //           setLoading(false);
    //           setTimeout(() => {
    //             Swal.fire({
    //               position: 'center',
    //               icon: 'error',
    //               title: 'Registrasi gagal!',
    //               text: result.non_field_errors.join(' '),
    //             });
    //           }, 1000);
    //         }
    //         Swal.fire({
    //           position: 'center',
    //           icon: 'error',
    //           title: 'Registrasi gagal. Silakan coba lagi.',
    //         });
    //       }
    //     } catch (error) {
    //       console.error(`Error Log: ${(error as Error).message}`);
    //       setLoading(false);
    //       setTimeout(() => {
    //         Swal.fire({
    //           position: 'center',
    //           icon: 'error',
    //           title: 'Timeout!',
    //           text: `Error: ${(error as Error).message}`,
    //         });
    //       }, 1000);
    //     }
    //   };

    const fields: {
        name: keyof IFormInput;
        label: string;
        required: boolean;
        type?: string;
    }[] = [
            { name: 'ws_name', label: 'Nama Agen', required: false, type: 'select' },
            { name: 'username', label: 'Nama Toko/Pemilik', required: false },
            { name: 'phone_number', label: 'Nomor Whatsapp', required: false },
            { name: 'address', label: 'Alamat', required: false },
            { name: 'provinsi', label: 'Provinsi', required: false, type: 'select' },
            { name: 'kota', label: 'Kota', required: false, type: 'select' },
            { name: 'kecamatan', label: 'Kecamatan', required: false, type: 'select' },
            { name: 'kelurahan', label: 'Kelurahan', required: false, type: 'select' },
            { name: 'photos', label: 'Upload Foto', required: false, type: 'file' },
        ];

    return (
        <>
            <div
                className="rounded-sm"
                style={{
                    backgroundImage: `url(${BG3})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex flex-wrap items-center justify-center">
                    <CustomToast />

                    {loading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <Spinner />
                        </div>
                    ) : reachLimit ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="flex justify-center items-center h-screen bg-transparent">
                                <h2 className="text-4xl font-bold mb-10 text-white text-center">
                                    Promo RYO Sudah Berakhir
                                </h2>
                            </div>
                        </div>
                    ) : encryptionError ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="flex justify-center items-center h-screen bg-transparent">
                                <div className="text-center">
                                    <h2 className="text-4xl font-bold mb-5 text-red-400">
                                        Link Tidak Valid
                                    </h2>
                                    <p className="text-xl text-white mb-5">
                                        Link registrasi yang Anda gunakan tidak valid atau sudah
                                        kedaluwarsa.
                                    </p>
                                    <p className="text-lg text-white">
                                        Silakan minta link registrasi yang baru dari agen Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full p-10">
                                <div className="p-10">
                                    <h2 className="text-4xl font-bold mb-10 text-white text-center">
                                        Pendaftaran Retailer
                                    </h2>

                                    {/* Show selected wholesale info */}
                                    {defaultWholesale && (
                                        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                                            <p className="text-blue-800 font-semibold">
                                                Agen Terpilih: {defaultWholesale.name}
                                            </p>
                                        </div>
                                    )}

                                    <FormRegister<IFormInput>
                                        onSubmit={onSubmit}
                                        fields={fields}
                                        defaultWholesale={defaultWholesale}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="sticky bottom-0 w-full">
                {window.innerWidth >= 768 ? (
                    <img src={banner1} className="object-cover w-full h-auto md:w-full" />
                ) : (
                    <img src={banner2} className="object-cover w-full h-auto md:w-full" />
                )}
            </div>
        </>
    );
};

export default RegisterRetailer;
