"use client";

import React from 'react';
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Search, Loader2 } from 'lucide-react';
import CardSkeleton from '@/components/skeleton/CardSkeleton';

const ProducersList = ({ producers, isLoading, isError }) => {
    if (isLoading) {
        return <CardSkeleton count={5} />;
    }

    if (isError) {
        return <p className="text-red-500">Error loading producers.</p>;
    }

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Producer</h2>
            {/* <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Producer" className="pl-9" />
            </div> */}
            <div className="space-y-3 max-h-[884px] overflow-y-auto">
                {!isLoading && !isError && producers && producers.length === 0 && (
                    <p className="text-muted-foreground">No producers found.</p>
                )}
                {producers && producers.map(producer => (
                    <div key={producer._id} className="flex items-center gap-3 border p-2 rounded-md">
                        <Avatar>
                            <AvatarImage src={producer.user?.avatar} />
                            <AvatarFallback>{producer.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{producer.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{producer.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducersList;
