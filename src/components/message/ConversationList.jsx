'use client';

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';
import ConversationListItem from "./ConversationListItem";



export const ConversationList = ({ conversations, activeConversation, onConversationClick, searchTerm, setSearchTerm }) => {
    return (
        <div className="bg-card border-r flex-col h-full flex w-full">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Chats</h1>
                <div className="relative mt-4">
                    <Input 
                        placeholder="Search Messenger" 
                        className="pl-10 rounded-full bg-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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