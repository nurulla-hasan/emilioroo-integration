"use client";

// import { Button } from "@/components/ui/button";
import Title2 from "@/components/ui/Title2";
import {  Facebook, Instagram, Link as LinkIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

const SocialLinks = ({ user }) => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <Title2 className="text-lg font-semibold">Social Links</Title2>
                {/* <Button variant={"ghost"} size="sm">
                    <Edit />
                </Button> */}
            </div>
            <div className="mt-4 space-y-3">
                {user.socialLinks && user.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-primary dark:text-muted-foreground">
                        {link.includes("instagram") ? <Instagram /> : link.includes("fb") ? <Facebook /> : <LinkIcon />}
                        <Link href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {link}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialLinks;
