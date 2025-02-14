import React, { useEffect, useState } from 'react';
import { stagingURL } from '../../utils/API';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface SKUItem {
    id_sku: number
    sku: string;
    qty: number;
    nominal: number;
}

function Redeem() {
    const [voucherCode, setVoucherCode] = useState('');
    const [skuItems, setSkuItems] = useState<SKUItem[]>([{ id_sku: 0, sku: '', qty: 0, nominal: 0 }]);
    const [message, setMessage] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const [receiptImage, setReceiptImage] = useState<File | null>(null);
    const [items, setItems] = useState<{
        id: string | number | readonly string[] | undefined; sku: string; name: string; price: string; is_active: boolean
    }[]>([]);
    const [isVoucherValid, setIsVoucherValid] = useState(false);


    const validateForm = () => {
        if (!voucherCode) {
            showErrorToast('Voucher code harus diisi.');
            return false;
        }

        for (let i = 0; i < skuItems.length; i++) {
            if (!skuItems[i].sku) {
                showErrorToast(`SKU pada baris ${i + 1} harus diisi.`);
                return false;
            }
            if (skuItems[i].qty <= 0) {
                showErrorToast(`Jumlah beli pada baris ${i + 1} harus lebih dari 0.`);
                return false;
            }
        }

        if (!receiptImage) {
            showErrorToast('Bukti pembelian harus diunggah.');
            return false;
        }

        return true;
    };

    const verifyVoucher = async () => {

        if (subTotal < 20000) {
            showErrorToast('Pembelian harus diatas 20,000 untuk redeem voucher.');
            return false;
        }

        const token = localStorage.getItem('token');
        const ws_id = localStorage.getItem('ws_id');

        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            showErrorToast('Token tidak ditemukan, silakan login kembali.');
            return false;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');

        try {
            const verifyResponse = await fetch(`${stagingURL}/api/redeem_voucher/`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ voucher_code: voucherCode, ws_id: ws_id }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.status === 201 && verifyData.message === "Voucher redeemed successfully") {
                showSuccessToast('Voucher valid.');
                setIsVoucherValid(true);
                setMessage(verifyData.message);
                return true;
            } else {
                showErrorToast(verifyData.non_field_errors[0]);
                setErrMessage(verifyData.non_field_errors[0]);
                return false;
            }

        } catch (error) {
            console.log('Gagal memverifikasi voucher, silakan coba lagi.');
            return false;
        }
    };

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!isVoucherValid) {
            showErrorToast('Voucher Anda tidak valid atau belum redeem voucher.');
            return;
        }

        const token = localStorage.getItem('token');
        const ws_id = localStorage.getItem('ws_id');

        if (!token) {
            console.error('Token tidak ditemukan di localStorage');
            showErrorToast('Token tidak ditemukan, silakan login kembali.');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        const itemsToPost = skuItems.map((item) => ({
            item_id: item.id_sku,
            qty: item.qty,
            sub_total: item.nominal
        }));

        const formdata = new FormData();
        formdata.append("voucher_code", voucherCode);
        formdata.append("ws_id", `${ws_id}`);
        formdata.append("items", JSON.stringify(itemsToPost));
        formdata.append("total_price", subTotal.toString());
        formdata.append("total_price_after_discount", grandTotalAfterDiscount.toString());
        if (receiptImage) {
            formdata.append("image", receiptImage);
        }

        // Log each key/value pair in the FormData
        for (let [key, value] of formdata.entries()) {
            console.log(`${key}: ${value}`);
        }

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: 'follow' as RequestRedirect,
        };
        try {
            setMessage('Loading...');
            const response = await fetch(`${stagingURL}/api/submit_redeem_voucher/`, requestOptions);
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                showSuccessToast(data.message);
                reimburseVoucher();

                // Clear form after a delay
                setTimeout(() => {
                    setVoucherCode('');
                    setSkuItems([{ id_sku: 0, sku: '', qty: 0, nominal: 0 }]);
                    setReceiptImage(null);
                    setIsVoucherValid(false);
                    setMessage('');
                    window.location.reload(); // Refresh the page
                }, 5000);
            } else {
                setErrMessage(data.non_field_errors[0]);
                showErrorToast(data.non_field_errors[0]);
            }
        } catch (error) {
            setErrMessage('Terjadi kesalahan, silakan coba lagi.');
            showErrorToast(String(error));
        }
    };

    const handleAddSKU = () => {
        setSkuItems([...skuItems, { id_sku: 0, sku: '', qty: 0, nominal: 0 }]);
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

        console.log('skuItems', skuItems);

        const newSkuItems = skuItems.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'sku') {
                    const selectedItem = items.find((itm) => itm.sku === value);
                    console.log('selectedItem', selectedItem);

                    if (selectedItem) {
                        updatedItem.nominal = Number(selectedItem.price) * updatedItem.qty;
                        updatedItem.id_sku = typeof selectedItem.id === 'number' ? selectedItem.id : 0;
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

    const subTotal = skuItems.reduce((acc, item) => acc + item.nominal, 0);
    const discount = isVoucherValid ? 20000 : 0;
    const grandTotalAfterDiscount = subTotal === 0 ? 0 : subTotal - discount;

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


    const reimburseVoucher = () => {

        const formData = {
            voucher_codes: [voucherCode],
        };

        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify(formData);
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        const url = `${stagingURL}/api/submit_reimburse/`;

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('res_Post', result[0].status);

                if (Array.isArray(result) && result[0]?.error) {
                    const errorCodes = result.filter((item: any) => item.error).map((item: any) => item.voucher_code);
                    showErrorToast(`${errorCodes.join(', ')} ${result[0].error}`);
                } else if (result.error) {
                    showErrorToast(result.error);
                } else {
                    setTimeout(() => {
                        showSuccessToast(`${result[0].status}`);
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error('Error posting/updating data:', error);
                showErrorToast('Error submitting data');
            });
    };

    return (
        <div>
            <CustomToast />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h1 className="text-xl font-bold">Reedem Voucher</h1>

                </div>

                <form action="#" onSubmit={handleRedeem}>
                    <div className="p-6.5">
                        <>
                            <button
                                type='button'
                                onClick={handleAddSKU}
                                className="mt-15 border border-green-500 text-green-500 py-2 px-2 rounded flex items-center hover:bg-green-500 hover:text-white"
                            >
                                <FaPlus className="mr-2" />
                                Tambah SKU
                            </button>

                            {skuItems.map((item, index) => (
                                <div key={index} className="mb-4.5 mt-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">

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
                                                handleSKUChange(index, 'qty', value);
                                            }}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Total Harga
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter nominal value"
                                            value={item.nominal.toLocaleString('id-ID')}
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
                                    value={subTotal.toLocaleString('id-ID')}
                                    readOnly
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5 flex items-end space-x-4">
                                <div className="flex-1">
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
                                <button
                                    type='button'
                                    onClick={verifyVoucher}
                                    className="rounded bg-purple-500 p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    Redeem Voucher
                                </button>
                            </div>

                            {(message || errMessage) && (
                                <div className={`mt-4 p-4 border rounded text-center ${message ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                    <p>{message || errMessage}</p>
                                </div>
                            )}

                            <div className="mb-4.5 mt-5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Diskon Potongan Voucher
                                </label>
                                <input
                                    type="text"
                                    value={isVoucherValid ? `${(20000).toLocaleString('id-ID')}` : 0}
                                    readOnly
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Grand Total (Setelah Diskon)
                                </label>
                                <input
                                    type="text"
                                    value={grandTotalAfterDiscount.toLocaleString('id-ID')}
                                    readOnly
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            {/* <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                Submit
                            </button> */}

                            {isVoucherValid && (
                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    Submit
                                </button>
                            )}
                        </>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Redeem;
