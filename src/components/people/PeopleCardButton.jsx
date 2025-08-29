import { useSentRequestMutation } from "@/lib/features/api/friendsApi";
import { Button } from "../ui/button";
import { toast } from "sonner";

const PeopleCardButton = ({ user }) => {
    const [sendFriendRequest, { isLoading: isSendingRequest }] = useSentRequestMutation();
    const handleConnect = async (userObject) => {
        try {
            await sendFriendRequest({ receiver: userObject._id }).unwrap();
            toast.success("Friend request sent!");
        } catch (error) {
            toast.error(error.data?.message || "Failed to send friend request.");
        }
    };

    const renderButton = () => {
        switch (user.friendRequestStatus) {
            case "friend":
                return (
                    <Button className="flex-1" disabled>
                        Friends
                    </Button>
                );
            case "following":
                return (
                    <Button className="flex-1" variant="outline">
                        Following
                    </Button>
                );
            case "follower":
                return (
                    <Button
                        className="flex-1"
                        onClick={() => handleConnect(user)}
                        disabled={isSendingRequest}
                        loading={isSendingRequest}>
                        Follow Back
                    </Button>
                );
            default:
                return (
                    <Button className="flex-1" onClick={() => handleConnect(user)} disabled={isSendingRequest} loading={isSendingRequest}>
                        Add Friend
                    </Button>
                );
        }
    };

    return <>{renderButton()}</>;
};

export default PeopleCardButton;
