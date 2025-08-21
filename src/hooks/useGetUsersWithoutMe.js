import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { useGetMe } from "./useGetMe";

export const useGetUsersWithoutMe = (currentPage, pageSize, searchTerm) => {
    const { data, isLoading, isError } = useGetAllUsersQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    const { profile } = useGetMe();
    const userId = profile?.data?._id;

    const userData = data?.data?.result || [];
    const users = userData.filter((user) => user._id !== userId);
    const totalPages = data?.data?.meta?.totalPage || 1;

    return { users, isLoading, isError, totalPages };
};