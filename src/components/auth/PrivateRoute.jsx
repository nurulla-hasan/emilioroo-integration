"use client";
import { useGetMe } from '@/hooks/useGetMe';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/animation/Loading.json';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { token } = useGetMe();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  if (token) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-minus-header">
      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150, height: 150 }} />
    </div>
  );
};

export default PrivateRoute;