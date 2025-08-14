import Lottie from 'lottie-react';
import error from "../../../public/animation/Error 404.json";

const LoadFailed = () => {
    return (
        <>
            <Lottie animationData={error} loop={true} style={{ width: 400, height: 400, }} />
        </>
    );
};

export default LoadFailed; 