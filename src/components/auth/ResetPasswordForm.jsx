"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { setNewPassword } from "@/api/auth/setNewPassword";
import { toast } from "sonner";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string().min(6, { message: "Confirm new password must be at least 6 characters." }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match.",
  path: ["confirmNewPassword"],
});

export function ResetPasswordForm({ className, ...props }) {
  const router = useRouter()

  const resetPassMail = typeof window !== 'undefined' ? localStorage.getItem("tempEmailForOTPVerification") : null
  const resetPassOTP = typeof window !== 'undefined' ? localStorage.getItem("tempEmailOTP") : null

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPasswordVisibility = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: setNewPassword,
    onSuccess: () => {
      toast.success("Password reset successful!");
      if (typeof window !== 'undefined') {
        localStorage.removeItem("tempEmailForOTPVerification")
        localStorage.removeItem("tempEmailOTP")
      }
      router.push("/auth/login")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Password reset failed.");
    },
  })

  const onSubmit = (data) => {
    const credential = {
      email: resetPassMail,
      otp: resetPassOTP,
      password: data?.newPassword
    };
    mutate(credential);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <Link href="/auth/verification">
              <ArrowLeft className="cursor-pointer" />
            </Link>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold text-title">Reset Your Password</h1>
                <p className="text-sm text-subtitle">Enter your new password below.</p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="********"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-primary cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs ml-1 -mt-2">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="********"
                    {...register("confirmNewPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-primary cursor-pointer"
                    onClick={toggleConfirmNewPasswordVisibility}
                  >
                    {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs ml-1 -mt-2">{errors.confirmNewPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!isValid || isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
