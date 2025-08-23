import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSendJoinRequestMutation } from "@/lib/features/api/projectApi";
import { toast } from "sonner";
import { useState } from "react";
import ProjectDetailsModal from "../modal/ProjectDetailsModal";

const ProjectCard = ({ project, isMyOrJoinedProject = false }) => {
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] = useState(false);
  const isJoinRequestSent = project.isJoinRequestSent === true;
  const [sendJoinRequest, { isLoading: isSendingRequest }] = useSendJoinRequestMutation();

  const handleSendJoinRequest = async (projectId) => {
    try {
      await sendJoinRequest(projectId).unwrap();
      toast.success("Join request sent successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send join request.");
    }
  };

  return (
    <>
      <Card>
        <div className="relative w-full h-48 cursor-pointer" onClick={() => setIsProjectDetailsModalOpen(true)}>
          <Image
            src={project.cover_image || "/images/placeholder-image.jpg"}
            alt={project.name}
            fill={true}
            sizes="100%"
            priority
            className="rounded-t-lg object-cover"
          />
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.status && <Badge variant="secondary">{project.status}</Badge>}
            {project.joinControll && <Badge variant="outline" className={`${project.joinControll === "Private" ? "text-red-500" : "text-green-500"}`}>{project.joinControll}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex-grow mb-2">
          <p className="text-sm line-clamp-2">{project.description}</p>
        </CardContent>
        <CardContent className="px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.owner?.avatar} />
                <AvatarFallback>{project.owner?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-xs">{project.owner?.name || "Unknown"}</p>
                <p className="text-[10px]">Owner</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{project.totalParticipants} Participants</span>
            </div>
          </div>

        </CardContent>

        <CardFooter className="p-4 pt-0">
          {isMyOrJoinedProject ? (
            <div className="flex space-x-2 w-full">
              <Link href={`/objects/${project._id}`} className="flex-1">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
              <Link href={`/objects/${project._id}/workspace`} className="flex-1">
                <Button className="w-full">Open Workspace</Button>
              </Link>
            </div>
          ) : (
            <Button
              loading={isSendingRequest}
              className={`w-full  ${isJoinRequestSent ? "bg-yellow-800" : ""}`}
              onClick={() => handleSendJoinRequest(project._id)}
              disabled={isSendingRequest || project?.joinControll === "Private" || isJoinRequestSent || project.isJoined || project.isOwner}
            >
              {project.isOwner ? "Owner" : isJoinRequestSent ? "Request Sent" : project.isJoined ? "Joined" : "Join Project"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Modal */}

      <ProjectDetailsModal
        isOpen={isProjectDetailsModalOpen}
        onOpenChange={setIsProjectDetailsModalOpen}
        projectId={project._id}
      />

    </>
  );
};

export default ProjectCard;
