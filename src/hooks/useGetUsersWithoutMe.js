import { useMemo } from "react";
import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { useGetMe } from "./useGetMe";

export const useGetUsersWithoutMe = (currentPage = 1, pageSize = 10, searchTerm = "") => {
    const { data, isLoading, isError } = useGetAllUsersQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    const { profile } = useGetMe();
    const userId = profile?.data?._id;

    const users = useMemo(() => {
        const userData = data?.data?.result || [];
        return userData.filter((user) => user._id !== userId);
    }, [data, userId]);

    const totalPages = data?.data?.meta?.totalPages || 1;

    return { users, isLoading, isError, totalPages };
};