"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    DialogClose,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateRelativeMutation } from "@/lib/features/api/relativesApi";
import { useGetUsersWithoutMe } from "@/hooks/useGetUsersWithoutMe";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackAvatar, getInitials } from "@/lib/utils";

const formSchema = z.object({
    relative: z.string().min(1, { message: "Please select a user." }),
    relation: z.string().min(1, { message: "Relation is required." }),
    familySide: z.string().min(1, { message: "Please select a family side." }),
});

const AddRelativeModal = ({ isOpen, onOpenChange }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            relative: "",
            relation: "",
            familySide: "",
        },
    });

    const [page, setPage] = useState(1);
    const [allUsers, setAllUsers] = useState([]);
    const { users, isLoading: isUsersLoading, totalPages } = useGetUsersWithoutMe(page, 10, "");
    const [createRelative, { isLoading: isCreating }] = useCreateRelativeMutation();

    // Update allUsers when users change
    useEffect(() => {
        if (users && users.length > 0) {
            setAllUsers((prev) => {
                if (page === 1) {
                    return users;
                }
                const newUsers = users.filter((u) => !prev.some((p) => p._id === u._id));
                return [...prev, ...newUsers];
            });
        }
    }, [users, page]);

    // Reset on modal close
    useEffect(() => {
        if (!isOpen) {
            setPage(1);
            setAllUsers([]);
        }
    }, [isOpen]);

    const observer = useRef();
    const lastUserElementRef = useCallback(
        (node) => {
            if (isUsersLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && page < totalPages) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isUsersLoading, totalPages, page]
    );

    const onSubmit = async (values) => {
        try {
            await createRelative(values).unwrap();
            toast.success("Relative added successfully");
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast.error(error.data?.message || "Failed to add relative");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Relative</DialogTitle>
                    <DialogDescription className="sr-only">
                        Select a relative to add to your profile.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="relative"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relative</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a user" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isUsersLoading && page === 1 ? (
                                                <SelectItem disabled value="loading">Loading users...</SelectItem>
                                            ) : allUsers.length === 0 ? (
                                                <SelectItem disabled value="no-users">No users available</SelectItem>
                                            ) : (
                                                <>
                                                    {allUsers.map((user, index) => (
                                                        <SelectItem 
                                                            key={user._id} 
                                                            value={user._id}
                                                            ref={index === allUsers.length - 1 ? lastUserElementRef : null}
                                                        >
                                                            <div className="flex items-center">
                                                                <Avatar className="mr-2 h-6 w-6">
                                                                    <AvatarImage src={user.profile_image || fallbackAvatar(user.gender)} />
                                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                                </Avatar>
                                                                {user.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                    {isUsersLoading && page > 1 && (
                                                        <SelectItem disabled value="loading-more">Loading more...</SelectItem>
                                                    )}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="relation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Uncle, Aunt" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="familySide"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Family Side</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a side" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Paternal">Paternal</SelectItem>
                                            <SelectItem value="Maternal">Maternal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button loading={isCreating} type="submit" disabled={isCreating}>
                                Add Relative
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRelativeModal;