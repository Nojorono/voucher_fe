import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";

interface FormAddWholesaleProps {
    open: boolean;
    handleOpen: () => void;
    onSubmit: (data: any, method: string) => void;
    initialData?: any;
    method: string;
    IdUpdate: any;
}

const ModalFormWholesale: React.FC<FormAddWholesaleProps> = ({ open, handleOpen, onSubmit, initialData, method, IdUpdate }) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: initialData || {},
    });

    const handleFormSubmit = (data: any) => {
        onSubmit(data, method);
        reset();
        handleOpen();
    };

    return (
        <Dialog open={open} handler={handleOpen} size={"lg"}>
            <DialogHeader>{method === 'PUT' ? `Update Data Id : ${IdUpdate[0]}` : 'Tambah Data'}</DialogHeader>
            <DialogBody>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div>
                        <label>Nama Agen</label>
                        <input {...register('name')} required className="border p-2 w-full" />
                    </div>
                    <div className='mt-2'>
                        <label>Telepon</label>
                        <input {...register('phone_number', { required: true })} required className="border p-2 w-full" type="tel" inputMode="numeric" />
                    </div>
                    <div className='mt-2'>
                        <label>Kota</label>
                        <input {...register('city', { required: true })} required className="border p-2 w-full" type="tel" />
                    </div>
                    <div className='mt-2'>
                        <label>Address</label>
                        <textarea {...register('address')} required className="border p-2 w-full" rows={4} />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit" variant="gradient" color="green" className="mr-2">
                            <span>Submit</span>
                        </Button>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                        >
                            <span>Cancel</span>
                        </Button>
                    </div>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default ModalFormWholesale;