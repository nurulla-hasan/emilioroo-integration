"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForgetPasswordMutation } from "@/lib/features/api/authApi";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export function ForgotPasswordForm({ className, ...props }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });


  const [forgetPassword, { isLoading }] = useForgetPasswordMutation(); 

  const onSubmit = async (data) => {
    try {
      await forgetPassword( data.email ).unwrap();
      toast.success("Please check your email for the OTP!");
      if (typeof window !== 'undefined') {
        localStorage.setItem("tempEmailForOTPVerification", data.email);
      }
      router.push('/auth/verification?type=reset-password');
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <Link href="/auth/login">
              <ArrowLeft className="cursor-pointer" />
            </Link>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold text-title mb-2">Forgot Your Password?</h1>
                <p className="text-sm text-subtitle">Enter your email to reset your password.</p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1 -mt-2">{errors.email.message}</p>
                )}
              </div>

              <Button loading={isLoading} type="submit" className="w-full" disabled={!isValid || isLoading}>
                Get Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
