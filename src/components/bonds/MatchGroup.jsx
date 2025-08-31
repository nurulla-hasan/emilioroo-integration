'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Gift, Handshake, ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCreateBondLinkMutation } from "@/lib/features/api/bondsApi";
import { toast } from "sonner";
import ProposeLinkModal from './ProposeLinkModal';
import { useRouter } from '@/i18n/navigation';

const UserRow = ({ user, isLast }) => (
    <div className="flex flex-col items-center">
        <div className="w-full p-4 rounded-xl bg-muted/40 shadow-sm border transition hover:shadow-md">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user.profile_image} alt={user.user.name} />
                    <AvatarFallback>{user.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-base font-semibold text-primary dark:text-white leading-tight">
                    {user.user.name}
                </p>
            </div>

            {/* Offer and Want */}
            <div className="pl-14 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                        <Gift className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>
                        <span className="font-semibold">Offers:</span> {user.offer}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                        <Handshake className="h-4 w-4 text-green-500" />
                    </div>
                    <span>
                        <span className="font-semibold">Wants:</span> {user.want}
                    </span>
                </div>
            </div>
            <p className="mt-2 text-muted-foreground max-w-xs break-words">
                Description: {user.description}
            </p>
        </div>

        {/* Separator */}
        {!isLast && (
            <ArrowUpDown className="text-muted-foreground my-2 animate-pulse" />
        )}
    </div>

);

const MatchGroup = ({ matchRequest, status, showProposeButton = true }) => {
    const router = useRouter();
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
            router.push('/message');
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