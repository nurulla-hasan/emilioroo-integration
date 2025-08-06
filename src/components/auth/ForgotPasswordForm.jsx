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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendOTP } from "@/api/auth/sendOTP";

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

  const {mutate, isPending } = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      toast.success("Please check your email for the OTP!");
      router.push("/auth/verification")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Verification failed.");
    },
  })

  const onSubmit = (data) => {
    mutate(data?.email)
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

              <Button type="submit" className="w-full" disabled={!isValid || isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Get Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
