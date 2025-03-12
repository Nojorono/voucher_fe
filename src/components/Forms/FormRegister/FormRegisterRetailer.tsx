import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { stagingURL } from '../../../utils/API'
import Select from 'react-select';
import { sample1, sample2, sample3, noImg } from '../../../images/sample/index';
import CustomToast, { showErrorToast, showSuccessToast } from '../../../components/Toast/CustomToast';
import { Webcam } from '@webcam/react';

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
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPhotos: File[] = [];
            const newPhotoRemarks: string[] = [];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                const remark = i === 0 ? 'Foto Stiker POSM' : i === 1 ? 'Foto Tester' : 'Foto Kode Tester';

                if (!file.type.startsWith('image/')) {
                    alert('Only image files are allowed.');
                    continue;
                }

                if (file.size > 500 * 1024) {
                    try {
                        file = await compressImage(file, 100 * 1024);
                    } catch (error) {
                        showErrorToast(`Failed to compress ${remark}.`);
                        continue;
                    }
                }

                if (file.size > 600 * 1024) {
                    showErrorToast(`${remark} tidak boleh lebih dari 500 KB!`);
                    event.target.value = ''; // Clear the input
                    return;
                }

                newPhotos.push(file);
                newPhotoRemarks.push(remark);
            }
            setUploadedPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
            setPhotoRemarks(newPhotoRemarks);
        }
    };

    const compressImage = (file: File, maxSize: number): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    const scaleFactor = Math.sqrt(maxSize / file.size);
                    canvas.width = img.width * scaleFactor;
                    canvas.height = img.height * scaleFactor;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: file.type }));
                        } else {
                            reject(new Error('Compression failed'));
                        }
                    }, file.type);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmitRegister = (data: T) => {

        if (uploadedPhotos.length != 3) {
            showErrorToast('Please upload all required photos.');
            return;
        }

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
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch(`${stagingURL}/api/wholesales/`, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const options = data
                .filter((item: { is_active: boolean }) => item.is_active)
                .map((item: { name: string, id: string }) => ({
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
        <>
            <CustomToast />

            <form onSubmit={handleSubmit(handleSubmitRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div className="mb-4" key={String(field.name)}>
                        <label htmlFor={String(field.name)} className="block mb-2 text-lg font-bold text-white">
                            {field.label}
                        </label>

                        {field.type === 'file' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="mb-2">
                                        <label className="mt-1 block text-sm text-white">
                                            {index === 0 ? 'Foto Stiker POSM' : index === 1 ? 'Foto Tester' : 'Foto Kode Tester'}
                                        </label>

                                        <img
                                            src={index === 0 ? sample1 : index === 1 ? sample2 : sample3}
                                            alt={`Sample ${index + 1}`}
                                            className="mt-2 mb-1 w-32 h-32 object-cover"
                                            onClick={() => setLightboxIndex(index)}
                                        />

                                        {lightboxIndex === index && (
                                            <Lightbox
                                                open={lightboxIndex !== null}
                                                close={() => setLightboxIndex(null)}
                                                slides={[{ src: index === 0 ? sample1 : index === 1 ? sample2 : sample3 }]}
                                            />
                                        )}

                                        <input
                                            id={`${String(field.name)}_${index}`}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            {...register(`${String(field.name)}_${index}` as any, { required: field.required, onChange: handleFileChange })}
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {/* WITH OPEN CAMERA */}
                                        {/* <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    const webcamElement = document.getElementById(`webcam-container-${index}`);
                                                    if (webcamElement) {
                                                        webcamElement.style.display = 'block';
                                                    }
                                                } catch (error) {
                                                    alert('Permission to access camera was denied.');
                                                }
                                            }}
                                            className="w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mt-2"
                                            id={`open-camera-button-${index}`}
                                        >
                                            Buka Camera
                                        </button>

                                        <div id={`webcam-container-${index}`} style={{ display: 'none' }} className='mt-2'>
                                            <Webcam mirrored>
                                                {({ getSnapshot }) => (
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const snapshot = getSnapshot({ quality: 0.8 });
                                                                if (snapshot) {
                                                                    const base64Data = snapshot.split(',')[1];
                                                                    const byteCharacters = atob(base64Data);
                                                                    const byteNumbers = new Array(byteCharacters.length);
                                                                    for (let i = 0; i < byteCharacters.length; i++) {
                                                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                                                    }
                                                                    const byteArray = new Uint8Array(byteNumbers);
                                                                    const file = new File([byteArray], `photo_${index}.jpg`, { type: 'image/jpeg' });

                                                                    handleFileChange({
                                                                        target: { files: [file] }
                                                                    } as unknown as React.ChangeEvent<HTMLInputElement>);

                                                                    // Display the captured photo
                                                                    const objectUrl = URL.createObjectURL(file);
                                                                    const imgElement = document.getElementById(`captured-photo-${index}`) as HTMLImageElement;
                                                                    if (imgElement) {
                                                                        imgElement.src = objectUrl;
                                                                    }

                                                                    // Hide webcam and show "Buka Camera" button again
                                                                    const webcamElement = document.getElementById(`webcam-container-${index}`);
                                                                    const openCameraButton = document.getElementById(`open-camera-button-${index}`);
                                                                    if (webcamElement && openCameraButton) {
                                                                        webcamElement.style.display = 'none';
                                                                        openCameraButton.style.display = 'block';
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mt-3"
                                                        >
                                                            Ambil Foto
                                                        </button>
                                                    </div>
                                                )}
                                            </Webcam>
                                        </div>
                                        <img src={noImg} id={`captured-photo-${index}`} alt={`Captured ${index + 1}`} className="mt-3 w-32 h-32 object-cover" /> */}
                                    </div>
                                ))}
                            </div>
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
                            <span className="text-sm text-yellow-500">This field is required!</span>
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
        </>

    );
};

export default FormRetailerRegister;