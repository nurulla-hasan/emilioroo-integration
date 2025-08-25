'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';

const ConversationListItem = ({ conv, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center p-2 cursor-pointer rounded-lg ${active ? 'bg-primary/10' : 'hover:bg-muted/50'} transition-colors`}>
        <div className="relative">
            <Avatar className="h-14 w-14 mr-4">
                <AvatarImage src={conv.avatar} alt={conv.name} />
                <AvatarFallback>{conv.name[0]}</AvatarFallback>
            </Avatar>
            {/* Online Indicator */}
            {conv.online && <div className="absolute bottom-0 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
        </div>

        <div className="flex-1">
            <p className="font-semibold">{conv.name}</p>
            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
        </div>
        <p className="text-xs text-muted-foreground self-start">{conv.time}</p>
    </div>
);

export const ConversationList = ({ conversations, activeConversation, onConversationClick }) => {
    return (
        <div className="bg-card border-r flex-col h-full flex w-full">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Chats</h1>
                <div className="relative mt-4">
                    <Input placeholder="Search Messenger" className="pl-10 rounded-full bg-muted" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {conversations.map(conv =>
                        <ConversationListItem
                            key={conv.id}
                            conv={conv}
                            active={activeConversation?.id === conv.id}
                            onClick={() => onConversationClick(conv)}
                        />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};