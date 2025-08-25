"use client";

// import { Button } from "@/components/ui/button";
import Title2 from "@/components/ui/Title2";
import { Link } from "@/i18n/navigation";
import { getSocialIcon } from "@/lib/utils";

const SocialLinks = ({ user }) => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <Title2 className="text-lg font-semibold">Social Links</Title2>
                {/* <Button variant={"ghost"} size="sm">
                    <Edit />
                </Button> */}
            </div>
            <div className="mt-4 flex gap-3">
                {user.socialLinks && user.socialLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary/10 hover:bg-primary dark:bg-primary dark:text-white hover:text-primary-foreground text-primary rounded-lg transition-colors duration-200"
                    >
                        {getSocialIcon(link)}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SocialLinks;
