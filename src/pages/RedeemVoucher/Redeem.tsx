import React, { useState } from 'react';
import { stagingURL } from '../../utils/API';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';

interface SKUItem {
    sku: string;
    qty: number;
    nominal: number;
}

function Redeem() {
    const [voucherCode, setVoucherCode] = useState('');
    const [skuItems, setSkuItems] = useState<SKUItem[]>([{ sku: '', qty: 0, nominal: 0 }]);
    const [message, setMessage] = useState('');

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const WSname = localStorage.getItem('ws_name');

        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            showErrorToast('Token tidak ditemukan, silakan login kembali.');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("voucher_code", voucherCode);
        formdata.append("ws_name", `${WSname}`);
        skuItems.forEach((item, index) => {
            formdata.append(`sku[${index}]`, item.sku);
            formdata.append(`qty[${index}]`, item.qty.toString());
            formdata.append(`nominal[${index}]`, item.nominal.toString());
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: 'follow' as RequestRedirect,
        };

        try {
            const response = await fetch(`${stagingURL}/api/redeem_voucher/`, requestOptions);
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                showSuccessToast(data.message);
            } else {
                setMessage(data.non_field_errors[0]);
                showErrorToast(data.non_field_errors[0]);
            }
        } catch (error) {
            setMessage('Terjadi kesalahan, silakan coba lagi.');
            showErrorToast(String(error));
        }
    };

    const handleAddSKU = () => {
        setSkuItems([...skuItems, { sku: '', qty: 0, nominal: 0 }]);
    };

    const handleRemoveSKU = (index: number) => {
        const newSkuItems = skuItems.filter((_, i) => i !== index);
        setSkuItems(newSkuItems);
    };

    const handleSKUChange = (index: number, field: keyof SKUItem, value: string | number) => {
        const newSkuItems = skuItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setSkuItems(newSkuItems);
    };

    const total = skuItems.reduce((acc, item) => acc + (item.qty * item.nominal), 0);

    return (
        <div>
            <CustomToast />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                Redeem Voucher
                </h3>
            </div>

            <form action="#" onSubmit={handleRedeem}>
                <div className="p-6.5">
                <button type="button" onClick={handleAddSKU} className="mb-4.5 text-blue-500">Add SKU</button>

                {skuItems.map((item, index) => (
                    <div key={index} className="mb-4.5 flex space-x-4">
                    <div className="flex-1">
                        <label className="mb-2.5 block text-black dark:text-white">
                        SKU
                        </label>
                        <input
                        type="text"
                        placeholder="Enter SKU"
                        value={item.sku}
                        onChange={(e) => handleSKUChange(index, 'sku', e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-2.5 block text-black dark:text-white">
                        Qty
                        </label>
                        <input
                        type="number"
                        placeholder="Enter quantity"
                        value={item.qty}
                        onChange={(e) => handleSKUChange(index, 'qty', Number(e.target.value))}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-2.5 block text-black dark:text-white">
                        Nominal
                        </label>
                        <input
                        type="number"
                        placeholder="Enter nominal value"
                        value={item.nominal}
                        onChange={(e) => handleSKUChange(index, 'nominal', Number(e.target.value))}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <button type="button" onClick={() => handleRemoveSKU(index)} className="mt-8 text-red-500">Remove</button>
                    </div>
                ))}

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                    Voucher
                    </label>
                    <input
                    type="text"
                    placeholder="Enter your voucher code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                    Total
                    </label>
                    <input
                    type="text"
                    value={total}
                    readOnly
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Redeem
                </button>
                {message && (
                    <input
                    type="text"
                    value={message}
                    readOnly
                    className="mt-4 w-full rounded border border-stroke bg-transparent py-2 px-3 text-black dark:text-white"
                    />
                )}
                </div>
            </form>
            </div>
        </div>
    );
}

export default Redeem;
