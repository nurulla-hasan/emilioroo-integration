"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SuccessPage = () => {
    return (
        <div className="min-h-minus-header flex flex-col items-center justify-center bg-background p-6">
            <Card className="w-full max-w-md text-center p-6 shadow-lg bg-card">
                <CardContent className="flex flex-col items-center justify-center p-0">
                    <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
                    <h1 className="text-3xl font-bold text-primary mb-2">Donation Successful!</h1>
                    <p className="text-muted-foreground mb-6">Thank you for your generous contribution. Your support means a lot to us!</p>
                    <Link href="/">
                        <Button>Go to Home</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessPage;