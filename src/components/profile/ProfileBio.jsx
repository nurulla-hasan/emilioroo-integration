"use client";

// import { Button } from "@/components/ui/button";
// import { Edit } from "lucide-react";

const ProfileBio = ({ user }) => {
    return (
        <div className="relative group mt-8 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground text-center">{user.bio}</p>
            {/* <Button variant="ghost" size="icon" className="absolute -bottom-8 transform -translate-x-1/2 left-1/2  opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit />
            </Button> */}
        </div>
    );
};

export default ProfileBio;
