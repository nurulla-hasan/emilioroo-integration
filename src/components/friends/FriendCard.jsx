import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fallbackAvatar, getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useUnfriendMutation } from "@/lib/features/api/friendsApi";

const FriendCard = ({ friend }) => {

    const [unfriend, { isLoading }] = useUnfriendMutation();

    const handleUnFriend = async () => {
        try {
            await unfriend(friend.friendInfo._id).unwrap();
        } catch (error) {
            console.error("Failed to unfriend:", error);
        }
    };

    return (
        <div className="bg-accent rounded-lg shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={friend.friendInfo?.profile_image || fallbackAvatar} />
                <AvatarFallback>{getInitials(friend.friendInfo?.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{friend.friendInfo?.name}</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                {friend.friendInfo?.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                ))}
            </div>
            <div className="flex gap-2 justify-between w-full mb-4">
                <Button loading={isLoading} variant="outline" className="w-[50%]" onClick={handleUnFriend}>Unfriend</Button>
                <Link href={`/friends/${friend.friendInfo?._id}`} className="w-[50%]">
                    <Button variant="outline" className="w-full">View profile</Button>
                </Link>
            </div>
            <Button variant="default" className="w-full">Message</Button>
        </div>
    );
};

export default FriendCard;