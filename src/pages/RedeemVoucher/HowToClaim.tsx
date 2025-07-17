import { FaCopy } from 'react-icons/fa';
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react';
import { encryptWsId } from '../../utils/encryption';

export default function HowToClaim() {
    const [wsId, setWsId] = useState<string>('');
    const [encryptedWsId, setEncryptedWsId] = useState<string>('');
    const { hostname, port } = window.location;
    const baseUrl = `http://${hostname}${port ? `:${port}` : ''}`;
    // if (hostname === 'ryo.kcsi.id') {
    //     const baseUrl = `http://${hostname}`;
    //     console.log('Current hostname:', baseUrl);
    // } else{
    //     const baseUrl = `http://${hostname}:${port}`;
    //     console.log('Current hostname:', baseUrl);
    // }

    useEffect(() => {
        // Get ws_id from localStorage
        const wsId = localStorage.getItem('ws_id');
        if (wsId) {
            setWsId(wsId);
            // Encrypt the ws_id
            const encrypted = encryptWsId(wsId);
            setEncryptedWsId(encrypted);
        }
    }, []);

    // COPY CLIPBOARD
    const copyToClipboard = () => {
        // Import stagingURL from src/utils/API.tsx
        const registrationUrl = `${baseUrl}/register/retailer?token=${encryptedWsId}`;
        
        navigator.clipboard
            .writeText(registrationUrl)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Link sudah ter-copy!",
                    text: 'Silahkan Paste/Tempel pada Chat Retailer yang akan mendaftar!'
                });
            })
            .catch((err) => console.error("Gagal menyalin teks: ", err));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">CARA RETAILER MENDAPATKAN VOUCHER:</h2>
            <ol className="list-decimal list-inside mb-6">
                <li className="mb-2">Toko/retailer diwajibkan memasang sticker POSM dan menyediakan tester di tempat yang telah disediakan di tempat yang strategis di dalam toko.</li>
                <li className="mb-2">Toko/retailer diwajibkan mengambil foto sticker POSM, kotak tester yang sudah terisi dan kode di kotak tester dengan cara mengisi formulir ini: <a href={`${baseUrl}/register/retailer?token=${encryptedWsId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">REGISTER</a></li>
                <li className="mb-2">Voucher akan dikirimkan oleh pihak admin hanya melalui no Whatsapp <strong>081220199495</strong> setelah melalui proses verifikasi.</li>
            </ol>
            <h2 className="text-2xl font-bold mb-4">CARA RETAILER CLAIM VOUCHER:</h2>
            <ol className="list-decimal list-inside">
                <li className="mb-2">Saat toko/retailer mau melakukan pembelian berikutnya, bisa menunjukkan kode voucher ke Agen untuk mendapatkan potongan Rp. 20.000 dari total nilai pembelian mereka.</li>
                <li className="mb-2">Total nilai pembelian produk harus diatas nilai voucher (Rp. 20,000)</li>
                <li className="mb-2">Agen diwajibkan mengisi formulir "Redeem Voucher" dengan detail pembelian.</li>
                <li className="mb-2">NNA akan mengganti biaya Rp. 20.000 kepada Agen sesuai dengan jumlah yang telah digunakan.</li>
            </ol>

            <div className="w-full mt-10 text-center">
                <button
                    onClick={copyToClipboard}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    disabled={!wsId || !encryptedWsId}
                >
                    <FaCopy className="mr-2" />
                    <span>Copy Retailer Registration Link</span>
                </button>
                {(!wsId || !encryptedWsId) && (
                    <p className="text-red-500 text-sm mt-2">Loading wholesale ID...</p>
                )}
                {encryptedWsId && (
                    <p className="text-green-600 text-sm mt-2">
                        🔒 Link aman dengan enkripsi
                    </p>
                )}
            </div>
        </div>
    )
}