
"use client"

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const JoinRequests = ({ requests, isLoading, isError, onAcceptReject, isProcessing }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Join Request</h2>
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
                                    <AvatarImage src={request.user?.profile_image || "/images/placeholder-avatar.jpg"} />
                                    <AvatarFallback>{request.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{request.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-gray-500">{request.user?.role || "User"}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onAcceptReject(request._id, "Rejected")}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <><Loader2 className="animate-spin" /> Processing</> : "Reject"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onAcceptReject(request._id, "Approved")}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <><Loader2 className="animate-spin" /> Processing</> : "Accept"}
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No pending join requests.</p>
                )}
            </div>
        </div>
    );
};

export default JoinRequests;
