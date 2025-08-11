"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from 'lucide-react';

const AllContent = () => {
    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Real conversation between people</h1>
                <div className="flex items-center gap-2">
                    <Input placeholder="Search institute"/>
                    <Button>+ Upload New Audio</Button>
                    <Button variant="outline" size="icon">
                        <Mic className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Placeholder for content */}
            <div className="bg-gray-100 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Content will be displayed here.</p>
            </div>
        </div>
    );
};

export default AllContent;
