"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
import { useGetAllTopicsQuery, useUpdateAudioMutation } from "@/lib/features/api/chattingApi";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const UpdateAudioModal = ({ isOpen, onOpenChange, audio }) => {
    const t = useTranslations('UpdateAudioModal');

    const formSchema = z.object({
        title: z.string().min(5, t('titleMinLength')),
        description: z.string().min(10, t('descriptionMinLength')),
        audioTopic: z.string({ required_error: t('audioTopicRequired') }),
        tags: z.string(),
        audio: z.any().optional(),
        audio_cover: z.any().optional(),
    });

    const [open, setOpen] = useState(false);
    const { data: topicsData, isLoading: isTopicsLoading } = useGetAllTopicsQuery();
    const [updateAudio, { isLoading: isUpdating }] = useUpdateAudioMutation();

    const topicOptions = useMemo(() => {
        if (!topicsData?.data?.result) return [];
        return topicsData.data.result.map(topic => ({
            value: topic._id,
            label: topic.name,
        }));
    }, [topicsData]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (audio) {
            form.reset({
                title: audio.title,
                description: audio.description,
                audioTopic: audio.audioTopic?._id,
                tags: audio.tags?.join(', ') || "",
            });
        }
    }, [audio, form]);

    const onSubmit = async (values) => {
        const tags = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const data = {
            title: values.title,
            description: values.description,
            audioTopic: values.audioTopic,
            tags,
        };

        const formData = new FormData();
        if (values.audio && values.audio.length > 0) {
            formData.append('audio', values.audio[0]);
        }
        if (values.audio_cover && values.audio_cover.length > 0) {
            formData.append('audio_cover', values.audio_cover[0]);
        }
        formData.append('data', JSON.stringify(data));

        try {
            await updateAudio({ id: audio._id, data: formData }).unwrap();
            toast.success(t("audioUpdatedSuccessfully"));
            onOpenChange(false);
        } catch (error) {
            toast.error(t("failedToUpdateAudio"), {
                description: error?.data?.message || t("somethingWentWrong"),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{t('updateAudio')}</DialogTitle>
                    <DialogDescription>
                        {t('editDetails')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>{t('title')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>{t('description')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField
                            control={form.control}
                            name="audioTopic"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('audioTopic')}</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                    {field.value ? topicOptions.find(t => t.value === field.value)?.label : t('selectTopic')}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command><CommandInput placeholder={t('searchTopic')} /><CommandList><CommandEmpty>{t('noTopicFound')}</CommandEmpty><CommandGroup>
                                                {topicOptions.map((topic) => (<CommandItem value={topic.label} key={topic.value} onSelect={() => {form.setValue("audioTopic", topic.value); setOpen(false);}}><Check className={cn("mr-2 h-4 w-4", topic.value === field.value ? "opacity-100" : "opacity-0")} />{topic.label}</CommandItem>))}
                                            </CommandGroup></CommandList></Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>{t('tags')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{t('currentCover')}</p>
                            <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                <Image src={audio?.cover_image} alt="Current cover" fill className="object-cover"/>
                            </div>
                        </div>
                        <FormField control={form.control} name="audio_cover" render={({ field }) => (<FormItem><FormLabel>{t('changeCover')}</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="audio" render={({ field }) => (<FormItem><FormLabel>{t('changeAudioFile')}</FormLabel><FormControl><Input type="file" accept="audio/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>)} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
                            <Button loading={isUpdating || isTopicsLoading} type="submit" disabled={isUpdating || isTopicsLoading}>
                                {t('saveChanges')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAudioModal;