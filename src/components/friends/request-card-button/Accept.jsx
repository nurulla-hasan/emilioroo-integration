import { Button } from "@/components/ui/button";
import { useAcceptAndEjectRequestMutation } from "@/lib/features/api/friendsApi";


const Accept = ({ request }) => {
    const [acceptAndEjectRequest, { isLoading }] = useAcceptAndEjectRequestMutation();
    const handleAccept = async () => {
        try {
            await acceptAndEjectRequest({ id: request._id, data: { status: "Accepted" } }).unwrap();
        } catch (error) {
            console.error("Failed to accept request:", error);
        }
    };
    return (
        <>
            <Button loading={isLoading} variant="default" className="w-[50%]" onClick={handleAccept} disabled={isLoading}>Accept</Button>
        </>
    );
};

export default Accept;