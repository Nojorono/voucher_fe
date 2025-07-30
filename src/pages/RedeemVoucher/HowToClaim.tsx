import { FaCopy } from 'react-icons/fa';
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react';
import { encryptWsAndProjectId } from '../../utils/encryption';

export default function HowToClaim() {
    const [wsId, setWsId] = useState<string>('');
    const [projectId] = useState<string>(''); 
    const [encryptedToken, setEncryptedToken] = useState<string>('');
    const { hostname, port } = window.location;
    const baseUrl = `http://${hostname}${port ? `:${port}` : ''}`;
    
    useEffect(() => {
        // Get ws_id from localStorage
        const wsId = localStorage.getItem('ws_id');
        const projectId = localStorage.getItem('project');
        if (wsId && projectId) {
            setWsId(wsId);
            // Encrypt both ws_id and project_id
            const encrypted = encryptWsAndProjectId(wsId, projectId);
            setEncryptedToken(encrypted);
        }
    }, [projectId]);

    // Fallback function untuk copy text
    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Link sudah ter-copy!",
                    text: 'Silahkan Paste/Tempel pada Chat Retailer yang akan mendaftar!'
                });
            } else {
                throw new Error('Copy command was unsuccessful');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            // Show manual copy option
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Copy Manual",
                html: `
                    <p>Silahkan copy link berikut secara manual:</p>
                    <input type="text" value="${text}" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;" readonly onclick="this.select()">
                    <p><small>Klik pada link untuk select all, lalu Ctrl+C untuk copy</small></p>
                `,
                showConfirmButton: true
            });
        }
        
        document.body.removeChild(textArea);
    };

    // COPY CLIPBOARD dengan fallback
    const copyToClipboard = () => {
        const registrationUrl = `${baseUrl}/register/retailer?token=${encryptedToken}`;
        
        // Check if clipboard API is available
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
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
                .catch((err) => {
                    console.error("Gagal menyalin teks: ", err);
                    // Fallback to manual copy
                    fallbackCopyTextToClipboard(registrationUrl);
                });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyTextToClipboard(registrationUrl);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">CARA RETAILER MENDAPATKAN VOUCHER:</h2>
            <ol className="list-decimal list-inside mb-6">
                <li className="mb-2">Toko/retailer diwajibkan memasang sticker POSM dan menyediakan tester di tempat yang telah disediakan di tempat yang strategis di dalam toko.</li>
                <li className="mb-2">Toko/retailer diwajibkan mengambil foto sticker POSM, kotak tester yang sudah terisi dan kode di kotak tester dengan cara mengisi formulir ini: <a href={`${baseUrl}/register/retailer?token=${encryptedToken}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">REGISTER</a></li>
                <li className="mb-2">Voucher akan dikirimkan oleh pihak admin hanya melalui no Whatsapp <strong>081220199495</strong> setelah melalui proses verifikasi.</li>
            </ol>
            <h2 className="text-2xl font-bold mb-4">CARA RETAILER CLAIM VOUCHER:</h2>
            <ol className="list-decimal list-inside">
                <li className="mb-2">Saat toko/retailer mau melakukan pembelian berikutnya, bisa menunjukkan kode voucher ke Agen untuk mendapatkan potongan Rp. 50.000 dari total nilai pembelian mereka.</li>
                <li className="mb-2">Total nilai pembelian produk harus diatas nilai voucher (Rp. 50.000)</li>
                <li className="mb-2">Agen diwajibkan mengisi formulir "Redeem Voucher" dengan detail pembelian.</li>
                <li className="mb-2">NNA akan mengganti biaya Rp. 50.000 kepada Agen sesuai dengan jumlah yang telah digunakan.</li>
            </ol>

            <div className="w-full mt-10 text-center">
                <button
                    onClick={copyToClipboard}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    disabled={!wsId || !encryptedToken}
                >
                    <FaCopy className="mr-2" />
                    <span>Copy Retailer Registration Link</span>
                </button>
                {(!wsId || !encryptedToken) && (
                    <p className="text-red-500 text-sm mt-2">Loading wholesale ID...</p>
                )}
                {encryptedToken && (
                    <p className="text-green-600 text-sm mt-2">
                        🔒 Link aman dengan enkripsi (WS + Project ID)
                    </p>
                )}
            </div>
        </div>
    )
}