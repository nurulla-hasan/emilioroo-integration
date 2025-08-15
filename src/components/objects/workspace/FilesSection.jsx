"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Folder } from 'lucide-react';
import Image from 'next/image';
import CardSkeleton from '@/components/skeleton/CardSkeleton';

const FilesSection = ({ documents, images, isLoadingDocuments, isErrorDocuments, isLoadingImages, isErrorImages }) => {
    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">All Files</h2>

            {/* Documents Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold">Document</h3>
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload file
                    </Button>
                </div>
                {isLoadingDocuments && <CardSkeleton count={4} />}
                {isErrorDocuments && <p className="text-red-500">Error loading documents.</p>}
                {!isLoadingDocuments && !isErrorDocuments && documents && documents.length === 0 && (
                    <p className="text-muted-foreground">No documents found.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {documents && documents.map(doc => (
                        <Card key={doc._id} className="p-2 flex flex-col items-center justify-center">
                            <Folder className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-semibold text-center">{doc.document_url.split('/').pop().slice(-16)}</p>
                            <p className="text-xs text-muted-foreground text-center">shared by {doc.addedBy?.name}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Images Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold">Image</h3>
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload file
                    </Button>
                </div>
                {isLoadingImages && <CardSkeleton count={4} />}
                {isErrorImages && <p className="text-red-500">Error loading images.</p>}
                {!isLoadingImages && !isErrorImages && images && images.length === 0 && (
                    <p className="text-muted-foreground">No images found.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images && images.map(img => (
                        <Card key={img._id} className="overflow-hidden">
                            <div className="relative h-32 w-full">
                                <Image
                                    src={img.image_url}
                                    alt={img.image_url.split('/').pop()}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <p className="text-sm font-semibold truncate">{img.image_url.split('/').pop().slice(-16)}</p>
                            </div>
                            <p className="text-xs text-muted-foreground text-center text-wrap">shared by{img.addedBy?.name}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilesSection;
