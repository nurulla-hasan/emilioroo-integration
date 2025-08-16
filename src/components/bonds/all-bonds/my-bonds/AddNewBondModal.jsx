"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

const bondSchema = z.object({
    offer: z.string().min(1, "Offer is required"),
    want: z.string().min(1, "Want is required"),
    tag: z.string().min(1, "Tag is required"),
});

const AddNewBondModal = ({ isOpen, onOpenChange, onCreateBond, isLoading }) => {
    const t = useTranslations('AddNewBondModal');
    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
        resolver: zodResolver(bondSchema),
    });

    const onSubmit = (data) => {
        onCreateBond(data);
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('createANewBond')}</DialogTitle>
                    <DialogDescription>
                        {t('fillInDetails')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="offer" className="text-left">
                            {t('offer')}
                        </Label>
                        <Input
                            id="offer"
                            {...register("offer")}
                            placeholder={t('exampleLaptop')}
                        />
                        {errors.offer && <p className="text-red-500 text-xs mt-1">{t('offerIsRequired')}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="want" className="text-left">
                            {t('want')}
                        </Label>
                        <Input
                            id="want"
                            {...register("want")}
                            placeholder={t('exampleCamera')}
                        />
                        {errors.want && <p className="text-red-500 text-xs mt-1">{t('wantIsRequired')}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tag" className="text-left">
                            {t('tag')} <span className='text-xs'>{t('forBetterMatching')}</span>
                        </Label>
                        <Input
                            id="tag"
                            {...register("tag")}
                            placeholder={t('exampleElectronics')}
                        />
                        {errors.tag && <p className="text-red-500 text-xs mt-1">{t('tagIsRequired')}</p>}
                    </div>
                    
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button size={"sm"} type="button" variant="outline">{t('cancel')}</Button>
                        </DialogClose>
                        <Button size={"sm"} type="submit" disabled={isLoading || !isValid}>
                            {isLoading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> {t('creating')}</>
                            ) : (
                                t('createBond')
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewBondModal;
