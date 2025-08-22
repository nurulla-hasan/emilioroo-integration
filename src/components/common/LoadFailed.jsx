import Lottie from 'lottie-react';
import error from "../../../public/animation/Error 404.json";

const LoadFailed = ({ msg }) => {
    return (
        <>
            <div className='col-span-full flex flex-col justify-center items-center mt-10 '>
                <Lottie animationData={error} loop={true} style={{ width: 300, height: 300, }} />
                <span>{msg}</span>
            </div>
        </>
    );
};

export default LoadFailed; 