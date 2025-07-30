// Simple encryption utility for ws_id
// This provides basic security to prevent easy manipulation of wholesale IDs in URLs

const SECRET_KEY = 'RYO_SECRET_2025'; // Secret key for encryption

/**
 * Encrypts a wholesale ID for secure URL transmission
 * @param wsId - The wholesale ID to encrypt
 * @returns Encrypted string in format "base64_encrypted_data.base64_timestamp"
 */
export const encryptWsId = (wsId: string): string => {
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

/**
 * Decrypts an encrypted wholesale ID
 * @param encryptedWsId - The encrypted string to decrypt
 * @returns Original wholesale ID or empty string if decryption fails
 */
export const decryptWsId = (encryptedWsId: string): string => {
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

/**
 * Validates if an encrypted wholesale ID is valid
 * @param encryptedWsId - The encrypted string to validate
 * @returns True if valid, false otherwise
 */
export const isValidEncryptedWsId = (encryptedWsId: string): boolean => {
    try {
        const decrypted = decryptWsId(encryptedWsId);
        return decrypted !== '' && !isNaN(parseInt(decrypted));
    } catch (error) {
        return false;
    }
};

/**
 * Encrypts both wholesale ID and project ID for secure URL transmission
 * @param wsId - The wholesale ID to encrypt
 * @param projectId - The project ID to encrypt
 * @returns Encrypted string containing both IDs
 */
export const encryptWsAndProjectId = (wsId: string, projectId: string): string => {
    try {
        // Combine both IDs with a separator
        const combinedData = `${wsId}|${projectId}`;
        
        // XOR encryption
        let encrypted = '';
        for (let i = 0; i < combinedData.length; i++) {
            const charCode = combinedData.charCodeAt(i);
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
        console.error('Combined encryption error:', error);
        return '';
    }
};

/**
 * Decrypts combined wholesale and project IDs
 * @param encryptedToken - The encrypted string to decrypt
 * @returns Object with wsId and projectId or null if decryption fails
 */
export const decryptWsAndProjectId = (encryptedToken: string): { wsId: string; projectId: string } | null => {
    try {
        // Split encrypted data and timestamp
        const [encryptedData, encryptedTimestamp] = encryptedToken.split('.');
        
        if (!encryptedData || !encryptedTimestamp) {
            console.error('Invalid encrypted format');
            return null;
        }
        
        // Decode timestamp and check if it's not too old
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
        
        // Split the combined data
        const [wsId, projectId] = decrypted.split('|');
        
        if (!wsId || !projectId) {
            console.error('Invalid decrypted format');
            return null;
        }
        
        return { wsId, projectId };
    } catch (error) {
        console.error('Combined decryption error:', error);
        return null;
    }
};

/**
 * Validates if an encrypted combined token is valid
 * @param encryptedToken - The encrypted string to validate
 * @returns True if valid, false otherwise
 */
export const isValidEncryptedToken = (encryptedToken: string): boolean => {
    try {
        const decrypted = decryptWsAndProjectId(encryptedToken);
        return decrypted !== null && 
               !isNaN(parseInt(decrypted.wsId)) && 
               !isNaN(parseInt(decrypted.projectId));
    } catch (error) {
        return false;
    }
};
