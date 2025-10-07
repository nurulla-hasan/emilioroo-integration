'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Handshake, MapPin, Pencil, Trash2, Pause, Search, Play } from "lucide-react";
import { timeAgo } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const BondRequestCard = ({ request, onFindMatch, onEdit, onDelete, onPause }) => {
    return (
        <div className="bg-card rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between h-full transition-all hover:shadow-lg">
            <div>
                {/* Main Info */}
                <div className="flex justify-between items-center mb-3">
                    <Badge variant={request.status === 'Active' ? 'default' : 'secondary'}>{request.status}</Badge>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {timeAgo(request.createdAt)}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Offer</p>
                            <p className="font-semibold text-base">{request.offer}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <Handshake className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Want</p>
                            <p className="font-semibold text-base">{request.want}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Radius</p>
                            <p className="font-semibold text-base">{request.radius} km</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <Button className="flex-1 mr-2" onClick={() => onFindMatch(request)}>
                    <Search className="h-4 w-4 mr-2" />
                    Find Match
                </Button>
                <div className="flex items-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onPause(request)}>
                                {request.isPause ? <Play className="h-4 w-4 text-green-500" /> : <Pause className="h-4 w-4 text-yellow-500" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{request.isPause ? "Resume Request" : "Pause Request"}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(request)}>
                                <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Request</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(request)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete Request</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default BondRequestCard;