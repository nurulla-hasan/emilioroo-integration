'use client';

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from 'lucide-react';
import ConversationListItem from "./ConversationListItem";
import { Button } from "../ui/button";
import { useState } from "react";
import { CreateGroupModal } from "./CreateGroupModal";
import { useTranslations } from "next-intl";



export const ConversationList = ({ conversations, activeConversation, onConversationClick, searchTerm, setSearchTerm }) => {
    const t = useTranslations('Message');
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="bg-card border-r flex-col h-full flex w-full bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
            <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold">{t('chats')}</h1>
                    <Button variant="outline" className="" onClick={() => setIsModalOpen(true)}>
                        <Plus />{t('createGroup')}
                    </Button>
                </div>
                <div className="relative mt-4">
                    <Input
                        placeholder={t('searchMessenger')}
                        className="pl-10 rounded-full bg-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>
            <ScrollArea className="flex-1 h-96">
                <div className="p-2 space-y-1">
                    {conversations.map(conv =>
                        <ConversationListItem
                            key={conv.conversationId}
                            conv={conv}
                            active={activeConversation?.id === conv.id}
                            onClick={() => onConversationClick(conv)}
                        />
                    )}
                </div>
            </ScrollArea>
            <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};