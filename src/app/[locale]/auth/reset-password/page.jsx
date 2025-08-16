"use client";
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';


const ResetPassPage = () => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-lg">
                <ResetPasswordForm/>
            </div>
        </div>
    );
};

export default ResetPassPage;