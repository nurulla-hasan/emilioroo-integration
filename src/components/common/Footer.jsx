"use client"

import { Facebook, Instagram, Mail, Heart, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Separator } from "../ui/separator"

const Footer = () => {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            setIsSubscribed(true)
            setEmail("")
            setTimeout(() => setIsSubscribed(false), 3000)
        }
    }

    return (
        <footer className="relative dark:bg-accent bg-primary text-white overflow-hidden px-4 md:px-0">
            {/* Animated Background Elements */}
            <div className="relative z-10 py-8">
                <div>
                    {/* Newsletter Section */}
                    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between text-center">
                        <div className="flex flex-col">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                Join Our Community
                            </h2>
                            <p className="text-white/80 mb-8 max-w-md mx-auto">
                                Get the latest updates and exclusive content delivered to your inbox
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="bg-white dark:bg-white/10 text-primary hover:bg-white/90 font-semibold px-6 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                {isSubscribed ? (
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-red-500" />
                                        Subscribed!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        Subscribe
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                    <Separator className="bg-gray-500 my-4" />
                    {/* Main Footer Content */}
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Logo and Description */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <Link href="/" className="group">
                                    <div className="relative">
                                        <div className="h-16 w-16 border-2 border-white/30 font-bold text-lg flex justify-center items-center gap-1 rounded-full p-3 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            <div className="w-8 h-2 rounded-full bg-yellow-400" />
                                            <div
                                                className="w-2 h-2 rounded-full bg-red-400 animate-pulse"
                                                style={{ animationDelay: "0.5s" }}
                                            />
                                        </div>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </Link>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        Bankybondy
                                    </h2>
                                    <p className="text-white/70 text-sm mt-1">We are chatting</p>
                                </div>
                            </div>

                            <p className="text-white/80 leading-relaxed max-w-md">
                                A free platform for sharing and exploring daily life conversations. Enjoy authentic audio snippets from
                                real people, and if you would like to support us, donations are always appreciated.
                            </p>
                        </div>

                        {/* Information Links */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold relative">
                                Information
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent" />
                            </h3>
                            <nav className="space-y-4">
                                {[
                                    { href: "/donate-us", label: "Donate us", icon: Heart },
                                    { href: "/contact", label: "Contact us", icon: Mail },
                                    { href: "/about", label: "About Us", icon: null },
                                    { href: "/terms", label: "Terms and Conditions", icon: null },
                                    { href: "/privacy", label: "Privacy policy", icon: null },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                    >
                                        {item.icon && (
                                            <item.icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                        )}
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold relative">
                                Follow Us
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent" />
                            </h3>
                            <div className="space-y-4">
                                <Link
                                    href="https://facebook.com"
                                    className="flex items-center gap-4 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <Facebook className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-[#1877F2]/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="font-medium">Facebook</span>
                                </Link>

                                <Link
                                    href="https://instagram.com"
                                    className="flex items-center gap-4 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <Instagram className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="font-medium">Instagram</span>
                                </Link>
{/* 
                                <Link
                                    href="https://twitter.com"
                                    className="flex items-center gap-4 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <Twitter className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="font-medium">Twitter</span>
                                </Link> */}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-500" />
                    {/* Bottom Section */}
                    <div className="pt-8 max-w-[1400px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <span>Made with</span>
                                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                                <span>by Bankybondy Team</span>
                            </div>

                            <div className="text-white/70 text-sm">© 2024 Bankybondy. All rights reserved.</div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span>Online</span>
                                </div>
                                <div className="text-xs text-white/60">Last updated: Today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
