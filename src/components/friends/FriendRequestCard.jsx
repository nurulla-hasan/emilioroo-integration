import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const FriendRequestCard = ({ request }) => {
    return (
        <div className="bg-accent rounded-lg shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={request.avatar} />
                <AvatarFallback>{getInitials(request.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{request.name}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {request.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                ))}
            </div>
            <div className="flex gap-2 w-full mb-4">
                <Button variant="outline" className="w-[50%]">Decline</Button>
                <Button variant="default" className="w-[50%]">Accept</Button>
            </div>
            <Link href={`/friends/${request.id}`} className="w-full">
                <Button variant="outline" className="w-full">View profile</Button>
            </Link>
        </div>
    );
};

export default FriendRequestCard;