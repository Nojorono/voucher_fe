import React from 'react';

const Profile: React.FC = () => {
  const name = localStorage.getItem('ws_name') || 'Not Assigned';
  const phoneNumber = localStorage.getItem('ws_phone_number') || 'Not Available';
  const email = localStorage.getItem('email') || 'Not Assigned';

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Phone Number:</strong> {phoneNumber}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  );
};

export default Profile;
