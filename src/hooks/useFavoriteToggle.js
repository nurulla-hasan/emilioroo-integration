import { useFavoriteToggleAudioMutation } from "@/lib/features/api/chattingApi";
import { toast } from "sonner";

const useFavoriteToggle = () => {
  const [favoriteToggle, { isLoading, isError, isSuccess, error }] = useFavoriteToggleAudioMutation();

  const toggleFavorite = async (audioId) => {
    try {
      const res = await favoriteToggle(audioId).unwrap();
      toast.success(res.message);
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      // Optionally, add toast notification here for error
    }
  };

  return { toggleFavorite, isLoading, isError, isSuccess, error };
};

export default useFavoriteToggle;
