import React, { useEffect, useState } from 'react';
import { stagingURL } from '../../utils/API';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface SKUItem {
    sku: string;
    qty: number;
    nominal: number;
}

function Redeem() {
    const [voucherCode, setVoucherCode] = useState('');
    const [skuItems, setSkuItems] = useState<SKUItem[]>([{ sku: '', qty: 0, nominal: 0 }]);
    const [message, setMessage] = useState('');
    const [receiptImage, setReceiptImage] = useState<File | null>(null);
    const [items, setItems] = useState<{ sku: string; name: string; price: string; is_active: boolean }[]>([]);

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
            formdata.append(`total_pembelian[${index}]`, item.nominal.toString());
        });

        if (receiptImage) {
            formdata.append("receipt_image", receiptImage);
        }

        // Log the form data
        console.log('Form Data:');
        console.log('Voucher Code:', voucherCode);
        console.log('WS Name:', WSname);
        console.log('SKU Items:', skuItems);
        console.log('Receipt Image:', receiptImage);

        // const requestOptions = {
        //     method: "POST",
        //     headers: myHeaders,
        //     body: formdata,
        //     redirect: 'follow' as RequestRedirect,
        // };

        // try {
        //     const response = await fetch(`${stagingURL}/api/redeem_voucher/`, requestOptions);
        //     const data = await response.json();
        //     if (response.ok) {
        //         setMessage(data.message);
        //         showSuccessToast(data.message);
        //     } else {
        //         setMessage(data.non_field_errors[0]);
        //         showErrorToast(data.non_field_errors[0]);
        //     }
        // } catch (error) {
        //     setMessage('Terjadi kesalahan, silakan coba lagi.');
        //     showErrorToast(String(error));
        // }
    };

    const handleAddSKU = () => {
        setSkuItems([...skuItems, { sku: '', qty: 0, nominal: 0 }]);
    };

    const handleRemoveSKU = (index: number) => {
        if (skuItems.length > 1) {
            const newSkuItems = skuItems.filter((_, i) => i !== index);
            setSkuItems(newSkuItems);
        } else {
            showErrorToast('Minimal harus ada satu inputan SKU.');
            return;
        }
    };

    const handleSKUChange = (index: number, field: keyof SKUItem, value: string | number) => {
        const newSkuItems = skuItems.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'sku') {
                    const selectedItem = items.find((itm) => itm.sku === value);
                    if (selectedItem) {
                        updatedItem.nominal = Number(selectedItem.price) * updatedItem.qty;
                    }
                } else if (field === 'qty') {
                    const selectedItem = items.find((itm) => itm.sku === item.sku);
                    if (selectedItem) {
                        updatedItem.nominal = Number(selectedItem.price) * Number(value);
                    }
                }
                return updatedItem;
            }
            return item;
        });
        setSkuItems(newSkuItems);
    };

    const handleFocus = (index: number, field: keyof SKUItem) => {
        const newSkuItems = skuItems.map((item, i) => {
            if (i === index && item[field] === 0) {
                return { ...item, [field]: '' };
            }
            return item;
        });
        setSkuItems(newSkuItems);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptImage(e.target.files[0]);
        }
    };

    const grandTotal = skuItems.reduce((acc, item) => acc + (item.qty * item.nominal), 0);

    const fetchItemSKU = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            showErrorToast('Token tidak ditemukan, silakan login kembali.');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        try {
            const response = await fetch(`${stagingURL}/api/items/`, {
                method: 'GET',
                headers: myHeaders,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Fetch error:', error);
            showErrorToast('Gagal mengambil data, silakan coba lagi.');
        }
    };

    useEffect(() => {
        fetchItemSKU();
    }, []);

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

                        <button
                            type='button'
                            onClick={handleAddSKU}
                            className="mb-5 border border-green-500 text-green-500 py-2 px-2 rounded flex items-center hover:bg-green-500 hover:text-white"
                        >
                            <FaPlus className="mr-2" />
                            Tambah SKU
                        </button>

                        {skuItems.map((item, index) => (
                            <div key={index} className="mb-4.5 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                <div className="flex-1">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        SKU
                                    </label>
                                    <select
                                        value={item.sku}
                                        onChange={(e) => handleSKUChange(index, 'sku', e.target.value)}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    >
                                        <option value="">Pilih SKU</option>
                                        {items.map((itm) => (
                                            <option key={itm.sku} value={itm.sku}>
                                                {itm.name} ({itm.sku})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Jumlah Beli
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={item.qty}
                                        min="1"
                                        onFocus={() => handleFocus(index, 'qty')}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value > 0) {
                                                handleSKUChange(index, 'qty', value);
                                            }
                                        }}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Total Harga
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter nominal value"
                                        value={item.nominal}
                                        readOnly
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSKU(index)}
                                    className="text-red-500 py-5 px-2 rounded flex items-center"
                                >
                                    <FaTrash className="mr-2" />
                                    Hapus
                                </button>
                            </div>
                        ))}

                        <hr className="my-8 border-t dark:border-strokedark" />

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Bukti Pembelian
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Sub Total
                            </label>
                            <input
                                type="text"
                                value={grandTotal}
                                readOnly
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Kode Voucher
                            </label>
                            <input
                                type="text"
                                placeholder="Masukan voucher code"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Grand Total
                            </label>
                            <input
                                type="text"
                                value={grandTotal}
                                readOnly
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Submit
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
