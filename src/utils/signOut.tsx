import { NavigateFunction } from 'react-router-dom';

export const signOut = (navigate: NavigateFunction) => {
    // Hapus semua data yang tersimpan di localStorage
    localStorage.clear();;

    // Navigasi ke halaman SignIn
    navigate('/auth/signin');
};