"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, CalendarIcon } from "lucide-react";
import { MultipleSelector } from "@/components/ui/multiselect";
import Link from "next/link";
import { useRegisterMutation, useGetSkillsQuery } from "@/lib/features/api/authApi";
import { useRouter } from "next/navigation";



const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"])
    .optional(),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(), // Array of strings for skill IDs
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export function SignUpForm({ className, ...props }) {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => setShowPassword(!showPassword);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const { data: skillsData } = useGetSkillsQuery();
  const skillOptions = skillsData?.data?.result?.map(skill => ({
    label: skill.name,
    value: skill._id,
  })) || [];

  const [register, { data, isLoading, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("tempEmailForOTPVerification", data?.data?.email);
      }
      router.push("/auth/verification?type=signup");
    }
  }, [isSuccess, router, data])

  const methods = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: undefined,
      dateOfBirth: undefined,
      address: "",
      bio: "",
      skills: [],
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, formState: { errors, isValid }, control } = methods;

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().slice(0, 10) : undefined,
    };
    register(formattedData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
              <Link href="/">
                <ArrowLeft className="cursor-pointer" />
              </Link>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Register a new account</h1>
                  <p className="text-sm">Please enter your information to create account.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        {errors.name && <p className="text-red-500 text-xs -mt-2">{errors.name.message}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        {errors.email && <p className="text-red-500 text-xs -mt-2">{errors.email.message}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                  <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="phone">Phone <span className="text-xs">(Optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="gender">Gender <span className="text-xs">(Optional)</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                  <FormField
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="dateOfBirth">Date of Birth <span className="text-xs">(Optional)</span></FormLabel>
                        <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-full justify-between font-normal"
                              >
                                {field.value ? field.value.toLocaleDateString() : "Select date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                field.onChange(date);
                                setOpenDatePicker(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="address">Address <span className="text-xs">(Optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            id="address"
                            type="text"
                            placeholder="Enter your address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel htmlFor="bio">Bio <span className="text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel htmlFor="skills">Skills <span className="text-xs">(Optional)</span></FormLabel>
                      <MultipleSelector
                        options={skillOptions}
                        placeholder="Select skills"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            {errors && <span className="text-red-500 text-xs">{errors.password?.message}</span>}
                            <Button
                              variant="ghost"
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center px-3 text-primary cursor-pointer"
                              onClick={toggleVisibility}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            {errors && <span className="text-red-500 text-xs">{errors.confirmPassword?.message}</span>}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button loading={isLoading} type="submit" className="w-full" disabled={!isValid || isLoading}>
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
