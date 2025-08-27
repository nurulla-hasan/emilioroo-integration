"use client";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ConversationListItem = ({ conv, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center p-2 cursor-pointer rounded-lg ${active ? 'bg-primary/10' : 'bg-muted/50'} transition-colors`}>
        <div className="relative">
            <Avatar className="h-14 w-14 mr-4">
                <AvatarImage src={conv.avatar} alt={conv.name} />
                <AvatarFallback>{getInitials(conv.name)}</AvatarFallback>
            </Avatar>
            {/* Online Indicator */}
            {conv.online && <div className="absolute bottom-0 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
        </div>

        <div className="flex-1">
            <p className="font-semibold">{conv.name}</p>
            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.length > 25 ? `${conv.lastMessage.slice(0, 25)}...` : conv.lastMessage}</p>
        </div>
        <p className="text-xs text-muted-foreground self-start">{conv.time}</p>
    </div>
);

export default ConversationListItem;