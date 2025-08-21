import { Button } from "@/components/ui/button";
import { useCancelRequestMutation } from "@/lib/features/api/friendsApi";

const CancelSentRequest = ({ request }) => {
    console.log(request);
    const [cancelRequest, { isLoading }] = useCancelRequestMutation();

    const handleCancelRequest = async () => {
        try {
            await cancelRequest(request.followingInfo._id).unwrap();
        } catch (error) {
            console.error("Failed to cancel request:", error);
        }
    };
    return (
        <>
            <Button loading={isLoading} variant="outline" className="w-full" onClick={handleCancelRequest} disabled={isLoading}>Cancel Request</Button>
        </>
    );
};

export default CancelSentRequest;