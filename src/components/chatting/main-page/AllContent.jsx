"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Plus } from 'lucide-react';
import UploadAudioModal from './UploadAudioModal';

const AllContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-primary dark:text-white">Real conversation between people</h1>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsModalOpen(true)}><Plus/> Upload New Audio</Button>
                        <Button variant="outline" size="icon">
                            <Mic/>
                        </Button>
                    </div>
                </div>

                {/* Placeholder for content */}
                <div className="bg-gray-100 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Content will be displayed here.</p>
                </div>
            </div>
            <UploadAudioModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
};

export default AllContent;
