'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { timeAgo } from "@/lib/utils";

export const Message = ({ msg }) => {
    if (msg.sender === 'me') {
        return (
            <div className="flex justify-end my-2">
                <div className={`p-3 rounded-2xl max-w-md bg-primary text-primary-foreground dark:text-white rounded-br-none`}>
                    {msg.type === 'text' && <p>{msg.text}</p>}
                    {msg.type === 'image' && <Image src={msg.src} alt="sent image" width={200} height={150} className="rounded-lg" />}
                    <p className="text-xs text-right mt-1 opacity-70">{timeAgo(msg.createdAt)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 my-2">
            <Avatar className="h-8 w-8 hidden md:block">
                <AvatarImage src={msg.avatar} alt={msg.sender} />
                <AvatarFallback>{msg.sender[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-semibold text-xs mb-1 hidden md:block">{msg.sender}</p>
                <div className={`p-3 rounded-2xl max-w-md bg-muted rounded-bl-none`}>
                    {msg.type === 'text' && <p>{msg.text}</p>}
                    {msg.type === 'image' && <Image src={msg.src} alt="sent image" width={200} height={150} className="rounded-lg" />}
                    <p className="text-xs text-right mt-1 opacity-70">{timeAgo(msg.createdAt)}</p>
                </div>
            </div>
        </div>
    );
};