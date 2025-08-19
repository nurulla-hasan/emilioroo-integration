"use client";

import React from 'react';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

const ConversationTopics = ({ topics, onTopicClick, onEditTopic, onDeleteTopic, selectedTopic }) => {

    return (
        <div className="space-y-2">
            {topics && topics.length > 0 ? (
                topics.map(topic => (
                    <div
                        key={topic._id}
                        onClick={() => onTopicClick(topic)}
                        className={`${topic._id === selectedTopic?._id
                            ? 'bg-primary/10 dark:bg-primary/50'
                            : ''
                            } bg-card p-3 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition hover:shadow-sm`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <p className="text-sm font-semibold">{topic.name}</p>
                            <p className="text-xs text-muted-foreground">({topic.totalComments} comments)</p>
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <Badge
                                variant={topic.isPublic ? 'default' : 'destructive'}
                                className={`text-[10px] ${topic.isPublic
                                    ? 'bg-green-100 dark:text-green-100 text-green-800'
                                    : 'bg-red-100 dark:text-red-100 text-red-800'
                                    }`}
                            >
                                {topic.isPublic ? 'Public' : 'Private'}
                            </Badge>

                            {
                                topic.isMyConversation && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditTopic(topic);
                                                }}
                                                className="flex items-center space-x-2"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteTopic(topic);
                                                }}
                                                className="flex items-center space-x-2 text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }

                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No conversations found.</p>
            )}
        </div>
    );
};

export default ConversationTopics;