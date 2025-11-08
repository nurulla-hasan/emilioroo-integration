"use client";

import { cn } from "@/lib/utils";

const PageLayout = ({ children, className }) => {
    return (
        <div className={cn("max-w-[1400px] mx-auto py-5 md:pb-24 px-4 xl:px-0", className)}>
            {children}
        </div>
    );
};

export default PageLayout;