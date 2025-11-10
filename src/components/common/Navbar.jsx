"use client";
import { usePathname, Link as NextIntlLink, useRouter as useNextRouter } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User, Menu, LogOut, UserPlus, ShoppingCart, MoonIcon, SunIcon, ChevronRight, Home, Mail, Play, Heart, User2, Users, Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "../ui/toggle";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogoutMutation } from "@/lib/features/api/authApi";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/useGetMe";
import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
    const t = useTranslations('Navbar');
    const nextRouter = useNextRouter();

    const currentPathname = usePathname();

    const { theme, setTheme } = useTheme()
    const { profile, profileLoading, token } = useGetMe();
    const [logout] = useLogoutMutation();

    const isLoggedIn = profile?.data?.email && token
    const userName = profile?.data?.name;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    const navLinks = [
        { name: t('Home'), href: "/", icon: Home },
        { name: t('DonateUs'), href: "/donate-us", icon: UserPlus },
        { name: t('Bonds'), href: "/bonds", icon: ShoppingCart, bgColor: 'bg-gradient-to-r from-violet-400 to-purple-500 rounded-full px-2 py-1' },
        { name: t('People'), href: "/people", icon: User },
        { name: t('Message'), href: "/message", icon: Mail },
        { name: t('WeAreChatting'), href: "/chatting", icon: Mail, bgColor: 'bg-gradient-to-r from-blue-400 to-pink-500 rounded-full px-2 py-1' },
    ];

    const handleLogOut = () => {
        logout()
        toast.success(t("logoutSuccess"));
        window.location.href = "/";
    }
    const handleNavClick = () => {
        setIsMobileMenuOpen(false)
    }

    const handleLanguageChange = (locale) => {
        nextRouter.push(currentPathname, { locale, scroll: false });
    };


    return (
        <nav className="h-[80px]">
            <div className="bg-primary dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 max-w-[1920px] mx-auto fixed top-0 left-0 right-0 z-[1100]">
                <div className="max-w-[1400] mx-auto px-4 xl:px-0 py-2">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu */}
                        <div className="xl:hidden flex items-center">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-brand">
                                        <Menu className="h-6 w-6 text-white" />
                                        <span className="sr-only">{t('toggleNavigation')}</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0 border-0">
                                    <div className="h-full bg-primary dark:bg-gray-900 flex flex-col">
                                        {/* Header Section */}
                                        <div className="relative bg-gradient-to-br from-brand via-brand/90 to-brand/80 p-6 text-white">
                                            <SheetHeader className="text-left">
                                                <SheetTitle className="sr-only">{t('mainMenu')}</SheetTitle>
                                                <SheetDescription className="sr-only">{t('navDescription')}</SheetDescription>
                                            </SheetHeader>

                                            {/* User Profile Section */}
                                            {isLoggedIn ? (
                                                <div className="flex items-center gap-3 mt-4">
                                                    <Avatar className="h-12 w-12 border-2 border-white/30">
                                                        <AvatarImage src={profile?.data?.profile_image} alt={userName} />
                                                        <AvatarFallback className="bg-white/20 text-white font-semibold">
                                                            {userName
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-white">{userName}</p>
                                                        <p className="text-xs text-white/80">{t('welcomeBack')}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <p className="text-white/90 text-sm mb-3">{t('joinCommunity')}</p>
                                                    <div className="flex gap-2">
                                                        <NextIntlLink href="/auth/login" onClick={handleNavClick}>
                                                            <Button size="sm" variant="secondary" className="text-xs">
                                                                {t('login')}
                                                            </Button>
                                                        </NextIntlLink>
                                                        <NextIntlLink href="/auth/sign-up" onClick={handleNavClick}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-xs border-white/30 text-white hover:bg-white/10 bg-transparent"
                                                            >
                                                                {t('signUp')}
                                                            </Button>
                                                        </NextIntlLink>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
                                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl translate-y-4 -translate-x-4"></div>
                                        </div>


                                        {/* Navigation Links */}
                                        <div className="flex-1 p-6">
                                            <div className="relative mb-6">
                                                <GlobalSearch isMobile={true} />
                                            </div>
                                            <nav className="space-y-2">
                                                {navLinks.map((link) => {
                                                    const IconComponent = link.icon
                                                    const isActive = currentPathname === link.href
                                                    return (
                                                        <NextIntlLink
                                                            key={link.name}
                                                            href={link.href}
                                                            onClick={handleNavClick}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                                                ? "bg-white/10 text-white border border-white/20"
                                                                : "text-gray-100 hover:bg-gray-50 hover:text-gray-900"
                                                                }`}
                                                        >
                                                            <IconComponent
                                                                className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                                                            />
                                                            <span className="font-medium">{link.name}</span>
                                                            <ChevronRight
                                                                className={`h-4 w-4 ml-auto transition-transform ${isActive ? "text-white" : "text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1"}`}
                                                            />
                                                        </NextIntlLink>
                                                    )
                                                })}
                                            </nav>

                                        </div>


                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        {/*---------------------------------------- */}

                        {/* Desktop Navigation */}
                        <div className="xl:flex w-full items-center justify-between">
                            {/* Logo */}
                            <div className="hidden xl:flex flex-col justify-center">
                                <NextIntlLink href="/">
                                    <div className="md:h-7 lg:h-8 border-[#FFFFFF] font-bold text-lg flex justify-center items-center gap-2 border-2 rounded-[100%] p-2">
                                        <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#22B14C]"></div>
                                        <div className="lg:w-12 w-8 h-2 rounded-full bg-[#FFF200]"></div>
                                        <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#ED1C24]"></div>
                                    </div>
                                </NextIntlLink>
                            </div>

                            <div className="flex items-center gap-8">
                                {/* Desktop Navigation Links */}
                                <div className="hidden xl:flex items-center gap-12">
                                    {navLinks.map((link) => (
                                        <NextIntlLink
                                            scroll={false}
                                            key={link.name}
                                            href={link.href}
                                            className={`hover:opacity-70 transition-colors font-medium duration-200 text-sm ${currentPathname === link.href ? "border-b-2 border-white text-white font-bold" : "text-white"} ${link.bgColor || ''}`}
                                        >
                                            {link.name}
                                        </NextIntlLink>
                                    ))}
                                </div>

                                {/* Search Input */}
                                <div className="hidden xl:block relative">
                                    <GlobalSearch />
                                </div>
                            </div>

                            {/* Right Action Icons */}
                            <div className="flex items-center justify-end xl:justify-start space-x-2 md:space-x-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="hover:bg-transparent">
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Languages className="h-6 w-6 text-white" />
                                            <span className="sr-only">{t('language')}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                                            {t('en')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                                            {t('es')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Theme Toggle */}
                                <Toggle
                                    variant="ghost"
                                    size="sm"
                                    className="group hover:bg-transparent data-[state=on]:bg-transparent rounded-full"
                                    pressed={theme === "dark"}
                                    onPressedChange={() =>
                                        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                                    }
                                    aria-label={t(theme === 'dark' ? 'switchToLight' : 'switchToDark')}
                                >
                                    <MoonIcon
                                        size={10}
                                        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                                        aria-hidden="true"
                                    />
                                    <SunIcon
                                        size={10}
                                        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0 text-white"
                                        aria-hidden="true"
                                    />
                                </Toggle>
                                {/* User Profile Icon */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex gap-3 items-center cursor-pointer">
                                            {/* Loading state */}
                                            {profileLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-10 w-10 rounded-full dark:bg-gray-700" />
                                                    <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                                                </div>
                                            ) : (
                                                <>
                                                    <Button variant="ghost" size="icon" className="hover:bg-brand">
                                                        {isLoggedIn ? (
                                                            <Avatar className="h-10 w-10 border-2 border-white/30">
                                                                <AvatarImage src={profile?.data?.profile_image} alt={userName} />
                                                                <AvatarFallback className="bg-white/20 text-white font-semibold text-xs">
                                                                    {userName?.split(" ").map((n) => n[0]).join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <span className="flex p-2 items-center justify-center rounded-full bg-white/10">
                                                                <User className="h-5 w-5 text-white" />
                                                            </span>
                                                        )}
                                                        <span className="sr-only">{t('profile')}</span>
                                                    </Button>

                                                    {/* Username */}
                                                    {isLoggedIn && (
                                                        <span className="hidden md:block text-white text-sm font-medium">{userName}</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="md:w-48">
                                        {isLoggedIn ? (
                                            <div>
                                                <DropdownMenuLabel className="md:hidden text-center">{userName}</DropdownMenuLabel>
                                                <DropdownMenuSeparator className={"md:hidden"} />
                                                <NextIntlLink href="/profile">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <User2 className="mr-2 h-4 w-4" />
                                                        <span>{t('profile')}</span>
                                                    </DropdownMenuItem>
                                                </NextIntlLink>
                                                <DropdownMenuSeparator />
                                                <NextIntlLink href="/friends">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>{t('friends')}</span>
                                                    </DropdownMenuItem>
                                                </NextIntlLink>
                                                <DropdownMenuSeparator />
                                                <NextIntlLink href="/chatting/favorite">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <Heart className="mr-2 h-4 w-4" />
                                                        <span>{t('favorite')}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </NextIntlLink>
                                                <NextIntlLink href="/chatting/playlist">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <Play className="mr-2 h-4 w-4" />
                                                        <span>{t('playlist')}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </NextIntlLink>
                                                <DropdownMenuItem onClick={handleLogOut} className={"cursor-pointer"}>
                                                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                                                    <span className="text-red-500">{t('logout')}</span>
                                                </DropdownMenuItem>
                                            </div>
                                        ) : (
                                            <>
                                                <NextIntlLink href="/auth/sign-up">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        <span>{t('signUp')}</span>
                                                    </DropdownMenuItem>
                                                </NextIntlLink>
                                                <DropdownMenuSeparator />
                                                <NextIntlLink href="/auth/login">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>{t('login')}</span>
                                                    </DropdownMenuItem>
                                                </NextIntlLink>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;