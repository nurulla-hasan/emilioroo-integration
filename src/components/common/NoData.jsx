import Image from 'next/image';
import React from 'react';

const NoData = ({msg}) => {
    return (
        <>
            <div className='col-span-full flex flex-col justify-center items-center h-[55vh]'>
                <Image src="/images/no-data.png" alt="No joined projects" width={150} height={150} className="mx-auto" />
                <span className='text-primary dark:text-white text-sm md:text-lg'>{msg}</span>
            </div>
        </>
    );
};

export default NoData;