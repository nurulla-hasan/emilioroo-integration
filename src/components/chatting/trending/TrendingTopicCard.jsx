import Image from "next/image";
import { Button } from "@/components/ui/button";

const TrendingTopicCard = ({ topic }) => {
  return (
    <div className="bg-primary rounded-2xl border overflow-hidden w-80 mx-auto"> 
      <div className="relative w-full aspect-video"> 
        <Image
          src={topic.topic_image || "/placeholder.png"}
          alt={topic.name || "Topic Image"}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-xl text-white truncate leading-tight">{topic.name}</h3> 
        <p className="text-sm leading-snug">{topic.audioCount ? `${topic.audioCount} audio` : ""}</p>
        <Button size={"sm"} variant='outline'> 
          Listen Now
        </Button>
      </div>
    </div>
  );
};

export default TrendingTopicCard;
