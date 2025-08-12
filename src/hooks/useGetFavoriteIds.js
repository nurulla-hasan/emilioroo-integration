import { useGetBookmarkAudioQuery } from "@/lib/features/api/chattingApi";

const useGetFavoriteIds = () => {
    const { data: bookmarkData } = useGetBookmarkAudioQuery();
    const bookmarks = bookmarkData?.data || [];

    const favouriteIds = bookmarks?.length > 0 ? bookmarks?.map((favorite) => favorite?.audio?._id) : []
    return [favouriteIds];
};

export default useGetFavoriteIds;