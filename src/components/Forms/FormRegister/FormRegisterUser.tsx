import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { stagingURL } from '../../../utils/API'
import Select from 'react-select';

interface FormProps<T extends FieldValues> {
    onSubmit: SubmitHandler<T>;
    isReset?: boolean;
    fields: {
        name: keyof T;
        label: string;
        required?: boolean;
        type?: string;
    }[];
}

const FormRegisterUser = <T extends FieldValues>({ onSubmit, fields, isReset }: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<T>();

    useEffect(() => {
        if (isReset) {
            reset(); // Reset the form when isReset changes to true
        }
    }, [isReset, reset]);


    const [data, setData] = useState<{ value: string; label: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedWholesale, setSelectedWholesale] = useState<string | null>(null);


    const fetchData = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${stagingURL}/api/wholesales/`, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const options = data.map((item: { name: string, id: string }) => ({
                value: item.id,
                label: item.name,
            }));
            setData(options);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmitRegisterUser = (data: T) => {
        const dataRegisterUser = {
            ...data,
            wholesale: selectedWholesale,
        };
        onSubmit(dataRegisterUser);
    };

    return (
        <form onSubmit={handleSubmit(handleSubmitRegisterUser)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
                <div className="mb-4" key={String(field.name)}>
                    <label htmlFor={String(field.name)} className="block mb-2 text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    {field.type === 'select' ? (
                        <div>
                            {field.name === 'wholesale' && (
                                <Select
                                    options={data}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedWholesale(selectedOption.value);
                                        }
                                    }}
                                />

                            )}

                            {errors[field.name] && (
                                <span className="text-sm text-red-500">This field is required</span>
                            )}
                        </div>
                    ) : (
                        <input
                            id={String(field.name)}
                            type={field.type || 'text'}
                            {...register(field.name as any, {
                                required: field.required,
                                pattern: field.name === 'email'
                                    ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                                    : undefined
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    {errors[field.name] && (
                        <span className="text-sm text-red-500">
                            {errors[field.name]?.type === 'required' && 'This field is required'}
                            {errors[field.name]?.type === 'pattern' && 'Invalid email format'}
                        </span>
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

export default FormRegisterUser;