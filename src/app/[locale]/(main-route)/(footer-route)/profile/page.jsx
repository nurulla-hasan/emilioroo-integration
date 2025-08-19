"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Edit, Facebook, Instagram, Link as LinkIcon, MessageSquare } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const ProfilePage = () => {
    // Fake Data
    const user = {
        coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf96132e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Mr. Jhon",
        roles: ["Artist", "Musician", "Vlogger"],
        followers: "8.1k",
        bio: "I still remember the excitement and nervousness bubbling inside me as I stepped off the plane at Kansai International Airport. It was my first-ever solo trip, and Japan had always been a dream destination. With my backpack strapped on, I took a deep breath, ready to embrace the adventure ahead. ❤️",
        socialLinks: [
            { platform: "Instagram", url: "https://instagram.com/jhon_oz", icon: <Instagram className="h-4 w-4" /> },
            { platform: "Facebook", url: "https://facebook.com/jhon_oz", icon: <Facebook className="h-4 w-4" /> },
        ],
        friends: [
            { name: "MR. Sarwar", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Fahad", role: "Engineer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "Ahmad Musa", role: "Emam", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. TA Emon", role: "Biker", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Mehehi", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Dindinia", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Nahid", role: "Scientist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "Ahmad Mus", role: "Emam", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        ],
        relatives: [
            { name: "Ahmad Musa", relationship: "Grandpa", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "Mr. Aman", relationship: "Uncle", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "Yolanda", relationship: "Aunt", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "Mrs. Nahid", relationship: "Grandma", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Dindinia", relationship: "Aunt", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { name: "MR. Fahad", relationship: "Cousin", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        ],
    };

    return (
        <PageLayout>
            <Card className="relative overflow-hidden shadow-none">
                <div className="relative w-full h-64">
                    <Image src={user.coverImage} alt="Cover Image" layout="fill" objectFit="cover" />
                    <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full">
                        <Camera className="h-5 w-5" />
                    </Button>
                    {/* Mother Avatar */}
                    <div className="absolute bottom-4 left-4 flex flex-col items-center">
                        <Avatar className="w-16 h-16 border-2 border-white">
                            <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                            <AvatarFallback>MO</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-xs mt-1">Mother</span>
                    </div>
                    {/* Father Avatar */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-center">
                        <Avatar className="w-16 h-16 border-2 border-white">
                            <AvatarImage src="https://images.unsplash.com/photo-1564564321837-a031393f03d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                            <AvatarFallback>FA</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-xs mt-1">Father</span>
                    </div>
                </div>
                <CardContent className="relative p-6 pt-0">
                    <div className="absolute -top-16 left-6">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full">
                            <Camera className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="ml-40 pt-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {user.name}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </h2>
                        <div className="flex gap-2 mt-2">
                            {user.roles.map((role, index) => (
                                <Badge key={index} variant="outline">
                                    {role}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{user.followers} Followers</p>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Social Links</h3>
                            <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-2" /> Add Social account
                            </Button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {user.socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm text-priamry">
                                    {link.icon}
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {link.url}
                                    </a>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Friends Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Friends</h3>
                            <Button variant="link" size="sm">view more</Button>
                        </div>
                        <div className="mt-4 flex space-x-6 overflow-x-auto pb-2">
                            {user.friends.map((friend, index) => (
                                <div key={index} className="flex flex-col items-center flex-shrink-0">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={friend.avatar} />
                                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium mt-2 whitespace-nowrap">{friend.name}</span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{friend.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Relatives & Relationships Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Relatives & Relationships</h3>
                            <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-2" /> Add New relatives
                            </Button>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.relatives.map((relative, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={relative.avatar} />
                                            <AvatarFallback>{relative.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{relative.name}</p>
                                            <p className="text-sm text-muted-foreground">{relative.relationship}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <MessageSquare className="h-4 w-4 mr-2" /> Chat now
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageLayout>
    );
};

export default ProfilePage;