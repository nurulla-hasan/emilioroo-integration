import Image from 'next/image';
import React from 'react';

const NoData = ({msg}) => {
    return (
        <>
            <div className='col-span-full flex flex-col justify-center items-center mt-10 md:mt-40'>
                <Image src="/images/no-data.png" alt="No joined projects" width={200} height={200} className="mx-auto" />
                <span>{msg}</span>
            </div>
        </>
    );
};

export default NoData;