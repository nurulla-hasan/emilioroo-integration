'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';

const NotFoundPage = () => {
  return (
    <PageLayout>
      <div className="container mx-auto py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <AlertTriangle className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-6xl font-bold text-title mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-subtitle mb-4">Page Not Found</h2>
        <p className="text-lg text-subtitle mb-8">Sorry, the page you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;