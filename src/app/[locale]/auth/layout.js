import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata = {
    title: "Emilirio | Auth",
    description: "Please Sign up or Sign in to continue.",
};

const layout = ({ children }) => {
    return (
        <>
            <ScrollArea className="h-screen scrollbar-primary">
                {children}
            </ScrollArea>
        </>
    );
};

export default layout;