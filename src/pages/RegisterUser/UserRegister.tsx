import React, { useState } from 'react';
import FormRegisterUser from '../../components/Forms/FormRegister/FormRegisterUser';
import { stagingURL } from '../../utils/API'
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';
import { SubmitHandler } from 'react-hook-form';
// import { RocketLaunchIcon } from '@heroicons/react/24/outline';

interface IFormInput {
  username: string;
  password: string;
  email: string;
  wholesale: Selection;
}

const UserRegister: React.FC = () => {
  const [isReset, setIsReset] = useState(false);

  const postRegisterUser = async (data: IFormInput) => {
    try {

      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token tidak ditemukan di localStorage');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      // Map form fields to FormData
      const formData = new FormData();
      const formFields = {
        username: data.username,
        password: data.password,
        email: data.email,
        wholesale: data.wholesale,
      };

      // Add form fields to FormData
      for (const [key, value] of Object.entries(formFields)) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value as string);
        }
      }

      // // Log FormData
      // formData.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });

      // Make API request
      const response = await fetch(`${stagingURL}/api/user/register/`, {
        method: 'POST',
        body: formData,
        headers: myHeaders,
      });

      if (!response.ok) {
        // const result = await response.json();
        //   console.log('res', result);
        showErrorToast('Terjadi kesalahan saat mengirim data.');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showSuccessToast("Sukses Register User!");
      setIsReset(true);

    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      showErrorToast(`Error: ${(error as Error).message}`);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await postRegisterUser(data);
  };

  const fields: { name: keyof IFormInput; label: string; required: boolean; type?: string }[] = [
    { name: 'username', label: 'Username', required: true },
    { name: 'password', label: 'Password', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'wholesale', label: 'Wholesale', required: true, type: 'select' },
  ];


  return (
    <div className="rounded-sm border">
      <div className="flex flex-wrap items-center">

        <div className="w-full p-10">
          <div className="p-10">

            <CustomToast />

            <h2 className="text-2xl font-bold mb-5">Pendaftaran User</h2>
            <FormRegisterUser<IFormInput>
              onSubmit={onSubmit}
              fields={fields}
              isReset={isReset}
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default UserRegister;