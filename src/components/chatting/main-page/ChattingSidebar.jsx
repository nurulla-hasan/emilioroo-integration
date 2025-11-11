"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, LayoutGrid, ListMusic, MessageCircle, PlayCircle, Flame, TableOfContents } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";


const ChattingSidebar = ({ className }) => {
    const t = useTranslations('Chatting');
    const locale = useLocale();
    const menuItems = [
        { name: t('allContent'), href: "/chatting", icon: LayoutGrid },
        { name: t('myContent'), href: "/chatting/my-content", icon: TableOfContents },
        { name: t('favorite'), href: "/chatting/favorite", icon: Heart },
        { name: t('playlist'), href: "/chatting/playlist", icon: ListMusic },
        { name: t('mostPlayed'), href: "/chatting/most-played", icon: PlayCircle },
        { name: t('trendingTopics'), href: "/chatting/trending", icon: Flame },
        { name: t('conversations'), href: "/chatting/conversations", icon: MessageCircle },
    ];
    const pathname = usePathname();

    return (
        <div className={cn("h-full  bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 border-r", className)}>
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">{t('menu')}</h2>
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const localizedHref = locale ? `/${locale}${item.href}` : item.href;
                        const matchesExact = pathname === localizedHref;
                        const matchesNested = pathname.startsWith(`${localizedHref}/`);
                        const isRootItem = item.href === "/chatting";
                        const isActive = isRootItem ? matchesExact : (matchesExact || matchesNested);

                        return (
                            <Link href={item.href} key={item.name} passHref>
                                <Button
                                    size={"lg"}
                                    variant={isActive ? "default" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChattingSidebar;
