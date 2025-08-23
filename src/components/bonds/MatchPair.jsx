'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const UserCard = ({ request }) => (
    <div className="flex-1 w-full p-4 border rounded-lg bg-background">
        <div className="flex items-center gap-3 mb-3">
            <Avatar>
                <AvatarImage src={request.user.profile_image} alt={request.user.name} />
                <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold truncate">{request.user.name}</span>
        </div>
        <div className="text-sm space-y-1">
            <p><span className="font-semibold text-muted-foreground">Offers:</span> {request.offer}</p>
            <p><span className="font-semibold text-muted-foreground">Wants:</span> {request.want}</p>
        </div>
    </div>
);

export default function MatchPair({ matchRequest }) {
  const [request1, request2] = matchRequest;

  return (
    <div className="p-4 border rounded-lg bg-card">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <UserCard request={request1} />
            <ArrowRightLeft className="h-6 w-6 text-primary shrink-0 my-4 md:my-0" />
            <UserCard request={request2} />
        </div>
        <div className="flex justify-end mt-4">
            <Button>Propose Link</Button>
        </div>
    </div>
  );
}
