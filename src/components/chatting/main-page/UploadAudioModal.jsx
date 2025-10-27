"use client";

import React, { useState, useRef } from 'react';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllTopicsQuery, useCreateAudioMutation, useCheckAudioMutation } from "@/lib/features/api/chattingApi";
import { Check, ChevronsUpDown, Upload, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',            // mp3
  'audio/mp3',
  'audio/x-mpeg',
  'audio/wav',             // wav
  'audio/x-wav',
  'audio/vnd.wave',
  'audio/webm',            // webm
  'audio/ogg',             // ogg/vorbis
  'audio/opus',            // opus
  'audio/flac',            // FLAC
  'audio/aac',             // AAC
  'audio/mp4',             // m4a
  'audio/x-m4a',
  'audio/vorbis',
  'audio/basic',           // μ-law
  'audio/L24',             // PCM 24-bit
  'audio/aiff',            // AIFF
  'audio/x-aiff',
  'audio/x-matroska',      // Matroska (.mka)
  'audio/x-ms-wma',        // WMA
  'audio/x-ms-wax',        // WAX
  'audio/vnd.rn-realaudio' // RealAudio
];

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
    const [audioFileName, setAudioFileName] = useState('');
    const [coverFileName, setCoverFileName] = useState('');
    const { data: topicsData, isLoading: isTopicsLoading } = useGetAllTopicsQuery();
    // console.log(topicsData);
    const [createAudio, { isLoading: isUploading }] = useCreateAudioMutation();
    const [checkAudio, { isLoading: isCheckingAudio }] = useCheckAudioMutation();

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            title: "",
            description: "",
            tags: "",
        }
    });

    const handleAudioFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setAudioFileName('');
            return;
        }
        setAudioFileName(file.name);

        // Perform AI check first
        const audioFormData = new FormData();
        audioFormData.append('audio_file', file);

        try {
            toast.info("Analyzing audio file, please wait...");
            const result = await checkAudio(audioFormData).unwrap();

            if (result.output !== 1) {
                toast.error("This audio cannot be uploaded.", {
                    description: result.message || "The audio content does not meet the requirements.",
                });
                form.setValue('audio', null, { shouldValidate: true });
                if (e.target) {
                    e.target.value = null; // Clear the file input visually
                }
                setAudioFileName('');
                return;
            }

            toast.success("Audio analysis passed!");

            // If check passes, proceed with duration calculation
            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = () => {
                setDuration(audio.duration);
            };

        } catch (error) {
            // console.log(error)
            toast.error("Failed to analyze audio", {
                description: error?.data?.message || "An error occurred during analysis.",
            });
            form.setValue('audio', null, { shouldValidate: true });
            if (e.target) {
                e.target.value = null; // Clear the file input visually
            }
            setAudioFileName('');
        }
    };

    const handleMicClick = async () => {
        if (isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);
                mediaRecorder.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.current.push(event.data);
                    }
                };
                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    const audioFile = new File([audioBlob], "recorded_audio.webm", { type: "audio/webm" });

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(audioFile);
                    
                    const syntheticEvent = {
                        target: {
                            files: dataTransfer.files
                        }
                    };

                    handleAudioFileChange(syntheticEvent);
                    form.setValue('audio', dataTransfer.files, { shouldValidate: true });

                    audioChunks.current = [];
                    stream.getTracks().forEach(track => track.stop());
                    toast.success("Recording finished.");
                };
                mediaRecorder.current.start();
                toast.info("Recording started. Click mic to stop.");
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                toast.error("Microphone access denied.");
            }
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
            setAudioFileName('');
            setCoverFileName('');
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
                                        <Input placeholder={t('exampleTitle')} {...field} disabled={isCheckingAudio || isRecording} />
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
                                        <Textarea placeholder={t('describeAudio')} {...field} disabled={isCheckingAudio || isRecording} />
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
                                                    disabled={isCheckingAudio || isRecording}
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
                                                    <ScrollArea
                                                        className="h-72"
                                                        onWheel={(e) => e.stopPropagation()}
                                                    >
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
                                                    </ScrollArea>
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
                                        <Input placeholder={t('exampleTags')} {...field} disabled={isCheckingAudio || isRecording} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="audio"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t('audioFile')}</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <Input
                                                    type="file"
                                                    accept="audio/*"
                                                    id="audio-upload"
                                                    disabled={isCheckingAudio || isRecording}
                                                    onChange={(e) => {
                                                        handleAudioFileChange(e);
                                                        field.onChange(e.target.files);
                                                    }}
                                                    className="hidden"
                                                />
                                                <label htmlFor="audio-upload" className="cursor-pointer">
                                                    <div
                                                        className="flex items-center justify-start px-2 py-1.5 border border-dashed rounded-md transition-colors duration-200 bg-accent">
                                                        <Upload className="h-5 w-5 mr-2" />
                                                        <span className="text-xs truncate">
                                                            {audioFileName || t('selectAudio')}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                            <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isCheckingAudio}>
                                                <Mic />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Cover Image Upload */}
                        <FormField
                            control={form.control}
                            name="audio_cover"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t('coverImage')}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="file"
                                                id="cover-upload"
                                                accept="image/*"
                                                disabled={isCheckingAudio || isRecording}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setCoverFileName(file.name);
                                                    } else {
                                                        setCoverFileName('');
                                                    }
                                                    field.onChange(e.target.files);
                                                }}
                                                className="hidden"
                                            />
                                            <label htmlFor="cover-upload" className="cursor-pointer">
                                                <div
                                                    className="flex items-center justify-start px-2 py-1.5 bg-accent border border-dashed rounded-md transition-colors duration-200">
                                                    <Upload className="h-5 w-5 mr-2" />
                                                    <span className="text-xs truncate">
                                                        {coverFileName || t('selectCover')}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
                            <Button loading={isUploading || isCheckingAudio} type="submit" disabled={isRecording}>
                                {isCheckingAudio ? "Analyzing..." : isRecording ? "Recording..." : t('uploadAudio')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadAudioModal;
