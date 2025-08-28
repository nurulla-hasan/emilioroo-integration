
"use client"

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackAvatar } from "@/lib/utils";

const MembersList = ({ project, title, members, isLoading, isError, onAddMember, onRemoveMember, isRemovingMember, memberType }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold ">{title}</h2>
                {project?.isOwner &&
                    <Button size="sm" onClick={() => onAddMember(memberType)}>+Add {title}</Button>
                }
            </div>
            <div className="space-y-3">
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p className="text-red-500">Error loading {title.toLowerCase()}.</p>
                ) : members?.length > 0 ? (
                    members.map((member) => (
                        <div key={member._id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.user?.profile_image || fallbackAvatar("MALE")} />
                                    <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.user?.name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            {project?.isOwner &&
                                <Button variant="destructive" size="sm" onClick={() => onRemoveMember(member)} disabled={isRemovingMember}>
                                    Remove
                                </Button>
                            }

                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
                )}
                {members?.length > 5 && (
                    <Button variant="link" className="p-0 h-auto">View all</Button>
                )}
            </div>
        </div>
    );
};

export default MembersList;
