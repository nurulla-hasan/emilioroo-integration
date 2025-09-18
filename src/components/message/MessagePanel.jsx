'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Message } from './Message';
import { ArrowLeft, CheckCheck, FileText, Info, MessageSquareDashed, PlusCircle, Send, X } from "lucide-react";
import MessagePanelSkeleton from "@/components/skeleton/MessagePanelSkeleton";
import LoadFailed from "@/components/common/LoadFailed";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDispatch } from "react-redux";
import { baseApi } from "@/lib/features/api/baseApi";
import { useDeleteUploadedFileMutation, useUploadFileMutation } from "@/lib/features/api/chatApi";
import { useMarkAsCompletedMutation } from "@/lib/features/api/bondsApi";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import RatingModal from '../bonds/RatingModal';
import { useTranslations } from "next-intl";

export const MessagePanel = ({
    conversation,
    messages,
    onOpenMedia,
    newMessage,
    setNewMessage,
    onSendMessage,
    fetchMoreMessages,
    isMessagesLoading,
    isMessagesError,
    onBack,
    isBondLink,
    isCompletedByYou,
    isBondLinkLoading
}) => {
    const t = useTranslations('Message');
    const messagesEndRef = useRef(null);
    const scrollViewportRef = useRef(null);
    const prevScrollHeightRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stagedFiles, setStagedFiles] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [uploadedPdfUrls, setUploadedPdfUrls] = useState([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);


    const dispatch = useDispatch();

    const [uploadFile] = useUploadFileMutation();
    const [deleteUploadedFile] = useDeleteUploadedFileMutation();
    const [markAsCompleted, { isLoading: isMarkingAsCompleted }] = useMarkAsCompletedMutation();

    const onConfirmMarkAsCompleted = async () => {
        if (!conversation?.bondLinkId) return;

        try {
            await markAsCompleted(conversation.bondLinkId).unwrap();
            toast.success(t("bondCompletedSuccess"));
            dispatch(baseApi.util.invalidateTags(['BONDS']));
            setIsRatingModalOpen(true);
        } catch (error) {
            toast.error(error?.data?.message || t("failedToMarkCompleted"));
        } finally {
            setIsConfirmationModalOpen(false);
        }
    };

    const handleMarkAsCompleted = () => {
        setIsConfirmationModalOpen(true);
    };


    const lastMessage = messages[messages.length - 1];
    useEffect(() => {
        if (prevScrollHeightRef.current === null) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [lastMessage]);

    useEffect(() => {
        if (prevScrollHeightRef.current !== null && scrollViewportRef.current) {
            const scrollViewport = scrollViewportRef.current;
            const newScrollHeight = scrollViewport.scrollHeight;
            scrollViewport.scrollTop = newScrollHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = null;
        }
    }, [messages]);

    const handleScroll = (e) => {
        const scrollViewport = e.currentTarget;
        scrollViewportRef.current = scrollViewport;

        if (scrollViewport.scrollTop === 0 && !isMessagesLoading) {
            prevScrollHeightRef.current = scrollViewport.scrollHeight;
            fetchMoreMessages();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const newStagedFiles = files.map(file => ({
            file,
            status: 'pending',
            url: null,
        }));
        setStagedFiles(prev => [...prev, ...newStagedFiles]);

        setIsUploadingFiles(true);

        const formData = new FormData();
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                formData.append('conversation_image', file);
            } else if (file.type === 'application/pdf') {
                formData.append('conversation_pdf', file);
            }
        });

        try {
            setStagedFiles(prev => prev.map(stagedFile =>
                newStagedFiles.some(nf => nf.file === stagedFile.file) ? { ...stagedFile, status: 'uploading' } : stagedFile
            ));

            const response = await uploadFile(formData).unwrap();

            if (response.data) {
                const uploadedImages = response.data.images || [];
                const uploadedPdfs = response.data.pdfs || [];

                setUploadedImageUrls(prev => [...prev, ...uploadedImages]);
                setUploadedPdfUrls(prev => [...prev, ...uploadedPdfs]);

                setStagedFiles(prev => prev.map(stagedFile => {
                    const imageUrl = uploadedImages.find(url => url.includes(stagedFile.file.name));
                    const pdfUrl = uploadedPdfs.find(url => url.includes(stagedFile.file.name));

                    if (imageUrl || pdfUrl) {
                        return { ...stagedFile, status: 'uploaded', url: imageUrl || pdfUrl };
                    }
                    return stagedFile;
                }));
            }
        } catch (error) {
            toast.error(error?.data?.message || t('failedToUploadFiles'));
            setStagedFiles(prev => prev.map(stagedFile =>
                newStagedFiles.some(nf => nf.file === stagedFile.file) ? { ...stagedFile, status: 'error' } : stagedFile
            ));
        } finally {
            setIsUploadingFiles(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeStagedFile = async (fileToRemove) => {
        setStagedFiles(prev => prev.filter(stagedFile => stagedFile !== fileToRemove));
        setUploadedImageUrls(prev => prev.filter(url => url !== fileToRemove.url));
        setUploadedPdfUrls(prev => prev.filter(url => url !== fileToRemove.url));

        if (fileToRemove.status === 'uploaded' && fileToRemove.url) {
            try {
                await deleteUploadedFile({ files: [fileToRemove.url] }).unwrap();
                // toast.success('File deleted from server.');
            } catch (error) {
                toast.error(error?.data?.message || t('failedToDeleteFile'));
            }
        }
    };

    const handleSendClick = () => {
        if (isUploadingFiles || (newMessage.trim() === '' && uploadedImageUrls.length === 0 && uploadedPdfUrls.length === 0)) {
            return;
        }
        onSendMessage(newMessage, uploadedImageUrls, uploadedPdfUrls);
        setNewMessage('');
        setUploadedImageUrls([]);
        setUploadedPdfUrls([]);
        setStagedFiles([]);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onOpenChange={setIsConfirmationModalOpen}
                title={t("markAsCompleted")}
                description={t("markAsCompletedDescription")}
                onConfirm={onConfirmMarkAsCompleted}
                loading={isMarkingAsCompleted}
                confirmText={t("confirm")}
            />
            <RatingModal
                isOpen={isRatingModalOpen}
                onOpenChange={setIsRatingModalOpen}
                bondLinkId={conversation.bondLinkId}
            />
            <div className="w-full bg-card flex flex-col h-full">
                <div className="p-3 border-b flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack}>
                            <ArrowLeft />
                        </Button>
                        <Avatar className="h-12 w-12 mr-4 border-2">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>
                                {conversation.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold">{conversation.name}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden lg:block">
                            {isBondLink && (
                                isBondLinkLoading ? (
                                    <Skeleton className="h-10 w-40" />
                                ) : isCompletedByYou ? (
                                    <Button className="bg-green-800 text-white cursor-default">
                                        <CheckCheck />
                                        {t('completedByYou')}
                                    </Button>
                                ) : (
                                    <Button onClick={handleMarkAsCompleted} disabled={isMarkingAsCompleted}>
                                        {isMarkingAsCompleted ? t('marking') : t('markAsCompleted')}
                                    </Button>
                                )
                            )}
                        </div>
                        <Button variant="ghost" size="icon" className="xl:hidden" onClick={onOpenMedia}>
                            <Info />
                        </Button>
                    </div>
                </div>
                <ScrollArea className="flex-1 p-4 h-96 bg-background/50" onScroll={handleScroll}>
                    {isMessagesLoading ? (
                        <MessagePanelSkeleton />
                    ) : isMessagesError ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <LoadFailed msg={t("failedToLoadMessages")} />
                        </div>
                    ) : messages && messages.length > 0 ? (
                        <>
                            {messages.map(msg => <Message key={msg._id} msg={msg} />)}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="h-[70vh] w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <MessageSquareDashed className="h-6 w-6" />
                            <p>{t('noMessagesYet')}</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t bg-card">
                    {stagedFiles.length > 0 && (
                        <div className="p-2 flex flex-wrap gap-2">
                            {stagedFiles.map((stagedFile, index) => (
                                <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden flex items-center justify-center">
                                    {stagedFile.file && stagedFile.file.type.startsWith('image/') ? (
                                        <Image src={URL.createObjectURL(stagedFile.file)} layout="fill" className="object-cover" alt={`Staged file ${index + 1}`} />
                                    ) : stagedFile.file && stagedFile.file.type === 'application/pdf' ? (
                                        <div className="flex flex-col items-center text-center p-1">
                                            <FileText />
                                            <span className="text-xs truncate w-full mt-1">{t('pdf')}</span>
                                        </div>
                                    ) : null}
                                    {(stagedFile.status === 'pending' || stagedFile.status === 'uploading') && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white text-xs">{t('uploading')}</span>
                                        </div>
                                    )}
                                    {stagedFile.status === 'error' && (
                                        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                                            <span className="text-white text-xs">{t('error')}</span>
                                        </div>
                                    )}
                                    <button onClick={() => removeStagedFile(stagedFile)} className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="relative flex items-center gap-2">
                        {isBondLink && (
                            isBondLinkLoading ? (
                                <Skeleton className="h-10 w-10 rounded-full lg:hidden" />
                            ) : isCompletedByYou ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="lg:hidden bg-green-800 text-white" size="icon" disabled>
                                            <CheckCheck />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('completedByYou')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="lg:hidden" variant="ghost" onClick={handleMarkAsCompleted} disabled={isMarkingAsCompleted}><CheckCheck /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('markAsCompleted')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,application/pdf"
                            multiple
                        />
                        <Button variant="ghost" size="icon" onClick={handleUploadClick}>
                            <PlusCircle />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                placeholder={t('messagePlaceholder')}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                                className="rounded-full bg-muted"
                            />
                        </div>
                        <Button
                            onClick={handleSendClick}
                            size="icon" variant="ghost">
                            <Send />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};