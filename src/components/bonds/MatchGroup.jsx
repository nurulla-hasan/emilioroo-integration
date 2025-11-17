'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCreateBondLinkMutation } from "@/lib/features/api/bondsApi";
import { toast } from "sonner";
import ProposeLinkModal from './ProposeLinkModal';
import { useRouter } from '@/i18n/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const UserCard = ({ user, showRating }) => (
    <div className="min-w-lg px-1">
        <div className="border rounded-lg sm:rounded-xl p-2 sm:p-4 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900 transition-all duration-500 h-full flex flex-col relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500"></div>
            <div className='flex justify-between items-center'>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Avatar>
                        <AvatarImage src={user.user.profile_image} alt={user.user.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                            {user.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <p className="text-center font-bold text-xs sm:text-sm truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" title={user.user.name}>{user.user.name}</p>
                </div>
                {showRating && (
                    <div className='flex justify-end mb-1 sm:mb-2'>
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">⭐ {user?.avgRating ?? 0}</Badge>
                    </div>
                )}
            </div>
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 mb-2 sm:mb-4">
                <div className="flex-grow p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg shadow-sm">
                    <p className="text-xs font-semibold text-green-800 dark:text-green-200 flex items-center capitalize">
                        <span className="mr-1">🎁</span>{user.offer}
                    </p>
                </div>
                <div className="flex-grow p-2 sm:p-3 bg-red-100 dark:bg-red-900 rounded-lg shadow-sm">
                    <p className="text-xs font-semibold text-red-800 dark:text-red-200 flex items-center capitalize">
                        <span className="mr-1">🔍</span>{user.want}
                    </p>
                </div>
            </div>
            <p className="pt-1 sm:pt-2 text-xs text-gray-600 dark:text-gray-300 break-words border-t border-gray-200 dark:border-gray-600 flex-grow flex items-start">
                <span className='font-bold text-purple-600 dark:text-purple-400 mr-1 sm:mr-2'>📝</span>
                <span className="leading-relaxed max-w-sm">{user.description}</span>
            </p>
        </div>

    </div>
);

const MatchGroup = ({ matchRequest, status, showProposeButton = true, showRating = true }) => {
    // console.log(matchRequest);
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
        <div className='md:p-4 xl:p-0 max-h-[80vh] overflow-scroll'>
            <ScrollArea className='max-w-[1600px] border rounded-lg p-4'>
                <div className='flex flex-col gap-3 xl:flex-row items-start md:items-center mb-3 sm:mb-4'>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 border rounded p-1">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                            <h3 className="font-semibold text-base sm:text-lg">Match Chain ({matchRequest.length} People)</h3>
                        </div>
                        {status && (
                            <Badge variant="secondary" className="text-xs">{status}</Badge>
                        )}
                    </div>
                    {showProposeButton && (
                        <div className="flex justify-center sm:justify-end">
                            <Button onClick={() => setIsModalOpen(true)} className="bg-pink-600 hover:bg-violet-700 text-white rounded">
                                Propose
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-3 xl:flex-row">
                    {matchRequest.map((request) => (
                        <UserCard key={request._id} user={request} showRating={showRating} />
                    ))}
                </div>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
            <ProposeLinkModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onPropose={handlePropose}
                isLoading={isLoading}
            />
        </div>
    );
}

export default MatchGroup;