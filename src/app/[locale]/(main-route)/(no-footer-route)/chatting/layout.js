"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import GlobalAudioPlayer from '@/components/common/GlobalAudioPlayer';
import ChattingSidebar from '@/components/chatting/main-page/ChattingSidebar';

const ChattingLayout = ({ children }) => {
    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <ChattingSidebar className="w-64 hidden lg:block" />

                {/* Mobile Sidebar & Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Menu</SheetTitle>
                                </SheetHeader>
                                <ChattingSidebar className="w-full" />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="p-4 md:p-6 h-[calc(100vh-230px)] lg:h-[calc(100vh-160px)] overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
            <GlobalAudioPlayer />
        </div>
    );
};

export default ChattingLayout;
