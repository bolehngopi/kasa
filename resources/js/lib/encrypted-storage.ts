import CryptoJS from 'crypto-js';
import type { StateStorage } from 'zustand/middleware';

const SECRET_KEY = import.meta.env.VITE_APP_KEY;

export const encryptedStorage: StateStorage = {
    getItem: (name: string): string | null => {
        const encrypted = localStorage.getItem(name);

        if (!encrypted) {
            return null;
        }

        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (decrypted) {
                return decrypted;
            }
        } catch {
            // Decryption failed or data was unencrypted (legacy data)
        }

        return encrypted;
    },
    setItem: (name: string, value: string): void => {
        try {
            const encrypted = CryptoJS.AES.encrypt(
                value,
                SECRET_KEY,
            ).toString();
            localStorage.setItem(name, encrypted);
        } catch (error) {
            console.error(`Failed to encrypt store [${name}]:`, error);
            localStorage.setItem(name, value);
        }
    },
    removeItem: (name: string): void => {
        localStorage.removeItem(name);
    },
};
