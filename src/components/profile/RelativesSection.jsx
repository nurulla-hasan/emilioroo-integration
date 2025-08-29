"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Title2 from "@/components/ui/Title2";
import { getInitials, fallbackAvatar2 } from "@/lib/utils";
import { Link as LinkIcon, MessageSquare, MoreHorizontal } from "lucide-react";

const RelativesSection = ({ maternalRelatives, paternalRelatives, handleEdit, handleDelete, openAddRelativeModal }) => {

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Title2>Relatives & Relationships</Title2>
                <Button size="sm" onClick={openAddRelativeModal}>
                    <LinkIcon /> Add New relatives
                </Button>
            </div>

            {maternalRelatives.length === 0 && paternalRelatives.length === 0 ? (
                <div className="text-center mt-8">No relatives found.</div>
            ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mother's Side */}
                    <div>
                        <h4 className="text-md font-semibold mb-4 text-center">Mothers Side</h4>
                        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                            {maternalRelatives.map((relative, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={relative.relative?.profile_image || fallbackAvatar2} />
                                            <AvatarFallback>{getInitials(relative.relative?.name || relative.relation)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{relative.relative?.name || relative.relation}</p>
                                            <p className="text-xs text-muted-foreground">{relative.relation}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare /> <span className="hidden md:inline">Chat Now</span>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(relative)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(relative)} className="text-red-600">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Father's Side */}
                    <div>
                        <h4 className="text-md font-semibold mb-4 text-center">Fathers Side</h4>
                        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                            {paternalRelatives.map((relative, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={relative.relative?.profile_image || fallbackAvatar2} />
                                            <AvatarFallback>{getInitials(relative.relative?.name || relative.relation)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{relative.relative?.name || relative.relation}</p>
                                            <p className="text-xs text-muted-foreground">{relative.relation}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare /> <span className="hidden md:inline">Chat Now</span>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(relative)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(relative)} className="text-red-600">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelativesSection;
