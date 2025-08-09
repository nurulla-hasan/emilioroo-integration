"use client";

import React from 'react';
import { SquarePen, Trash2 } from 'lucide-react';

const ConversationTopics = ({ topics, onTopicClick, onEditTopic, onDeleteTopic }) => {
    return (
        <div className="space-y-2">
            {topics && topics.length > 0 ? (
                topics.map(topic => (
                    <div key={topic._id} className="bg-card p-2 rounded-lg border flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2" onClick={() => onTopicClick(topic)}>
                            <p className="text-sm font-semibold">{topic.name}</p>
                            <p className="text-xs text-muted-foreground">({topic.ussers.length} members)</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${topic.isPublic ? 'bg-green-100 dark:bg-green-800 dark:text-green-100 text-green-800' : 'bg-red-100 dark:bg-red-800 dark:text-red-100 text-red-800'}`}>
                                {topic.isPublic ? 'Public' : 'Private'}
                            </span>
                            <SquarePen className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onEditTopic(topic)} />
                            <Trash2 color='red' className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onDeleteTopic(topic)} />
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
