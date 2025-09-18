"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateMyProfileMutation } from "@/lib/features/api/authApi";
import { useTranslations } from "next-intl";

const formSchema = z.object({
    bio: z.string().optional(),
});

const EditBioModal = ({ isOpen, onOpenChange, bio }) => {
    const t = useTranslations("ProfilePage");
    const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bio: "",
        },
    });

    useEffect(() => {
        if (bio) {
            form.reset({ bio });
        }
    }, [bio, form]);

    const onSubmit = async (values) => {
        const formData = new FormData();
        const data = {
            bio: values.bio,
        };
        formData.append("data", JSON.stringify(data));

        try {
            await updateProfile(formData).unwrap();
            toast.success(t("bioUpdatedSuccess"));
            onOpenChange(false);
        } catch (error) {
            toast.error(error.data?.message || t("failedToUpdateBio"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("editBio")}</DialogTitle>
                    <DialogDescription>{t("editBioDescription")}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("bio")}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t("tellUsAboutYourself")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
                            <Button type="submit" loading={isUpdating} disabled={isUpdating}>
                                {t("saveChanges")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBioModal;