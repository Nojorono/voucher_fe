import React from 'react';

const Profile: React.FC = () => {
  const name = localStorage.getItem('ws_name') || 'Not Assigned';
  const phoneNumber = localStorage.getItem('ws_phone_number') || 'Not Available';
  const email = localStorage.getItem('email') || 'Not Assigned';
  const isStaff = localStorage.getItem('is_staff') || 'Not Assigned';

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
      <div className="flex flex-col gap-12">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Profile
            </h3>
          </div>
          <form action="#">
            <div className="p-6.5">

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  First name
                </label>
                <input
                  value={name}
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>


              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phone Number
                </label>
                <input
                  value={phoneNumber}
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>

                <input
                  value={email}
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Staf?
                </label>

                <input
                  value={isStaff}
                  type="email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>


              {/* <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Edit Profile
                </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;



