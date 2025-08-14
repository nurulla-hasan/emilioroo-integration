import { Button } from '@/components/ui/button';
import { useAcceptRejectJoinRequestMutation } from '@/lib/features/api/projectApi';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const MemberRejectButton = ({ request }) => {

      const [acceptRejectJoinRequest, { isLoading }] = useAcceptRejectJoinRequestMutation();

    const handleAcceptReject = async (requestId, status) => {
        try {
            await acceptRejectJoinRequest({ id: requestId, data: { status } }).unwrap();
            toast.success(`Request ${status} successfully!`);
        } catch (err) {
            toast.error(err?.data?.message || `Failed to ${status.toLowerCase()} request.`);
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleAcceptReject(request._id, "Rejected")}
                disabled={isLoading}
            >
                {isLoading ? <><Loader2 className=" animate-spin" />Loading</> : "Reject"}
            </Button>
        </>
    );
};

export default MemberRejectButton;