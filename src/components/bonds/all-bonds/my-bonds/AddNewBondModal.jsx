"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

const bondSchema = z.object({
    offer: z.string().min(1, "Offer is required"),
    want: z.string().min(1, "Want is required"),
    tag: z.string(),
});

const AddNewBondModal = ({ isOpen, onOpenChange, onCreateBond, isLoading }) => {
    const t = useTranslations('AddNewBondModal');
    const { register, handleSubmit, formState: { errors, isValid }, reset, setValue } = useForm({
        resolver: zodResolver(bondSchema),
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        // console.log(data)
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="offer" className="text-left">
                                {t('offer')}
                            </Label>
                            <Input
                                id="offer"
                                {...register("offer")}
                                placeholder={t('exampleLaptop')}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" type="button" onClick={() => setValue('offer', 'Empty', { shouldValidate: true })}>
                                    {t('empty', { defaultMessage: 'Empty' })}
                                </Button>
                                <Button size="sm" variant="outline" type="button" onClick={() => setValue('offer', 'Surprise', { shouldValidate: true })}>
                                    {t('surprise', { defaultMessage: 'Surprise' })}
                                </Button>
                            </div>
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
                             <div className="flex gap-2 justify-end">   
                                <Button size="sm" variant="outline" type="button" onClick={() => setValue('want', 'Empty', { shouldValidate: true })}>
                                    {t('empty', { defaultMessage: 'Empty' })}
                                </Button>
                                <Button size="sm" variant="outline" type="button" onClick={() => setValue('want', 'Surprise', { shouldValidate: true })}>
                                    {t('surprise', { defaultMessage: 'Surprise' })}
                                </Button>
                            </div>
                        </div>
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
                        <Button loading={isLoading} size={"sm"} type="submit" disabled={isLoading || !isValid}>
                            {t('createBond')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewBondModal;