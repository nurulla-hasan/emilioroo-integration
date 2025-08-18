"use client";

import React from 'react';
import PostCard from "./PostCard";
import CreatePost from './CreatePost';
import PostFeedSkeleton from "@/components/skeleton/PostFeedSkeleton";

const PostFeed = ({ posts, selectedTopic, isFetching, isError }) => {
    if (!selectedTopic) {
        return (
            <div className='mt-4 border rounded-lg p-3 text-center text-muted-foreground'>
                <p>Please select a conversation topic to view comments.</p>
            </div>
        );
    }

    return (
        <div className='mt-4 border rounded-lg p-3'>
            <CreatePost selectedTopic={selectedTopic} />
            <div className="mt-4 space-y-4">
                {isFetching ? (
                    <PostFeedSkeleton count={5} />
                ) : isError ? (
                    <p className="text-red-500">Error loading comments.</p>
                ) : (
                    posts && posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))
                    ) : (
                        <p className='text-sm text-muted-foreground text-center'>No comments yet.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default PostFeed;
 