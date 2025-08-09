"use client";

import React from 'react';
import { SquarePen, Trash2 } from 'lucide-react';

const ConversationTopics = ({ topics, onTopicClick, onEditTopic, onDeleteTopic }) => {
    return (
        <div className="space-y-2">
            {topics.map(topic => (
                <div key={topic.id} className="bg-card p-2 rounded-lg border flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2" onClick={() => onTopicClick(topic)}>
                        <span role="img" aria-label={topic.emojiAriaLabel}>{topic.emoji}</span>
                        <p className="text-sm font-semibold">{topic.name}</p>
                        <p className="text-xs text-muted-foreground">({topic.members} members)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="text-xs text-blue-500">Make Private</button>
                        <SquarePen className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onEditTopic(topic)} />
                        <Trash2 color='red' className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onDeleteTopic(topic)} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationTopics;
