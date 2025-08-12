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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    audioTopic: z.string({ required_error: "Please select an audio topic." }),
    tags: z.string(),
    audio: z
        .any()
        .refine((files) => files?.length == 1, "Audio file is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
        .refine(
            (files) => ALLOWED_AUDIO_TYPES.includes(files?.[0]?.type),
            ".mp3, .wav and .ogg files are accepted."
        ),
    audio_cover: z
        .any()
        .refine((files) => files?.length == 1, "Cover image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
        .refine(
            (files) => ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
});

const UploadAudioModal = ({ isOpen, onOpenChange }) => {
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
            toast.success("Audio uploaded successfully!");
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to upload audio.", {
                description: error?.data?.message || "Something went wrong.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Upload New Audio</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to upload a new audio file. Click upload when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Soothing Ocean Waves" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the audio..." {...field} />
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
                                    <FormLabel>Audio Topic</FormLabel>
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
                                                        : "Select topic"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search topic..." />
                                                <CommandList>
                                                    {isTopicsLoading && <div className="p-4 text-sm">Loading...</div>}
                                                    <CommandEmpty>No topic found.</CommandEmpty>
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
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., relaxing, nature, ocean (comma separated)" {...field} />
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
                                    <FormLabel>Audio File</FormLabel>
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
                                    <FormLabel>Cover Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={!form.formState.isValid || isUploading}>
                                {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading Audio</> : "Upload Audio"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadAudioModal;