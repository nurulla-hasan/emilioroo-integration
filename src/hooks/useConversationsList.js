import { useMemo } from 'react';
import { fallbackAvatar, timeAgo } from '@/lib/utils';
import { useGetChatListQuery } from '@/lib/features/api/chatApi';

export const useConversationsList = (searchTerm) => {
    const { data: chatListData, isLoading: isChatListLoading, isError: isChatListError } = useGetChatListQuery({ searchTerm });

    const conversations = useMemo(() => {
        const conversationData = chatListData?.data?.data || [];

        const uniqueConversationMap = new Map();

        for (const conv of conversationData) {
            let uniqueKey;
            if (conv.type === 'one-two-one') {
                uniqueKey = conv.userData?._id;
            } else if (conv.type === 'chat-group') {
                uniqueKey = conv.chatGroup?._id;
            } else if (conv.type === 'bond-link-group') {
                uniqueKey = conv.bondLink?._id;
            } else if (conv.type === 'project-group') {
                uniqueKey = conv.project?._id;
            }

            if (uniqueKey && !uniqueConversationMap.has(uniqueKey)) {
                uniqueConversationMap.set(uniqueKey, conv);
            }
        }

        const uniqueConversations = Array.from(uniqueConversationMap.values());

        return uniqueConversations.map(conv => {
            const isGroup = conv.type !== 'one-two-one';
            let subtype = 'oneToOne';
            let name = conv.userData?.name;
            let avatar = conv.userData?.profile_image || fallbackAvatar("MALE");

            if (conv.type === 'chat-group') {
                subtype = 'chatGroup';
                name = conv.chatGroup.name;
                avatar = conv.chatGroup.image || "/images/groupFallback.jpg";
            } else if (conv.type === 'bond-link-group') {
                subtype = 'bondLink';
                name = conv.bondLink.name;
                avatar = conv.bondLink.cover_image || "/images/groupFallback.jpg";
            } else if (conv.type === 'project-group') {
                subtype = 'project';
                name = conv.project.name;
                avatar = conv.project.cover_image || fallbackAvatar();
            }

            return {
                id: conv._id,
                conversationId: conv._id,
                userId: conv.userData?._id,
                type: conv.type,
                subtype,
                bondLinkId: conv.bondLink?._id,
                projectId: conv.project?._id,
                chatGroupId: conv.chatGroup?._id,
                name: name || (isGroup ? 'Group' : 'Unknown User'),
                avatar,
                lastMessage: conv.lastMessage?.text || 'No messages yet',
                time: timeAgo(conv.lastMessage?.createdAt || conv.updated_at),
                online: false,
            };
        });
    }, [chatListData]);

    return {
        conversations,
        isChatListLoading,
        isChatListError,
    };
};