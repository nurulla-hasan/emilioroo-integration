"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetMe } from '@/hooks/useGetMe';
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/lottie/Loading.json";
import useAuthStore from '@/store/auth';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const token = useAuthStore.getState().token;
  const { user, isLoading, isError } = useGetMe();

  useEffect(() => {

    if (!token) {
      toast.error('You need to be logged in to access this page.');
      router.push('/');
      return;
    }

    if (!isLoading && isError) {
      // toast.error('Your session has expired or is invalid. Please log in again.');
      router.push('/auth/login');
    }
  }, [isLoading, isError, user, router, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-minus-header">
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150, height: 150 }} />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;