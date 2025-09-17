// import { Button } from '@/components/ui/button';
// import { useAcceptRejectJoinRequestMutation } from '@/lib/features/api/projectApi';
// import React from 'react';
// import { toast } from 'sonner';

// const MemberAcceptButton = ({ request }) => {

//     const [acceptRejectJoinRequest, { isLoading }] = useAcceptRejectJoinRequestMutation();

//     const handleAcceptReject = async (requestId, status) => {
//         try {
//             await acceptRejectJoinRequest({ id: requestId, data: { status } }).unwrap();
//             toast.success(`Request ${status} successfully!`);
//         } catch (err) {
//             toast.error(err?.data?.message || `Failed to ${status.toLowerCase()} request.`);
//         }
//     };

//     return (
//         <>
//             <Button
//                 loading={isLoading}
//                 onClick={() => handleAcceptReject(request._id, "Approved")}
//                 disabled={isLoading}
//             >
//                 Accept
//             </Button>
//         </>
//     );
// };

// export default MemberAcceptButton;