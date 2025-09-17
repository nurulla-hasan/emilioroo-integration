'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Handshake, MapPin, Pencil, Trash2, Pause, Search, Play } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { timeAgo } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BondRequestCard = ({ request, onFindMatch, onEdit, onDelete, onPause }) => {
    return (
        <div className="bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between h-full">
            <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold">Offer: {request.offer}</span>
                    </div>
                    <Badge variant="outline">{request.status}</Badge>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 pl-7">
                    <div className="flex items-center gap-2">
                        <Handshake className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">Want: {request.want}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-5 w-5" />
                        <span>Radius: {request.radius} km</span>
                    </div>
                </div>
            </div>

            <div>
                <Separator className="my-2" />
                {/* Footer */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Created ({timeAgo(request.createdAt)})
                    </p>
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => onFindMatch(request)}>
                                    <Search />
                                    <span className="hidden md:inline">Find Match</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Find Match</p>
                            </TooltipContent>
                        </Tooltip>

                        <Button title={request.isPause ? "Resume Request" : "Pause Request"} variant="ghost" size="icon" onClick={() => onPause(request)}>
                            {request.isPause ? <Play className="h-4 w-4 text-green-500" /> : <Pause className="h-4 w-4 text-yellow-500" />}
                        </Button>
                        <Button title="Edit Request" variant="ghost" size="icon" onClick={() => onEdit(request)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                            title="Delete Request"
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(request)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BondRequestCard