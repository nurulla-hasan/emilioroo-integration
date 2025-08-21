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

    return (
        <>
            <Button
                className="flex-1"
                onClick={() => handleConnect(user)}
                disabled={isSendingRequest}
                loading={isSendingRequest}
            >
                Connect
            </Button>
        </>
    );
};

export default PeopleCardButton;