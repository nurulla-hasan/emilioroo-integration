"use client";

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllAudioQuery, useCreatePlaylistMutation } from "@/lib/features/api/chattingApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MultipleSelector } from "@/components/ui/multiselect";
import { useTranslations } from "next-intl";

const CreatePlaylistModal = ({ isOpen, onOpenChange }) => {
    const t = useTranslations('CreatePlaylistModal');

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    const formSchema = z.object({
        name: z.string().min(3, t('nameMinLength')),
        description: z.string().min(10, t('descriptionMinLength')),
        audios: z.array(z.string()).min(1, t('selectAtLeastOneAudio')),
        playlist_cover: z
            .any()
            .refine((files) => files?.length == 1, t('coverImageRequired'))
            .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, t('maxFileSize'))
            .refine(
                (files) => ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type),
                t('acceptedImageFormats')
            ),
    });

    // Fetch all audios (assuming the API supports a way to get all without pagination, or a high limit)
    const { data: audioData, isLoading: isAudioLoading } = useGetAllAudioQuery({ limit: 500 }); // High limit to get all audios
    const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();

    const audioOptions = useMemo(() => {
        if (!audioData?.data?.result) return [];
        return audioData.data.result.map(audio => ({
            value: audio._id,
            label: audio.title,
        }));
    }, [audioData]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            audios: [],
        },
    });

    const onSubmit = async (values) => {
        const data = {
            name: values.name,
            description: values.description,
            audios: values.audios,
        };

        const formData = new FormData();
        formData.append('playlist_cover', values.playlist_cover[0]);
        formData.append('data', JSON.stringify(data));

        try {
            await createPlaylist(formData).unwrap();
            toast.success(t("playlistCreatedSuccessfully"));
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(t("failedToCreatePlaylist"), {
                description: error?.data?.message || t("somethingWentWrong"),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{t('createNewPlaylist')}</DialogTitle>
                    <DialogDescription>
                        {t('fillDetailsCreatePlaylist')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('playlistName')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('examplePlaylistName')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('description')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('describePlaylist')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audios"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('audios')}</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            {...field}
                                            options={audioOptions}
                                            placeholder={t('selectAudios')}
                                            className="z-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="playlist_cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('playlistCoverImage')}</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
                            <Button type="submit" disabled={!form.formState.isValid || isCreating || isAudioLoading}>
                                {(isCreating || isAudioLoading) ? <><Loader2 className="animate-spin" />{t('creatingPlaylist')}</>: t('createPlaylistButton')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePlaylistModal;
