import React from 'react';
import TableOne from '../../components/Tables/TableOne';
import ChartThree from '../../components/Charts/ChartThree';
import DataTableDashboard from '../../components/Tables/DataTableDashboard'


const DashboardRetailer: React.FC = () => {
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          {/* <TableOne /> */}
          {/* <ChartThree /> */}
          <DataTableDashboard />
        </div>
      </div>
    </>
  );
};

export default DashboardRetailer;
