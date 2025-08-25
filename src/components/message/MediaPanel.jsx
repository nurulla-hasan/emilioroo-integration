'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

const fakeMedia = [
    { id: 1, type: 'image', src: '/images/placeholder-image.jpg' },
    { id: 2, type: 'image', src: '/images/placeholder-image.jpg' },
    { id: 3, type: 'image', src: '/images/placeholder-image.jpg' },
    { id: 4, type: 'image', src: '/images/placeholder-image.jpg' },
    { id: 5, type: 'image', src: '/images/placeholder-image.jpg' },
    { id: 6, type: 'image', src: '/images/placeholder-image.jpg' },
];

export const MediaPanel = () => {
    return (
        <div className="w-full bg-card flex-col h-full flex">
            <div className="p-4 border-b"><h2 className="text-lg font-semibold">Media and files</h2></div>
            <ScrollArea className="flex-1"><div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                    {
                        fakeMedia.map(item =>
                            <div key={item.id} className="relative aspect-square">
                                <Image src={item.src} alt="media" fill className="object-cover rounded-lg" />
                            </div>
                        )}
                </div>
            </div>
            </ScrollArea>
        </div>
    );
};