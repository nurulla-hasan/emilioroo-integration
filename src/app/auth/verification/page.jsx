"use client";
import { VerificationForm } from '@/components/auth/VerificationForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';


const VerificationPage = () => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-lg">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <VerificationForm />
                </Suspense>
            </div>
        </div>
    );
};

export default VerificationPage;