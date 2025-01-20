import { NavigateFunction } from 'react-router-dom';

export const signOut = (navigate: NavigateFunction) => {
    // Hapus item dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    localStorage.removeItem('ws_id');
    localStorage.removeItem('ws_name');
    localStorage.removeItem('ws_phone_number');
    localStorage.removeItem('is_staff');

    // Navigasi ke halaman SignIn
    navigate('/auth/signin');
};