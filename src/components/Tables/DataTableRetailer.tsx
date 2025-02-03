import { RETAILER } from '../../types/retailer';

const retailerData: RETAILER[] = [
  {
    status: 'PENDING',
    agen: 'Agen 1',
    toko: 'Toko A',
    whatsapp: '000',
    alamat: 'xxx',
    provinsi: 'xxx',
    kota: 'xxx',
    kecamatan: 'xxx',
    kelurahan: 'xxx',
    voucher: 'IEEKCUJEJ',
  },
  {
    status: 'RECEIVED',
    agen: 'Agen 1',
    toko: 'Toko A',
    whatsapp: '000',
    alamat: 'xxx',
    provinsi: 'xxx',
    kota: 'xxx',
    kecamatan: 'xxx',
    kelurahan: 'xxx',
    voucher: '-',
  },
  {
    status: 'CLAIMED',
    agen: 'Agen 1',
    toko: 'Toko A',
    whatsapp: '000',
    alamat: 'xxx',
    provinsi: 'xxx',
    kota: 'xxx',
    kecamatan: 'xxx',
    kelurahan: 'xxx',
    voucher: 'JKEIXLEWN',
  },
  {
    status: 'REIMBURSED',
    agen: 'Agen 1',
    toko: 'Toko A',
    whatsapp: '000',
    alamat: 'xxx',
    provinsi: 'xxx',
    kota: 'xxx',
    kecamatan: 'xxx',
    kelurahan: 'xxx',
    voucher: 'KEIUKISUXS',
  },
  {
    status: 'REIMBURSED',
    agen: 'Agen 1',
    toko: 'Toko A',
    whatsapp: '000',
    alamat: 'xxx',
    provinsi: 'xxx',
    kota: 'xxx',
    kecamatan: 'xxx',
    kelurahan: 'xxx',
    voucher: '-',
  },
];

const DataTableDashboardRetailer = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Retailer Data
      </h4>

      <div className="flex flex-col">
        {/* Set the grid to have 11 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-10 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Voucher Status
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Agen
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Toko
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              WhatsApp
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Alamat
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Provinsi
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Kota
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Kecamatan
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Kelurahan
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Voucher Code
            </h5>
          </div>
        </div>

        {retailerData.map((retailer, key) => (
          <div
            className={`grid grid-cols-1 sm:grid-cols-10 ${
              key === retailerData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="hidden text-sm items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-meta-5">{retailer.status}</p>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-xs text-black dark:text-white sm:block">
                {retailer.agen}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.toko}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-xs text-meta-3">{retailer.whatsapp}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.alamat}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.provinsi}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.kota}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.kecamatan}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-black dark:text-white">
                {retailer.kelurahan}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-xs text-meta-5">{retailer.voucher}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-xs font-medium text-black dark:text-white">
          Voucher Status: PENDING → Formulir telah dikirim tetapi belum
          diapprove. RECEIVED → Formulir telah diapprove, dan voucher telah
          dikirim. CLAIMED → Pembelian telah dilakukan, dan voucher telah
          digunakan. REIMBURSED → NNA telah mengganti biaya kepada agen.
        </p>
      </div>
    </div>
  );
};

export default DataTableDashboardRetailer;
