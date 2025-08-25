
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

export const MediaPanel = ({ media = [] }) => {
    return (
        <div className="w-full bg-card flex-col h-full flex">
            {/* The header is now in the parent sheet, so we can remove it from here if needed */}
            {/* <div className="p-4 border-b"><h2 className="text-lg font-semibold">Media and files</h2></div> */}
            <ScrollArea className="flex-1">
                <div className="p-4">
                    {media.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {media.map(item =>
                                <div key={item.id} className="relative aspect-square">
                                    <Image src={item.src} alt="media" fill className="object-cover rounded-lg" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground pt-8">
                            <p>No media shared in this conversation yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};