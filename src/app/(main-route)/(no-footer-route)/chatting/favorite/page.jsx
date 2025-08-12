"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetBookmarkAudioQuery } from "@/lib/features/api/chattingApi";
import AudioCard from "@/components/chatting/AudioCard";
import AudioCardSkeleton from '@/components/skeleton/AudioCardSkeleton';

const FavoritePage = () => {
    const { data: bookmarkData, isLoading, isError, error } = useGetBookmarkAudioQuery();
    const bookmarks = bookmarkData?.data || [];

    const favouriteIds = bookmarks?.length > 0 ? bookmarks?.map((favorite) => favorite?.audio?._id) : []

    return (
        <div>
            <Tabs defaultValue="audio" className="p-0">
                <div className="flex justify-between items-center mb-6 px-6">
                    <h1 className="text-2xl font-bold">My Favorite</h1>
                    <TabsList>
                        <TabsTrigger value="audio">Audio</TabsTrigger>
                        <TabsTrigger value="playlist">Playlist</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="audio" className="px-6">
                    {
                        isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => <AudioCardSkeleton key={i} />)}
                            </div>
                        ) : isError ? (
                            <div className="text-red-500 text-center py-10">Error: {error.message}</div>
                        ) : bookmarks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {bookmarks.map(bookmark => (
                                    <AudioCard key={bookmark._id} audio={bookmark.audio} favouriteIds={favouriteIds} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">You have not bookmarked any audio yet.</div>
                        )
                    }
                </TabsContent>
                <TabsContent value="playlist" className="px-6">
                    <div className="bg-gray-100 dark:bg-gray-800 h-96 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Favorite playlist content will be displayed here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FavoritePage;
