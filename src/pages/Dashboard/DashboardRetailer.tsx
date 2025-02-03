import React from 'react';
import DataTableRetailer from '../../components/Tables/DataTableRetailer'


const DashboardRetailer: React.FC = () => {
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <DataTableRetailer />
        </div>
      </div>
    </>
  );
};

export default DashboardRetailer;
