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
import { useUpdateRelativeMutation } from "@/lib/features/api/relativesApi";
import { useEffect } from "react";

const formSchema = z.object({
    relation: z.string().min(1, { message: "Relation is required." }),
    familySide: z.string().min(1, { message: "Please select a family side." }),
});

const EditRelativeModal = ({ isOpen, onOpenChange, relative }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            relation: "",
            familySide: "",
        },
    });

    useEffect(() => {
        if (relative) {
            form.reset({
                relation: relative.relation,
                familySide: relative.familySide,
            });
        }
    }, [relative, form]);

    const [updateRelative, { isLoading: isUpdating }] = useUpdateRelativeMutation();

    const onSubmit = async (values) => {
        if (!relative) return;

        try {
            await updateRelative({ id: relative._id, data: values }).unwrap();
            toast.success("Relative updated successfully");
            onOpenChange(false);
        } catch (error) {
            toast.error(error.data?.message || "Failed to update relative");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Relative</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Updating..." : "Update Relative"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditRelativeModal;
