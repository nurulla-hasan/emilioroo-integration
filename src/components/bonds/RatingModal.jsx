'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetSingleBondLinkQuery, useGiveRatingMutation } from "@/lib/features/api/bondsApi";
import { useGetSingleUserQuery } from '@/lib/features/api/projectApi';
import { useGetMe } from '@/hooks/useGetMe';
import { toast } from 'sonner';
import StarRating from '../ui/StarRating';
import { Skeleton } from '../ui/skeleton';

// Small component to fetch and display user info
const UserProfile = ({ userId }) => {
    const { data: userData, isLoading, isError } = useGetSingleUserQuery(userId);

    if (isLoading) return <Skeleton className="w-24 h-24 rounded-full" />;
    if (isError || !userData?.data) return <div className="w-24 h-24 rounded-full bg-gray-200" />;

    const user = userData.data;

    return (
        <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24">
                <AvatarImage src={user.profile_image} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-lg text-center">How was your experience with {user.name}?</p>
        </div>
    );
};

const RatingModal = ({ isOpen, onOpenChange, bondLinkId }) => {
    const { data: bondLinkData, isLoading: isBondLoading } = useGetSingleBondLinkQuery(bondLinkId, { skip: !isOpen });
    const { profile } = useGetMe();
    const [giveRating, { isLoading: isRating }] = useGiveRatingMutation();

    const [participantIds, setParticipantIds] = useState([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (bondLinkData?.data && profile?.data) {
            const otherParticipants = bondLinkData.data.participants.filter(id => id !== profile.data._id);
            setParticipantIds(otherParticipants);
            setCurrentUserIndex(0); // Reset on new bond link
            setRating(0);
        }
    }, [bondLinkData, profile, isOpen]);

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setParticipantIds([]);
            setCurrentUserIndex(0);
            setRating(0);
        }, 300);
    };

    const goToNextUser = () => {
        if (currentUserIndex < participantIds.length - 1) {
            setCurrentUserIndex(currentUserIndex + 1);
            setRating(0); // Reset rating for next user
        } else {
            toast.success("Thank you for your feedback!");
            handleClose();
        }
    };

    const handleNextOrSubmit = async () => {
        if (rating > 0) {
            try {
                await giveRating({
                    bondLink: bondLinkId,
                    userId: participantIds[currentUserIndex],
                    rating
                }).unwrap();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to submit rating.");
            }
        }
        goToNextUser();
    };

    const handleSkip = () => {
        goToNextUser();
    };

    const currentUserId = participantIds[currentUserIndex];
    const hasMembersToRate = participantIds.length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate Your Bond Members</DialogTitle>
                    <DialogDescription>
                        Your feedback helps build a better community.
                    </DialogDescription>
                </DialogHeader>

                {isBondLoading && <Skeleton className="w-full h-48" />}

                {!isBondLoading && hasMembersToRate && currentUserId && (
                    <div className="py-4 flex flex-col items-center gap-4">
                        <UserProfile userId={currentUserId} />
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                )}

                {!isBondLoading && !hasMembersToRate && (
                     <div className="py-8 text-center">
                        <p>There are no other members to rate in this bond.</p>
                    </div>
                )}

                <DialogFooter>
                    {hasMembersToRate ? (
                        <>
                            <Button variant="ghost" onClick={handleSkip} disabled={isRating}>Skip</Button>
                            <Button onClick={handleNextOrSubmit} disabled={isRating}>
                                {isRating ? "Submitting..." : (currentUserIndex === participantIds.length - 1 ? "Finish" : "Next")}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleClose}>Close</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RatingModal;
