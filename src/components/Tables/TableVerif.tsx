import { stagingURL } from '../../utils/API'
import { memo } from 'react';

interface PhotoData {
    retailer_id: number;
    id: number;
    image: string;
    is_verified: boolean;
    is_approved: boolean;
}

const TableVerif = memo(({ dataPhoto }: { dataPhoto: PhotoData[] }) => {
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Verification Process
                </h4>
            </div>

            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Image</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Verified</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Approved</p>
                </div>

                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Action</p>
                </div>
            </div>

            {dataPhoto.map((photo, key) => (
                <div
                    className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-1 flex items-center">
                        <div className="h-12.5 w-15 rounded-md overflow-hidden">
                            <img
                                loading="lazy"
                                src={`${stagingURL}${photo.image}`}
                                alt="Retailer"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {photo.is_verified ? 'Yes' : 'No'}
                        </p>
                    </div>

                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {photo.is_approved ? 'Yes' : 'No'}
                        </p>
                    </div>

                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            Action
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default TableVerif;

