import { useCallback } from 'react';

import { fallbackAvatar, timeAgo } from '@/lib/utils';

export const useTransformMessage = (me) => {
    
    const transformMessage = useCallback((msg) => {
        const userDetails = msg.userDetails || msg.msgByUserId;
        const isMessageFromMe = msg.isMyMessage || (userDetails && userDetails._id === me?._id);
        return {
            ...msg,
            id: msg._id,
            text: msg.text,
            sender: isMessageFromMe ? 'Me' : (userDetails?.name || 'Unknown User'),
            avatar: isMessageFromMe ? (me?.profile_image || fallbackAvatar) : (userDetails?.profile_image || fallbackAvatar),
            time: timeAgo(msg.createdAt),
            imageUrl: msg.imageUrl || [],
            videoUrl: msg.videoUrl || [],
            isMyMessage: isMessageFromMe, // Add this line
        };
    }, [me]);

    return transformMessage;
};