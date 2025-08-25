'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Gift, Handshake, ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCreateBondLinkMutation } from "@/lib/features/api/bondsApi";
import { toast } from "sonner";
import ProposeLinkModal from './ProposeLinkModal';

const UserRow = ({ user, isLast }) => (
    <div className="flex flex-col items-center">
        <div className="w-full p-3 rounded-lg bg-muted/50">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-2">
                <Avatar>
                    <AvatarImage src={user.user.profile_image} alt={user.user.name} />
                    <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-primary dark:text-white">{user.user.name}</p>
            </div>

            {/* Offer and Want */}
            <div className="pl-11 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500 shrink-0" />
                    <span><span className="font-semibold">Offers:</span> {user.offer}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Handshake className="h-4 w-4 text-green-500 shrink-0" />
                    <span><span className="font-semibold">Wants:</span> {user.want}</span>
                </div>
            </div>
        </div>
        {!isLast && (
            <ArrowUpDown className="text-muted-foreground" />
        )}
    </div>
);

const MatchGroup = ({ matchRequest, status, showProposeButton = true }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createBondLink, { isLoading }] = useCreateBondLinkMutation();

    const handlePropose = async (name) => {
        const payload = {
            name,
            participants: matchRequest.map((request) => request.user._id),
            requestedBonds: matchRequest.map((request) => request._id),
        };

        try {
            await createBondLink(payload).unwrap();
            toast.success("Bond link proposed successfully!");
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to propose bond link.");
        }
    };

    return (
        <>
            <div className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Match Chain ({matchRequest.length} People)</h3>
                    </div>
                    {status && (
                        <Badge variant="secondary">{status}</Badge>
                    )}
                </div>
                <div className="space-y-0">
                    {matchRequest.map((request, index) => (
                        <UserRow key={request._id} user={request} isLast={index === matchRequest.length - 1} />
                    ))}
                </div>
                {showProposeButton && (
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Propose Link to Group
                        </Button>
                    </div>
                )}
            </div>
            <ProposeLinkModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onPropose={handlePropose}
                isLoading={isLoading}
            />
        </>
    );
}

export default MatchGroup