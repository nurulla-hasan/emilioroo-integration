"use client"

import { useMemo } from "react"
import { useGetSingleUserQuery } from "@/lib/features/api/projectApi"
import { useGetSkillsQuery } from "@/lib/features/api/authApi"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { fallbackAvatar, formatDate, getSocialIcon } from "@/lib/utils"

import Image from "next/image";
import { Link } from "@/i18n/navigation"
import PeopleCardButton from "@/components/people/PeopleCardButton"

const UserProfilePage = () => {
    const { id } = useParams()
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetSingleUserQuery(id)
    const { data: skillsData, isLoading: areSkillsLoading } = useGetSkillsQuery()

    const user = userData?.data

    const userSkillNames = useMemo(() => {
        const allSkills = skillsData?.data?.result || []
        if (!user?.skills || !allSkills.length) return []
        return user.skills
            .map((skillId) => {
                const skill = allSkills.find((s) => s._id === skillId)
                return skill ? skill.name : ""
            })
            .filter(Boolean)
    }, [user?.skills, skillsData])

    if (isUserLoading || areSkillsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (isUserError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-2">User Not Found</h2>
                    <p className="text-muted-foreground">The user profile you are looking for does not exist.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background mb-4 relative">
            {/* Cover Image Section */}
            <div className="relative h-60 bg-gradient-to-r from-primary/20 to-accent/20">
                {user.cover_image ? (
                    <Image src={user.cover_image || "/placeholder-image.jpg"} alt="Cover" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary to-accent opacity-20"></div>
                )}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Profile Section */}
            <div className="relative max-w-7xl mx-auto px-4 -mt-20">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <Image
                            src={user.profile_image || fallbackAvatar}
                            alt={user.name}
                            width={160}
                            height={160}
                            className="w-40 h-40 rounded-full border-4 border-background shadow-xl object-cover"
                        />
                        {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full border-4 border-background"></div> */}
                    </div>
                </div>

                {/* Name and Basic Info */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">{user.name}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{user.email}</p>
                    <div className="flex justify-center gap-4">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            Message
                        </Button>
                        {/* <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                            Connect
                        </Button> */}
                        <div className="w-fit">
                            <PeopleCardButton user={user} />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Bio Section */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold text-card-foreground mb-4">About</h2>
                                <p className="text-card-foreground leading-relaxed text-base">{user.bio}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Skills and Info Sidebar */}
                    <div className="space-y-6">
                        {/* Skills */}
                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-card-foreground mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userSkillNames.map((skill, index) => (
                                        <Badge key={index} className="bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-card-foreground mb-4">Contact Info</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-card-foreground">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-card-foreground">
                                        <Phone className="h-5 w-5 text-primary" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-card-foreground">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <span className="text-sm">{user.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-card-foreground">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span className="text-sm">Born {formatDate(user.dateOfBirth)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        {user.socialLinks && user.socialLinks.length > 0 && (
                            <Card className="bg-card border-border">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-card-foreground mb-4">Social Links</h3>
                                    <div className="flex gap-3">
                                        {user.socialLinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-primary/10 hover:bg-primary dark:bg-primary dark:text-white hover:text-primary-foreground text-primary rounded-lg transition-colors duration-200"
                                            >
                                                {getSocialIcon(link)}
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
