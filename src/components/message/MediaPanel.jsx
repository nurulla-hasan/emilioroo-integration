'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMediaQuery } from '@/lib/features/api/chatApi';
import { addUrls, incrementPage, setMediaConversation } from '@/lib/features/slices/media/mediaSlice';
import { FileText, ImageIcon } from 'lucide-react';
import NoData from "../common/NoData";
import LoadFailed from "../common/LoadFailed";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const MediaPanel = ({ activeConversation }) => {
    const t = useTranslations('Message');
    const dispatch = useDispatch();
    const id = activeConversation?.conversationId;

    const { page, allUrls } = useSelector(state => state.media);
    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    // Normalize entries to { url, createdAt? }
    const toEntry = (item) => (typeof item === 'string' ? { url: item } : item);
    const imageEntries = allUrls.map(toEntry).filter(item => item?.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));
    const pdfEntries = allUrls.map(toEntry).filter(item => item?.url?.match(/\.pdf$/i));

    const openPreview = (url) => {
        setPreviewImage(url);
        setIsPreviewOpen(true);
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

        if (isAtBottom && !isFetching && mediaData?.data?.meta?.totalPages > page) {
            dispatch(incrementPage());
        }
    };

    const renderContent = () => {
        if (!id) {
            return (
                <div className="text-center text-muted-foreground h-[50vh] flex items-center justify-center">
                    <p>{t('selectConversationForMedia')}</p>
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
            return <LoadFailed msg={t('failedToLoadMedia')} />;
        }

        if (allUrls.length === 0 && !isFetching) {
            return (
                <div className="text-center text-muted-foreground">
                    <NoData msg={t('noMediaShared')} />
                </div>
            );
        }

        return (
            <>
                <TabsContent value="images">
                    {imageEntries.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {imageEntries.map((entry, index) => (
                                <button key={index} type="button" className="relative h-26 w-26 focus:outline-none" onClick={() => openPreview(entry.url)}>
                                    <Image
                                        src={entry.url}
                                        alt="media"
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                                        className="object-cover border rounded-lg"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground pt-10">
                            <NoData msg={t('noImagesFound')} />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pdfs">
                    {pdfEntries.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {pdfEntries.map((entry, index) => (
                                <a
                                    key={index}
                                    href={entry.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-2 p-2 border rounded-lg bg-background hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-6 h-6 text-red-500" />
                                        <span className="text-sm font-medium truncate">
                                            {entry.url.substring(entry.url.lastIndexOf("/") + 1)}
                                        </span>
                                    </div>
                                    {entry.createdAt && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDate(entry.createdAt)}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground pt-10">
                            <NoData msg={t('noPdfsFound')} />
                        </div>
                    )}
                </TabsContent>

                {isFetching && page > 1 && (
                    <div className="text-center p-4 col-span-full">{t('loadingMore')}</div>
                )}
            </>
        );
    };

    return (
        <div className="w-full bg-card flex-col h-full flex bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
            <div className="flex justify-between items-center p-5.5 border-b">
                <h3 className="text-lg font-semibold">{t('media')}</h3>
            </div>

            <Tabs defaultValue="images" className="flex-1 h-96 flex flex-col">
                <TabsList className="w-full">
                    <TabsTrigger value="images" >
                        <ImageIcon className="w-4 h-4" />
                        {t('images')}
                    </TabsTrigger>
                    <TabsTrigger value="pdfs" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('pdfs')}
                    </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1" onScroll={handleScroll}>
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </ScrollArea>
            </Tabs>
            {/* Image Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-3xl w-full">
                    <DialogHeader>
                        <DialogTitle>{t('imagePreview')}</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[60vh]">
                        {previewImage && (
                            <Image src={previewImage} alt="preview" fill className="object-contain rounded-lg" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};