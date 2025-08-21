"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetMyProfileQuery, useGetSkillsQuery, useUpdateMyProfileMutation } from "@/lib/features/api/authApi";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { MultipleSelector } from "@/components/ui/multiselect";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().optional(),
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    socialLinks: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).optional(),
    skills: z.array(z.string()).optional(),
    profile_image: z.any().optional(),
    cover_image: z.any().optional(),
});

const EditProfileForm = () => {
    const { data: profileData, isLoading: isProfileLoading } = useGetMyProfileQuery();
    const { data: skillsData } = useGetSkillsQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
    const fileInputRef = useRef(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const allSkills = skillsData?.data?.result?.map(skill => ({
        value: skill._id,
        label: skill.name,
    })) || [];

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            dateOfBirth: undefined,
            address: "",
            bio: "",
            socialLinks: [],
            skills: [],
            profile_image: null,
            cover_image: null,
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "socialLinks",
        control: form.control,
    });

    useEffect(() => {
        if (profileData) {
            const data = profileData.data;
            form.reset({
                name: data.name,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                address: data.address,
                bio: data.bio,
                socialLinks: data.socialLinks?.map(link => ({ value: link })) || [],
                skills: data.skills || [],
            });
        }
    }, [profileData, form]);

    const onSubmit = async (values) => {
        const formData = new FormData();
        if (values.profile_image && values.profile_image[0]) {
            formData.append("profile_image", values.profile_image[0]);
        }
        if (values.cover_image && values.cover_image[0]) {
            formData.append("profile_cover", values.cover_image[0]);
        }

        const data = {
            name: values.name,
            phone: values.phone,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString().slice(0, 10) : undefined,
            address: values.address,
            bio: values.bio,
            socialLinks: values.socialLinks.map(link => link.value),
            skills: values.skills,
        };

        formData.append("data", JSON.stringify(data));

        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.data?.message || "Failed to update profile");
        }
    };

    return (
        <Card className={"p-4"}>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="profile_image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Image</FormLabel>
                                        <FormControl>
                                            <Input type="file" ref={fileInputRef} onChange={e => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cover_image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <Input type="file" onChange={e => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full justify-between font-normal"
                                                    >
                                                        {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setOpenDatePicker(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about yourself" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Social Links</label>
                            {fields.map((field, index) => (
                                <FormField
                                    control={form.control}
                                    key={field.id}
                                    name={`socialLinks.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2 mt-2">
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ value: "" })}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
                            </Button>
                        </div>
                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skills</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            options={allSkills}
                                            placeholder="Select skills"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button loading={isUpdating} type="submit" disabled={isUpdating || isProfileLoading}>
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default EditProfileForm;