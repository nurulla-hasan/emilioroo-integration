"use client"
import { Facebook, Instagram, Mail, Heart } from "lucide-react"
import Link from "next/link"
import { Separator } from "../ui/separator"
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('Footer');

    return (
        <footer className="relative bg-gradient-to-br from-primary via-primary/95 to-sky-600 text-white overflow-hidden px-4 xl:px-0 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-purple-900">
            {/* Animated Background Elements */}
            <div className="relative z-10 py-8">
                <div>
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
                                        {t('bankybondy')}
                                    </h2>
                                    <p className="text-white/70 text-sm mt-1">{t('weAreChatting')}</p>
                                </div>
                            </div>

                            <p className="text-white/80 leading-relaxed max-w-md">
                                {t('platformDescription')}
                            </p>
                        </div>

                        {/* Information Links */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold relative">
                                {t('information')}
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent" />
                            </h3>
                            <nav className="space-y-4">
                                {[
                                    { href: "/donate-us", label: t('donateUs'), icon: Heart },
                                    { href: "/contact", label: t('contactUs'), icon: Mail },
                                    { href: "/about", label: t('aboutUs'), icon: null },
                                    { href: "/terms", label: t('termsAndConditions'), icon: null },
                                    { href: "/privacy", label: t('privacyPolicy'), icon: null },
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
                                {t('followUs')}
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent" />
                            </h3>
                            <div className="space-y-4">
                                <Link
                                    href="https://www.facebook.com/bankybondy"
                                    className="flex items-center gap-4 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <Facebook className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-[#1877F2]/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="font-medium">{t('facebook')}</span>
                                </Link>

                                <Link
                                    href="https://www.instagram.com/bankybondyar"
                                    className="flex items-center gap-4 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                            <Instagram className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <span className="font-medium">{t('instagram')}</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-500" />
                    {/* Bottom Section */}
                    <div className="pt-8 max-w-[1400px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <span>{t('madeWith')}</span>
                                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                                <span>{t('byTeam')}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-white/70 text-sm text-center">{t('copyright')}</div>

                                {/* Creative Commons License Icons */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center" title="Creative Commons">
                                        <svg
                                            width="25"
                                            height="25"
                                            viewBox="-10 -5 1034 1234"
                                            className="text-black border-black border bg-white rounded-full hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            <path fill="currentColor" d="M499 226q-166 0 -280 117q-58 58 -88.5 131t-30.5 152.5t30 152t87.5 130t130 87.5t152 30t153.5 -30.5t133 -88.5q56 -55 85 -127t29 -153.5t-29.5 -154t-85.5 -128.5q-118 -118 -286 -118zM501 299q135 0 232 96q46 47 70.5 106t24.5 125q0 138 -94 230q-48 47 -108.5 72t-125 25t-124 -24.5t-106.5 -71.5t-72.5 -106.5t-25.5 -124.5t25.5 -124.5t72.5 -107.5q94 -95 231 -95zM389 502q-50 0 -83.5 33.5t-33.5 91.5t33 91t86 33q34 0 62 -17t43 -46l-49 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70q11 0 23.5 7t20.5 25l54 -28q-32 -58 -107 -58zM621 502q-51 0 -84 33.5t-33 91.5t32.5 91t86.5 33q33 0 60.5 -17t44.5 -46l-50 -25q-14 34 -49 34q-27 0 -40.5 -19t-13.5 -52q0 -70 54 -70q11 0 23.5 7t21.5 25l52 -28q-31 -58 -105 -58z" />
                                        </svg>
                                    </div>

                                    <div className="flex items-center justify-center" title="Attribution">
                                        <svg
                                            width="25"
                                            height="25"
                                            viewBox="-10 -5 1034 1234"
                                            className="text-black border-black border bg-white rounded-full hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            <path fill="currentColor" d="M499 228q-165 0 -281 116q-118 120 -118 284t118.5 282t280.5 118q165 0 287 -119q114 -112 114 -280.5t-116 -284.5t-285 -116zM501 300q135 0 231 96t96 232q0 139 -94 229q-100 98 -234 98t-231 -97t-97 -229.5t98 -232.5q94 -96 231 -96zM500 370q-56 0 -56 56t56 56t56 -56t-56 -56zM418 503q-11 0 -18.5 7.5t-7.5 18.5v163h46v195h124v-195h46v-163q0 -11 -8 -18.5t-18 -7.5h-164z" />
                                        </svg>
                                    </div>

                                    <div className="flex items-center justify-center" title="Share Alike">
                                        <svg
                                            width="25"
                                            height="25"
                                            viewBox="0 0 24 24"
                                            className="text-black border-black border bg-white rounded-full hover:text-white/80 transition-colors cursor-pointer"
                                        >
                                            <path stroke="currentColor" strokeWidth="2" fill="none" d="M8 12a4 4 0 1 1 1.354 3M8 12l2.5-1M8 12l-1.5-2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span>{t('online')}</span>
                                </div>
                                <div className="text-xs text-white/60">{t('lastUpdated')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer