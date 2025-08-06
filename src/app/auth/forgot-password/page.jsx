"use client";
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';


const ForgotPassPage = () => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-lg">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPassPage;