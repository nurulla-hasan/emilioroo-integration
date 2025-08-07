"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVerifyOTPMutation, useVerifyOTPForResetPasswordMutation, useResendOTPMutation, useResendResetOTPMutation } from "@/lib/features/api/authApi";

const verificationSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function VerificationForm({ className, type, ...props }) {
  const router = useRouter();
  const otpMail = (typeof window !== 'undefined' ? localStorage.getItem("tempEmailForOTPVerification") : null);

  const [timeLeft, setTimeLeft] = useState(60); 
  const [canResend, setCanResend] = useState(false);

  const [verifySignupOTP, { isLoading: isVerifyingSignupOTP }] = useVerifyOTPMutation();
  const [verifyResetOTP, { isLoading: isVerifyingResetOTP }] = useVerifyOTPForResetPasswordMutation();
  const [resendOTP, { isLoading: isResendingOTP }] = useResendOTPMutation();
  const [resendResetOTP, { isLoading: isResendingResetOTP }] = useResendResetOTPMutation();

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

  const onSubmit = async (data) => {
    if (!otpMail || !data.code) {
      toast.error("Email or OTP is missing. Please go back to the previous page.");
      router.push(type === 'signup' ? "/auth/sign-up" : "/auth/forgot-password");
      return;
    }

    const credentials = { email: otpMail };
    if (type === 'signup') {
      credentials.verifyCode = Number(data.code);
    } else if (type === 'reset-password') {
      credentials.resetCode = Number(data.code);
    }

    try {
      if (type === 'signup') {
        await verifySignupOTP(credentials).unwrap();
        if (typeof window !== 'undefined') {
          localStorage.removeItem("tempEmailForOTPVerification");
        }
        router.push("/auth/login");
      } else if (type === 'reset-password') {
        await verifyResetOTP(credentials).unwrap();
        toast.success("OTP verified! You can now reset your password.");
        if (typeof window !== 'undefined') {
          localStorage.setItem("tempEmailOTP", data.code);
        }
        router.push("/auth/reset-password");
      } else {
        toast.error("Invalid verification type.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Verification failed.");
    }
  };

  const handleResendOTP = async () => {
    if (!otpMail) {
      toast.error("Email not found. Please go back to the previous page.");
      router.push(type === 'signup' ? "/auth/sign-up" : "/auth/forgot-password");
      return;
    }

    try {
      if (type === 'signup') {
        await resendOTP({ email: otpMail }).unwrap();
        toast.success("New OTP sent to your email!");
      } else if (type === 'reset-password') {
        await resendResetOTP({ email: otpMail }).unwrap();
        toast.success("New OTP sent to your email!");
      } else {
        toast.error("Invalid verification type for resend.");
      }
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send new OTP.");
    }
  };

  const sendOtpLoading = isResendingOTP || isResendingResetOTP;
  const verifyOtpLoading = isVerifyingSignupOTP || isVerifyingResetOTP;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <Link href={type === 'signup' ? "/auth/sign-up" : "/auth/forgot-password"}>
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
                    disabled={sendOtpLoading}
                    className="p-0 h-auto"
                  >
                    {sendOtpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-sm text-subtitle">
                    Resend in {timeLeft} seconds
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!isValid || verifyOtpLoading}>
                {verifyOtpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
