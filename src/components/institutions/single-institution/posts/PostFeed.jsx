"use client";

import React from 'react';
import PostCard from "./PostCard";
import CreatePost from './CreatePost';

const PostFeed = ({ posts, selectedTopic }) => {
    return (
        <div className='mt-4 border rounded-lg p-3'>
            <CreatePost selectedTopic={selectedTopic} />
            <div className="mt-4 space-y-4">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostFeed;
