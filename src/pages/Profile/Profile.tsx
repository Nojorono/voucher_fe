import React, { useState } from 'react';
import { stagingURL, signOut } from '../../utils';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState({
    userId: localStorage.getItem('userid') || 'Not Assigned',
    email: localStorage.getItem('email') || 'Not Assigned',
    ws_name: localStorage.getItem('ws_name') || 'Not Assigned',

    username: localStorage.getItem('username') || 'Not Assigned',
    password: localStorage.getItem('password') || 'Not Assigned',
  });

  const [userProfileOriginal, setUserProfileOriginal] = useState({
    userId: localStorage.getItem('userid') || 'Not Assigned',
    email: localStorage.getItem('email') || 'Not Assigned',
    ws_name: localStorage.getItem('ws_name') || 'Not Assigned',

    username: localStorage.getItem('username') || 'Not Assigned',
    password: localStorage.getItem('password') || 'Not Assigned',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setUserProfile(prevProfile => ({ ...prevProfile, [field]: value }));
    localStorage.setItem(`ws_${field}`, value);
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const renderInput = (label: string, value: string, type: string = 'text', field: string) => {
    if (isEditing && field === 'ws_name') return null;
    return (
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">{label}</label>
        <div className="relative">
          <input
            value={value}
            type={field === 'password' && !showPassword ? 'password' : type}
            onChange={e => handleInputChange(e, field)}
            readOnly={!isEditing || field === 'ws_name'}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition
               focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${(!isEditing || field === 'ws_name') ? 'bg-gray-200' : ''}`}
          />
          {field === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    const updatedData: { [key: string]: string } = {};
    (Object.keys(userProfile) as Array<keyof typeof userProfile>).forEach(key => {
      if (userProfile[key] !== userProfileOriginal[key]) {
        updatedData[key] = userProfile[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      showErrorToast('No changes detected');
      return;
    }


    console.log(updatedData);


    try {
      if (updatedData.password) {
        await updatePassword(token, updatedData.password);
      }

      if (updatedData.username || updatedData.email) {
        await updateProfile(token, updatedData);
      }

      setIsEditing(false);
      setUserProfileOriginal(userProfile);
    } catch (error) {
      showErrorToast('Error updating profile');
    }
  };

  const updateProfile = async (token: string, updatedData: { [key: string]: string }) => {
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    };

    const response = await fetch(`${stagingURL}/api/user/update/${userProfile.userId}/`, requestOptions);

    if (response.ok) {
      showSuccessToast('Profile updated successfully');
      // Update localStorage with new values
      if (updatedData.username) {
        localStorage.setItem('username', updatedData.username);
      }
      if (updatedData.email) {
        localStorage.setItem('email', updatedData.email);
      }
    } else {
      showErrorToast(`Failed to update profile: ${response.statusText}`);
      throw new Error('Failed to update profile');
    }
  };

  const updatePassword = async (token: string, newPassword: string) => {
    const response = await fetch(`${stagingURL}/api/change_password/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_password: userProfileOriginal.password,
        new_password: newPassword,
      }),
    });

    if (response.ok) {
      showSuccessToast('Password updated successfully');
      localStorage.setItem('password', newPassword);
      setShowPassword(false); // Hide the password
      console.log('Password updated successfully');
    } else {
      const errorData = await response.json();
      if (errorData.new_password) {
        showErrorToast(errorData.new_password.join(' '));
      } else {
        showErrorToast(`Failed to update password: ${response.statusText}`);
      }
      throw new Error('Failed to update password');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
      <div className="flex flex-col gap-12">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h2 className="font-bold text-black dark:text-white text-3xl">
              {isEditing ? 'Update Profile' : 'My Profile'}
            </h2>
          </div>

          <CustomToast />

          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {renderInput('Nama Agen', userProfile.ws_name, 'ws_name', 'ws_name')}
              {renderInput('Username', userProfile.username, 'text', 'username')}
              {renderInput('Email', userProfile.email, 'email', 'email')}

              {isEditing && renderInput('Password', userProfile.password, 'text', 'password')}

              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setUserProfile(userProfileOriginal);
                    setShowPassword(false); // Hide the password
                  }
                  setIsEditing(prev => !prev);
                }}
                className={`flex w-full justify-center rounded p-3 font-medium text-gray hover:bg-opacity-90 ${isEditing ? 'bg-red-500' : 'bg-primary'}`}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-success p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
                >
                  Submit Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
