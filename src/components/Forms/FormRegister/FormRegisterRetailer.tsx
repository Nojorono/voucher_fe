import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { stagingURL } from '../../../utils/API'
import Select from 'react-select';

interface FormProps<T extends FieldValues> {
    onSubmit: SubmitHandler<T>;
    fields: {
        name: keyof T;
        label: string;
        required?: boolean;
        type?: string;
    }[];
}

const FormRetailerRegister = <T extends FieldValues>({ onSubmit, fields }: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<T>();

    const [provinsi, setProvinsi] = useState<{ value: string; label: string }[]>([]);
    const [kota, setKota] = useState<{ value: string; label: string }[]>([]);
    const [kecamatan, setKecamatan] = useState<{ value: string; label: string }[]>([]);
    const [kelurahan, setKelurahan] = useState<{ value: string; label: string }[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
    const [photoRemarks, setPhotoRemarks] = useState<string[]>([]);
    const [dataWholesale, setDataWholesale] = useState<{ value: string; label: string }[]>([]);

    const [selectedProvinsi, setSelectedProvinsi] = useState<string | null>(null);
    const [selectedKota, setSelectedKota] = useState<string | null>(null);
    const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
    const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);
    const [selectedWS, setSelectedWS] = useState<string | null>(null);



    useEffect(() => {
        const fetcProvinsi = async () => {
            try {
                const response = await fetch(`${stagingURL}/api/provinsi`);
                const data = await response.json();
                const options = data.map((item: string) => ({
                    value: item,
                    label: item,
                }));
                setProvinsi(options);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetcProvinsi();
    }, []);

    const handleProvinsiChange = async (selectedProvinsi: string) => {
        setKota([]);
        setKecamatan([]);
        setKelurahan([]);
        if (selectedProvinsi) {
            await fetchKota(selectedProvinsi);
        }
    };

    const fetchKota = async (provinsi: string) => {
        if (!provinsi) return;
        try {
            const response = await fetch(`${stagingURL}/api/kota/?provinsi=${provinsi}`);
            const data = await response.json();
            const options = data.map((item: string) => ({
                value: item,
                label: item,
            }));
            setKota(options);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKotaChange = async (selectedKota: string) => {
        setKecamatan([]);
        setKelurahan([]);
        if (selectedKota) {
            await fetcKecamatan(selectedKota);
        }
    };

    const fetcKecamatan = async (kota: string) => {
        if (!kota) return;
        try {
            const response = await fetch(`${stagingURL}/api/kecamatan/?kota=${kota}`);
            const data = await response.json();
            const options = data.map((item: string) => ({
                value: item,
                label: item,
            }));
            setKecamatan(options);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKecamatanChange = async (selectedKecamatan: string) => {
        if (selectedKecamatan) {
            await fetcKelurahan(selectedKecamatan);
        }
    };

    const fetcKelurahan = async (kecamatan: string) => {
        if (!kecamatan) return;
        try {
            const response = await fetch(`${stagingURL}/api/kelurahan/?kecamatan=${kecamatan}`);
            const data = await response.json();
            const options = data.map((item: string) => ({
                value: item,
                label: item,
            }));
            setKelurahan(options);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPhotos = Array.from(files);
            setUploadedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
            setPhotoRemarks(['Tampak Depan', 'Tampak Belakang', 'Tampak Samping'].slice(0, newPhotos.length));
        }
    };

    const handleSubmitRegister = (data: T) => {
        const remarksData = {
            ...data,
            photo_remarks: photoRemarks,
            photos: uploadedPhotos,
            provinsi: selectedProvinsi,
            kota: selectedKota,
            kecamatan: selectedKecamatan,
            kelurahan: selectedKelurahan,
            ws_name: selectedWS,
        };
        onSubmit(remarksData);
    };

    const fetchDataWholesale = async () => {
        // const token = localStorage.getItem('token');

        // if (!token) {
        //     console.error('Token tidak ditemukan di localStorage');
        //     return;
        // }

        // const myHeaders = new Headers();
        // myHeaders.append('Authorization', `Bearer ${token}`);

        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
            // headers: myHeaders,
        };

        try {
            const response = await fetch(`${stagingURL}/api/wholesales/`, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const options = data.map((item: { name: string, id: string }) => ({
                value: item.name,
                label: item.name,
            }));
            setDataWholesale(options);
        } catch (error) {
            console.log(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    useEffect(() => {
        fetchDataWholesale();
    }, [])


    return (
        <form onSubmit={handleSubmit(handleSubmitRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
                <div className="mb-4" key={String(field.name)}>
                    <label htmlFor={String(field.name)} className="block mb-2 text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    {field.type === 'file' ? (
                        <>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="mb-2">
                                    <label className="mt-1 block text-sm text-gray-600">
                                        {index === 0 ? 'Upload Foto Tampak Depan' : index === 1 ? 'Upload Foto Tampak Belakang' : 'Upload Foto Tampak Samping'}
                                    </label>
                                    <input
                                        id={`${String(field.name)}_${index}`}
                                        type="file"
                                        {...register(`${String(field.name)}_${index}` as any, { required: field.required, onChange: handleFileChange })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </>
                    ) : field.type === 'select' ? (
                        <div>
                            {field.name === 'provinsi' && (
                                <Select
                                    options={provinsi}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedProvinsi(selectedOption.value);
                                            handleProvinsiChange(selectedOption.value);
                                        }
                                    }}
                                />
                            )}
                            {field.name === 'kota' && (
                                <Select
                                    options={kota}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedKota(selectedOption.value);
                                            handleKotaChange(selectedOption.value);
                                        }
                                    }}
                                />
                            )}
                            {field.name === 'kecamatan' && (
                                <Select
                                    options={kecamatan}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedKecamatan(selectedOption.value);
                                            handleKecamatanChange(selectedOption.value);
                                        }
                                    }}
                                />
                            )}
                            {field.name === 'kelurahan' && (
                                <Select
                                    options={kelurahan}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedKelurahan(selectedOption.value);
                                        }
                                    }}
                                />
                            )}
                            {field.name === 'ws_name' && (
                                <Select
                                    options={dataWholesale}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedWS(selectedOption.value);
                                        }
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <input
                            id={String(field.name)}
                            type={field.type || 'text'}
                            {...register(field.name as any, { required: field.required })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    {errors[field.name] && (
                        <span className="text-sm text-red-500">This field is required</span>
                    )}
                </div>
            ))}
            <div className="col-span-1 md:col-span-2">
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default FormRetailerRegister;