'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { formatFileName, timeAgo } from "@/lib/utils";
import { FileText, Download } from "lucide-react";

const MediaContent = ({ msg }) => (
    <div className="mt-2 flex flex-col gap-2">
        {(msg.imageUrl && msg.imageUrl.length > 0) && (
            <div className={`grid gap-2 ${msg.imageUrl.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {msg.imageUrl.map((url, index) => (
                    <div key={index} className="relative w-40 h-32 group">
                        <Image
                            src={url}
                            alt={`sent image ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                            className="object-cover rounded-lg"
                            proiority="true"
                        />
                        <a
                            href={url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Download Image"
                        >
                            <Download className="w-8 h-8 text-white" />
                        </a>
                    </div>
                ))}
            </div>
        )}
        {(msg.videoUrl && msg.videoUrl.length > 0) && (
            <div className="flex flex-col gap-2">
                {msg.videoUrl.map((url, index) => (
                    <video key={index} controls src={url} className="rounded-lg max-w-full" />
                ))}
            </div>
        )}
        {(msg.pdfUrl && msg.pdfUrl.length > 0) && (
            <div className="flex flex-col gap-2">
                {msg.pdfUrl.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 border border-gray-500 rounded-lg  hover:bg-black/20 transition-colors">
                        <FileText/>
                        <span className="text-sm font-medium truncate">
                            {formatFileName(url, 20)}
                        </span>
                    </a>
                ))}
            </div>
        )}
    </div>
);

const MessageBubble = ({ msg, isMyMessage }) => {
    const hasMedia = (msg.imageUrl && msg.imageUrl.length > 0) || (msg.videoUrl && msg.videoUrl.length > 0) || (msg.pdfUrl && msg.pdfUrl.length > 0);

    return (
        <div className={`p-3 rounded-2xl max-w-md ${isMyMessage ? 'bg-primary text-primary-foreground dark:text-white rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
            {msg.text && <p>{msg.text}</p>}
            {hasMedia && <MediaContent msg={msg} />}
            <p className={`text-xs mt-1 opacity-70 ${isMyMessage ? 'text-right' : 'text-left'}`}>{timeAgo(msg.createdAt)}</p>
        </div>
    );
};

export const Message = ({ msg }) => {
    if (msg.isMyMessage) {
        return (
            <div className="flex justify-end my-2">
                <MessageBubble msg={msg} isMyMessage={true} />
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 my-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={msg.avatar} alt={msg.sender} />
                <AvatarFallback>{msg.sender ? msg.sender[0] : ''}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-semibold text-xs mb-1">{msg.sender}</p>
                <MessageBubble msg={msg} isMyMessage={false} />
            </div>
        </div>
    );
};