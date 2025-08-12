"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bondSchema = z.object({
    offer: z.string().min(1, "Offer is required"),
    want: z.string().min(1, "Want is required"),
    tag: z.string().min(1, "Tag is required"),
});

const EditBondModal = ({ isOpen, onOpenChange, onUpdateBond, isLoading, bond }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(bondSchema),
    });

    useEffect(() => {
        if (bond) {
            setValue("offer", bond.offer);
            setValue("want", bond.want);
            setValue("tag", bond.tag);
        }
    }, [bond, setValue]);

    const onSubmit = (data) => {
        onUpdateBond({ id: bond._id, ...data });
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit bond</DialogTitle>
                    <DialogDescription>
                        Update the details of your bond.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="offer" className="text-left">
                            Offer
                        </Label>
                        <Input
                            id="offer"
                            {...register("offer")}
                            placeholder="e.g., Laptop"
                        />
                        {errors.offer && <p className="text-red-500 text-xs mt-1">{errors.offer.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="want" className="text-left">
                            Want
                        </Label>
                        <Input
                            id="want"
                            {...register("want")}
                            placeholder="e.g., Camera"
                        />
                        {errors.want && <p className="text-red-500 text-xs mt-1">{errors.want.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tag" className="text-left">
                            Tag <span className='text-xs'>(For better matching)</span>
                        </Label>
                        <Input
                            id="tag"
                            {...register("tag")}
                            placeholder="e.g., electronics"
                        />
                        {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>}
                    </div>
                    
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                            ) : (
                                "Update Bond"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBondModal;
