import { Button } from "@/components/ui/button";
import { useAcceptAndEjectRequestMutation } from "@/lib/features/api/friendsApi";


const Reject = ({ request }) => {
    const [acceptAndEjectRequest, { isLoading }] = useAcceptAndEjectRequestMutation();

    const handleDecline = async () => {
        try {
            await acceptAndEjectRequest({ id: request._id, data: { status: "Rejected" } }).unwrap();
        } catch (error) {
            console.error("Failed to decline request:", error);
        }
    };
    return (
        <>
            <Button loading={isLoading} variant="outline" className="w-[50%]" onClick={handleDecline} disabled={isLoading}>Decline</Button>
        </>
    );
};

export default Reject;