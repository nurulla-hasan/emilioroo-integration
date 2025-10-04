// import Lottie from 'lottie-react';
// import error from "../../../public/animation/Error 404.json";
import Image from 'next/image';

const LoadFailed = ({ msg }) => {
    return (
        <>
            <div className='col-span-full flex flex-col justify-center items-center h-[55vh]'>
                {/* <Lottie animationData={error} loop={true} style={{ width: 200, height: 200, }} /> */}
                <Image src="/images/error.png" alt="No joined projects" width={100} height={100} className="mx-auto" priority />
                <span>{msg}</span>
            </div>
        </>
    );
};

export default LoadFailed; 