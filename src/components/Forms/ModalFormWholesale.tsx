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
    wholesales?: any[];
}

const ModalFormWholesale: React.FC<FormAddWholesaleProps> = ({ open, handleOpen, onSubmit, initialData, method, IdUpdate, wholesales = [] }) => {
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
                        <input {...register('city', { required: true })} required className="border p-2 w-full" type="text" />
                    </div>
                    <div className='mt-2'>
                        <label>Address</label>
                        <textarea {...register('address')} required className="border p-2 w-full" rows={4} />
                    </div>
                    <div className='mt-2'>
                        <label>PIC (Person In Charge)</label>
                        <input {...register('pic')} className="border p-2 w-full" type="text" placeholder="Enter PIC name" />
                    </div>
                    <div className='mt-2'>
                        <label>Parent</label>
                        <select {...register('parent')} className="border p-2 w-full">
                            <option value="">No Parent (Root)</option>
                            {wholesales.map((wholesale) => (
                                <option key={wholesale.id} value={wholesale.id}>
                                    {'  '.repeat(wholesale.level || 0)}
                                    {wholesale.level > 0 ? '└─ ' : ''}
                                    {wholesale.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                        >
                            <span>Batal</span>
                        </Button>
                        <Button type="submit" variant="gradient" color="green" className="mr-2">
                            <span>Simpan</span>
                        </Button>
                    </div>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default ModalFormWholesale;