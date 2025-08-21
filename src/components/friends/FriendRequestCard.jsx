import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fallbackAvatar, getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useAcceptAndEjectRequestMutation } from "@/lib/features/api/friendsApi";

const FriendRequestCard = ({ request }) => {
    const [acceptAndEjectRequest, { isLoading }] = useAcceptAndEjectRequestMutation();

    const handleAccept = async () => {
        try {
            await acceptAndEjectRequest({ id: request._id, data: { status: "Accepted" } }).unwrap();
        } catch (error) {
            console.error("Failed to accept request:", error);
        }
    };

    const handleDecline = async () => {
        try {
            await acceptAndEjectRequest({ id: request._id, data: { status: "Rejected" } }).unwrap();
        } catch (error) {
            console.error("Failed to decline request:", error);
        }
    };

    return (
        <div className="bg-accent rounded-lg shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={request.followingInfo?.profile_image || fallbackAvatar} />
                <AvatarFallback>{getInitials(request.followingInfo?.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{request.followingInfo?.name || "Unknown"}</h3>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4 flex-grow">
                {request.followingInfo?.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                ))}
            </div>
            <div className="flex gap-2 w-full mb-4">
                <Button variant="outline" className="w-[50%]" onClick={handleDecline} disabled={isLoading}>Decline</Button>
                <Button variant="default" className="w-[50%]" onClick={handleAccept} disabled={isLoading}>Accept</Button>
            </div>
            <Link href={`/friends/${request.followingInfo?._id}`} className="w-full">
                <Button variant="outline" className="w-full">View profile</Button>
            </Link>
        </div>
    );
};

export default FriendRequestCard;