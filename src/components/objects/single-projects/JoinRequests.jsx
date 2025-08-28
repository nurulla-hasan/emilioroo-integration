
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MemberRejectButton from "./MemberRejectButton";
import MemberAcceptButton from "./MemberAcceptButton";
import { fallbackAvatar } from "@/lib/utils";

const JoinRequests = ({ requests, isLoading, isError }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Join Request</h2>
            <div className="space-y-3">
                {isLoading ? (
                    <p>Loading join requests...</p>
                ) : isError ? (
                    <p className="text-red-500">Error loading join requests.</p>
                ) : requests?.length > 0 ? (
                    requests.map((request) => (
                        <div key={request._id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={request.user?.profile_image || fallbackAvatar("MALE")} />
                                    <AvatarFallback>{request.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{request.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-muted-foreground">{request.user?.role || "User"}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                              <MemberAcceptButton request={request} />
                              <MemberRejectButton request={request} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No pending join requests.</p>
                )}
            </div>
        </div>
    );
};

export default JoinRequests;
