"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, LayoutGrid, ListMusic, MessageCircle, PlayCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "All Content", href: "/chatting", icon: LayoutGrid },
    { name: "Favorite", href: "/chatting/favorite", icon: Heart },
    { name: "Playlist", href: "/chatting/playlist", icon: ListMusic },
    { name: "Most Played", href: "/chatting/most-played", icon: PlayCircle },
    { name: "Trending", href: "/chatting/trending", icon: Flame },
    { name: "Conversations", href: "/chatting/conversations", icon: MessageCircle },
];

const ChattingSidebar = ({ className }) => {
    const pathname = usePathname();

    return (
        <div className={cn("h-full bg-card border-r", className)}>
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link href={item.href} key={item.name} passHref>
                            <Button
                                size={"lg"}
                                variant={pathname === item.href ? "default" : "ghost"}
                                className="w-full justify-start"
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChattingSidebar;
