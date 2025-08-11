"use client";

import React from 'react';

const ConversationsPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">My Conversations</h1>
            <div className="bg-gray-100 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center mt-6">
                <p className="text-muted-foreground">Conversations will be displayed here.</p>
            </div>
        </div>
    );
};

export default ConversationsPage;
