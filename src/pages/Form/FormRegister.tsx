import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { stagingURL } from '../../utils/API'


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
    const [provinsi, setProvinsi] = useState<string[]>([]);
    const [kota, setKota] = useState<string[]>([]);
    const [kecamatan, setKecamatan] = useState<string[]>([]);
    const [kelurahan, setKelurahan] = useState<string[]>([]);
    // const [kodepos, setKodepos] = useState<string[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
    const [photoRemarks, setPhotoRemarks] = useState<string[]>([]);

    useEffect(() => {
        const fetcProvinsi = async () => {
            try {
                const response = await fetch(`${stagingURL}/api/provinsi`);
                const data = await response.json();
                setProvinsi(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetcProvinsi();
    }, []);

    const handleProvinsiChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProvinsi = event.target.value;
        setKota([]);
        setKecamatan([]);
        setKelurahan([]);
        if (selectedProvinsi) {
            await fetcKOta(selectedProvinsi);
        }
    };

    const fetcKOta = async (provinsi: string) => {
        if (!provinsi) return;
        try {
            const response = await fetch(`${stagingURL}/api/kota/?provinsi=${provinsi}`);
            const data = await response.json();
            setKota(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKotaChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKota = event.target.value;
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
            setKecamatan(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKecamatanChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKecamatan = event.target.value;
        if (selectedKecamatan) {
            await fetcKelurahan(selectedKecamatan);
        }
    };

    const fetcKelurahan = async (kecamatan: string) => {
        if (!kecamatan) return;
        try {
            const response = await fetch(`${stagingURL}/api/kelurahan/?kecamatan=${kecamatan}`);
            const data = await response.json();
            setKelurahan(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPhotos = Array.from(files);
            setUploadedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
            setPhotoRemarks((prevRemarks) => [
                ...prevRemarks,
                ...Array.from(files).map(() => ''),
            ]);
        }
    };

    const handleSubmitWithRemarks = (data: T) => {
        const remarksData = {
            ...data,
            photo_remarks: photoRemarks,
            photos: uploadedPhotos,
        };
        onSubmit(remarksData);
    };

    return (
        <form onSubmit={handleSubmit(handleSubmitWithRemarks)} className="space-y-4">
            {fields.map((field) => (
                <div className="mb-4" key={String(field.name)}>
                    <label htmlFor={String(field.name)} className="block mb-2 text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    {field.type === 'file' ? (
                        <>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        id={`${String(field.name)}_${index}`}
                                        type="file"
                                        {...register(`${String(field.name)}_${index}` as any, { required: field.required, onChange: handleFileChange })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={photoRemarks[index] || ''}
                                        onChange={(e) => {
                                            const newRemarks = [...photoRemarks];
                                            newRemarks[index] = e.target.value;
                                            setPhotoRemarks(newRemarks);
                                        }}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Remark for Photo ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </>
                    ) : field.type === 'select' ? (
                        <>
                            {field.name === 'provinsi' && (
                                <select
                                    id={String(field.name)}
                                    {...register(field.name as any, { required: field.required, onChange: handleProvinsiChange })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih opsi</option>
                                    {provinsi.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                            {field.name === 'kota' && (
                                <select
                                    id={String(field.name)}
                                    {...register(field.name as any, { required: field.required, onChange: handleKotaChange })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Kota</option>
                                    {kota.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                            {field.name === 'kecamatan' && (
                                <select
                                    id={String(field.name)}
                                    {...register(field.name as any, { required: field.required, onChange: handleKecamatanChange })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Kecamatan</option>
                                    {kecamatan.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                            {field.name === 'kelurahan' && (
                                <select
                                    id={String(field.name)}
                                    {...register(field.name as any, { required: field.required })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Kelurahan</option>
                                    {kelurahan.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                        </>
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
            <button
                type="submit"
                className="col-span-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                Submit
            </button>
        </form>
    );
};

export default FormRetailerRegister;