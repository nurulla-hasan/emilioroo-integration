"use client";

import React from 'react';
import PostCard from "./PostCard";
import CreatePost from './CreatePost';

const PostFeed = ({ posts }) => {
    return (
        <div className='mt-4 border rounded-lg p-3'>
            <CreatePost />
            <div className="mt-4 space-y-4">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default PostFeed;
