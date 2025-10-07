'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCreateBondLinkMutation } from "@/lib/features/api/bondsApi";
import { toast } from "sonner";
import ProposeLinkModal from './ProposeLinkModal';
import { useRouter } from '@/i18n/navigation';

const UserCard = ({ user }) => (
    <div className="flex-1 min-w-0 px-1">
        <p className="text-center font-semibold text-sm mb-1 truncate" title={user.user.name}>{user.user.name}</p>
        <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800 space-y-1 h-full flex flex-col">
            <div className='flex justify-end'>
                <Badge variant="outline" className="text-xs">Rating: {user?.avgRating ?? 0}</Badge>
            </div>
            <div className="border-b pb-1 flex-grow flex items-center justify-center text-center">
                <p className="text-xs font-medium" title={user.offer}>
                    <span className="font-semibold">Offers:</span> {user.offer}
                </p>
            </div>
            <div className="flex-grow flex items-center justify-center text-center">
                <p className="text-xs font-medium" title={user.want}>
                    <span className="font-semibold">Wants:</span> {user.want}
                </p>
            </div>
             <p className="pt-1 text-xs text-muted-foreground text-center break-words border-t">
                <span className='font-semibold'>Description:</span> {user.description}
            </p>
        </div>
    </div>
);

const MatchGroup = ({ matchRequest, status, showProposeButton = true, className = '' }) => {
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
            <div className={`p-4 border rounded-lg bg-card shadow-sm hover:shadow-lg transition-all duration-300 w-full ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Match Chain ({matchRequest.length} People)</h3>
                    </div>
                    {status && (
                        <Badge variant="secondary">{status}</Badge>
                    )}
                </div>

                <div className="flex items-stretch justify-center p-4 bg-muted/40 rounded-lg">
                    {matchRequest.map((request) => (
                        <UserCard key={request._id} user={request} />
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

export default MatchGroup;