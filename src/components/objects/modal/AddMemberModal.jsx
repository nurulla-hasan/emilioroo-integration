"use client";

import { useEffect } from "react";
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
import { useGetAllUsersQuery, useAddProjectMemberMutation } from "@/lib/features/api/projectApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackAvatar, getInitials } from "@/lib/utils";

const formSchema = z.object({
  userId: z.string().min(1, { message: "User is required." }),
  type: z.enum(["Producer", "Consumer"], { message: "Type is required." }),
  role: z.string().optional(), // Optional for Consumer, required for Producer
}).superRefine((data, ctx) => {
  if (data.type === "Producer" && !data.role) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Role is required for Producer.",
      path: ["role"],
    });
  }
});

const AddMemberModal = ({ isOpen, onOpenChange, projectId, onMemberAdded }) => {
  const { data: usersData, isLoading: isUsersLoading, isError: isUsersError, error: usersError } = useGetAllUsersQuery();
  const [addProjectMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      type: "Consumer", // Default to Consumer
      role: "",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (isUsersError) {
      toast.error(usersError?.data?.message || "Failed to load users.");
    }
  }, [isUsersError, usersError]);

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form.reset, form]);

  const onSubmit = async (values) => {
    console.log(values);
    try {
      const payload = {
        user: values.userId,
        type: values.type,
      };
      if (values.type === "Producer") {
        payload.role = values.role;
      }

      await addProjectMember({ id: projectId, data: payload }).unwrap();
      toast.success("Member added successfully!");
      onOpenChange(false);
      onMemberAdded();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add member.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select key={usersData?.data?.result?.length || 0} onValueChange={field.onChange} defaultValue={field.value} disabled={isUsersLoading}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersData?.data?.result?.length > 0 ? (
                        usersData.data.result.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            <Avatar className="mr-2">
                              <AvatarImage src={user.profile_image || fallbackAvatar(user.gender)} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            {user.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-users-found" disabled>No users found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Producer">Producer</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === "Producer" && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button loading={isAddingMember} type="submit" disabled={isAddingMember || !form.formState.isValid}>
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
