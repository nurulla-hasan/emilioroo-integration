'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useGetMediaQuery } from '@/lib/features/api/chatApi';
import { FileText, ImageIcon } from 'lucide-react';
import NoData from "../common/NoData";
import LoadFailed from "../common/LoadFailed";
import { Skeleton } from "../ui/skeleton";

export const MediaPanel = ({ activeConversation }) => {
    const id = activeConversation?.conversationId;
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const scrollRef = useRef(null);

    const { data: mediaData, isLoading, isFetching, isError } = useGetMediaQuery(
        { id, args: { page, limit } },
        { skip: !id, refetchOnMountOrArgChange: true }
    );

    const urls = mediaData?.data?.urls || [];
    const imageUrls = urls.filter(url => url.match(/\.(jpeg|jpg|gif|png|webp)$/i));
    const pdfUrls = urls.filter(url => url.match(/\.pdf$/i));

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
            <div className="flex justify-between items-center p-5.5 border-b">
                <h3 className="text-lg font-semibold">Media</h3>
            </div>

            <Tabs defaultValue="images" className="flex-1 h-96 flex flex-col">
                <TabsList className="w-full">
                    <TabsTrigger value="images" >
                        <ImageIcon className="w-4 h-4" />
                        Images
                    </TabsTrigger>
                    <TabsTrigger value="pdfs" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        PDFs
                    </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1" onScroll={handleScroll} ref={scrollRef}>
                    <div className="p-4">
                        {isLoading || isFetching ? (
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <Skeleton key={i} className="h-26 w-26 rounded-lg" />
                                    ))}
                                </div>
                            </div>

                        ) : isError ? (
                            <LoadFailed msg="Failed to load media" />
                        ) : urls.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                                <NoData msg="No media shared in this conversation" />
                            </div>
                        ) : (
                            <>
                                <TabsContent value="images">
                                    {imageUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {imageUrls.map((url, index) => (
                                                <div key={index} className="relative h-26 w-26">
                                                    <Image
                                                        src={url}
                                                        alt="media"
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                                                        className="object-cover border rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="pdfs">
                                    {pdfUrls.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            {pdfUrls.map((url, index) => (
                                                <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-2 border rounded-lg bg-background hover:bg-muted transition-colors"
                                                >
                                                    <FileText className="w-6 h-6 text-red-500" />
                                                    <span className="text-sm font-medium truncate">
                                                        {url.substring(url.lastIndexOf("/") + 1)}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    );
};