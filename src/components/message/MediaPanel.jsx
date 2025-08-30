'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from 'next/image';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMediaQuery } from '@/lib/features/api/chatApi';
import { addUrls, incrementPage, setMediaConversation } from '@/lib/features/slices/media/mediaSlice';
import { FileText, ImageIcon } from 'lucide-react';
import NoData from "../common/NoData";
import LoadFailed from "../common/LoadFailed";
import { Skeleton } from "../ui/skeleton";

export const MediaPanel = ({ activeConversation }) => {
    const dispatch = useDispatch();
    const id = activeConversation?.conversationId;

    const { page, allUrls } = useSelector(state => state.media);

    const { data: mediaData, isFetching, isError } = useGetMediaQuery(
        { id, args: { page, limit: 20 } },
        { skip: !id, refetchOnMountOrArgChange: true }
    );

    useEffect(() => {
        dispatch(setMediaConversation({ conversationId: id }));
    }, [id, dispatch]);

    useEffect(() => {
        if (mediaData?.data?.urls) {
            dispatch(addUrls({ urls: mediaData.data.urls }));
        }
    }, [mediaData, dispatch]);

    const imageUrls = allUrls.filter(url => url.match(/\.(jpeg|jpg|gif|png|webp)$/i));
    const pdfUrls = allUrls.filter(url => url.match(/\.pdf$/i));

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

        if (isAtBottom && !isFetching && mediaData?.data?.meta?.totalPage > page) {
            dispatch(incrementPage());
        }
    };

    const renderContent = () => {
        if (!id) {
            return (
                <div className="text-center text-muted-foreground h-[50vh] flex items-center justify-center">
                    <p>Please select a conversation to see media</p>
                </div>
            );
        }

        if (isFetching && page === 1) {
            return (
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Skeleton key={i} className="h-26 w-26 rounded-lg" />
                    ))}
                </div>
            );
        }

        if (isError && allUrls.length === 0) {
            return <LoadFailed msg="Failed to load media" />;
        }

        if (allUrls.length === 0 && !isFetching) {
            return (
                <div className="text-center text-muted-foreground">
                    <NoData msg="No media shared in this conversation" />
                </div>
            );
        }

        return (
            <>
                <TabsContent value="images">
                    {imageUrls.length > 0 ? (
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
                    ) : (
                        <div className="text-center text-muted-foreground pt-10">
                            <NoData msg="No images found" />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pdfs">
                    {pdfUrls.length > 0 ? (
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
                    ) : (
                        <div className="text-center text-muted-foreground pt-10">
                            <NoData msg="No PDFs found" />
                        </div>
                    )}
                </TabsContent>

                {isFetching && page > 1 && (
                    <div className="text-center p-4 col-span-full">Loading more...</div>
                )}
            </>
        );
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

                <ScrollArea className="flex-1" onScroll={handleScroll}>
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    );
};
