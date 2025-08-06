"use client"

import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Loader2 } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { useEffect } from "react";
// import useWebsiteInfoStore from "@/store/websiteInfo";
// import { toast } from "sonner";
// import { useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
import { useForm } from "react-hook-form";

const Footer = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    // const { info, fetchInfo } = useWebsiteInfoStore();

    // useEffect(() => {
    //     if (!info) {
    //         fetchInfo();
    //     }
    // }, [info, fetchInfo]);

    const info = {
        email: "2Tt8K@example.com",
        phone: "123-456-7890",
        address: "123 Main St, Anytown, USA",
        instagram: "https://www.instagram.com/example",
        telegram: "https://t.me/example",
    }

    const { email, phone, address, instagram, telegram } = info || {};

    const isPending = false;
    // const { mutate, isPending } = useMutation({
    //     mutationFn: (data) => api.post("/newsletter/subscribe", data),

    //     onSuccess: (data) => {
    //         console.log(data);
    //         toast.success(data?.data?.message);
    //     },
    //     onError: (error) => {
    //         toast.error(error?.response?.data?.message || "Failed to send message.");
    //     },
    // })

    const onSubmit = (data) => {
        console.log(data);
        // mutate({
        //     email: data.email,
        // })
        reset()
    }

    return (
        <footer
            className="relative py-12 bg-skyBlue2"
        >
            {/* Dark overlay on top of the background image */}
            <div className="relative z-10">
                {/* Newsletter Section */}
                <div className="max-w-7xl mx-auto px-4 lg:px-0 pb-8 md:pb-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl lg:text-4xl max-w-lg text-title">
                                Subscribe Newsletter For Latest Update
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto bg-skyBlue3 p-2 rounded-lg">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                                <div>
                                    <Input
                                        {...register("email", { required: true })}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="focus:border-0"
                                    />
                                    {errors.email && <span className="text-red-500 text-xs ml-1">Email is required</span>}
                                </div>
                                <Button
                                className={"bg-skyBlue text-white hover:bg-skyBlue/90"}
                                    type="submit"
                                >
                                    {
                                        isPending ? <><Loader2 className="animate-spin" />Loading</> : 'Subscribe'
                                    }
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-300 w-full"></div>


                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 lg:px-0 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-18 ">
                        {/* Logo and Description */}
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="relative w-[150px] h-auto">
                                <Image
                                    src="/images/logo.png"
                                    alt="TripleM Collectibles Logo"
                                    width={150}
                                    height={50}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <p className="text-subtitle text-sm leading-relaxed">
                                Collect smarter with authentic products, fair prices, and a platform built just for hobbyists.
                            </p>
                        </div>

                        {/* Company & Legal */}
                        <div>
                            <h4 className="text-title font-semibold text-lg mb-4">
                                Company & Legal
                            </h4>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-subtitle text-sm hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="/terms" className="text-subtitle text-sm hover:text-primary transition-colors">Terms & Conditions</Link></li>
                                <li><Link href="/privacy" className="text-subtitle text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Help & Contact */}
                        <div>
                            <h4 className="text-title font-semibold text-lg mb-4">
                                Help & Contact
                            </h4>
                            <ul className="space-y-3">
                                <li><Link href="/faq" className="text-subtitle text-sm hover:text-primary transition-colors">FAQs</Link></li>
                                <li><Link href="/help" className="text-subtitle text-sm hover:text-primary transition-colors">Help & Support</Link></li>
                                <li><Link href="/contact" className="text-subtitle text-sm hover:text-primary transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Our Address */}
                        <div>
                            <h4 className="text-title font-semibold text-lg mb-4">
                                Our Address
                            </h4>
                            <address className="not-italic space-y-3 text-subtitle text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-subtitle shrink-0 mt-1" />
                                    <span>{address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-subtitle shrink-0" />
                                    <span>{phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-subtitle shrink-0" />
                                    <span>{email}</span>
                                </div>
                            </address>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer - Social Icons and Copyright */}
                <div className="flex gap-3 items-center justify-center">
                    <div className="border-b border-gray-300 w-full"></div>
                    <div className="max-w-7xl mx-auto px-4 lg:px-0">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="flex space-x-6">
                                <Link href={`${instagram}`} target="_blank" aria-label="Instagram" className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-prbg-primary hover:border-prbg-primary transition-colors">
                                    <Instagram className="w-4 h-4 text-subtitle hover:text-primary transition-colors" />
                                </Link>
                                <Link href={`${telegram}`} target="_blank" aria-label="Twitter" className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-prbg-primary hover:border-prbg-primary transition-colors">
                                    <FaTelegramPlane className="w-4 h-4 text-subtitle hover:text-primary transition-colors" />
                                </Link>
                                <Link href="#" aria-label="Facebook" className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-prbg-primary hover:border-prbg-primary transition-colors">
                                    <Facebook className="w-4 h-4 text-subtitle hover:text-primary transition-colors" />
                                </Link>
                                <Link href="#" aria-label="YouTube" className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:bg-prbg-primary hover:border-prbg-primary transition-colors">
                                    <Youtube className="w-4 h-4 text-subtitle hover:text-primary transition-colors" />
                                </Link>
                                {/* Changed from Pinterest to MessageCircleHeart based on your import */}

                            </div>

                        </div>
                    </div>
                    <div className="border-b border-gray-300 w-full"></div>
                </div>
                <div className="text-subtitle text-sm text-center mt-8">
                    © 2025 Triplemcollectibles. All right reserved
                </div>
            </div>
        </footer>
    )
}

export default Footer