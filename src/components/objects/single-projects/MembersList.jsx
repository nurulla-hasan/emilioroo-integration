
"use client"

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const MembersList = ({ title, members, isLoading, isError, onAddMember, onRemoveMember, isRemovingMember, memberType }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <Button size="sm" onClick={() => onAddMember(memberType)}>+Add {title}</Button>
            </div>
            <div className="space-y-3">
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p className="text-red-500">Error loading {title.toLowerCase()}.</p>
                ) : members?.length > 0 ? (
                    members.map((member) => (
                        <div key={member._id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.user?.profile_image || "/images/placeholder-image.jpg"} />
                                    <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => onRemoveMember(member)} disabled={isRemovingMember}>
                                {isRemovingMember ? <><Loader2 className="animate-spin" />Removing</> : "Remove"}
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No {title.toLowerCase()} found.</p>
                )}
                {members?.length > 5 && (
                    <Button variant="link" className="p-0 h-auto">View all</Button>
                )}
            </div>
        </div>
    );
};

export default MembersList;
