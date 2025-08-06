"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/api/auth/verifyEmail";
import { verifyOTP } from "@/api/auth/verifyOTP";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { sendOTP } from "@/api/auth/sendOTP";

const verificationSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function VerificationForm({ className, ...props }) {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const otpMail = typeof window !== 'undefined' ? localStorage.getItem("tempEmailForOTPVerification") : null;

  const [timeLeft, setTimeLeft] = useState(60); 
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const {mutate: mutateOTP, isPending: isPendingOTP} = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      toast.success("Verification successful!");
      router.push("/auth/reset-password");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Verification failed.");
    },
  })

  const { mutate: mutateResendOTP, isPending: isPendingResend } = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      toast.success("New OTP sent to your email!");
      setTimeLeft(60);
      setCanResend(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send new OTP.");
    },
  });

  // Verify email
  const { isSuccess, isPending, error } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token),
    enabled: !!token,
  });


  const onSubmit = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("tempEmailOTP", data?.code);
    }
    if (otpMail && data?.code) {
      const credential = { email: otpMail, otp: data?.code };
      mutateOTP(credential);
    } else {
      toast.error("Email or OTP is missing. Please go back to forgot password page.");
      router.push("/auth/forgot-password");
    }
  };

  const handleResendOTP = () => {
    if (otpMail) {
      mutateResendOTP(otpMail);
    } else {
      toast.error("Email not found. Please go back to forgot password page.");
      router.push("/auth/forgot-password");
    }
  };

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
              <Link href="/auth/forgot-password">
                <ArrowLeft className="cursor-pointer" />
              </Link>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold text-title mb-2">
                    Verify Your Account
                  </h1>
                  <p className="text-sm text-subtitle">
                    Enter the 6-digit code sent to your email.
                  </p>
                  {otpMail && (
                    <p className="text-sm text-gray-600">
                      Code sent to: <span className="font-medium">{otpMail}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 justify-center">
                  <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <InputOTP {...field} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Resend OTP button */}
                <div className="flex justify-center text-sm text-subtitle">
                  {canResend ? (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={isPendingResend}
                      className="p-0 h-auto"
                    >
                      {isPendingResend && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Resend Code
                    </Button>
                  ) : (
                    <p className="text-sm text-subtitle">
                      Resend in {timeLeft} seconds
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={!isValid || isPendingOTP}>
                  {isPendingOTP && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-xl font-semibold text-title">Verifying your email...</h1>
            <p className="text-sm text-subtitle text-center">Please wait, this may take a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl font-semibold text-red-500">Verification Failed!</h1>
            <p className="text-sm text-subtitle text-center">{error?.response?.data?.message || "An unexpected error occurred."}</p>
            <Button onClick={() => router.push("/auth/sign-up")}>Go to Sign Up</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl font-semibold text-green-500">Verification Successful!</h1>
            <p className="text-sm text-subtitle text-center">Your account has been successfully verified.</p>
            <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}