"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Folder } from 'lucide-react';
import Image from 'next/image';
import CardSkeleton from '@/components/skeleton/CardSkeleton';
import UploadDocumentModal from '@/components/objects/modal/UploadDocumentModal';
import UploadImageModal from '@/components/objects/modal/UploadImageModal';
import { formatFileName } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const FilesSection = ({ documents, images, isLoadingDocuments, isErrorDocuments, isLoadingImages, isErrorImages, project }) => {
    const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
    const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">All Files</h2>

            {/* Documents Section */}
            <div className="mb-8 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold">Document</h3>
                    {
                        project?.isOwner && (
                            <Button variant="outline" size="sm" onClick={() => setIsUploadDocumentModalOpen(true)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload file
                            </Button>
                        )
                    }
                </div>
                {isLoadingDocuments && <CardSkeleton count={4} />}
                {isErrorDocuments && <p className="text-red-500">Error loading documents.</p>}
                {!isLoadingDocuments && !isErrorDocuments && documents && documents.length === 0 && (
                    <p className="text-muted-foreground">No documents found.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {documents && documents.map(doc => (
                        <Card key={doc._id} className="p-2 flex flex-col items-center justify-center">
                            <Folder className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-xs font-semibold text-center">{formatFileName(doc.document_url, 10)}</p>
                            <p className="text-[10px] text-muted-foreground text-center">shared by {doc.addedBy?.name}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Images Section */}
            <div className='max-h-[500px] overflow-y-auto'>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold">Image</h3>
                    {
                        project?.isOwner && (
                            <Button variant="outline" size="sm" onClick={() => setIsUploadImageModalOpen(true)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload file
                            </Button>
                        )
                    }
                </div>
                {isLoadingImages && <CardSkeleton count={4} />}
                {isErrorImages && <p className="text-red-500">Error loading images.</p>}
                {!isLoadingImages && !isErrorImages && images && images.length === 0 && (
                    <p className="text-muted-foreground">No images found.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {images && images.map(img => (
                        <Card key={img._id} className="overflow-hidden">
                            <div className="relative h-32 w-full">
                                <Image
                                    src={img.image_url}
                                    alt={formatFileName(img.image_url, 10)}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <p className="text-sm font-semibold">{formatFileName(img.image_url, 10)}</p>
                                <p className="text-xs text-muted-foreground">shared by {img.addedBy?.name}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <UploadDocumentModal isOpen={isUploadDocumentModalOpen} onOpenChange={setIsUploadDocumentModalOpen} />
            <UploadImageModal isOpen={isUploadImageModalOpen} onOpenChange={setIsUploadImageModalOpen} />
        </div>
    );
};

export default FilesSection;
