"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fallbackAvatar, getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useUnfriendMutation } from "@/lib/features/api/friendsApi";
import { useSocket } from "@/context/soket-context/SocketContext";
import { SendMessageModal } from "./SendMessageModal";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { baseApi } from "@/lib/features/api/baseApi";

const FriendCard = ({ friend }) => {

    const [unfriend, { isLoading }] = useUnfriendMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { sendMessage } = useSocket();
    const dispatch = useDispatch();


    const handleUnFriend = async () => {
        try {
            await unfriend(friend.friendInfo._id).unwrap();
            toast.success("Unfriended successfully");
        } catch (error) {
            console.error("Failed to unfriend:", error);
            toast.error("Failed to unfriend");
        }
    };

    const handleSendMessage = (messageText) => {
        if (!friend.friendInfo?._id) {
            console.error("Friend ID is missing");
            toast.error("Could not send message, friend ID is missing.");
            return;
        }

        const payload = {
            text: messageText,
            receiver: friend.friendInfo._id,
            imageUrl: [],
            videoUrl: []
        };

        sendMessage(payload);
        setIsModalOpen(false);
        toast.success(`Message sent to ${friend.friendInfo.name}`);
        dispatch(baseApi.util.invalidateTags(['CONVERSATIONS']));
    };

    return (
        <>
            <div className="bg-accent rounded-lg shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 border">
                    <AvatarImage src={friend.friendInfo?.profile_image || fallbackAvatar(friend.friendInfo?.gender)} />
                    <AvatarFallback>{getInitials(friend.friendInfo?.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-1">{friend.friendInfo?.name}</h3>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 flex-grow">
                    {friend.friendInfo?.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                </div>
                <div className="flex flex-col gap-2 justify-between w-full">
                    <div className="flex gap-2">
                        <Button loading={isLoading} variant="outline" className="flex-1" onClick={handleUnFriend}>Unfriend</Button>
                        <Link href={`/people/${friend.friendInfo?._id}`} className="flex-1">
                            <Button variant="outline" className="w-full">View profile</Button>
                        </Link>
                    </div>
                    <Button variant="default" className="w-full" onClick={() => setIsModalOpen(true)}>Message</Button>
                </div>
            </div>
            <SendMessageModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                receiverName={friend.friendInfo?.name}
                onSend={handleSendMessage}
            />
        </>
    );
};

export default FriendCard;