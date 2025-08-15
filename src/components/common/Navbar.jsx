"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User, Menu, LogOut, UserPlus, ChevronDown, ShoppingBasket, ShoppingCart, MoonIcon, SunIcon, ChevronRight, Home, Mail, SearchIcon, Play, Heart, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "../ui/toggle";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";
import { useGetProfileQuery, useLogoutMutation } from "@/lib/features/api/authApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const { accessToken: token } = useSelector((state) => state.auth);
    const { data: profile, isLoading: profileLoading } = useGetProfileQuery(undefined, { skip: !token });
    const [logout] = useLogoutMutation();

    const isLoggedIn = profile?.data?.email && token
    const userName = profile?.data?.name;
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Donate Us", href: "/donate-us", icon: UserPlus },
        { name: "Bonds", href: "/bonds", icon: ShoppingCart },
        { name: "Objects", href: "/objects", icon: ShoppingBasket },
        { name: "Institutions", href: "/institutions", icon: User },
        { name: "Message", href: "/message", icon: Mail },
        { name: "We are chatting", href: "/chatting", icon: Mail },
    ];

    const handleLogOut = () => {
        logout()
        toast.success("Logout successful!");
        window.location.reload();
    }
    const handleNavClick = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="h-[80px] ">
            <div className="bg-primary dark:bg-accent max-w-[1920px] mx-auto fixed top-0 left-0 right-0 z-50">
                <div className="max-w-[1400] mx-auto px-4 xl:px-0 py-2">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu */}
                        <div className="xl:hidden flex items-center">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-brand">
                                        <Menu className="h-6 w-6 text-white" />
                                        <span className="sr-only">Toggle navigation menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0 border-0">
                                    <div className="h-full bg-primary dark:bg-gray-900 flex flex-col">
                                        {/* Header Section */}
                                        <div className="relative bg-gradient-to-br from-brand via-brand/90 to-brand/80 p-6 text-white">
                                            <SheetHeader className="text-left">
                                                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                                                <SheetDescription className="sr-only">Navigation links for the website.</SheetDescription>
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
                                                        <p className="text-xs text-white/80">Welcome back!</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <p className="text-white/90 text-sm mb-3">Join our community</p>
                                                    <div className="flex gap-2">
                                                        <Link href="/auth/login" onClick={handleNavClick}>
                                                            <Button size="sm" variant="secondary" className="text-xs">
                                                                Login
                                                            </Button>
                                                        </Link>
                                                        <Link href="/auth/sign-up" onClick={handleNavClick}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-xs border-white/30 text-white hover:bg-white/10 bg-transparent"
                                                            >
                                                                Sign Up
                                                            </Button>
                                                        </Link>
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
                                                <Input
                                                    className="peer ps-9 placeholder:text-white placeholder:text-xs text-white border-none bg-white/5 rounded-full"
                                                    placeholder="Search..."
                                                    type="search"
                                                />
                                                <div className="text-white pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                                    <SearchIcon size={16} />
                                                </div>
                                            </div>
                                            <nav className="space-y-2">
                                                {navLinks.map((link) => {
                                                    const IconComponent = link.icon
                                                    const isActive = pathname === link.href
                                                    return (
                                                        <Link
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
                                                        </Link>
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
                                <Link href="/">
                                    <div className="md:h-7 lg:h-8 border-[#FFFFFF] font-bold text-lg flex justify-center items-center gap-2 border-2 rounded-[100%] p-2">
                                        <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#22B14C]"></div>
                                        <div className="lg:w-12 w-8 h-2 rounded-full bg-[#FFF200]"></div>
                                        <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#ED1C24]"></div>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className="hidden xl:flex items-center gap-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`hover:opacity-70 transition-colors font-medium duration-200 text-sm ${pathname === link.href ? "border-b-2 border-white text-white font-bold" : "text-white"}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="hidden xl:block relative">
                                <Input
                                    className="peer ps-9 placeholder:text-white placeholder:text-xs text-white border-none bg-white/5 rounded-full"
                                    placeholder="Search..."
                                    type="search"
                                />
                                <div className="text-white pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <SearchIcon size={16} />
                                </div>
                            </div>
                            {/* Right Action Icons */}
                            <div className="flex items-center justify-end xl:justify-start space-x-2">
                                {/* User Profile Icon */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex gap-3 items-center cursor-pointer">
                                            <Button variant="ghost" size="icon" className="hover:bg-brand">
                                                {isLoggedIn ? (
                                                    <Avatar className="h-10 w-10 border-2 border-white/30">
                                                        <AvatarImage src={profile?.data?.profile_image} alt={userName} />
                                                        <AvatarFallback className="bg-white/20 text-white font-semibold text-xs">
                                                            {userName
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : !profileLoading && (
                                                    <User className="h-6 w-6 text-white" />
                                                )}
                                                <span className="sr-only">Profile</span>
                                            </Button>
                                            {profileLoading ? (
                                                <div className="flex items-center gap-1">
                                                    <Skeleton className="h-4 w-23" />
                                                    <Skeleton className="h-4 w-4" />
                                                </div>
                                            ) : isLoggedIn && (
                                                <div className="flex items-center gap-1">
                                                    <span className="hidden md:block text-white text-sm font-medium">{userName}</span>
                                                    <ChevronDown className="hidden md:block h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="md:w-48">
                                        {isLoggedIn ? (
                                            <div>
                                                <DropdownMenuLabel className="md:hidden text-center">{userName}</DropdownMenuLabel>
                                                <DropdownMenuSeparator className={"md:hidden"} />
                                                <Link href="/profile">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <User2 className="mr-2 h-4 w-4" />
                                                        <span>Profile</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <Link href="/chatting/favorite">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <Heart className="mr-2 h-4 w-4" />
                                                        <span>Favorite</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </Link>
                                                <Link href="/chatting/playlist">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <Play className="mr-2 h-4 w-4" />
                                                        <span>Playlist</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </Link>
                                                <DropdownMenuItem onClick={handleLogOut} className={"cursor-pointer"}>
                                                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                                                    <span className="text-red-500">Logout</span>
                                                </DropdownMenuItem>
                                            </div>
                                        ) : (
                                            <>
                                                <Link href="/auth/sign-up">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        <span>Sign Up</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <Link href="/auth/login">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>Login</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Theme Toggle */}
                                <Toggle
                                    variant="ghost"
                                    className="group data-[state=on]:bg-transparent text-white hover:bg-primary dark:hover:bg-primary justify-end"
                                    pressed={theme === "dark"}
                                    onPressedChange={() =>
                                        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                                    }
                                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                                >
                                    <MoonIcon
                                        size={16}
                                        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                                        aria-hidden="true"
                                    />
                                    <SunIcon
                                        size={16}
                                        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
                                        aria-hidden="true"
                                    />
                                </Toggle>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;