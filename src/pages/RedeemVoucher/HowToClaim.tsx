import { FaCopy } from 'react-icons/fa';
import CustomToast, { showSuccessToast } from '../../components/Toast/CustomToast';


export default function HowToClaim() {
    const copyToClipboard = () => {
        navigator.clipboard
            .writeText("https://ryoapp.niaganusaabadi.co.id/register/retailer")
            .then(() => {
                showSuccessToast(
                    "Link sudah ter-copy, silahkan Paste/Tempel pada Chat Retailer yang akan mendaftar!"
                );
            })
            .catch((err) => console.error("Gagal menyalin teks: ", err));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <CustomToast/>
            <h2 className="text-2xl font-bold mb-4">CARA RETAILER MENDAPATKAN VOUCHER:</h2>
            <ol className="list-decimal list-inside mb-6">
                <li className="mb-2">Toko/retailer diwajibkan memasang sticker POSM dan menyediakan tester di tempat yang telah disediakan di tempat yang strategis di dalam toko.</li>
                <li className="mb-2">Toko/retailer diwajibkan mengambil foto sticker POSM, kotak tester yang sudah terisi dan kode di kotak tester dengan cara mengisi formulir ini: <a href={`https://ryoapp.niaganusaabadi.co.id/register/retailer`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">REGISTER</a></li>
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
                >
                    <FaCopy className="mr-2" />
                    <span>Copy Retailer Registration Link</span>
                </button>
            </div>
        </div>
    )
}