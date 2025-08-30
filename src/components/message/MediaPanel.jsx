
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useGetMediaQuery } from '@/lib/features/api/chatApi';
import { FileText } from 'lucide-react';

export const MediaPanel = ({ activeConversation }) => {
    const id = activeConversation?.conversationId;
    const [page, setPage] = useState(1);
    const [limit] = useState(20); 
    const [allMediaUrls, setAllMediaUrls] = useState([]);
    const scrollRef = useRef(null);

    const { data: mediaData, isLoading, isFetching, isError } = useGetMediaQuery(
        { id, args: { page, limit } },
        { skip: !id, refetchOnMountOrArgChange: true });


    useEffect(() => {
        if (mediaData?.data?.urls) {
            setAllMediaUrls(prevUrls => [...prevUrls, ...mediaData.data.urls]);
        }
    }, [mediaData]);

    useEffect(() => {
        setPage(1);
        setAllMediaUrls([]);
    }, [activeConversation?.conversationId]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop } = scrollRef.current;
            if (scrollTop === 0 && !isFetching && mediaData?.data?.meta?.totalPage > page) {
                setPage(prevPage => prevPage + 1);
            }
        }
    };
    return (
        <div className="w-full bg-card flex-col h-full flex">
            <ScrollArea className="flex-1 h-96" onScroll={handleScroll} ref={scrollRef}>
                <div className="p-4">
                    {isLoading || isFetching ? (
                        <div className="text-center text-muted-foreground pt-8">
                            <p>Loading media...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 pt-8">
                            <p>Failed to load media.</p>
                        </div>
                    ) : allMediaUrls.length > 0 ? (
                        <>
                            <h3 className="text-lg font-semibold mb-2">Images</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {allMediaUrls.filter(url => url.match(/\.(jpeg|jpg|gif|png|webp)$/i)).map((url, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <Image 
                                        src={url} 
                                        alt="media" 
                                        fill 
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                                        className="object-cover rounded-lg" />
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">PDFs</h3>
                            <div className="flex flex-col gap-2">
                                {allMediaUrls.filter(url => url.match(/\.pdf$/i)).map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 border rounded-lg bg-background hover:bg-muted transition-colors">
                                        <FileText className="w-6 h-6 text-red-500" />
                                        <span className="text-sm font-medium truncate">{url.substring(url.lastIndexOf('/') + 1)}</span>
                                    </a>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground pt-8">
                            <p>No media shared in this conversation yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}