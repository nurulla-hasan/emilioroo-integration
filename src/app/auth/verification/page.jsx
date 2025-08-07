"use client";
import { VerificationForm } from '@/components/auth/VerificationForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const VerificationPage = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-lg">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <VerificationForm type={type} />
                </Suspense>
            </div>
        </div>
    );
};

export default VerificationPage;