import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
                <div className="mb-4" key={String(field.name)}>
                    <label htmlFor={String(field.name)} className="block mb-2 text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    {field.type === 'file' ? (
                        <input
                            id={String(field.name)}
                            type="file"
                            multiple
                            {...register(field.name as any, { required: field.required })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                Submit
            </button>
        </form>
    );
};

export default FormRetailerRegister;