"use client";

import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, PlusCircle, X, FileText } from 'lucide-react';
import MessagePanelSkeleton from '@/components/skeleton/MessagePanelSkeleton';
import LoadFailed from '@/components/common/LoadFailed';
import NoData from '@/components/common/NoData';
import Image from 'next/image';
import { toast } from 'sonner';
import { useUploadFileMutation, useDeleteUploadedFileMutation } from '@/lib/features/api/chatApi';
import { Message } from '@/components/message/Message';

const ProjectDiscussion = ({ messages, isLoading, isError, newMessage, setNewMessage, onSendMessage }) => {
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stagedFiles, setStagedFiles] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [uploadedPdfUrls, setUploadedPdfUrls] = useState([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);

    const [uploadFile] = useUploadFileMutation();
    const [deleteUploadedFile] = useDeleteUploadedFileMutation();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendClick();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const newStaged = files.map(file => ({ file, status: 'pending', url: null }));
        setStagedFiles(prev => [...prev, ...newStaged]);
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
            setStagedFiles(prev => prev.map(sf => newStaged.some(nf => nf.file === sf.file) ? { ...sf, status: 'uploading' } : sf));
            const response = await uploadFile(formData).unwrap();
            const uploadedImages = response?.data?.images || [];
            const uploadedPdfs = response?.data?.pdfs || [];

            setUploadedImageUrls(prev => [...prev, ...uploadedImages]);
            setUploadedPdfUrls(prev => [...prev, ...uploadedPdfs]);

            setStagedFiles(prev => prev.map(sf => {
                const img = uploadedImages.find(url => url.includes(sf.file.name));
                const pdf = uploadedPdfs.find(url => url.includes(sf.file.name));
                if (img || pdf) return { ...sf, status: 'uploaded', url: img || pdf };
                return sf;
            }));
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to upload files.');
            setStagedFiles(prev => prev.map(sf => newStaged.some(nf => nf.file === sf.file) ? { ...sf, status: 'error' } : sf));
        } finally {
            setIsUploadingFiles(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeStagedFile = async (fileToRemove) => {
        setStagedFiles(prev => prev.filter(sf => sf !== fileToRemove));
        setUploadedImageUrls(prev => prev.filter(url => url !== fileToRemove.url));
        setUploadedPdfUrls(prev => prev.filter(url => url !== fileToRemove.url));

        if (fileToRemove.status === 'uploaded' && fileToRemove.url) {
            try {
                await deleteUploadedFile({ files: [fileToRemove.url] }).unwrap();
            } catch (error) {
                toast.error(error?.data?.message || 'Failed to delete file from server.');
            }
        }
    };

    const handleSendClick = () => {
        if (isUploadingFiles) return;
        const hasText = newMessage?.trim();
        const hasMedia = uploadedImageUrls.length > 0 || uploadedPdfUrls.length > 0;
        if (!hasText && !hasMedia) return;

        onSendMessage(newMessage, uploadedImageUrls, uploadedPdfUrls);
        setNewMessage('');
        setUploadedImageUrls([]);
        setUploadedPdfUrls([]);
        setStagedFiles([]);
    };

    return (
        <div className="border rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Project Discussion</h2>
            <div ref={messagesContainerRef} className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto flex flex-col-reverse gap-4">
                {isLoading ? (
                    <MessagePanelSkeleton />
                ) : isError ? (
                    <div className="h-full flex items-center justify-center">
                        <LoadFailed msg="Failed to load messages" />
                    </div>
                ) : messages && messages.length > 0 ? (
                    <>
                        {messages.map(message => (
                            <Message key={message._id} msg={message} />
                        ))}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <NoData msg="No messages yet" />
                    </div>
                )}
            </div>
            {stagedFiles.length > 0 && (
                <div className="mt-4 p-2 flex flex-wrap gap-2">
                    {stagedFiles.map((stagedFile, index) => (
                        <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden flex items-center justify-center">
                            {stagedFile.file && stagedFile.file.type.startsWith('image/') ? (
                                <Image src={URL.createObjectURL(stagedFile.file)} fill className="object-cover" alt={`Staged file ${index + 1}`} />
                            ) : stagedFile.file && stagedFile.file.type === 'application/pdf' ? (
                                <div className="flex flex-col items-center text-center p-1">
                                    <FileText />
                                    <span className="text-xs truncate w-full mt-1">PDF</span>
                                </div>
                            ) : null}
                            {(stagedFile.status === 'pending' || stagedFile.status === 'uploading') && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-xs">Uploading...</span>
                                </div>
                            )}
                            {stagedFile.status === 'error' && (
                                <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                                    <span className="text-white text-xs">Error</span>
                                </div>
                            )}
                            <button onClick={() => removeStagedFile(stagedFile)} className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1 cursor-pointer">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4 flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                    multiple
                />
                <Button variant="ghost" size="icon" onClick={handleUploadClick}>
                    <PlusCircle className="h-5 w-5" />
                </Button>
                <div className="relative flex-grow">
                    <Input
                        placeholder="Send Message"
                        className="pr-12"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSendClick} disabled={isUploadingFiles}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDiscussion;

