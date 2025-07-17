import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { stagingURL } from '../../../utils/API';
import Select from 'react-select';
import { sample1, sample2, sample3 } from '../../../images/sample/index';
import CustomToast, {
  showErrorToast,
} from '../../../components/Toast/CustomToast';

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  fields: {
    name: keyof T;
    label: string;
    required?: boolean;
    type?: string;
  }[];
  defaultWholesale?: { id: number; name: string } | null;
}

const FormRetailerRegister = <T extends FieldValues>({
  onSubmit,
  fields,
  defaultWholesale,
}: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>();

  const [provinsi, setProvinsi] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [kota, setKota] = useState<{ value: string; label: string }[]>([]);
  const [kecamatan, setKecamatan] = useState<
    { value: string; label: string }[]
  >([]);
  const [kelurahan, setKelurahan] = useState<
    { value: string; label: string }[]
  >([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoRemarks, setPhotoRemarks] = useState<string[]>([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState<string | null>(null);
  const [selectedKota, setSelectedKota] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(
    null,
  );
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(
    null,
  );
  const [selectedWS, setSelectedWS] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetcProvinsi = async () => {
      try {
        const response = await fetch(`${stagingURL}/api/provinsi`);
        const data = await response.json();
        console.log('Fetched Provinsi:', data);

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
      const response = await fetch(
        `${stagingURL}/api/kota/?provinsi=${provinsi}`,
      );
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
      const response = await fetch(
        `${stagingURL}/api/kelurahan/?kecamatan=${kecamatan}`,
      );
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      let file = files[0];
      const remark =
        index === 0
          ? 'Foto Pack/Slop Display'
          : index === 1
          ? 'Foto Tester'
          : 'Foto Kode Tester';

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      if (file.size > 500 * 1024) {
        try {
          file = await compressImage(file, 100 * 1024);
        } catch (error) {
          showErrorToast(`Failed to compress ${remark}.`);
          return;
        }
      }

      if (file.size > 600 * 1024) {
        showErrorToast(`${remark} tidak boleh lebih dari 500 KB!`);
        event.target.value = ''; // Clear the input
        return;
      }

      setUploadedPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        newPhotos[index] = file;
        return newPhotos;
      });

      setPhotoRemarks((prevRemarks) => {
        const newRemarks = [...prevRemarks];
        newRemarks[index] = remark;
        return newRemarks;
      });
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
    if (uploadedPhotos.length != 1) {
      showErrorToast('Please upload all required photos.');
      return;
    }

    // Pastikan ws_name terisi, baik dari selectedWS atau defaultWholesale
    const wsName =
      selectedWS || (defaultWholesale ? defaultWholesale.name : '');

    if (!wsName) {
      showErrorToast(
        'Nama Agen diperlukan. Silakan gunakan link registrasi yang diberikan oleh agen.',
      );
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
      ws_name: wsName,
    };
    onSubmit(remarksData);
  };

  // Set default wholesale if provided from URL
  useEffect(() => {
    if (defaultWholesale) {
      setSelectedWS(defaultWholesale.name);
    }
  }, [defaultWholesale]);

  return (
    <>
      <CustomToast />

      <form
        onSubmit={handleSubmit(handleSubmitRegister)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {fields.map((field) => (
          <div className="mb-4" key={String(field.name)}>
            <label
              htmlFor={String(field.name)}
              className="block mb-2 text-lg font-bold text-white"
            >
              {field.label}
            </label>

            {field.type === 'file' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[0].map((index) => (
                  <div key={index} className="mb-2">
                    <label className="mt-1 block text-sm text-white">
                      {index === 0
                        ? 'Foto Pack/Slop Display'
                        : index === 1
                        ? 'Foto Tester'
                        : 'Foto Kode Tester'}
                    </label>

                    <img
                      src={
                        uploadedPhotos[index]
                          ? URL.createObjectURL(uploadedPhotos[index])
                          : index === 0
                          ? sample1
                          : index === 1
                          ? sample2
                          : sample3
                      }
                      alt={`Sample ${index + 1}`}
                      className="mt-2 mb-1 w-32 h-32 object-cover"
                      onClick={() => setLightboxIndex(index)}
                    />

                    {lightboxIndex === index && (
                      <Lightbox
                        open={lightboxIndex !== null}
                        close={() => setLightboxIndex(null)}
                        slides={[
                          {
                            src: uploadedPhotos[index]
                              ? URL.createObjectURL(uploadedPhotos[index])
                              : index === 0
                              ? sample1
                              : index === 1
                              ? sample2
                              : sample3,
                          },
                        ]}
                      />
                    )}

                    <input
                      style={{ width: '100%' }}
                      id={`${String(field.name)}_${index}`}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      {...register(`${String(field.name)}_${index}` as any, {
                        required: field.required,
                        onChange: (e) => handleFileChange(e, index),
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                  <div>
                    <input
                      type="text"
                      value={
                        selectedWS ||
                        (defaultWholesale ? defaultWholesale.name : '')
                      }
                      onChange={(e) => setSelectedWS(e.target.value)}
                      readOnly={true}
                      placeholder={
                        defaultWholesale
                          ? `${defaultWholesale.name}`
                          : 'Nama Agen akan terisi otomatis'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                    />
                    {defaultWholesale && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Agen sudah terpilih dari link registrasi
                      </p>
                    )}
                    {!defaultWholesale && (
                      <p className="text-sm text-blue-600 mt-1">
                        ℹ️ Gunakan link registrasi yang diberikan oleh agen
                      </p>
                    )}
                  </div>
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
              <span className="text-sm text-yellow-500">
                This field is required!
              </span>
            )}
          </div>
        ))}

        <div className="col-span-1 md:col-span-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5">
            <strong className="font-bold">Peringatan!&nbsp;</strong>
            <span className="block sm:inline">
              Voucher akan dikirimkan oleh pihak admin hanya melalui no Whatsapp{' '}
              <b>081220199495</b> setelah melalui proses verifikasi.
            </span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
          </div>

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
