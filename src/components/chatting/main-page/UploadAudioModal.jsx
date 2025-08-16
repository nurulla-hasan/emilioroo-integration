"use client";

import React, { useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useGetAllTopicsQuery, useCreateAudioMutation } from "@/lib/features/api/chattingApi";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];


const UploadAudioModal = ({ isOpen, onOpenChange }) => {
    const t = useTranslations('UploadAudioModal');
    const formSchema = z.object({
        title: z.string().min(5, t('titleMinLength')),
        description: z.string().min(10, t('descriptionMinLength')),
        audioTopic: z.string({ required_error: t('audioTopicRequired') }),
        tags: z.string(),
        audio: z
            .any()
            .refine((files) => files?.length == 1, t('audioFileRequired'))
            .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, t('maxFileSize'))
            .refine(
                (files) => ALLOWED_AUDIO_TYPES.includes(files?.[0]?.type),
                t('acceptedAudioFormats')
            ),
        audio_cover: z
            .any()
            .refine((files) => files?.length == 1, t('coverImageRequired'))
            .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, t('maxFileSize'))
            .refine(
                (files) => ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type),
                t('acceptedImageFormats')
            ),
    });
    const [duration, setDuration] = useState(0);
    const [open, setOpen] = useState(false);
    const { data: topicsData, isLoading: isTopicsLoading } = useGetAllTopicsQuery();
    const [createAudio, { isLoading: isUploading }] = useCreateAudioMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            title: "",
            description: "",
            tags: "",
        }
    });

    const handleAudioFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = () => {
                setDuration(audio.duration);
            };
        }
    };
    
    const onSubmit = async (values) => {
        const tags = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const data = {
            title: values.title,
            description: values.description,
            audioTopic: values.audioTopic,
            tags,
            duration: Math.round(duration),
        };

        const formData = new FormData();
        formData.append('audio', values.audio[0]);
        formData.append('audio_cover', values.audio_cover[0]);
        formData.append('data', JSON.stringify(data));

        try {
            await createAudio(formData).unwrap();
            toast.success(t('audioUploadedSuccessfully'));
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(t('failedToUploadAudio'), {
                description: error?.data?.message || t('somethingWentWrong'),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{t('uploadNewAudio')}</DialogTitle>
                    <DialogDescription>
                        {t('fillDetailsUploadAudio')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('title')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('exampleTitle')} {...field} />
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
                                        <Textarea placeholder={t('describeAudio')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audioTopic"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('audioTopic')}</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? topicsData?.data?.result?.find(
                                                            (topic) => topic._id === field.value
                                                        )?.name
                                                        : t('selectTopic')}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder={t('searchTopic')} />
                                                <CommandList>
                                                    {isTopicsLoading && <div className="p-4 text-sm">{t('loading')}</div>}
                                                    <CommandEmpty>{t('noTopicFound')}</CommandEmpty>
                                                    <CommandGroup>
                                                        {topicsData?.data?.result?.map((topic) => (
                                                            <CommandItem
                                                                value={topic.name}
                                                                key={topic._id}
                                                                onSelect={() => {
                                                                    form.setValue("audioTopic", topic._id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        topic._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {topic.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('tags')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('exampleTags')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('audioFile')}</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="audio/*" onChange={(e) => {
                                            field.onChange(e.target.files);
                                            handleAudioFileChange(e);
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audio_cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('coverImage')}</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
                            <Button type="submit" disabled={!form.formState.isValid || isUploading}>
                                {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" />{t('uploadingAudio')}</> : t('uploadAudio')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadAudioModal;