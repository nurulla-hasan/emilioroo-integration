"use client";

import { useForm } from "react-hook-form";
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
import { useChangePasswordMutation, useLogoutMutation } from "@/lib/features/api/authApi";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    oldPassword: z.string().min(1, { message: "Old password is required." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ChangePasswordForm = () => {
    const [changePassword, { isLoading: isUpdating }] = useChangePasswordMutation();
    const [logout] = useLogoutMutation();
    const router = useRouter();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
    const error = form.formState.errors;

    const onSubmit = async (values) => {
        try {
            await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmPassword,
            }).unwrap();
            toast.success("Password changed successfully. Please log in again.");
            await logout().unwrap();
            router.push('/auth/login');
        } catch (error) {
            if (error.data.message === "Password do not match") {
                toast.error("Old password is incorrect.");
            } else {
                toast.error(error.data?.message || "Failed to change password");
            }
        }
    };

    return (
        <Card className={"p-4"}>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old Password</FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="relative">
                                                <Input type={showOldPassword ? "text" : "password"} placeholder="Your old password" {...field} />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                >
                                                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {error.oldPassword && <p className="text-red-500 text-xs ml-1 mt-1">{error.oldPassword.message}</p>}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="relative">
                                                <Input type={showNewPassword ? "text" : "password"} placeholder="Your new password" {...field} />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {error.newPassword && <p className="text-red-500 text-xs ml-1 mt-1">{error.newPassword.message}</p>}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="relative">
                                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your new password" {...field} />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {error.confirmPassword && <p className="text-red-500 text-xs ml-1 mt-1">{error.confirmPassword.message}</p>}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button loading={isUpdating} type="submit" disabled={isUpdating || !form.formState.isValid}>
                            Save changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordForm;