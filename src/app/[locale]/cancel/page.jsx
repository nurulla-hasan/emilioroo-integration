"use client";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CancelPage = () => {
    return (
        <div className="min-h-minus-header flex flex-col items-center justify-center bg-background p-6">
            <Card className="w-full max-w-md text-center p-6 shadow-lg bg-card">
                <CardContent className="flex flex-col items-center justify-center p-0">
                    <XCircle className="h-20 w-20 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-primary mb-2">Donation Canceled!</h1>
                    <p className="text-muted-foreground mb-6">Your donation was not completed. If you encountered an issue, please try again or contact support.</p>
                    <Link href="/donate-us">
                        <Button>Try Again</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default CancelPage;