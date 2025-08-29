import { useFavoriteToggleAudioMutation } from "@/lib/features/api/chattingApi";
import { toast } from "sonner";

const useFavoriteToggle = () => {
  const [favoriteToggle, { isLoading, isError, isSuccess, error }] = useFavoriteToggleAudioMutation();

  const toggleFavorite = async (audio) => {
    try {
      const res = await favoriteToggle(audio).unwrap();
      toast.success(res.message);
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
    }
  };

  return { toggleFavorite, isLoading, isError, isSuccess, error };
};

export default useFavoriteToggle;
