import React from 'react'
import DataTableVoucher from '../../components/Tables/DataTableVoucher'
import TableOne from '../../components/Tables/TableOne';
import ChartThree from '../../components/Charts/ChartThree';



function DashboardVoucher() {
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          {/* <ChartThree /> */}
          {/* <TableOne /> */}
          <DataTableVoucher />
        </div>
      </div>
    </>
  )
}

export default DashboardVoucher