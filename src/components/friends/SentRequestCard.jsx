import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fallbackAvatar, getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import CancelSentRequest from "./request-card-button/CancelSentRequest";

const SentRequestCard = ({ request }) => {


    return (
        <div className="bg-accent rounded-lg shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={request.followingInfo?.profile_image || fallbackAvatar(request.followingInfo?.gender)} />
                <AvatarFallback>{getInitials(request.followingInfo?.name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{request.followingInfo?.name || "Unknown"}</h3>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4 flex-grow">
                {request.followingInfo?.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                ))}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <CancelSentRequest request={request} />
                <Link href={`/people/${request.followingInfo?._id}`} className="w-full">
                    <Button variant="outline" className="w-full">View profile</Button>
                </Link>
            </div>
        </div>
    );
};

export default SentRequestCard;