import { useFavoriteToggleAudioMutation } from "@/lib/features/api/chattingApi";

const useFavoriteToggle = () => {
  const [favoriteToggle, { isLoading, isError, isSuccess, error }] = useFavoriteToggleAudioMutation();

  const toggleFavorite = async (audioId) => {
    try {
      await favoriteToggle(audioId).unwrap();
      // Optionally, add toast notification here for success
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      // Optionally, add toast notification here for error
    }
  };

  return { toggleFavorite, isLoading, isError, isSuccess, error };
};

export default useFavoriteToggle;
