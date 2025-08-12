"use client";

import React, {useMemo, useEffect } from 'react';
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
import { useGetAllAudioQuery, useUpdatePlaylistMutation } from "@/lib/features/api/chattingApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MultipleSelector } from "@/components/ui/multiselect";
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    audios: z.array(z.string()).min(1, "Please select at least one audio."),
    playlist_cover: z
        .any()
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true; // Optional
            return files?.[0]?.size <= MAX_FILE_SIZE;
        }, `Max file size is 5MB.`)
        .refine(
            (files) => {
                if (!files || files.length === 0) return true; // Optional
                return ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type);
            },
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
});

const UpdatePlaylistModal = ({ isOpen, onOpenChange, playlist }) => {
    const { data: audioData, isLoading: isAudioLoading } = useGetAllAudioQuery({ limit: 500 });
    const [updatePlaylist, { isLoading: isUpdating }] = useUpdatePlaylistMutation();

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

    useEffect(() => {
        if (playlist) {
            form.reset({
                name: playlist.name,
                description: playlist.description,
                audios: playlist.audios.map(a => a._id),
            });
        }
    }, [playlist, form]);

    const onSubmit = async (values) => {
        const data = {
            name: values.name,
            description: values.description,
            audios: values.audios,
        };

        const formData = new FormData();
        // Only append cover if a new one is selected
        if (values.playlist_cover && values.playlist_cover.length > 0) {
            formData.append('playlist_cover', values.playlist_cover[0]);
        }
        formData.append('data', JSON.stringify(data));

        try {
            await updatePlaylist({ id: playlist._id, data: formData }).unwrap();
            toast.success("Playlist updated successfully!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to update playlist.", {
                description: error?.data?.message || "Something went wrong.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Update Playlist</DialogTitle>
                    <DialogDescription>
                        Edit the details below to update the playlist. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Playlist Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Morning Focus" {...field} />
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
                                        <Textarea placeholder="Describe the playlist..." {...field} />
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
                                    <FormLabel>Audios</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            {...field}
                                            options={audioOptions}
                                            placeholder="Select audios..."
                                            className="z-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <p className="text-sm font-medium leading-none">Current Cover</p>
                            <div className="relative w-full h-32 rounded-md overflow-hidden">
                                <Image 
                                    src={playlist?.cover_image} 
                                    alt="Current cover" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="playlist_cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Change Cover Image (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={!form.formState.isValid || isUpdating || isAudioLoading}>
                                {(isUpdating || isAudioLoading) ? <><Loader2 className="animate-spin" /> Saving Changes</> : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePlaylistModal;
