import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ListMusic, Share2 } from "lucide-react";
import Link from "next/link"; // Import Link

const PlaylistCard = ({ playlist }) => {
  const audioCount = playlist.audios?.length || 0;
  // Duration is not available in the API response, so omitting for now
  // const duration = "1 hr 23m"; 

  return (
    <div className="bg-card rounded-lg shadow-md border overflow-hidden">
      <div className="relative w-full aspect-video">
        <Image
          src={playlist.cover_image || "/placeholder.png"}
          alt={playlist.name || "Playlist Cover"}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{playlist.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <ListMusic className="w-4 h-4 mr-1" />
          <span>{audioCount}+ audio</span>
          {/* {duration && (
            <>
              <Clock className="w-4 h-4 ml-4 mr-1" />
              <span>{duration}</span>
            </>
          )} */}
        </div>
        <div className="flex justify-between gap-2">
          <Link href={`/chatting/playlist/${playlist._id}`} passHref>
            <Button size={"sm"} className="w-26 bg-primary text-primary-foreground hover:bg-primary/90 dark:text-white">View</Button>
          </Link>
          <Button size={"sm"} variant="outline" className="w-28 border-secondary text-secondary-foreground hover:bg-secondary/80">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
