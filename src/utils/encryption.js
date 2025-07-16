// Simple encryption utility for ws_id
const SECRET_KEY = 'RYO_SECRET_2025'; // Secret key for encryption

export const encryptWsId = (wsId) => {
    try {
        // Convert to string if it's a number
        const wsIdString = wsId.toString();
        
        // XOR encryption
        let encrypted = '';
        for (let i = 0; i < wsIdString.length; i++) {
            const charCode = wsIdString.charCodeAt(i);
            const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            encrypted += String.fromCharCode(charCode ^ keyChar);
        }
        
        // Base64 encode to make it URL safe
        const base64 = btoa(encrypted);
        
        // Add timestamp for additional security
        const timestamp = Date.now().toString();
        const timestampEncrypted = btoa(timestamp);
        
        return `${base64}.${timestampEncrypted}`;
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

export const decryptWsId = (encryptedWsId) => {
    try {
        // Split encrypted data and timestamp
        const [encryptedData, encryptedTimestamp] = encryptedWsId.split('.');
        
        if (!encryptedData || !encryptedTimestamp) {
            console.error('Invalid encrypted format');
            return '';
        }
        
        // Decode timestamp and check if it's not too old (optional security check)
        const timestamp = parseInt(atob(encryptedTimestamp));
        const currentTime = Date.now();
        const hoursDifference = (currentTime - timestamp) / (1000 * 60 * 60);
        
        // Optional: Check if link is not older than 24 hours
        if (hoursDifference > 24) {
            console.warn('Encrypted link is too old');
            // You can decide whether to reject or allow old links
        }
        
        // Base64 decode
        const encrypted = atob(encryptedData);
        
        // XOR decryption
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
            const charCode = encrypted.charCodeAt(i);
            const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            decrypted += String.fromCharCode(charCode ^ keyChar);
        }
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
};

// Additional validation function
export const isValidEncryptedWsId = (encryptedWsId) => {
    try {
        const decrypted = decryptWsId(encryptedWsId);
        return decrypted !== '' && !isNaN(parseInt(decrypted));
    } catch (error) {
        return false;
    }
};
