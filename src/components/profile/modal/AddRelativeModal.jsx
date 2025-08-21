"use client";

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

    const { users, isLoading: isUsersLoading } = useGetUsersWithoutMe();
    const [createRelative, { isLoading: isCreating }] = useCreateRelativeMutation();


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
                                            {isUsersLoading ? (
                                                <SelectItem disabled>Loading users...</SelectItem>
                                            ) : (
                                                users.map((user) => (
                                                    <SelectItem key={user._id} value={user._id}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))
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