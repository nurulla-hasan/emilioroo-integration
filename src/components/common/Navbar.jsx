"use client";
// import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User, Menu, LogOut, UserPlus, ChevronDown, ShoppingBasket, ShoppingCart, MoonIcon, SunIcon, ChevronRight, Home, LayoutGrid, Info, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "../ui/toggle";
import { useAuthRedirect } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const isLoading = false;
    const cart = 1;
    const handleAuthRedirect = useAuthRedirect();

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const userName = "Golap Hasan";
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Category", href: "/category", icon: LayoutGrid },
        { name: "About Us", href: "/about-us", icon: Info },
        { name: "Contact Us", href: "/contact", icon: Mail },
    ];

    const handleLogOut = () => {
        // toast.success("Logout successful!");
        // window.location.reload();
        setIsLoggedIn(false);
    }
    const handleNavClick = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="h-[81px]">
            <div className="bg-black/20 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 xl:px-0 py-2">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu button */}
                        <div className="lg:hidden flex items-center">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-brand">
                                        <Menu className="h-6 w-6 text-white" />
                                        <span className="sr-only">Toggle navigation menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0 border-0">
                                    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
                                        {/* Header Section */}
                                        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 text-white">
                                            <SheetHeader className="text-left">
                                                {/* <Link href="/" onClick={handleNavClick} className="flex items-center mb-4">
                                                    <Image
                                                        src="/images/logo.png"
                                                        alt="Company Logo"
                                                        priority
                                                        width={120}
                                                        height={48}
                                                        className="h-10 w-auto brightness-0 invert"
                                                    />
                                                </Link> */}
                                                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                                                <SheetDescription className="sr-only">Navigation links for the website.</SheetDescription>
                                            </SheetHeader>

                                            {/* User Profile Section */}
                                            {isLoggedIn ? (
                                                <div className="flex items-center gap-3 mt-4">
                                                    <Avatar className="h-12 w-12 border-2 border-white/30">
                                                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt={userName} />
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
                                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                }`}
                                                        >
                                                            <IconComponent
                                                                className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`}
                                                            />
                                                            <span className="font-medium">{link.name}</span>
                                                            <ChevronRight
                                                                className={`h-4 w-4 ml-auto transition-transform ${isActive ? "text-primary" : "text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1"}`}
                                                            />
                                                        </Link>
                                                    )
                                                })}
                                            </nav>

                                            {/* Quick Actions */}
                                            {/* <div className="mt-8 pt-6 border-t border-gray-200">
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                                    Quick Actions
                                                </h3>
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={(e) => {
                                                            handleAuthRedirect(e, "/cart")
                                                            handleNavClick()
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full group"
                                                    >
                                                        <div className="relative">
                                                            <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                                                            {cart && cart > 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                    {cart}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="font-medium">Shopping Cart</span>
                                                        <ChevronRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                    </button>

                                                    <button
                                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full group"
                                                    >
                                                        {theme === "dark" ? (
                                                            <SunIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                                                        ) : (
                                                            <MoonIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                                                        )}
                                                        <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                                        <ChevronRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Footer Section */}
                                        {/* {isLoggedIn && (
                                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                                <div className="space-y-2">
                                                    <Link href="/profile" onClick={handleNavClick}>
                                                        <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 w-full group">
                                                            <User className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                            <span className="text-sm font-medium">My Account</span>
                                                        </button>
                                                    </Link>
                                                    <Link href="/my-orders" onClick={handleNavClick}>
                                                        <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 w-full group">
                                                            <ShoppingBasket className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                            <span className="text-sm font-medium">My Orders</span>
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogOut}
                                                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
                                                    >
                                                        <LogOut className="h-4 w-4 text-red-500" />
                                                        <span className="text-sm font-medium">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )} */}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Left Logo - Visible on all screen sizes */}
                        <div className="flex-shrink-0">
                            {/* <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/logo.png"
                                    alt="TripleM Collectibles"
                                    width={124}
                                    height={32}
                                    priority
                                    className="md:h-14 h-10 w-auto"
                                />
                            </Link> */}
                        </div>

                        {/* Right side content: Nav Links and Icons */}
                        <div className="lg:flex items-center space-x-16">
                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`hover:opacity-70 transition-colors font-medium duration-200 text-sm ${pathname === link.href ? "border-b-2 border-brand text-brand font-bold" : "text-white"}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Right Action Icons */}
                            <div className="flex items-center space-x-2">
                                <div onClick={(e) => handleAuthRedirect(e, '/cart')}>
                                    <Button variant="ghost" size="icon" className="relative hover:bg-brand">
                                        <ShoppingCart className="h-5 w-5 text-white" />
                                        <span className="sr-only">Shopping Cart</span>
                                        {cart && cart.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cart?.length}</span>
                                        )}
                                    </Button>
                                </div>

                                {/* User Profile Icon */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center cursor-pointer">
                                            <Button variant="ghost" size="icon" className="hover:bg-brand">
                                                <User className="h-5 w-5 text-white" />
                                                <span className="sr-only">Profile</span>
                                            </Button>
                                            {isLoading ? (
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
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>My Account</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <Link href="/my-orders">
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <ShoppingBasket className="mr-2 h-4 w-4" />
                                                        <span>My Order</span>
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

                                <Toggle
                                    variant="ghost"
                                    className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent text-white hover:bg-brand hover:text-white"
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